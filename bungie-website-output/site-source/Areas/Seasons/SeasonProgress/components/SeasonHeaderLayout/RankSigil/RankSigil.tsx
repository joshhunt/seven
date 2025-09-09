// Created by larobinson 2025
// Copyright Bungie, Inc.

import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { Localizer } from "@bungie/localization";
import { DestinyComponentType } from "@Enum";
import classNames from "classnames";
import React from "react";
import styles from "./RankSigil.module.scss";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";

interface RankSigilProps {
  seasonUtilArgs: ISeasonUtilArgs;
  ownsPremiumPass?: boolean;
}

const RankSigil: React.FC<RankSigilProps> = ({ seasonUtilArgs }) => {
  const { destinyData } = useGameData();
  const { profile } = useProfileData({
    membershipId: destinyData?.selectedMembership?.membershipId,
    membershipType: destinyData?.selectedMembership?.membershipType,
    components: [
      DestinyComponentType.CharacterProgressions,
      DestinyComponentType.Records,
    ],
  });

  const characterProgressions = profile?.characterProgressions;
  const profileRecords = profile?.profileRecords;

  const seasonPassDef = SeasonProgressUtils?.getCurrentSeasonPass(
    seasonUtilArgs
  );

  const getProgression = (hash: number) => {
    if (!characterProgressions?.data) {
      return undefined;
    }

    // Get progression from the first available character (they should all have the same seasonal progression)
    const characterIds = Object.keys(characterProgressions.data);
    if (characterIds.length === 0) {
      return undefined;
    }

    // Use the first character's progressions (seasonal progress is account-wide)
    const firstCharacterId = characterIds[0];
    return characterProgressions.data[firstCharacterId]?.progressions?.[hash];
  };

  const characterSeasonPassRewardProgression = getProgression(
    seasonPassDef?.rewardProgressionHash
  );
  // Always show base seasonal progression (current season cap varies), never add prestige levels
  const currentProgressionLevel = characterSeasonPassRewardProgression?.level;

  function parseRankTemplate(template: string, level: number) {
    const beforeLevel = template.split("{characterSeasonProgressionLevel}")[0];

    return {
      word: beforeLevel,
      number: level,
    };
  }

  const template = Localizer.Seasons.RankCharacterseasonprogressionlevel;
  const level = currentProgressionLevel;
  const { word, number } = parseRankTemplate(template, level);
  const premiumPassOwnershipStatus = characterProgressions
    ? SeasonProgressUtils?.getSigilVersion(
        seasonUtilArgs,
        characterProgressions,
        undefined,
        profileRecords
      )
    : "base";

  return (
    <>
      {level && level > 0 ? (
        <div
          className={classNames(styles.sigil, {
            [styles.base]: premiumPassOwnershipStatus === "base",
            [styles.premium]: premiumPassOwnershipStatus === "premium",
            [styles.base_over_100]:
              premiumPassOwnershipStatus === "base_over_100",
            [styles.premium_over_100]:
              premiumPassOwnershipStatus === "premium_over_100",
          })}
        >
          <div className={styles.rankLabel}>{word.trim()}</div>
          <div className={styles.rankValue}>{number}</div>
        </div>
      ) : null}
    </>
  );
};

export default RankSigil;
