// Created by atseng, 2021
// Copyright Bungie, Inc.

import { SeasonProgressBar } from "@Areas/Seasons/SeasonProgress/components/SeasonProgressBar";
import {
  RewardsPassArray,
  RewardsPassDefinition,
  BnetRewardsPassConfig,
} from "@Areas/Seasons/SeasonProgress/constants/BnetRewardsPassConfig";
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

  const convertToDateFormat = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("LLLL d");
  };

  const duration = `${convertToDateFormat(
    seasonDef.startDate
  )} - ${convertToDateFormat(seasonDef.endDate)}`;

  const characterProgression =
    profileResponse.characterProgressions.data[characterComponent.characterId];

  // Always use the base seasonal progression (current season cap varies by season), ignore prestige levels
  const characterSeasonPassProgression =
    characterProgression?.progressions?.[seasonDef.seasonPassProgressionHash];

  const currentPassDefinitionBnet = BnetRewardsPassConfig.currentPass;

  const backgroundImagePath = currentPassDefinitionBnet.progressPageImage;
  const seasonIconPath = currentPassDefinitionBnet.smallIcon;
  const seasonName = currentPassDefinitionBnet.title;

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
