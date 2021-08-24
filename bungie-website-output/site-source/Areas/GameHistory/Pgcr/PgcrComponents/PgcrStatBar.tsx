// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { PgcrDataStore } from "@Areas/GameHistory/Pgcr/PgcrDataStore";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { useDataStore } from "@bungie/datastore/DataStore";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./PgcrStatBar.module.scss";

interface PgcrStatBarProps
  extends D2DatabaseComponentProps<
    "DestinyActivityModeDefinition" | "DestinyActivityTypeDefinition"
  > {
  statId: string;
}

const PgcrStatBar: React.FC<PgcrStatBarProps> = (props) => {
  const pgcrData = useDataStore(PgcrDataStore);
  const [focusedTeamTotal, setFocusedTeamTotal] = useState(0);
  const [otherTeamTotal, setOtherTeamTotal] = useState(0);
  const overallTotal = focusedTeamTotal + otherTeamTotal;
  const focusedTeamPercent = focusedTeamTotal / overallTotal / 100;
  const otherTeamPercent = otherTeamTotal / overallTotal / 100;
  const { statId, definitions } = props;
  const statDef = definitions.DestinyActivityModeDefinition.get(
    pgcrData.pgcrDerivedDefinitionHashes.activityTypeHash
  );

  const separatorWidth = focusedTeamPercent > 0 && otherTeamPercent > 0 ? 5 : 0;
  const focusedTeamWidth = `calc(${focusedTeamPercent}% - ${
    separatorWidth / 2
  }px)`;
  const otherTeamWidth = `calc(${otherTeamPercent}% - ${separatorWidth / 2}px)`;

  useEffect(() => {
    if (pgcrData.pgcr.entries === null) {
      return;
    }

    if (props.statId === "score") {
      if (pgcrData.pgcr.teams) {
        pgcrData.pgcr.teams.forEach((t) => {
          const isFocusedTeam =
            t.teamId === pgcrData.pgcrActivityData.focusedTeamId;
          const score = t.score;

          if (isFocusedTeam) {
            setFocusedTeamTotal(focusedTeamTotal + score.basic.value);
          } else {
            setOtherTeamTotal(otherTeamTotal + score.basic.value);
          }
        });
      }
    } else {
      pgcrData.pgcr.entries
        .filter((e) => {
          e?.values;
        })
        .forEach((entry) => {
          let focusedTeamId = pgcrData.pgcrActivityData.focusedTeamId;
          let matchesFocusedTeam = false;

          const team = entry.values?.["team"];
          if (team?.basic !== null) {
            if (pgcrData.pgcrActivityData.focusedTeamId === -1) {
              focusedTeamId = team.basic.value;
            }

            matchesFocusedTeam = focusedTeamId === team.basic.value;
          }

          let stat = entry.values?.[statId];
          if (stat === null && entry.extended?.values !== null) {
            stat = entry.extended.values?.[statId];
          }

          if (stat?.basic?.value !== null) {
            if (matchesFocusedTeam) {
              setFocusedTeamTotal(focusedTeamTotal + stat.basic.value);
            } else {
              setOtherTeamTotal(otherTeamTotal + stat.basic.value);
            }
          }
        });
    }
  }, []);

  return focusedTeamPercent > 0 && otherTeamTotal > 0 ? (
    <div className={styles.statBars}>
      <div className={styles.label}>{statDef.displayProperties.name}</div>
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
          style={{ width: otherTeamWidth, marginLeft: `${separatorWidth}` }}
        />
      </div>
    </div>
  ) : null;
};

export default withDestinyDefinitions(PgcrStatBar, {
  types: ["DestinyActivityModeDefinition", "DestinyActivityTypeDefinition"],
});
