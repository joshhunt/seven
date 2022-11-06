// Created by larobinson, 2021
// Copyright Bungie, Inc.

import {
  initialDefinitionHashes,
  initialPgcrStats,
  PgcrActivityData,
  PgcrDefinitionHashes,
  PgcrStat,
  PgcrStats,
} from "@Areas/Pgcr/PgcrDataStore";
import { StatsDefinitions } from "@Areas/Pgcr/StatsDefinitions";

import { DestinyActivityModeType } from "@Enum";
import { HistoricalStats } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";

export class PgcrUtils {
  public static getTeamIdForCharacter = (
    pgcr: HistoricalStats.DestinyPostGameCarnageReportData,
    characterId: string
  ) => {
    let characterTeamId = -1;

    const characterEntry =
      pgcr?.entries && pgcr.entries.find((a) => a.characterId === characterId);
    const team = characterEntry?.values?.["team"];

    if (team?.basic !== null) {
      characterTeamId = team?.basic?.value;
    }

    return characterTeamId;
  };

  public static getTeamIdFromEntry = (
    entry: HistoricalStats.DestinyPostGameCarnageReportEntry
  ) => {
    let teamId = -1;

    const team = entry?.values["team"];
    if (team?.basic?.value) {
      teamId = team?.basic?.value;
    }

    return teamId;
  };

  public static getActivityHashFromModeType = (
    modeType: DestinyActivityModeType,
    allActivityModes: { [hash: string]: any }
  ) => {
    const allActivityHashes = Object.keys(allActivityModes);

    return allActivityHashes.find(
      (hash) => allActivityModes[hash].modeType === modeType
    );
  };

  /**
   * Rearrange the pgcr to see what kind of activity it is
   * NB: createStats is called at the end of this function
   * @param pgcr
   */
  public static getDefinitionsHashesFromPgcr = (
    pgcr: HistoricalStats.DestinyPostGameCarnageReportData
  ): PgcrDefinitionHashes => {
    const newDefinitionHashes: PgcrDefinitionHashes = initialDefinitionHashes;

    if (pgcr) {
      newDefinitionHashes.activityModeType = pgcr.activityDetails.mode;
      newDefinitionHashes.activityDefinitionHash =
        pgcr.activityDetails.referenceId;
      newDefinitionHashes.directorActivityHash =
        pgcr.activityDetails.directorActivityHash;
    }

    return newDefinitionHashes;
  };

  public static createStats = (
    activityData: PgcrActivityData,
    entries: HistoricalStats.DestinyPostGameCarnageReportEntry[]
  ): PgcrStats => {
    const newStats: PgcrStats = initialPgcrStats;

    if (activityData === null) {
      return null;
    }

    const isValidStat = (statName: string) => {
      return (
        Object.keys(entries[0]?.values).includes(statName) ||
        Object.keys(entries[0]?.extended?.values).includes(statName)
      );
    };

    newStats.statBarData = activityData.isGambit
      ? StatsDefinitions.compPveTeamStatBarStats
          .filter((stat) => isValidStat(stat))
          .slice(0, 5)
      : StatsDefinitions.teamStatBarStats
          .filter((stat) => isValidStat(stat))
          .slice(0, 4);

    // leaderboard for stats
    if (activityData.isScoredPvE) {
      newStats.leaderStatItemData = StatsDefinitions.teamStatBarStats
        .filter((stat) => stat !== "score" && isValidStat(stat))
        .slice(0, 5);
    } else if (activityData.isGambit) {
      newStats.leaderStatItemData = StatsDefinitions.compPveTeamStatBarStats
        .filter((stat) => stat !== "teamScore" && isValidStat(stat))
        .slice(0, 4);
    } else {
      newStats.leaderStatItemData = StatsDefinitions.teamStatBarStats
        .filter(
          (stat) =>
            stat !== "teamScore" && stat !== "score" && isValidStat(stat)
        )
        .slice(0, 4);
    }

    //stats table

    const statsFilter: string[] = [];
    const extendedStatsFilter: string[] = [];

    if (entries) {
      entries.forEach((entry) => {
        if (entry?.values !== null) {
          statsFilter.push(...Object.keys(entry?.values));
        }

        if (entry?.extended?.values !== null) {
          extendedStatsFilter.push(...Object.keys(entry?.extended.values));
        }
      });
    }

    const filteredRelevantStats: string[] = [];
    const filteredRelevantExtendedStats: string[] = [];

    if (activityData) {
      if (activityData.isCrucible) {
        filteredRelevantStats.push(
          ...StatsDefinitions.pvpStatIds.filter((a) => statsFilter.includes(a))
        );
        filteredRelevantExtendedStats.push(
          ...StatsDefinitions.pvpExtendedStatIds.filter((a) =>
            extendedStatsFilter.includes(a)
          )
        );
      } else if (activityData.isGambit) {
        filteredRelevantExtendedStats.push(
          ...StatsDefinitions.compPveExtendedStatIds.filter((a) =>
            extendedStatsFilter.includes(a)
          )
        );
      } else {
        filteredRelevantStats.push(
          ...StatsDefinitions.pveStatIds.filter((a) => statsFilter.includes(a))
        );
        filteredRelevantExtendedStats.push(
          ...StatsDefinitions.pveExtendedStatIds.filter((a) =>
            extendedStatsFilter.includes(a)
          )
        );
      }
    }

    newStats.statTableData.statNames = [
      ...filteredRelevantStats,
      ...filteredRelevantExtendedStats,
    ];

    newStats.statTableData.statsByCharacter = {};

    // per entry in pgcr
    if (entries) {
      entries.forEach((entry) => {
        //add character to stat
        newStats.statTableData.statsByCharacter[entry?.characterId] = {
          stats: [],
          team: -1,
          emblem: entry?.player?.emblemHash,
          displayName:
            UserUtils.getBungieNameFromUserInfoCard(
              entry?.player?.destinyUserInfo
            )?.bungieGlobalName +
            UserUtils.getBungieNameFromUserInfoCard(
              entry?.player?.destinyUserInfo
            )?.bungieGlobalCodeWithHashtag,
          membershipId: entry?.player?.destinyUserInfo?.membershipId,
        };

        filteredRelevantStats.forEach((statName) => {
          const stat: PgcrStat = {
            value: entry?.values[statName].basic.displayValue,
            name: statName,
          };

          newStats.statTableData.statsByCharacter[
            entry?.characterId
          ].stats.push(stat);
        });

        filteredRelevantExtendedStats.forEach((statName) => {
          const stat: PgcrStat = {
            value: entry?.extended.values[statName].basic.displayValue,
            name: statName,
          };

          newStats.statTableData.statsByCharacter[
            entry?.characterId
          ].stats.push(stat);
        });
      });
    }

    return newStats;
  };
}
