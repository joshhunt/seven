// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { PgcrDataStore } from "@Areas/GameHistory/Pgcr/PgcrDataStore";
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
  const [focusedTeamTotal, setFocusedTeamTotal] = useState(0);
  const [otherTeamTotal, setOtherTeamTotal] = useState(0);
  const overallTotal = focusedTeamTotal + otherTeamTotal;
  const focusedTeamPercent =
    overallTotal > 0 ? (focusedTeamTotal / overallTotal) * 100 : 50;
  const otherTeamPercent =
    overallTotal > 0 ? (otherTeamTotal / overallTotal) * 100 : 50;
  const { statId, definitions } = props;

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
          let matchesFocusedTeam = false;

          const team = entry.values?.["team"];
          if (!!team?.basic) {
            if (pgcrData.pgcrActivityData.focusedTeamId === -1) {
              pgcrData.pgcrActivityData.focusedTeamId = team?.basic?.value;
            } else {
              matchesFocusedTeam =
                pgcrData.pgcrActivityData.focusedTeamId === team?.basic?.value;
            }
          }

          let stat = entry.values?.[statId];
          if (!stat && !!entry.extended?.values) {
            stat = entry.extended.values?.[statId];
          }

          if (!!stat?.basic?.value) {
            if (matchesFocusedTeam) {
              setFocusedTeamTotal(focusedTeamTotal + stat.basic.value);
            } else {
              setOtherTeamTotal(otherTeamTotal + stat.basic.value);
            }
          }
        });
    }
  }, [pgcrData]);

  if (pgcrData.pgcrActivityData.focusedTeamId === -1) {
    return null;
  }

  return (
    <div className={styles.statBars}>
      <div className={styles.label}>
        {definitions.DestinyActivityModeDefinition.get(
          pgcrData.pgcrDerivedDefinitionHashes.activityTypeHash
        )?.displayProperties?.name || Localizer.Pgcr.Classified}
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
          style={{ width: otherTeamWidth, marginLeft: `${separatorWidth}` }}
        />
      </div>
    </div>
  );
};

export default withDestinyDefinitions(PgcrStatBar, {
  types: ["DestinyActivityModeDefinition", "DestinyActivityTypeDefinition"],
});
