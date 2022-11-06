// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { HistoricalStats } from "@Platform";
import React from "react";

export interface PgcrStat {
  value: string;
  name: string;
}

export type PgcrStatCharacter = {
  stats: PgcrStat[];
  team: number;
  emblem: number;
  displayName: string;
  membershipId: string;
};

export interface PgcrStatsByCharacter {
  [character: string]: PgcrStatCharacter;
}

export interface PgcrStatTableData {
  statsByCharacter: PgcrStatsByCharacter;
  statNames: string[];
}

export interface PgcrStats {
  statBarData: string[];
  leaderStatItemData: string[];
  statTableData: PgcrStatTableData;
}

export interface PgcrDefinitionHashes {
  activityDefinitionHash: number;
  directorActivityHash: number;
  activityModeType: number;
}

export interface PgcrDerivedDefinitionHashes {
  activityHash: number;
  activityTypeHash: number;
  placeHash: number;
  destinationHash: number;
}

export interface PgcrActivityData {
  isScoredPvE: boolean;
  isCrucible: boolean;
  isGambit: boolean;
  focusedTeamId: number;
  opponentTeamId: number;
  focusedTeamStanding: number;
  opponentTeamStanding: number;
  pgcrImage: string;
}

interface PgcrDataStorePayload {
  pgcr: HistoricalStats.DestinyPostGameCarnageReportData;
  pgcrDefinitionHashes: PgcrDefinitionHashes;
  pgcrDerivedDefinitionHashes: PgcrDerivedDefinitionHashes;
  pgcrActivityData: PgcrActivityData;
  pgcrStats: PgcrStats;
}

export const initialDefinitionHashes: PgcrDefinitionHashes = {
  activityDefinitionHash: null,
  directorActivityHash: null,
  activityModeType: null,
};

export const initialDerivedDefinitionHashes: PgcrDerivedDefinitionHashes = {
  activityHash: null,
  activityTypeHash: null,
  destinationHash: null,
  placeHash: null,
};

export const initialActivityData: PgcrActivityData = {
  isScoredPvE: false,
  isCrucible: false,
  isGambit: false,
  focusedTeamId: -1,
  opponentTeamId: -1,
  focusedTeamStanding: 0,
  opponentTeamStanding: 0,
  pgcrImage: "",
};

export const initialPgcrStats: PgcrStats = {
  statBarData: [],
  leaderStatItemData: [],
  statTableData: {
    statsByCharacter: {},
    statNames: [],
  },
};

class PgcrDataStoreInternal extends DataStore<PgcrDataStorePayload> {
  public static Instance = new PgcrDataStoreInternal({
    pgcr: null,
    pgcrDefinitionHashes: initialDefinitionHashes,
    pgcrDerivedDefinitionHashes: initialDerivedDefinitionHashes,
    pgcrActivityData: initialActivityData,
    pgcrStats: initialPgcrStats,
  });

  public actions = this.createActions({
    /**
     * Update pgcr as it comes directly from the endpoint
     * @param _state
     * @param pgcr
     */
    updatePgcr: (
      _state,
      pgcr: HistoricalStats.DestinyPostGameCarnageReportData
    ) => ({ pgcr }),
    /**
     * Store useful definition hashes
     * @param _state
     * @param pgcrDefinitionHashes
     */
    updatePgcrDefinitionHashes: (
      _state,
      pgcrDefinitionHashes: PgcrDefinitionHashes
    ) => ({ pgcrDefinitionHashes }),
    /**
     * Store useful definition hashes derived from original definition hashes
     * @param _state
     * @param pgcrDerivedDefinitionHashes
     */
    updatePgcrDerivedDefinitionHashes: (
      _state,
      pgcrDerivedDefinitionHashes: PgcrDerivedDefinitionHashes
    ) => ({ pgcrDerivedDefinitionHashes }),
    /**
     * Filter pgcr to see what kind of activity it is
     * @param _state
     * @param pgcrActivityData
     */
    updatePgcrActivityData: (_state, pgcrActivityData: PgcrActivityData) => ({
      pgcrActivityData,
    }),
    /**
     * Create or update stats in the format that is useful for creating the stat bars, stat leaders section and stats data tables in the pgcr
     * @param _state
     * @param pgcrStats
     */
    updateStats: (_state, pgcrStats: PgcrStats) => ({ pgcrStats }),
  });
}

export const PgcrDataStore = PgcrDataStoreInternal.Instance;
