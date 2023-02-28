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
import { Responses } from "@Platform";
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

  const rootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    globalState.coreSettings.destiny2CoreSettings.guardianRanksRootNodeHash
  );

  //index is zero-based and is always 1 less than rank and is used for presentationNode def
  const highestRank = Math.max(
    props.destinyProfileResponse?.profile?.data?.lifetimeHighestGuardianRank ??
      1,
    1
  );
  const currentRank = Math.max(
    props.destinyProfileResponse?.profile?.data?.currentGuardianRank ?? 1,
    1
  );
  const currentRankIndex = Math.max((currentRank ?? 1) - 1, 0);
  const highestRankIndex = Math.max((highestRank ?? 1) - 1, 0);

  const currentRankPresentationNodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    rootNode?.children?.presentationNodes?.[currentRankIndex]
      ?.presentationNodeHash
  );
  const highestRankPresentationNodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    rootNode?.children?.presentationNodes?.[highestRankIndex]
      ?.presentationNodeHash
  );

  const currentRankDef = props.definitions.DestinyGuardianRankDefinition.get(
    currentRank
  );

  const highestRankDef = props.definitions.DestinyGuardianRankDefinition.get(
    highestRank
  );

  const guardianRankConstants = props.definitions.DestinyGuardianRankConstantsDefinition.get(
    1
  );

  if (!rootNode || !currentRankPresentationNodeDef) {
    return null;
  }

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

              const isComplete =
                data?.completionValue > 0 &&
                data?.progressValue >= data?.completionValue;
              const isActive = currentRankIndex === index;
              const isHighest = !isActive && highestRankIndex === index;

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
          <div className={classNames(styles.currentRankBar, styles.bar)}>
            <span className={styles.label}>{triumphsLoc.Rank}</span>
            <span className={styles.rankText}>
              <span
                className={classNames(
                  styles.highestCurrentCompletedIndex,
                  styles.rankNumber
                )}
                style={{
                  backgroundImage: `url(${currentRankDef?.displayProperties?.icon})`,
                }}
              />
              <span className={styles.rankValue}>
                {currentRankPresentationNodeDef?.displayProperties?.name}
              </span>
            </span>
          </div>
          <div className={classNames(styles.highestRankBar, styles.bar)}>
            <span className={styles.label}>{triumphsLoc.HighestAchieved}</span>
            <span className={styles.rankText}>
              <span
                className={classNames(
                  styles.highestCurrentCompletedIndex,
                  styles.rankNumber
                )}
                style={{
                  backgroundImage: `url(${highestRankDef?.displayProperties?.icon})`,
                }}
              />
              <span className={styles.rankValue}>
                {highestRankPresentationNodeDef?.displayProperties?.name}
              </span>
            </span>
          </div>
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
