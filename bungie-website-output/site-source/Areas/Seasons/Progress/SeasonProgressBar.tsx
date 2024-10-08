// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/Seasons/Progress/SeasonPassRewardProgression.module.scss";
import { Localizer } from "@bungie/localization";
import { World } from "@Platform";
import classNames from "classnames";
import React from "react";

interface SeasonProgressBarProps {
  characterSeasonProgression: World.DestinyProgression;
  isPrestige: boolean;
  className?: string;
}

export const SeasonProgressBar: React.FC<SeasonProgressBarProps> = (props) => {
  if (!props.characterSeasonProgression) {
    return null;
  }

  const rankLabel = Localizer.Format(
    Localizer.Seasons.RankCharacterseasonprogressionlevel,
    {
      characterSeasonProgressionLevel: props.isPrestige
        ? props.characterSeasonProgression.level + 100
        : props.characterSeasonProgression.level,
    }
  );
  const progressLabel = `${props.characterSeasonProgression.progressToNextLevel.toLocaleString()}/${props.characterSeasonProgression.nextLevelAt.toLocaleString()}`;

  const progressPercentage =
    (props.characterSeasonProgression.progressToNextLevel /
      props.characterSeasonProgression.nextLevelAt) *
    100;

  const cssBar: React.CSSProperties = {
    width: `${progressPercentage}%`,
  };

  return (
    <div
      className={classNames(styles.seasonRankBar, {
        [props.className]: props.className?.length,
      })}
    >
      <span className={styles.rank}>{rankLabel}</span>
      <div className={styles.bar} style={cssBar} />
      <span className={styles.progress}>{progressLabel}</span>
    </div>
  );
};
