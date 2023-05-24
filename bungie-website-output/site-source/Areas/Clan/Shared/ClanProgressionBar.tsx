// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanProgression.module.scss";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { Localizer } from "@bungie/localization/Localizer";
import { World } from "@Platform";
import classNames from "classnames";
import React from "react";

interface ClanProgressionBarProps {
  clanProgression: { [key: number]: World.DestinyProgression };
  className?: string;
  showProgressFraction?: boolean;
  showCap?: boolean;
}

export const ClanProgressionBar: React.FC<ClanProgressionBarProps> = (
  props
) => {
  const clansLoc = Localizer.Clans;
  const clanLevelProgression =
    props.clanProgression[parseInt(ClanUtils.PROGRESSION_HASH_CLAN_LEVEL, 10)];

  const progressLevel = clanLevelProgression?.level;
  const weeklyProgressLevel = clanLevelProgression?.weeklyProgress;

  const progressPercentage = () => {
    const percentage =
      Math.max(clanLevelProgression.progressToNextLevel, 1) /
      Math.max(clanLevelProgression.nextLevelAt, 1);

    return `${Math.round(percentage) * 100}%`;
  };

  const progressFractionString = `${clanLevelProgression.currentProgress} / ${clanLevelProgression.nextLevelAt}`;

  return (
    <div className={classNames(styles.progressionPanel, props.className)}>
      <div className={styles.progressDiamond}>{progressLevel}</div>
      <div className={styles.clanProgression}>
        <div className={styles.progressBar}>
          <div
            className={styles.barFill}
            style={{ width: progressPercentage() }}
          />
          {props.showProgressFraction && (
            <span className={styles.progressFraction}>
              {progressFractionString}
            </span>
          )}
        </div>
        {props.showCap && (
          <p className={styles.weeklyClanCap}>
            {" "}
            {weeklyProgressLevel} {clansLoc.ClanContributionThisWeek}
          </p>
        )}
      </div>
    </div>
  );
};
