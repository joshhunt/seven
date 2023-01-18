import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { CrossSaveHeader } from "@Areas/CrossSave/Shared/CrossSaveHeader";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { CrossSave } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CrossSaveAccountCard } from "./CrossSaveAccountCard";
import styles from "./CrossSaveAccountLinkItem.module.scss";
import { CrossSaveSilverBalance } from "./CrossSaveSilverBalance";
import { CrossSaveValidationError } from "./CrossSaveValidationError";

interface ICrossSaveAccountLinkItemProps {
  className?: string;
  stateIdentifier: number;
  flowState: ICrossSaveFlowState;
  membershipType: BungieMembershipType;
  linkedCredentialTypes: BungieCredentialType[];
  authButtonOverride?: () => void;
  hideAccountInfo?: boolean;
  onAccountLinked?: (shouldReset: boolean) => Promise<any>;
  resetAuth?: boolean;
  isDeactivateFlow?: boolean;
}

/**
 * Shows account info for the purpose of choosing an account in CrossSave
 *  *
 * @param {ICrossSaveAccountLinkItemProps} props
 * @returns
 */
export const CrossSaveAccountLinkItem: React.FC<ICrossSaveAccountLinkItemProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["credentialTypes"]);

  const [isLinked, setIsLinked] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [goodToGo, setGoodToGo] = useState(false);
  const [loading, setLoading] = useState(false);

  const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
    props.flowState,
    props.membershipType
  );

  useEffect(() => {
    const { membershipType, linkedCredentialTypes } = props;

    const mtype = BungieMembershipType[membershipType] as EnumStrings<
      typeof BungieMembershipType
    >;

    const authStatus = props.flowState.validation.authStatuses[mtype];
    const validationErrors =
      props.flowState.validation.profileSpecificErrors[mtype];

    const status = CrossSaveUtils.getAccountLinkStatus(
      membershipType,
      authStatus,
      validationErrors,
      linkedCredentialTypes
    );

    setNeedsAuth(status.needsAuth);
    setGoodToGo(status.goodToGo);
    setHasErrors(status.hasErrors);
    setIsLinked(status.isLinked);
    setLoading(status.needsAuth && loading);
  }, [props]);

  const accountLinkItemWrapperClasses = classNames(
    props.className,
    styles.accountLinkItemWrapper,
    {
      [styles.unlinked]: !isLinked || needsAuth,
      [styles.needsAttention]: hasErrors && !needsAuth,
    }
  );

  const mt = BungieMembershipType[props.membershipType] as EnumStrings<
    typeof BungieMembershipType
  >;

  const errors = props.flowState.validation.profileSpecificErrors[mt];

  const credentialType = () => {
    return UserUtils.getCredentialTypeFromMembershipType(props.membershipType);
  };

  const platformName = () => {
    return LocalizerUtils.getPlatformNameFromMembershipType(
      props.membershipType
    );
  };

  const openAccountLinkWindow = () => {
    if (props.authButtonOverride) {
      props.authButtonOverride();

      return;
    }

    setLoading(true);

    const requiresFlowStateReset = !isLinked;
    // this checks if resetAuth is set to be true at the environment level but if set to false, will respect whatever props have been passed in to the specific instance
    const resetAuth =
      ConfigUtils.GetParameter("CrossSave", "CrossSaveResetAuth", true) ||
      props.resetAuth;

    const url = isLinked
      ? RouteHelper.GetAccountAuthVerify(
          credentialType(),
          props.stateIdentifier,
          resetAuth
        ).url
      : RouteHelper.SignInPreview(credentialType()).url;

    BrowserUtils.openWindow(url, "linkui", () => {
      //need to account for closing the modal without linking
      GlobalStateDataStore.refreshUserAndRelatedData().then(() => {
        setLoading(false);

        if (
          globalState.credentialTypes?.find(
            (c) => c.credentialType === credentialType()
          )
        ) {
          props.onAccountLinked &&
            props.onAccountLinked(requiresFlowStateReset).then(() => {
              setLoading(false);
            });
        }
      });
    });
  };

  const showErrors = () => {
    const modalSubtitle = Localizer.Format(
      Localizer.Crosssave.ErrorModalSubtitle,
      {
        platformName: LocalizerUtils.getPlatformNameFromMembershipType(
          props.membershipType
        ),
      }
    );

    const rendered = (
      <React.Fragment>
        <CrossSaveHeader
          text={Localizer.Crosssave.ErrorModalTitle}
          subtext={modalSubtitle}
        />
        <div>
          {props.flowState.validation.profileSpecificErrors[mt].map((error) => (
            <CrossSaveValidationError key={error.errorCode} error={error} />
          ))}
        </div>
      </React.Fragment>
    );

    Modal.open(rendered, {
      className: styles.errorModal,
    });
  };

  return (
    <CrossSaveAccountCard
      className={accountLinkItemWrapperClasses}
      flowState={props.flowState}
      loading={loading}
      hideAccountInfo={props.hideAccountInfo}
      membershipType={props.membershipType}
    >
      {UserUtils.isAuthEnabledForMembershipType(props.membershipType) ? (
        <div className={styles.actionWrapper}>
          {!!flowStateForMembership.platformMembership && (
            <CrossSaveSilverBalance
              membershipType={props.membershipType}
              flowState={props.flowState}
            />
          )}

          {goodToGo && <GoodToGo platformName={platformName()} />}

          {(needsAuth || !isLinked) && !hasErrors && (
            <NeedsAuth
              platformName={platformName()}
              onClick={() => openAccountLinkWindow()}
              isLinked={isLinked}
            />
          )}

          {hasErrors && isLinked && (
            <HasErrors validationErrors={errors} onClick={showErrors} />
          )}
        </div>
      ) : (
        <div className={styles.actionWrapper}>
          {!props?.isDeactivateFlow && (
            <div className={styles.text}>
              {Localizer.Profile.PlatformLinkingOff}
            </div>
          )}
        </div>
      )}
    </CrossSaveAccountCard>
  );
};

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
