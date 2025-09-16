// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import headerStyles from "@Areas/User/ProfileComponents/DestinyCommendations.module.scss";
import { GuardianRankUtils } from "@UI/Destiny/GuardianRankUtils";
import styles from "./DestinyGuardianRanks.module.scss";
import profileStyles from "@Areas/User/ProfileComponents/miniblock.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Profiles, Responses } from "@Platform";
import { AiOutlineQuestionCircle } from "@react-icons/all-files/ai/AiOutlineQuestionCircle";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";

interface DestinyGuardianRanksProps
  extends D2DatabaseComponentProps<
    | "DestinyRecordDefinition"
    | "DestinyPresentationNodeDefinition"
    | "DestinyObjectiveDefinition"
    | "DestinyGuardianRankDefinition"
    | "DestinyGuardianRankConstantsDefinition"
  > {
  destinyProfileResponse: Responses.DestinyProfileResponse;
}

const DestinyGuardianRanks: React.FC<DestinyGuardianRanksProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);

  const triumphsLoc = Localizer.Triumphs;

  const profileData = props.destinyProfileResponse?.profile?.data;

  const rootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    globalState.coreSettings.destiny2CoreSettings.guardianRanksRootNodeHash
  );
  const rankIndex = (rankNumber: number) => Math.max((rankNumber ?? 1) - 1, 0);
  const rankPresentationNodeDef = (index: number) =>
    props.definitions.DestinyPresentationNodeDefinition.get(
      rootNode?.children?.presentationNodes?.[index]?.presentationNodeHash
    );
  const rankDef = (rankNumber: number) =>
    props.definitions.DestinyGuardianRankDefinition.get(rankNumber);

  //index is zero-based and is always 1 less than rank and is used for presentationNode def
  const highestRank = Math.max(
    profileData?.lifetimeHighestGuardianRank ?? 1,
    1
  );
  const currentRank = Math.max(profileData?.currentGuardianRank ?? 1, 1);
  const renewedRank = Math.max(profileData?.renewedGuardianRank ?? 1, 1);

  const currentRankIndex = rankIndex(currentRank);
  const highestRankIndex = rankIndex(highestRank);
  const renewedRankIndex = rankIndex(renewedRank);

  const currentRankPresentationNodeDef = rankPresentationNodeDef(
    currentRankIndex
  );
  const renewedRankPresentationNodeDef = rankPresentationNodeDef(
    renewedRankIndex
  );
  const highestRankPresentationNodeDef = rankPresentationNodeDef(
    highestRankIndex
  );

  const currentRankDef = rankDef(currentRank);
  const renewedRankDef = rankDef(renewedRank);
  const highestRankDef = rankDef(highestRank);

  const guardianRankConstants = props.definitions.DestinyGuardianRankConstantsDefinition.get(
    1
  );

  if (!rootNode || !currentRankPresentationNodeDef) {
    return null;
  }

  const rankBar = (
    title: string,
    backgroundIconPath: string,
    displayName: string
  ) => {
    return (
      <div className={styles.bar}>
        <span className={styles.label}>{title}</span>
        <span className={styles.rankText}>
          <span
            className={classNames(
              styles.highestCurrentCompletedIndex,
              styles.rankNumber
            )}
            style={{
              backgroundImage: `url(${backgroundIconPath})`,
            }}
          />
          <span className={styles.rankValue}>{displayName}</span>
        </span>
      </div>
    );
  };

  return (
    <div
      className={classNames(
        profileStyles.mainContainer,
        profileStyles.guardianRanksContainer,
        headerStyles.commendationsContainer
      )}
    >
      <div className={headerStyles.miniBlockHeader}>
        <h4>{triumphsLoc.GuardianRank}</h4>
        <Anchor url={RouteHelper.Help()} title={Localizer.Helptext.HelpArticle}>
          <AiOutlineQuestionCircle />
        </Anchor>
      </div>
      <div className={styles.content}>
        <div className={styles.guardianRankIcon}>
          <div
            className={styles.icon}
            style={{
              backgroundImage: GuardianRankUtils.BackgroundImagesStack(
                currentRankDef,
                guardianRankConstants,
                guardianRankConstants.iconBackgrounds
                  .backgroundFilledBlueBorderedImagePath
              ),
            }}
          />
          <div className={styles.label}>
            {currentRankPresentationNodeDef?.displayProperties?.name}
          </div>
        </div>
        <div className={styles.rankingsWrapper}>
          <div className={styles.rankingsHeader}>
            {triumphsLoc.GuardianRankLabel}{" "}
            {currentRankPresentationNodeDef?.displayProperties?.name}
          </div>
          <div className={styles.rankIconWrapper}>
            {rootNode?.children?.presentationNodes.map((n, index) => {
              const def = props.definitions.DestinyPresentationNodeDefinition.get(
                n.presentationNodeHash
              );
              const data = PresentationNodeUtils.GetPresentationComponentData(
                n.presentationNodeHash,
                destinyMembership?.selectedCharacter?.characterId,
                props.destinyProfileResponse
              );

              const isComplete = index <= currentRankIndex;
              const isActive = currentRankIndex === index;
              const isHighest =
                !isComplete && !isActive && index <= highestRankIndex;

              return (
                <div
                  className={classNames(
                    styles.rankIcon,
                    { [styles.completed]: isComplete },
                    { [styles.active]: isActive },
                    { [styles.highest]: isHighest }
                  )}
                  key={def.hash}
                  title={def.displayProperties?.name}
                >
                  <span>{index + 1}</span>
                </div>
              );
            })}
          </div>
          {rankBar(
            triumphsLoc.Rank,
            currentRankDef?.displayProperties?.icon,
            currentRankPresentationNodeDef?.displayProperties?.name
          )}
          {rankBar(
            triumphsLoc.RenewedRank,
            renewedRankDef?.displayProperties?.icon,
            renewedRankPresentationNodeDef?.displayProperties?.name
          )}
          {rankBar(
            triumphsLoc.HighestAchieved,
            highestRankDef?.displayProperties?.icon,
            highestRankPresentationNodeDef?.displayProperties?.name
          )}
        </div>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(DestinyGuardianRanks, {
  types: [
    "DestinyRecordDefinition",
    "DestinyPresentationNodeDefinition",
    "DestinyObjectiveDefinition",
    "DestinyGuardianRankDefinition",
    "DestinyGuardianRankConstantsDefinition",
  ],
});
