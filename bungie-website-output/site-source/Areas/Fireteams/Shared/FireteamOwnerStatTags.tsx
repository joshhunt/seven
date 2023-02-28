// Created by atseng, 2023
// Copyright Bungie, Inc.

import { FireteamCommendations } from "@Areas/Fireteams/Shared/FireteamCommendations";
import FireteamGuardianRank from "@Areas/Fireteams/Shared/FireteamGuardianRank";
import styles from "@Areas/Fireteams/Shared/FireteamListItem.module.scss";
import React from "react";

interface FireteamOwnerStatTagsProps {
  highestLifetimeGuardianRank: number;
  currentGuardianRank: number;
  totalCommendationScore: number;
}

//different from FireteamUserStatTags - this one is used for the Fireteams list and only is used for the owners stats
export const FireteamOwnerStatTags: React.FC<FireteamOwnerStatTagsProps> = (
  props
) => {
  return (
    <>
      <FireteamGuardianRank
        highestRank={props.highestLifetimeGuardianRank}
        currentRank={props.currentGuardianRank}
        className={styles.fireteamItemTag}
      />
      <FireteamCommendations
        totalScore={props.totalCommendationScore}
        className={styles.fireteamItemTag}
      />
    </>
  );
};
