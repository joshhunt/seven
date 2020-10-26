import * as React from "react";
import { CrossSave, Renderer, Characters } from "@Platform";
import styles from "./CrossSaveAccountLinkItem.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@Global/Localizer";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";
import { CrossSaveValidationError } from "./CrossSaveValidationError";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { CrossSaveHeader } from "@Areas/CrossSave/Shared/CrossSaveHeader";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { CrossSaveAccountCard } from "./CrossSaveAccountCard";
import { CrossSaveSilverBalance } from "./CrossSaveSilverBalance";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { PlatformError } from "@CustomErrors";
import { Logger } from "@Global/Logger";
import { BungieMembershipType, BungieCredentialType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

interface ICrossSaveAccountLinkItemProps {
  className?: string;
  stateIdentifier: number;
  flowState: ICrossSaveFlowState;
  membershipType: BungieMembershipType;
  linkedCredentialTypes: BungieCredentialType[];
  authButtonOverride?: () => void;
  hideAccountInfo?: boolean;
  onAccountLinked?: (shouldReset: boolean) => Promise<void | PlatformError>;
  resetAuth?: boolean;
}

interface ICrossSaveAccountLinkItemState {
  isLinked: boolean;
  needsAuth: boolean;
  hasErrors: boolean;
  goodToGo: boolean;
  loading: boolean;
}

/**
 * Shows account info for the purpose of choosing an account in CrossSave
 *  *
 * @param {ICrossSaveAccountLinkItemProps} props
 * @returns
 */
export class CrossSaveAccountLinkItem extends React.Component<
  ICrossSaveAccountLinkItemProps,
  ICrossSaveAccountLinkItemState
> {
  constructor(props: ICrossSaveAccountLinkItemProps) {
    super(props);

    this.state = {
      isLinked: false,
      needsAuth: false,
      hasErrors: false,
      goodToGo: false,
      loading: false,
    };
  }

  public static getDerivedStateFromProps(
    props: ICrossSaveAccountLinkItemProps,
    state: ICrossSaveAccountLinkItemState
  ): ICrossSaveAccountLinkItemState {
    const { membershipType, linkedCredentialTypes } = props;

    const authStatus =
      props.flowState.validation.authStatuses[
        BungieMembershipType[membershipType]
      ];
    const validationErrors =
      props.flowState.validation.profileSpecificErrors[
        BungieMembershipType[membershipType]
      ];

    const status = CrossSaveUtils.getAccountLinkStatus(
      membershipType,
      authStatus,
      validationErrors,
      linkedCredentialTypes
    );

    return {
      ...status,
      loading: status.needsAuth && state.loading,
    };
  }

  private get credentialType() {
    return UserUtils.getCredentialTypeFromMembershipType(
      this.props.membershipType
    );
  }

  private get platformName() {
    return LocalizerUtils.getPlatformNameFromMembershipType(
      this.props.membershipType
    );
  }

  private readonly openAccountLinkWindow = () => {
    if (this.props.authButtonOverride) {
      this.props.authButtonOverride();

      return;
    }

    this.setState({
      loading: true,
    });

    const requiresFlowStateReset = !this.state.isLinked;
    // this checks if resetAuth is set to be true at the environment level but if set to false, will respect whatever props have been passed in to the specific instance
    const resetAuth =
      ConfigUtils.GetParameter("CrossSave", "CrossSaveResetAuth", true) ||
      this.props.resetAuth;

    const url = this.state.isLinked
      ? RouteHelper.GetAccountAuthVerify(
          this.credentialType,
          this.props.stateIdentifier,
          resetAuth
        ).url
      : RouteHelper.GetAccountLink(
          this.credentialType,
          this.props.stateIdentifier
        ).url;

    BrowserUtils.openWindow(url, "linkui", () => {
      this.props.onAccountLinked &&
        this.props.onAccountLinked(requiresFlowStateReset).then(() => {
          this.setState({
            loading: false,
          });
        });
    });
  };

  private readonly showErrors = () => {
    const errors = this.props.flowState.validation.profileSpecificErrors[
      BungieMembershipType[this.props.membershipType]
    ];

    const modalSubtitle = Localizer.Format(
      Localizer.Crosssave.ErrorModalSubtitle,
      {
        platformName: LocalizerUtils.getPlatformNameFromMembershipType(
          this.props.membershipType
        ),
      }
    );

    const rendered = (
      <React.Fragment>
        <CrossSaveHeader
          text={Localizer.Crosssave.ErrorModalTitle}
          subtext={modalSubtitle}
        />
        <div className={styles.errors}>
          {errors.map((error) => (
            <CrossSaveValidationError key={error.errorCode} error={error} />
          ))}
        </div>
      </React.Fragment>
    );

    Modal.open(rendered, {
      className: styles.errorModal,
    });
  };

  public render() {
    const { flowState, membershipType } = this.props;

    const { goodToGo, hasErrors, isLinked, needsAuth } = this.state;

    const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
      flowState,
      membershipType
    );

    const accountLinkItemWrapperClasses = classNames(
      this.props.className,
      styles.accountLinkItemWrapper,
      {
        [styles.unlinked]: !isLinked || needsAuth,
        [styles.needsAttention]: hasErrors && !needsAuth,
      }
    );

    const errors = this.props.flowState.validation.profileSpecificErrors[
      BungieMembershipType[this.props.membershipType]
    ];

    return (
      <CrossSaveAccountCard
        className={accountLinkItemWrapperClasses}
        flowState={this.props.flowState}
        loading={this.state.loading}
        hideAccountInfo={this.props.hideAccountInfo}
        membershipType={membershipType}
      >
        {UserUtils.isAuthEnabledForMembershipType(membershipType) ? (
          <div className={styles.actionWrapper}>
            {!!flowStateForMembership.platformMembership && (
              <CrossSaveSilverBalance
                membershipType={membershipType}
                flowState={flowState}
              />
            )}

            {goodToGo && <GoodToGo platformName={this.platformName} />}

            {(needsAuth || !isLinked) && !hasErrors && (
              <NeedsAuth
                platformName={this.platformName}
                onClick={this.openAccountLinkWindow}
                isLinked={isLinked}
              />
            )}

            {hasErrors && isLinked && (
              <HasErrors validationErrors={errors} onClick={this.showErrors} />
            )}
          </div>
        ) : (
          <div className={styles.actionWrapper}>
            <div className={styles.text}>
              {Localizer.Profile.PlatformLinkingOff}
            </div>
          </div>
        )}
      </CrossSaveAccountCard>
    );
  }
}

const GoodToGo = (props: { platformName: string }) => {
  const alreadyLinkedLabel = Localizer.Format(
    Localizer.Crosssave.PlatformIsLinked,
    {
      platform: props.platformName,
    }
  );

  const icon = (
    <Icon
      className={styles.successIcon}
      iconType={"fa"}
      iconName={"check-circle"}
    />
  );

  return (
    <Button
      className={classNames(styles.actionButton, styles.fakeButton)}
      buttonType={"text"}
      icon={icon}
      caps={true}
    >
      {alreadyLinkedLabel}
    </Button>
  );
};

const NeedsAuth = (props: {
  platformName: string;
  isLinked: boolean;
  onClick: () => void;
}) => {
  const buttonLabel = props.isLinked
    ? Localizer.Crosssave.VerifyAuthenticationButtonLabel
    : Localizer.Format(Localizer.Crosssave.LinkCredentialButtonLabel, {
        credentialLabel: props.platformName,
      });

  const icon = !props.isLinked && (
    <Icon iconType={"material"} iconName={"add_circle_outline"} />
  );

  return (
    <Button
      className={styles.actionButton}
      buttonType={props.isLinked ? "gold" : "white"}
      onClick={props.onClick}
      icon={icon}
      caps={true}
    >
      {buttonLabel}
    </Button>
  );
};

const HasErrors = (props: {
  validationErrors: CrossSave.CrossSaveValidationError[];
  onClick: () => void;
}) => {
  const label =
    props.validationErrors.length === 1
      ? Localizer.Crosssave.Resolve1Error
      : Localizer.Format(Localizer.Crosssave.ResolveCountErrors, {
          count: props.validationErrors.length,
        });

  return (
    <Button
      className={classNames(styles.actionButton, styles.errorButton)}
      onClick={props.onClick}
      caps={true}
      buttonType={"red"}
    >
      {label}
    </Button>
  );
};
