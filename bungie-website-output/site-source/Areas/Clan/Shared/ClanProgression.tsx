// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanProgression.module.scss";
import clanStyles from "@Areas/Clan/Clan.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { World } from "@Platform";
import classNames from "classnames";
import React from "react";

interface ClanProgressionProps {
  clanProgression: { [key: number]: World.DestinyProgression };
}

export const PROGRESSION_HASH_CLAN_LEVEL = "584850370";
export const PROGRESSION_HASH_CLAN_FITNESS_RAID = "3381682691";
export const PROGRESSION_HASH_CLAN_FITNESS_TRIALS = "3759191272";
export const PROGRESSION_HASH_CLAN_FITNESS_NIGHTFALL = "1273404180";

export const ClanProgression: React.FC<ClanProgressionProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const clanLevelProgression =
    props.clanProgression[PROGRESSION_HASH_CLAN_LEVEL];
  const progressLevel = clanLevelProgression?.level;
  const weeklyProgressLevel = clanLevelProgression?.weeklyProgress;

  const progressPercentage = () => {
    const percentage =
      Math.max(clanLevelProgression.progressToNextLevel, 1) /
      Math.max(clanLevelProgression.nextLevelAt, 1);

    return `${Math.round(percentage) * 100}%`;
  };

  if (!clanLevelProgression) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.clanProgressionContainer,
        clanStyles.progressionBox
      )}
    >
      <h3 className={styles.sectionHeader}>{clansLoc.Season1}</h3>
      <p className={styles.progressionDescription}>
        {clansLoc.SeasonDescription}
      </p>
      <h4 className={styles.progressHeader}>{clansLoc.ClanLevel}</h4>
      <div className={styles.progressionPanel}>
        <div className={styles.progressDiamond}>{progressLevel}</div>
        <div className={styles.clanProgression}>
          <div className={styles.progressBar}>
            <div
              className={styles.barFill}
              style={{ width: progressPercentage() }}
            />
          </div>
          <p className={styles.weeklyClanCap}>
            {" "}
            {weeklyProgressLevel} {clansLoc.ClanContributionThisWeek}
          </p>
        </div>
      </div>
    </div>
  );
};
