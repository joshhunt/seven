// Created by atseng, 2021
// Copyright Bungie, Inc.

import { SeasonProgressBar } from "@Areas/Seasons/SeasonProgress/components/SeasonProgressBar";
import {
  SeasonsArray,
  SeasonsDefinitions,
} from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import styles from "./Season.module.scss";
import { Characters, Responses } from "@Platform";
import React from "react";
import { SeasonalRanks } from "./SeasonalRanks";
import { DateTime } from "luxon";

interface SeasonProps
  extends D2DatabaseComponentProps<
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
  > {
  seasonHash: number;
  characterComponent: Characters.DestinyCharacterComponent;
  profileResponse: Responses.DestinyProfileResponse;
}

const Season: React.FC<SeasonProps> = (props) => {
  const {
    definitions,
    seasonHash,
    profileResponse,
    characterComponent,
  } = props;

  if (!profileResponse?.characterProgressions?.data || !characterComponent) {
    return null;
  }

  const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);
  const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
    seasonDef.seasonPassHash
  );
  const seasonOnPage = SeasonsArray.find(
    (season) => season.seasonNumber === seasonDef.seasonNumber
  );

  const convertToDateFormat = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("LLLL d");
  };

  const duration = `${convertToDateFormat(
    seasonDef.startDate
  )} - ${convertToDateFormat(seasonDef.endDate)}`;

  const characterProgression =
    profileResponse.characterProgressions.data[characterComponent.characterId];

  const characterSeasonPassRewardProgression =
    characterProgression?.progressions?.[seasonDef.seasonPassProgressionHash];

  const seasonProgression =
    characterProgression?.progressions?.[seasonDef.seasonPassProgressionHash];
  const prestigeProgression = seasonProgression?.level
    ? characterProgression.progressions[seasonPassDef.prestigeProgressionHash]
    : undefined;

  const characterSeasonPassProgression =
    typeof characterSeasonPassRewardProgression !== "undefined"
      ? prestigeProgression?.level
        ? prestigeProgression
        : characterSeasonPassRewardProgression
      : undefined;

  const seasonsDefinitionsBnet = SeasonsDefinitions.currentSeason;

  const backgroundImagePath = seasonsDefinitionsBnet.progressPageImage;
  const seasonIconPath = seasonsDefinitionsBnet.smallIcon;
  const seasonName = seasonsDefinitionsBnet.title;

  return (
    <div className={styles.seasonContainer}>
      <div
        style={{ backgroundImage: `url(${backgroundImagePath})` }}
        className={styles.seasonHeader}
      >
        <img className={styles.icon} src={seasonIconPath} alt={""} />
        <h4>{seasonName}</h4>
        <p>{duration}</p>
        <SeasonProgressBar
          className={styles.progressBar}
          characterSeasonProgression={characterSeasonPassProgression}
          isPrestige={
            typeof prestigeProgression !== "undefined" &&
            prestigeProgression.level > 0
          }
        />
      </div>
      <div className={styles.seasonalRanksContainer}>
        <SeasonalRanks
          characterProgressions={characterProgression}
          definitions={definitions}
        />
      </div>
    </div>
  );
};

export default withDestinyDefinitions(Season, {
  types: [
    "DestinySeasonDefinition",
    "DestinySeasonPassDefinition",
    "DestinyProgressionDefinition",
  ],
});
