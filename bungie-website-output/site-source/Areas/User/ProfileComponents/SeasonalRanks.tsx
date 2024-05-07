// Created by atseng, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Characters } from "@Platform";
import styles from "./SeasonalRanks.module.scss";
import React from "react";
import classNames from "classnames";

interface SeasonalRanksProps {
  characterProgressions: Characters.DestinyCharacterProgressionComponent;
  definitions: Pick<AllDefinitionsFetcherized, "DestinyProgressionDefinition">;
}

export const SeasonalRanks: React.FC<SeasonalRanksProps> = (props) => {
  if (typeof props.characterProgressions === "undefined") {
    return null;
  }

  const { coreSettings } = useDataStore(GlobalStateDataStore, ["coreSettings"]);
  const currentRankProgressionHashes =
    coreSettings?.destiny2CoreSettings?.currentRankProgressionHashes;

  const rankItem = (progressionHash: number, className: string) => {
    const progressionDef = props.definitions.DestinyProgressionDefinition.get(
      progressionHash
    );

    if (typeof progressionDef === "undefined") {
      // previously the progression hashes were different and could change again?
      return null;
    }

    const characterProgression =
      props.characterProgressions.progressions[progressionHash];

    if (typeof characterProgression === "undefined") {
      return null;
    }

    const characterProgressionDef = props.definitions.DestinyProgressionDefinition.get(
      characterProgression.progressionHash
    );

    const stepIndexAdjusted = Math.min(
      progressionDef.steps.length - 1,
      characterProgression.stepIndex
    );

    const stepDisplay = progressionDef.steps[stepIndexAdjusted];

    const icon = (
      <img
        src={characterProgressionDef.displayProperties.icon}
        alt={characterProgressionDef.displayProperties.name}
      />
    );
    //nextLevelAt 0 means you have finished the progression
    const progress =
      characterProgression.nextLevelAt === 0
        ? 100
        : ((characterProgression.nextLevelAt -
            characterProgression.progressToNextLevel) *
            100) /
          characterProgression.nextLevelAt;

    return (
      <div className={classNames(styles.seasonRankItem, className)}>
        <div
          className={styles.icon}
          style={{
            backgroundImage: `url(${characterProgressionDef.displayProperties.icon})`,
          }}
        />
        <div className={styles.text}>
          <h4>
            {stepDisplay.stepName}{" "}
            <span>{progressionDef.displayProperties.name}</span>
          </h4>
        </div>
        <div className={styles.progressNumber}>
          {characterProgression.currentProgress}
        </div>
        <div className={styles.progressBar}>
          {characterProgression.currentProgress > 0 && (
            <span
              className={styles.progress}
              style={{ width: `${progress}%` }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {currentRankProgressionHashes?.map((hash) =>
        rankItem(hash, styles.currentRank)
      )}
    </>
  );
};
