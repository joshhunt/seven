// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { PgcrDataStore } from "@Areas/Pgcr/PgcrDataStore";
import { Localizer } from "@bungie/localization";
import { HistoricalStats } from "@Platform";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./PgcrLeaderStatItem.module.scss";

interface PgcrLeaderStatItemProps {
  statId: string;
  leaderNameOverride?: string;
}

export const PgcrLeaderStatItem: React.FC<PgcrLeaderStatItemProps> = (
  props
) => {
  let leaderValueNumber = -99;
  let leaderValue = null;
  let leaderUserName = null;
  const pgcrData = useDataStore(PgcrDataStore);

  if (pgcrData.pgcr?.entries === null) {
    return;
  }

  pgcrData.pgcr?.entries?.forEach((entry) => {
    let statValue: HistoricalStats.DestinyHistoricalStatsValue = null;
    let statValNumber = 0;

    if (!!entry?.values) {
      const val = entry.values[props.statId];
      if (val && val?.basic?.value) {
        statValNumber = val.basic.value;
        statValue = val;
      }
    }

    if (!!entry?.extended?.values) {
      const extVal = entry.extended.values[props.statId];
      if (extVal && extVal?.basic?.value) {
        statValNumber = extVal.basic.value;
        statValue = extVal;
      }
    }

    if (!!entry?.extended?.scoreboardValues) {
      const scoreboardVal = entry.extended.scoreboardValues[props.statId];
      if (scoreboardVal && scoreboardVal?.basic?.value) {
        statValNumber = scoreboardVal.basic.value;
        statValue = scoreboardVal;
      }
    }

    if (statValNumber > leaderValueNumber) {
      leaderValue = statValue;
      leaderValueNumber = statValNumber;
      leaderUserName =
        UserUtils.getBungieNameFromUserInfoCard(entry?.player?.destinyUserInfo)
          ?.bungieGlobalName +
        UserUtils.getBungieNameFromUserInfoCard(entry?.player?.destinyUserInfo)
          ?.bungieGlobalCodeWithHashtag;
    }
  });

  return leaderValue !== null ? (
    <div className={styles.leaderStatItem}>
      <div className={styles.statName}>
        {Localizer.pgcr[`moststat_${props.statId}`]}
      </div>
      <div className={styles.userValue}>
        <div>{props.leaderNameOverride ?? leaderUserName}</div>
        <div>{leaderValueNumber}</div>
      </div>
    </div>
  ) : null;
};
