// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { PgcrDataStore } from "@Areas/Pgcr/PgcrDataStore";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./PgcrStatBar.module.scss";
import { Localizer } from "@bungie/localization/Localizer";

interface PgcrStatBarProps
  extends D2DatabaseComponentProps<
    "DestinyActivityModeDefinition" | "DestinyActivityTypeDefinition"
  > {
  statId: string;
}

const PgcrStatBar: React.FC<PgcrStatBarProps> = (props) => {
  const pgcrData = useDataStore(PgcrDataStore);
  let focusedTeamTotal = 0;
  let otherTeamTotal = 0;
  let overallTotal = 0;

  const { statId, definitions } = props;

  if (pgcrData.pgcr.entries === null) {
    return;
  }

  if (props.statId === "score") {
    if (pgcrData.pgcr.teams) {
      pgcrData.pgcr.teams.forEach((t) => {
        const isFocusedTeam =
          t.teamId === pgcrData.pgcrActivityData?.focusedTeamId;
        const score = t.score.basic.value;

        if (isFocusedTeam) {
          focusedTeamTotal += score;
          overallTotal = focusedTeamTotal + otherTeamTotal;
        } else {
          otherTeamTotal += score;
          overallTotal = focusedTeamTotal + otherTeamTotal;
        }
      });
    }
  } else {
    pgcrData.pgcr.entries.forEach((entry) => {
      let matchesFocusedTeam = false;

      const team = entry.values?.["team"];
      if (pgcrData.pgcrActivityData.focusedTeamId === -1) {
        pgcrData.pgcrActivityData.focusedTeamId = team?.basic?.value ?? -1;
      } else {
        matchesFocusedTeam =
          pgcrData.pgcrActivityData.focusedTeamId === team?.basic?.value;
      }

      let statValue = entry.values?.[statId]?.basic?.value;
      if (!statValue && entry.extended?.values) {
        statValue = entry.extended.values?.[statId]?.basic?.value;
      }

      if (matchesFocusedTeam && statValue) {
        focusedTeamTotal = focusedTeamTotal + statValue;
        overallTotal = focusedTeamTotal + otherTeamTotal;
      } else if (statValue) {
        otherTeamTotal = otherTeamTotal + statValue;
        overallTotal = focusedTeamTotal + otherTeamTotal;
      }
    });
  }

  if (pgcrData.pgcrActivityData.focusedTeamId === -1) {
    return null;
  }

  const focusedTeamPercent =
    overallTotal > 0 ? (focusedTeamTotal / overallTotal) * 100 : 50;
  const otherTeamPercent =
    overallTotal > 0 ? (otherTeamTotal / overallTotal) * 100 : 50;
  const separatorWidth = 5;
  const focusedTeamWidth = `calc(${focusedTeamPercent}% - ${
    separatorWidth / 2
  }px)`;
  const otherTeamWidth = `calc(${otherTeamPercent}% - ${separatorWidth / 2}px)`;

  return (
    <div className={styles.statBars}>
      <div className={styles.label}>
        {Localizer.historicalStats[`StatName_${statId}`]}
      </div>
      <div className={styles.values}>
        <div className={classNames(styles.teamValue)}>{focusedTeamTotal}</div>
        <div className={classNames(styles.teamValue)}>{otherTeamTotal}</div>
      </div>
      <div className={styles.bars}>
        <div
          className={classNames(styles.teamBar, styles.teamOneBar)}
          style={{ width: focusedTeamWidth }}
        />
        <div
          className={classNames(styles.teamBar, styles.teamTwoBar)}
          style={{ width: otherTeamWidth, marginLeft: `${separatorWidth}px` }}
        />
      </div>
    </div>
  );
};

export default withDestinyDefinitions(PgcrStatBar, {
  types: ["DestinyActivityModeDefinition", "DestinyActivityTypeDefinition"],
});
