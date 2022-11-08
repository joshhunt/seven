import { ConvertToPlatformError } from "@ApiIntermediary";
import { EntitlementsTable } from "@Areas/CrossSave/Activate/Components/EntitlementsTable";
import SeasonsTable from "@Areas/CrossSave/Activate/Components/SeasonsTable";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import { PlatformError } from "@CustomErrors";
import * as Globals from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { EnumKey } from "@Helpers";
import { CrossSave, Platform } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import ConfirmationModal from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Spinner } from "@UI/UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import posed from "react-pose";
import { useHistory } from "react-router";
import { CrossSaveCardHeader } from "../Shared/CrossSaveCardHeader";
import { CrossSaveClanCard } from "../Shared/CrossSaveClanCard";
import { CrossSaveFlowStateDataStore } from "../Shared/CrossSaveFlowStateDataStore";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { CrossSaveUtils } from "../Shared/CrossSaveUtils";
import { CrossSaveAccountCard } from "./Components/CrossSaveAccountCard";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { CrossSaveValidationError } from "./Components/CrossSaveValidationError";
import styles from "./CrossSaveCommit.module.scss";

interface ICrossSaveReviewProps {
  onAccountLinked: (isVerify: boolean) => Promise<any | PlatformError>;
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
const CrossSaveCommit = (props: ICrossSaveReviewProps) => {
  const [show, setShow] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [showSilverWarning, setShowSilverWarning] = useState(false);
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
  ]);
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const history = useHistory();

  useEffect(() => {
    setShowSilverWarning(doShowSilverWarning);
    setTimeout(() => setShow(true), 250);
  }, []);

  const doShowSilverWarning = () => {
    return flowState.linkedDestinyProfiles.profiles
      .filter((p) => !p.isCrossSavePrimary)
      .some((profile) => {
        const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
          flowState,
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

  const commitCrossSave = () => {
    setCommitLoading(true);

    const primaryMembershipType = flowState.primaryMembershipType;
    const overriddenMembershipTypes = flowState.includedMembershipTypes.filter(
      (a) => a !== primaryMembershipType
    );

    const input: CrossSave.CrossSavePairingRequest = {
      primaryMembershipType,
      overriddenMembershipTypes,
    };

    setTimeout(() => {
      Platform.CrosssaveService.SetCrossSavePairing(
        input,
        flowState.stateIdentifier
      )
        .then(onPairChanged)
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => Modal.error(e))
        .finally(() => setCommitLoading(false));
    }, 1500);
  };

  const confirmCommitCrossSave = () => {
    const helpStepId = ConfigUtils.GetParameter(
      SystemNames.CrossSave,
      "CrossSaveHelpStepId",
      0
    );
    const stadiaIsPrimary =
      flowState.primaryMembershipType ===
      Globals.BungieMembershipType.TigerStadia;
    const showStadiaWarning =
      ConfigUtils.SystemStatus(SystemNames.CrossSaveStadiaException) &&
      stadiaIsPrimary;

    const ackList = [
      `${Localizer.Format(Localizer.Crosssave.CrossSaveLockoutWarning, {
        timeLimit: flowState.validation.settings.repairThrottleDurationFragment,
      })} <a href="${RouteHelper.HelpStep(helpStepId).url}" target="__blank">${
        Localizer.Crosssave.IDonTUnderstandHelp
      }</a>`,
      Localizer.Crosssave.SilverInConfirmationModal,
      Localizer.Crosssave.AcknowledgementCheckboxText1,
      Localizer.Crosssave.AcknowledgementCheckboxText2,
      Localizer.Crosssave.AcknowledgementCheckboxText3,
    ];

    if (!showSilverWarning) {
      ackList.splice(1, 1);
    }

    ConfirmationModal.show({
      type: "info",
      title: Localizer.Crosssave.ConfirmationModalTitle,
      acknowledgements: ackList,
      children: (
        <div>
          {showStadiaWarning && (
            <div>
              {Localizer.Crosssave.StadiaSeasonsWarning}
              <br />
              <br />
            </div>
          )}
        </div>
      ),
      confirmButtonProps: {
        labelOverride: Localizer.Crosssave.ConfirmModalConfirmButtonLabel,
        onClick: () => {
          commitCrossSave();

          return true;
        },
      },
      footerContent: (
        <Anchor url={RouteHelper.CrossSave({ FAQ: "true" })}>
          {Localizer.Crosssave.SilverLinkFAQ}
        </Anchor>
      ),
    });
  };

  const onPairChanged = (data: CrossSave.CrossSavePairingResponse) => {
    const errorEntries = data.entries.filter(
      (a) => a.errorCode !== Globals.PlatformErrorCodes.Success
    );

    if (errorEntries.length > 0) {
      const allErrors = errorEntries.map((a) => (
        <div key={a.errorCode}>{a.message}</div>
      ));

      Modal.open(allErrors);
    } else {
      CrossSaveFlowStateDataStore.actions.resetSetup();

      const confirmationPath = RouteDefs.Areas.CrossSave.resolve("Confirmation")
        .url;
      history.push(confirmationPath);

      CrossSaveFlowStateDataStore.loadUserData();
    }
  };

  const entitlementOwned = (
    membershipType: Globals.BungieMembershipType,
    gameVersion: Globals.DestinyGameVersions
  ) => {
    const memberShipTypeString = Globals.BungieMembershipType[
      membershipType
    ] as EnumStrings<typeof Globals.BungieMembershipType>;
    const entitlements =
      flowState.entitlements.platformEntitlements[memberShipTypeString];

    return (
      entitlements && EnumUtils.hasFlag(gameVersion, entitlements.gameVersions)
    );
  };

  const renderPairReview = () => {
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
        entitlementOwned(membershipType, gv)
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
          />
        </div>
      );
    });

    return includedPlatforms;
  };

  // Flatten all the errors into one big list
  const errors = Object.values(
    flowState.validation.profileSpecificErrors
  ).reduce((flattened, errorSet) => flattened.concat(errorSet), []);

  // We don't want to allow users to set their Cross Save status if they have errors
  // unless they have already committed it and are trying to fix issues
  const canCommit = errors.length === 0 && !flowState.isActive;

  const settingsMessage = (
    <>
      {Localizer.FormatReact(Localizer.Crosssave.ReviewSettingsMessage, {
        accountLinkingSettingsLink: (
          <Anchor url={RouteHelper.Settings({ category: "Accounts" })}>
            {Localizer.Crosssave.SettingsLinkLabel}
          </Anchor>
        ),
      })}
    </>
  );

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

  const commitLabel = commitLoading ? (
    Localizer.Crosssave.ActivatingCrossSave
  ) : (
    <React.Fragment>
      {Localizer.Crosssave.CommitButtonLabel}{" "}
      <Icon iconType={"material"} iconName={`arrow_forward`} />
    </React.Fragment>
  );

  return (
    <div className={classNames({ [styles.commitLoading]: commitLoading })}>
      <div className={styles.commitDetails}>
        {commitLoading && !globalState.responsive.medium && (
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
              pose={show ? "show" : "hide"}
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
                <div className={classNames(styles.result, styles.reviewBlock)}>
                  {renderPairReview()}
                </div>
              </StaggerItem>
            </StaggerWrapper>
          </CrossSaveStaggerPose>
        </div>
      </div>
      {ConfigUtils.SystemStatus("CrossSaveEntitlementTables") && (
        <div className={styles.entitlementTables}>
          <EntitlementsTable flowState={flowState} />
          <hr />
          <SeasonsTable flowState={flowState} />
        </div>
      )}
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
                    loading={commitLoading}
                    onClick={confirmCommitCrossSave}
                    caps={true}
                  >
                    {commitLabel}
                  </Button>
                </React.Fragment>
              )}
            </div>

            {flowState.isActive && (
              <div className={styles.reviewSettingsMessage}>
                {settingsMessage}
              </div>
            )}
          </StaggerItem>
        </StaggerWrapper>
      </CrossSaveStaggerPose>
    </div>
  );
};

export default CrossSaveCommit;
