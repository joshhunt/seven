import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./RankSigil.module.scss";
import { UserUtils } from "@Utilities/UserUtils";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";

interface RankSigilProps {
  seasonUtilArgs: ISeasonUtilArgs;
  selectedSeasonPassHash?: number;
  page?: "current" | "previous";
  ownsPremium?: boolean;
}

const RankSigil: React.FC<RankSigilProps> = ({
  seasonUtilArgs,
  selectedSeasonPassHash,
  page,
  ownsPremium,
}) => {
  const { destinyData } = useGameData();
  const { profile } = useProfileData({
    membershipType: destinyData.selectedMembership?.membershipType,
    membershipId: destinyData.selectedMembership?.membershipId,
    components: [DestinyComponentType.CharacterProgressions],
  });

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  // Use the selected pass hash if provided, otherwise fall back to current pass
  const seasonPassDef = selectedSeasonPassHash
    ? seasonUtilArgs.definitions?.DestinySeasonPassDefinition?.get(
        selectedSeasonPassHash
      )
    : SeasonProgressUtils?.getCurrentSeasonPass(seasonUtilArgs);

  const getProgression = (hash: number) => {
    if (
      !destinyData.selectedCharacterId ||
      !profile?.characterProgressions?.data
    ) {
      return undefined;
    }
    return profile.characterProgressions.data[destinyData.selectedCharacterId]
      ?.progressions?.[hash];
  };

  const characterSeasonPassRewardProgression = getProgression(
    seasonPassDef?.rewardProgressionHash
  );

  function parseRankTemplate(template: string, level: number) {
    const beforeLevel = template.split("{characterSeasonProgressionLevel}")[0];

    return {
      word: beforeLevel,
      number: level,
    };
  }

  const template = Localizer.Seasons.RankCharacterseasonprogressionlevel;
  const level = characterSeasonPassRewardProgression?.level;
  const { word, number } = parseRankTemplate(template, level);
  const premiumPassOwnershipStatus = SeasonProgressUtils?.getSigilVersionWithValues(
    level,
    ownsPremium
  );

  // If user is not authenticated, don't render anything
  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  // Show loading if we don't have valid level data yet
  const shouldShowLoading = !level || level === 0;

  return (
    <div className={styles.sigilContainer}>
      {shouldShowLoading ? (
        <div className={classNames(styles.sigil, styles.loading)}>
          <div className={styles.rankLabel}>&nbsp;</div>
          <div className={styles.rankValue}>&nbsp;</div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default RankSigil;
