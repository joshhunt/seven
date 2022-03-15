// Created by atseng, 2021
// Copyright Bungie, Inc.

import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { Characters, Definitions, World } from "@Platform";
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
      {rankItem(1647151960, styles.glory)}
      {rankItem(2083746873, styles.valor)}
      {rankItem(3008065600, styles.infamy)}
      {rankItem(527867935, styles.strangeFavor)}
      {rankItem(1471185389, styles.gunsmith)}
      {rankItem(457612306, styles.vanguard)}
      {rankItem(2755675426, styles.trials)}
    </>
  );
};
