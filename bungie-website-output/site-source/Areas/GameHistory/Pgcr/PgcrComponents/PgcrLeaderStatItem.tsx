// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { PgcrDataStore } from "@Areas/GameHistory/Pgcr/PgcrDataStore";
import { Localizer } from "@bungie/localization";
import { HistoricalStats } from "@Platform";
import { useDataStore } from "@bungie/datastore/DataStore";
import React, { useEffect, useState } from "react";
import styles from "./PgcrLeaderStatItem.module.scss";

interface PgcrLeaderStatItemProps {
  statId: string;
  leaderNameOverride?: string;
}

export const PgcrLeaderStatItem: React.FC<PgcrLeaderStatItemProps> = (
  props
) => {
  const [leaderValueNumber, setLeaderValueNumber] = useState(-99);
  const [leaderValue, setLeaderValue] = useState(null);
  const [leaderUserName, setLeaderUserName] = useState(null);
  const pgcrData = useDataStore(PgcrDataStore);

  useEffect(() => {
    if (pgcrData.pgcr?.entries === null) {
      return;
    }

    let leaderEntry: HistoricalStats.DestinyPostGameCarnageReportEntry = null;

    pgcrData.pgcr.entries.forEach((entry) => {
      let statValue: HistoricalStats.DestinyHistoricalStatsValue = null;
      let statValNumber = 0;

      if (entry.values !== null && entry.values !== undefined) {
        const val = entry.values?.[props.statId];
        if (val && val?.basic?.value !== null) {
          statValNumber = val.basic.value;
          statValue = val;
          leaderEntry = entry;
        }
      }

      if (
        entry.extended?.values !== null &&
        entry.extended?.values !== undefined
      ) {
        const extVal = entry.extended.values?.[props.statId];
        if (extVal && extVal?.basic?.value !== null) {
          statValNumber = extVal.basic.value;
          statValue = extVal;
          leaderEntry = entry;
        }
      }

      if (statValNumber > leaderValueNumber) {
        setLeaderValue(statValue);
        setLeaderValueNumber(statValNumber);
        setLeaderUserName(leaderEntry?.player?.destinyUserInfo?.displayName);
      }
    });
  }, []);

  return leaderValue !== null ? (
    <div className={styles.leaderStatItem}>
      <div className={styles.statName}>
        {Localizer.historicalstats[`StatName_${props.statId}`]}
      </div>
      <div className={styles.userValue}>
        <div>{props.leaderNameOverride ?? leaderUserName}</div>
        <div>{leaderValueNumber}</div>
      </div>
    </div>
  ) : null;
};
