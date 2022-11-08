import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Responses } from "@Platform";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { useState } from "react";
import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
} from "../Shared/CrossSaveFlowStateDataStore";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { CrossSaveSteamMessage } from "../Shared/CrossSaveSteamMessage";
import { CrossSaveUtils } from "../Shared/CrossSaveUtils";
import { CrossSaveAccountCard } from "./Components/CrossSaveAccountCard";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { CrossSaveSilverBalance } from "./Components/CrossSaveSilverBalance";
import styles from "./CrossSaveCharacters.module.scss";

/**
 * The steps to choose your characters in Cross-Save
 *  *
 * @returns
 */
export const CrossSaveCharacters = () => {
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const [hoveredAccount, setHoveredAccount] = useState(null);
  const [primaryMembership, setPrimaryMembership] = useState(
    flowState.primaryMembershipType
  );

  const onCharactersSelected = (membershipType: BungieMembershipType) => {
    setPrimaryMembership(membershipType);
    CrossSaveFlowStateDataStore.actions.updatePrimaryMembershipType(
      membershipType
    );
  };

  const onCharactersHovered = (membershipType: BungieMembershipType) => {
    if (primaryMembership <= 0) {
      setHoveredAccount(membershipType);
    }
  };

  const deHover = () => {
    setHoveredAccount(null);
  };

  const deselect = () => {
    setPrimaryMembership(null);

    CrossSaveFlowStateDataStore.actions.updatePrimaryMembershipType(null);

    setTimeout(() => deHover, 500);
  };

  const renderAccounts = () => {
    if (!flowState.loaded) {
      return null;
    }

    const accounts = flowState.includedMembershipTypes.map((membershipType) => {
      const canBePrimary = CrossSaveUtils.membershipTypeCanBePrimary(
        membershipType,
        flowState
      );
      if (!canBePrimary) {
        return null;
      }

      const isHovered = hoveredAccount === membershipType;

      const classes = classNames(styles.accountItemWrapper, {
        [styles.hoveredCharacters]: isHovered,
        [styles.selectedAccount]: primaryMembership === membershipType,
        [styles.unhoveredAccount]:
          hoveredAccount !== null && hoveredAccount !== membershipType,
        [styles.unselectedCharacters]:
          primaryMembership !== null && primaryMembership !== membershipType,
        [styles.unavailableAccount]: flowState.includedMembershipTypes.every(
          (a) => a !== membershipType
        ),
        [styles.unselectable]: !canBePrimary,
      });

      const onSelected = () => onCharactersSelected(membershipType);
      const onMouseOver = () => onCharactersHovered(membershipType);

      return (
        <div key={membershipType} className={classes} onMouseOver={onMouseOver}>
          <CrossSaveAccountCard
            style={{ cursor: "pointer" }}
            onClick={onSelected}
            onMouseOut={deHover}
            flowState={flowState}
            membershipType={membershipType}
          >
            <CrossSaveSilverBalance
              membershipType={membershipType}
              flowState={flowState}
            />
          </CrossSaveAccountCard>
        </div>
      );
    });

    return accounts;
  };

  const accountRendered = renderAccounts();

  const nextPrevSteps = CrossSaveUtils.getNextPrevStepPaths(
    flowState,
    "Characters"
  );

  const buttonContainerClasses = classNames(styles.buttonContainer, {
    [styles.disabled]: primaryMembership === BungieMembershipType.None,
  });

  const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(flowState);

  // If we came from the Pair page, we don't want to stagger the animation.
  const cameFromPair = stepDefs.some((a) => a.step === "Pair");

  const helpStepId = ConfigUtils.GetParameter(
    SystemNames.CrossSave,
    "CrossSaveHelpStepId",
    0
  );

  const desc = (
    <>
      {Localizer.FormatReact(Localizer.Crosssave.CharacterStepDescription, {
        helpLink: (
          <Anchor url={RouteHelper.HelpStep(helpStepId)}>
            {Localizer.Crosssave.CharactersHelpLinkLabel}
          </Anchor>
        ),
      })}
    </>
  );

  return (
    <div>
      <CrossSaveStaggerPose index={0} instant={cameFromPair}>
        <CrossSaveActivateStepInfo
          title={Localizer.Crosssave.CharacterStepTitle}
          desc={desc}
        />
      </CrossSaveStaggerPose>

      <CrossSaveStaggerPose index={1} instant={cameFromPair}>
        <div className={styles.characterAccounts}>
          {accountRendered}

          <CharacterChoice
            primaryMembership={primaryMembership}
            nextPath={nextPrevSteps.nextPath}
          />
        </div>
      </CrossSaveStaggerPose>

      <CrossSaveStaggerPose index={2} instant={cameFromPair}>
        <div className={buttonContainerClasses}>
          {!primaryMembership ? (
            <Button
              className={styles.buttonBack}
              buttonType={"white"}
              url={nextPrevSteps.prevPath}
              caps={true}
            >
              <Icon iconType={"material"} iconName={`arrow_back`} />{" "}
              {Localizer.Crosssave.Back}
            </Button>
          ) : (
            <Button
              className={styles.buttonBack}
              buttonType={"white"}
              onClick={deselect}
              caps={true}
            >
              <Icon iconType={"material"} iconName={`arrow_back`} />{" "}
              {Localizer.Crosssave.Back}
            </Button>
          )}
        </div>
      </CrossSaveStaggerPose>
    </div>
  );
};

const CharacterChoice = (props: {
  primaryMembership: BungieMembershipType;
  nextPath: IMultiSiteLink;
}) => {
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  if (!props.primaryMembership) {
    return null;
  }

  const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
    flowState,
    props.primaryMembership
  );
  const { userInfo } = flowStateForMembership;

  const faqArticleId = ConfigUtils.GetParameter(
    SystemNames.CrossSave,
    "FaqFirehoseArticleId",
    0
  );
  const faqLink = RouteHelper.HelpArticle(faqArticleId);

  const title = Localizer.Format(Localizer.Crosssave.PlatformCharacters, {
    platform: LocalizerUtils.getPlatformNameFromMembershipType(
      props.primaryMembership
    ),
  });

  const subtitle = (
    <>
      {Localizer.FormatReact(Localizer.Crosssave.ChooseCharactersSubtitle, {
        crossSaveHelpLink: (
          <Anchor url={faqLink}>
            {Localizer.Crosssave.CrossSaveHelpLinkLabel}
          </Anchor>
        ),
      })}
    </>
  );

  const alertContentSilver = (
    <>
      {Localizer.FormatReact(Localizer.Crosssave.AlertContentSilver, {
        silver: <span>{Localizer.Crosssave.Silver}</span>,
        seasons: <span>{Localizer.Crosssave.Seasons}</span>,
      })}
    </>
  );

  const stadiaIsPrimary =
    props.primaryMembership === BungieMembershipType.TigerStadia;
  const showStadiaWarning =
    ConfigUtils.SystemStatus(SystemNames.CrossSaveStadiaException) &&
    stadiaIsPrimary;

  const activeCharactersHaveNone =
    !flowStateForMembership.profileResponse ||
    !flowStateForMembership.profileResponse.characters ||
    !flowStateForMembership.profileResponse.characters.data ||
    Object.keys(flowStateForMembership.profileResponse.characters.data)
      .length === 0;

  /** this is the check for silver on other platforms, we will want to check for seasons owned on other platforms too */
  let hasInactiveSilver = false;
  if (userInfo) {
    flowState.linkedDestinyProfiles.profiles.map((profile) => {
      // Check if there's any silver on accounts being overridden in expected Destiny Platform buckets, if those
      // buckets exist.
      if (profile.membershipId !== userInfo.membershipId) {
        if (profile.platformSilver && profile.platformSilver.platformSilver) {
          const platformSilverComponents =
            profile.platformSilver.platformSilver;

          if (
            platformSilverComponents.TigerBlizzard &&
            platformSilverComponents.TigerBlizzard.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
          if (
            platformSilverComponents.TigerPsn &&
            platformSilverComponents.TigerPsn.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
          if (
            platformSilverComponents.TigerStadia &&
            platformSilverComponents.TigerStadia.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
          if (
            platformSilverComponents.TigerSteam &&
            platformSilverComponents.TigerSteam.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
          if (
            platformSilverComponents.TigerXbox &&
            platformSilverComponents.TigerXbox.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
          if (
            platformSilverComponents.TigerEgs &&
            platformSilverComponents.TigerEgs.quantity > 0
          ) {
            hasInactiveSilver = true;
          }
        }
      }

      const mt = (profile.membershipType as any) as EnumStrings<
        typeof BungieMembershipType
      >;

      // Check old school location for silver if it's there.
      if (flowState.profileResponses[mt]) {
        const profileResponse: Responses.DestinyProfileResponse =
          flowState.profileResponses[mt];

        if (
          profileResponse.profileCurrencies &&
          profileResponse.profileCurrencies.data &&
          profileResponse.profileCurrencies.data.items
        ) {
          profileResponse.profileCurrencies.data.items.forEach((item) => {
            if (item.itemHash === 3147280338 && item.quantity > 0) {
              hasInactiveSilver = true;
            }
          });
        }
      }
    });
  }

  const hasAlert =
    activeCharactersHaveNone || hasInactiveSilver || stadiaIsPrimary;

  return (
    <div className={styles.characterChoice}>
      {props.primaryMembership === BungieMembershipType.TigerBlizzard && (
        <CrossSaveSteamMessage />
      )}
      <div className={styles.title}>
        <span>{title}</span>
      </div>
      <div className={styles.subtitle}>{subtitle}</div>

      {hasAlert && <div className={styles.alertTopLine} />}

      {showStadiaWarning && (
        <Alert
          title={Localizer.Crosssave.StadiaAlertTitle}
          contents={[Localizer.Crosssave.StadiaSeasonsWarning]}
        />
      )}

      {hasInactiveSilver && (
        <Alert
          title={Localizer.Crosssave.AlertTitle}
          contents={[
            alertContentSilver,
            Localizer.Crosssave.AlertContentDefault,
          ]}
        />
      )}

      {activeCharactersHaveNone && (
        <Alert
          title={Localizer.Crosssave.NoCharWarningTitle}
          contents={[Localizer.Crosssave.NoCharWarningDesc]}
        />
      )}

      <div className={styles.characterConfirmation}>
        {Localizer.Crosssave.ConfirmCharacterChoice}
      </div>

      <div className={styles.buttonContainer}>
        <Button buttonType={"gold"} url={props.nextPath} size={BasicSize.Large}>
          {Localizer.Crosssave.CharacterChoiceButtonLabel}{" "}
          <Icon iconType={"material"} iconName={`arrow_forward`} />
        </Button>
      </div>
    </div>
  );
};

const Alert = (props: {
  title: React.ReactNode;
  contents: React.ReactNode[];
}) => {
  return (
    <div className={styles.alertBox}>
      <div className={styles.alertHeader}>
        <Icon
          className={styles.alertIcon}
          iconType={"material"}
          iconName={"warning"}
        />
        <div className={styles.alertTitle}>{props.title}</div>
      </div>
      <div className={styles.alertContent}>
        {props.contents.map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </div>
    </div>
  );
};
