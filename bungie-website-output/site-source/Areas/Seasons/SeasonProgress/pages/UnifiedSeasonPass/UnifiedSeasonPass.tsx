// Created by larobinson, 2025
// Copyright Bungie, Inc.

import React from "react";
import { SeasonHeaderLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout";
import { SeasonProgressLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonProgressLayout";
import RewardsCarousel from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/RewardsCarousel/RewardsCarousel";
import styles from "./UnifiedSeasonPass.module.scss";
import { DestinyComponentType } from "@Enum";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";

type UnifiedSeasonPassProps = {
  mode: "current" | "previous";
  definitions: any;
  seasonHash: number;
  seasonDefinition: any;
  selectedPassHash?: number;
  onSelectPass: (hash?: number) => void;
  ownsPremium: boolean;
  [key: string]: any;
};

/**
 * UnifiedSeasonPass - Single component that handles both current and previous pass modes
 * Prevents remounting when switching between modes
 */
const UnifiedSeasonPass: React.FC<UnifiedSeasonPassProps> = ({
  mode,
  definitions,
  seasonHash,
  seasonDefinition,
  selectedPassHash,
  onSelectPass,
  title,
  ...forwarded
}) => {
  const selectedPassDef = selectedPassHash
    ? definitions?.DestinySeasonPassDefinition?.get(selectedPassHash)
    : undefined;

  const seasonUtilArgs = { seasonHash, definitions };
  const { destinyData } = useGameData();
  const { profile: bungieProfile } = useProfileData({
    membershipId: destinyData.selectedMembership?.membershipId,
    membershipType: destinyData.selectedMembership?.membershipType,
    components: [DestinyComponentType.Profiles],
  });

  const isCurrentSeason = mode === "current";
  const ownedPasses = bungieProfile?.profile.data.seasonPassHashes;
  return (
    <SeasonProgressLayout
      seasonDefinition={seasonDefinition}
      passDefinition={selectedPassDef}
      mode={mode}
    >
      <div className={styles.seasonInfoContainer}>
        <SeasonHeaderLayout
          {...forwarded}
          isCurrentSeason={isCurrentSeason}
          seasonUtilArgs={seasonUtilArgs}
          selectedSeasonPassHash={selectedPassHash}
          page={mode}
          ownsPremium={ownedPasses?.includes(selectedPassHash)}
        />
      </div>

      <RewardsCarousel
        seasonHash={seasonHash}
        seasonPassHash={selectedPassHash}
        rewardProgressionHash={selectedPassDef?.rewardProgressionHash}
        definitions={definitions}
        isPassActive={isCurrentSeason}
        ownsPremium={ownedPasses?.includes(selectedPassHash)}
      />
    </SeasonProgressLayout>
  );
};

export default UnifiedSeasonPass;
