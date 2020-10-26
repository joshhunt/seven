import * as React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@Global/Localizer";
import { Platform, CrossSave } from "@Platform";
import styles from "./CrossSaveCommit.module.scss";
import { RouteDefs } from "@Routes/RouteDefs";
import {
  ICrossSaveFlowState,
  CrossSaveFlowStateDataStore,
} from "../Shared/CrossSaveFlowStateDataStore";
import { GlobalStateComponentProps } from "@Global/DataStore/GlobalStateDataStore";
import { RouteComponentProps, withRouter } from "react-router-dom";
import * as Globals from "@Enum";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { CrossSaveUtils } from "../Shared/CrossSaveUtils";
import classNames from "classnames";
import posed from "react-pose";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { RouteHelper } from "@Routes/RouteHelper";
import { CrossSaveValidationError } from "./Components/CrossSaveValidationError";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { Anchor } from "@UI/Navigation/Anchor";
import { CrossSaveAccountCard } from "./Components/CrossSaveAccountCard";
import { CrossSaveClanCard } from "../Shared/CrossSaveClanCard";
import { CrossSaveCardHeader } from "../Shared/CrossSaveCardHeader";
import { PlatformError } from "@CustomErrors";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Spinner } from "@UI/UIKit/Controls/Spinner";
import { Responsive } from "@Boot/Responsive";
import ConfirmationModal from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { EnumKey } from "@Helpers";

interface ICrossSaveReviewProps
  extends RouteComponentProps,
    GlobalStateComponentProps<
      "loggedInUser" | "responsive" | "loggedInUserClans"
    > {
  flowState: ICrossSaveFlowState;
  onAccountLinked: (isVerify: boolean) => Promise<void | PlatformError>;
}

interface ICrossSaveReviewState {
  show: boolean;
  commitLoading: boolean;
  showSilverWarning: boolean;
}

const transition = {
  transition: {
    ease: "easeInOut",
    duration: 1000,
  },
};

/** Animates children inside at a staggered rate */
const StaggerWrapper = posed.div({
  show: {
    opacity: 1,
    delayChildren: 300,
    staggerChildren: 500,
    ...transition,
  },
  hide: {
    opacity: 0,
    ...transition,
  },
  initialPose: "hide",
});

/** Animates this item as a staggered child of StaggerWrapper */
const StaggerItem = posed.div({
  show: {
    opacity: 1,
    ...transition,
  },
  hide: {
    opacity: 0,
    ...transition,
  },
  initialPose: "hide",
});

/**
 * The steps to review your choices in Cross-Save
 *  *
 * @param {ICrossSaveReviewProps} props
 * @returns
 */
class CrossSaveCommit extends React.Component<
  ICrossSaveReviewProps,
  ICrossSaveReviewState
> {
  constructor(props: ICrossSaveReviewProps) {
    super(props);

    this.state = {
      show: false,
      commitLoading: false,
      showSilverWarning: false,
    };
  }

  public componentDidMount() {
    this.setState({
      showSilverWarning: this.showSilverWarning(),
    });

    setTimeout(
      () =>
        this.setState({
          show: true,
        }),
      250
    );
  }

  private readonly showSilverWarning = () => {
    return this.props.flowState.linkedDestinyProfiles.profiles
      .filter((p) => !p.isCrossSavePrimary)
      .some((profile) => {
        const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
          this.props.flowState,
          profile.membershipType
        );
        const userInfo = flowStateForMembership.userInfo;
        const key = EnumKey(
          profile.membershipType,
          Globals.BungieMembershipType
        );
        const silver = userInfo.platformSilver.platformSilver[key];

        return silver && silver.quantity > 0;
      });
  };

  private readonly commitCrossSave = () => {
    this.setCommitLoading(true);

    const primaryMembershipType = this.props.flowState.primaryMembershipType;
    const overriddenMembershipTypes = this.props.flowState.includedMembershipTypes.filter(
      (a) => a !== primaryMembershipType
    );

    const input: CrossSave.CrossSavePairingRequest = {
      primaryMembershipType,
      overriddenMembershipTypes,
    };

    setTimeout(() => {
      Platform.CrosssaveService.SetCrossSavePairing(
        input,
        this.props.flowState.stateIdentifier
      )
        .then(this.onPairChanged)
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => Modal.error(e))
        .finally(() => this.setCommitLoading(false));
    }, 1500);
  };

  private readonly confirmCommitCrossSave = () => {
    const helpStepId = ConfigUtils.GetParameter(
      SystemNames.CrossSave,
      "CrossSaveHelpStepId",
      0
    );
    const stadiaIsPrimary =
      this.props.flowState.primaryMembershipType ===
      Globals.BungieMembershipType.TigerStadia;
    const showStadiaWarning =
      ConfigUtils.SystemStatus(SystemNames.CrossSaveStadiaException) &&
      stadiaIsPrimary;

    ConfirmationModal.show({
      type: "info",
      title: Localizer.Crosssave.ConfirmationModalTitle,
      children: (
        <div>
          {Localizer.Format(Localizer.Crosssave.CrossSaveLockoutWarning, {
            timeLimit: this.props.flowState.validation.settings
              .repairThrottleDurationFragment,
          })}
          <br />
          <br />
          <Anchor url={RouteHelper.HelpStep(helpStepId)}>
            {Localizer.Crosssave.CommitHelpLinkLabel}
          </Anchor>
          <br />
          <br />
          {showStadiaWarning && (
            <div>
              {Localizer.Crosssave.StadiaSeasonsWarning}
              <br />
              <br />
            </div>
          )}
          {this.state.showSilverWarning && (
            <div>
              {Localizer.Crosssave.SilverInConfirmationModal}
              <br />
              <br />
              <Anchor url={RouteHelper.CrossSave({ FAQ: "true" })}>
                {Localizer.Crosssave.SilverLinkFAQ}
              </Anchor>
            </div>
          )}
        </div>
      ),
      confirmButtonProps: {
        labelOverride: Localizer.Crosssave.ConfirmModalConfirmButtonLabel,
        onClick: () => {
          this.commitCrossSave();

          return true;
        },
      },
    });
  };

  private readonly onPairChanged = (
    data: CrossSave.CrossSavePairingResponse
  ) => {
    const errorEntries = data.entries.filter(
      (a) => a.errorCode !== Globals.PlatformErrorCodes.Success
    );

    if (errorEntries.length > 0) {
      const allErrors = errorEntries.map((a) => (
        <div key={a.errorCode}>{a.message}</div>
      ));

      Modal.open(allErrors);
    } else {
      CrossSaveFlowStateDataStore.resetSetup();

      const confirmationPath = RouteDefs.Areas.CrossSave.resolve("Confirmation")
        .url;
      this.props.history.push(confirmationPath);

      CrossSaveFlowStateDataStore.loadUserData();
    }
  };

  private setCommitLoading(loading: boolean) {
    this.setState({
      commitLoading: loading,
    });
  }

  private entitlementOwned(
    membershipType: Globals.BungieMembershipType,
    gameVersion: Globals.DestinyGameVersions
  ) {
    const memberShipTypeString = Globals.BungieMembershipType[
      membershipType
    ] as EnumStrings<typeof Globals.BungieMembershipType>;
    const entitlements = this.props.flowState.entitlements.platformEntitlements[
      memberShipTypeString
    ];

    return (
      entitlements && EnumUtils.hasFlag(gameVersion, entitlements.gameVersions)
    );
  }

  private renderPairReview() {
    const flowState = this.props.flowState;

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );
    const gameVersionsForCommitPage = [
      Globals.DestinyGameVersions.Forsaken,
      Globals.DestinyGameVersions.DLC2,
      Globals.DestinyGameVersions.DLC1,
    ];

    const includedPlatforms = pairableMembershipTypes.map((membershipType) => {
      const flowstateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
        flowState,
        membershipType
      );

      const needsAuth =
        flowState.includedMembershipTypes.indexOf(membershipType) === -1;
      const classes = classNames(
        styles.reviewCard,
        {
          [styles.cardNeedsAuth]: needsAuth,
        },
        styles.relativeContainer
      );

      if (needsAuth) {
        return null;
      }

      const entitlementsOwned = gameVersionsForCommitPage.filter((gv) =>
        this.entitlementOwned(membershipType, gv)
      );
      const hasEntitlements = entitlementsOwned.length > 0;

      const entitlementsOwnedRendered = entitlementsOwned.map((gv) => {
        return (
          <div key={gv} className={styles.entitlementTag}>
            {Localizer.Format(Localizer.Crosssave.OwnedLabel, {
              platformName:
                Localizer.Crosssave[Globals.DestinyGameVersions[gv]],
            })}
          </div>
        );
      });

      let seasonsOwnedRendered = null;

      if (
        flowstateForMembership.profileResponse &&
        flowstateForMembership.profileResponse.profile &&
        flowstateForMembership.profileResponse.profile.data.seasonHashes &&
        flowstateForMembership.profileResponse.profile.data.seasonHashes
          .length > 0
      ) {
        seasonsOwnedRendered = flowstateForMembership.profileResponse.profile.data.seasonHashes.map(
          (seasonHash) => {
            const def = flowState.definitions.seasons[seasonHash];
            if (def) {
              return (
                <div className={styles.entitlementTag}>
                  {def.displayProperties.name}
                </div>
              );
            }
          }
        );
      }

      const noSeasonsRendered = (
        <div className={classNames(styles.none, styles.entitlementTag)}>
          {Localizer.Crosssave.NoSeasons}
        </div>
      );

      return (
        <div key={membershipType} className={styles.resultItemWrapper}>
          <CrossSaveAccountCard
            className={classes}
            hideAccountInfo={needsAuth}
            hideCharacters={true}
            hideClan={true}
            flowState={flowState}
            membershipType={membershipType}
            showSilver={true}
          >
            <div className={styles.sticksToEnd}>
              <div className={styles.seasonsTitle}>
                {Localizer.Crosssave.OwnedSeasonsHeader}
              </div>
              <div className={styles.seasonsContainer}>
                {seasonsOwnedRendered || noSeasonsRendered}
              </div>
              <div className={styles.entitlementsTitle}>
                {Localizer.Crosssave.PlatformEntitlementsHeading}
              </div>
              <div className={styles.entitlementsContainer}>
                {entitlementsOwnedRendered}

                {
                  /* Check if a user has any of the above entitlements, since it is the closest way to guess whether they have access to The Red War or not */
                  hasEntitlements && (
                    <div className={styles.entitlementTag}>
                      {Localizer.Format(Localizer.Crosssave.OwnedLabel, {
                        platformName:
                          Localizer.Crosssave[Globals.DestinyGameVersions[1]],
                      })}
                    </div>
                  )
                }

                {!hasEntitlements && (
                  <div
                    className={classNames(styles.none, styles.entitlementTag)}
                  >
                    {Localizer.Crosssave.NoEntitlements}
                  </div>
                )}
              </div>
            </div>
          </CrossSaveAccountCard>
        </div>
      );
    });

    return includedPlatforms;
  }

  public render() {
    // Flatten all the errors into one big list
    const errors = Object.values(
      this.props.flowState.validation.profileSpecificErrors
    ).reduce((flattened, errorSet) => flattened.concat(errorSet), []);

    // We don't want to allow users to set their Cross Save status if they have errors
    // unless they have already committed it and are trying to fix issues
    const canCommit = errors.length === 0 && !this.props.flowState.isActive;

    const settingsMessage = Localizer.FormatReact(
      Localizer.Crosssave.ReviewSettingsMessage,
      {
        accountLinkingSettingsLink: (
          <Anchor url={RouteHelper.Settings({ category: "Accounts" })}>
            {Localizer.Crosssave.SettingsLinkLabel}
          </Anchor>
        ),
      }
    );
    const { globalState, flowState } = this.props;
    const userClans = globalState.loggedInUserClans
      ? globalState.loggedInUserClans.results
      : [];
    const clan = userClans.filter(
      (myClan) =>
        myClan.member.destinyUserInfo.membershipType ===
          flowState.primaryMembershipType && myClan.group.groupType === 1
    )[0];

    const nextPrevSteps = CrossSaveUtils.getNextPrevStepPaths(
      flowState,
      "Commit"
    );

    const stepDesc = (
      <React.Fragment>
        {Localizer.Crosssave.ReviewStepDescription1}
      </React.Fragment>
    );

    const frictionWindowLabel = Localizer.Format(
      Localizer.Crosssave.CommitLockWarning2,
      {
        crossSaveFrictionWindow:
          flowState.validation.settings.repairThrottleDurationFragment,
      }
    );

    const commitLabel = this.state.commitLoading ? (
      Localizer.Crosssave.ActivatingCrossSave
    ) : (
      <React.Fragment>
        {Localizer.Crosssave.CommitButtonLabel}{" "}
        <Icon iconType={"material"} iconName={`arrow_forward`} />
      </React.Fragment>
    );

    return (
      <div
        className={classNames({
          [styles.commitLoading]: this.state.commitLoading,
        })}
      >
        <div className={styles.commitDetails}>
          {this.state.commitLoading && !Responsive.state.medium && (
            <div className={styles.spinnerOverlay}>
              <h2>{Localizer.Crosssave.ActivatingCrossSave}</h2>
              <Spinner />
            </div>
          )}
          <div className={styles.hideDuringLoading}>
            <CrossSaveStaggerPose index={0}>
              <CrossSaveActivateStepInfo
                title={Localizer.Crosssave.ReviewStepTitle}
                desc={stepDesc}
              />
            </CrossSaveStaggerPose>

            <CrossSaveStaggerPose index={1}>
              {errors.length > 0 && (
                <div className={styles.reviewErrors}>
                  {errors.map((error, i) => (
                    <CrossSaveValidationError
                      key={i}
                      error={error}
                      includeMembershipType={true}
                    />
                  ))}
                </div>
              )}
              <StaggerWrapper
                className={styles.reviewSummary}
                pose={this.state.show ? "show" : "hide"}
              >
                <StaggerItem
                  className={classNames(
                    styles.characterReview,
                    styles.reviewBlock
                  )}
                >
                  <div className={styles.ellipsesText}>
                    {Localizer.Crosssave.SetUpPrimary}
                  </div>
                  <CrossSaveAccountCard
                    className={styles.reviewCard}
                    membershipType={flowState.primaryMembershipType}
                    flowState={flowState}
                    hideAccountInfo={true}
                  />
                  {clan && (
                    <CrossSaveAccountCard
                      className={styles.clan}
                      flowState={flowState}
                      membershipType={flowState.primaryMembershipType}
                      hideAccountInfo={true}
                      hideCharacters={true}
                      headerOverride={<CrossSaveCardHeader />}
                    >
                      <CrossSaveClanCard clan={clan} />
                    </CrossSaveAccountCard>
                  )}
                </StaggerItem>
                <StaggerItem className={styles.dottedLine}>
                  <div />
                </StaggerItem>
                <StaggerItem className={styles.platforms}>
                  <div className={styles.ellipsesText}>
                    {Localizer.Crosssave.SetUpAllPlatforms}
                  </div>
                  <div
                    className={classNames(styles.result, styles.reviewBlock)}
                  >
                    {this.renderPairReview()}
                  </div>
                </StaggerItem>
              </StaggerWrapper>
            </CrossSaveStaggerPose>
          </div>
        </div>

        <CrossSaveStaggerPose index={2}>
          <StaggerWrapper>
            <StaggerItem>
              <div className={styles.buttonDisabledDesc}>
                {Localizer.Crosssave.CommitLockWarning1}
                <br />
                {frictionWindowLabel}
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className={styles.buttonContainer}>
                {canCommit && (
                  <React.Fragment>
                    <Button
                      className={styles.buttonBack}
                      buttonType={"white"}
                      url={nextPrevSteps.prevPath}
                      caps={true}
                    >
                      <Icon iconType={"material"} iconName={`arrow_back`} />{" "}
                      {Localizer.Crosssave.Back}
                    </Button>
                    <Button
                      className={classNames(styles.buttonNext)}
                      buttonType={"gold"}
                      loading={this.state.commitLoading}
                      onClick={this.confirmCommitCrossSave}
                      caps={true}
                    >
                      {commitLabel}
                    </Button>
                  </React.Fragment>
                )}
              </div>

              {this.props.flowState.isActive && (
                <div className={styles.reviewSettingsMessage}>
                  {settingsMessage}
                </div>
              )}
            </StaggerItem>
          </StaggerWrapper>
        </CrossSaveStaggerPose>
      </div>
    );
  }
}

export default withRouter(CrossSaveCommit);
