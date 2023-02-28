// Created by atseng, 2022
// Copyright Bungie, Inc.

import classNames from "classnames";
import styles from "./FireteamTags.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import React from "react";

interface FireteamGuardianRankProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyGuardianRankDefinition"
    | "DestinyGuardianRankConstantsDefinition"
  > {
  highestRank: number;
  currentRank: number;
  className?: string;
}

const FireteamGuardianRank: React.FC<FireteamGuardianRankProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const rootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    globalState.coreSettings.destiny2CoreSettings.guardianRanksRootNodeHash
  );

  const highestRank = Math.max(props.highestRank ?? 1, 1);
  const currentRank = Math.max(props.currentRank ?? 1, 1);
  //index is zero-based and is always 1 less than rank and is used for presentationNode def
  const currentRankIndex = Math.max((currentRank ?? 1) - 1, 0);

  const currentRankPresentationNodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    rootNode?.children?.presentationNodes?.[currentRankIndex]
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
    <div className={classNames(styles.guardianRank, props.className)}>
      <span
        className={classNames(
          styles.highestCurrentCompletedIndex,
          styles.rankNumber
        )}
        style={{
          backgroundImage: `url(${currentRankDef?.displayProperties.icon})`,
        }}
      />
      <span className={styles.rankValue}>
        {currentRankPresentationNodeDef?.displayProperties?.name}
      </span>
      <span
        className={classNames(styles.highestAchievedIndex, styles.rankNumber)}
      >
        {highestRank}
      </span>
    </div>
  );
};

export default withDestinyDefinitions(FireteamGuardianRank, {
  types: [
    "DestinyPresentationNodeDefinition",
    "DestinyGuardianRankConstantsDefinition",
    "DestinyGuardianRankDefinition",
  ],
});
