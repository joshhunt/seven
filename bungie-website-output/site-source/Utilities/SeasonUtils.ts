// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";

export class SeasonUtils {
  public static GetSeasonHashFromSeasonNumber(
    seasonNumber: number,
    fetcharizedDestinySeasonDefinitions: DefinitionsFetcherized<
      "DestinySeasonDefinition"
    >
  ) {
    const seasonDefs = fetcharizedDestinySeasonDefinitions.all();

    const season = Object.keys(seasonDefs).find((key) => {
      return seasonDefs[key].seasonNumber === seasonNumber;
    });

    if (season) {
      return seasonDefs[season].hash;
    }

    return null;
  }
}
