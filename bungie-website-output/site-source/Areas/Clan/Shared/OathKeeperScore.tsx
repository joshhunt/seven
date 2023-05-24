// Created by atseng, 2023
// Copyright Bungie, Inc.

import clanStyles from "@Areas/Clan/ClanProfile.module.scss";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { Localizer } from "@bungie/localization/Localizer";
import { World } from "@Platform";
import { FaMinus } from "@react-icons/all-files/fa/FaMinus";
import classNames from "classnames";
import React from "react";
import styles from "@Areas/Clan/Shared/OathKeeperScore.module.scss";

interface OathKeeperScoreProps {
  clanProgression: { [key: number]: World.DestinyProgression };
}

export const OathKeeperScore: React.FC<OathKeeperScoreProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const nightfallFitness = Object.entries(props.clanProgression).find(
    ([k, v]) => k === ClanUtils.PROGRESSION_HASH_CLAN_FITNESS_NIGHTFALL
  );
  const raidFitness = Object.entries(props.clanProgression).find(
    ([k, v]) => k === ClanUtils.PROGRESSION_HASH_CLAN_FITNESS_RAID
  );

  const clanProgression = (
    progression: [string, World.DestinyProgression],
    title: string,
    className: string,
    color: string
  ) => {
    const progressionValue = progression[1];

    if (!progressionValue) {
      return null;
    }

    return (
      <li className={styles[className]}>
        <em>{title}</em>
        <span>
          {progressionValue.level === 0 && clansLoc.NotEnoughGuidedGamesYet}
          {progressionValue.level > 0 && (
            <>
              {[...Array(progressionValue.level - 1)].map((_, index) => (
                <FaMinus key={index} style={{ color: color }} />
              ))}
              {[...Array(progressionValue.levelCap - 1)].map((_, index) => (
                <FaMinus key={index} />
              ))}
            </>
          )}
        </span>
      </li>
    );
  };

  return (
    <div
      className={classNames(
        styles.oathKeeperScoreContainer,
        clanStyles.progressionBox
      )}
    >
      <h3>{clansLoc.OathKeeperScore}</h3>
      <p>{clansLoc.OathKeeperDescription}</p>
      <ul className={styles.clanList}>
        {clanProgression(
          nightfallFitness,
          Localizer.Activitymodes.nightfall_NAME,
          "strike",
          "white"
        )}
        {clanProgression(
          raidFitness,
          Localizer.Activitymodes.raid_NAME,
          "raid",
          "white"
        )}
      </ul>
    </div>
  );
};
