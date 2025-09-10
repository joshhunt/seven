// Created by larobinson, 2025
// Copyright Bungie, Inc.

import React, { useEffect, useState } from "react";
import { SeasonHeaderLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout";
import { SeasonProgressLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonProgressLayout";
import RewardsCarousel from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/RewardsCarousel/RewardsCarousel";
import styles from "./UnifiedSeasonPass.module.scss";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import {
  selectSelectedCharacter,
  selectDestinyAccount,
  loadUserData,
  loadAllPlatformCharacters,
} from "@Global/Redux/slices/destinyAccountSlice";
import { Platform } from "@Platform";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { UserUtils } from "@Utilities/UserUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";

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

  const [ownedPasses, setOwnedPasses] = useState<number[]>([]);

  const seasonUtilArgs = { seasonHash, definitions };
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const dispatch = useAppDispatch();

  const selectedCharacter = useAppSelector(selectSelectedCharacter) as any;
  const destinyAccount = useAppSelector(selectDestinyAccount) as any;
  const charProgressions = destinyAccount?.characterProgressions?.data as any;

  // Load user data with showAllMembershipsWhenCrossaved=true to show all linked accounts
  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      console.log(
        `UnifiedSeasonPass (${mode}): Loading user data with showAllMembershipsWhenCrossaved=true`
      );
      // Don't pass membershipPair - let it get current user's membership data
      dispatch(
        loadUserData({
          showAllMembershipsWhenCrossaved: true,
        })
      ).then(() => {
        // After loading memberships, load characters from all platforms
        dispatch(loadAllPlatformCharacters());
      });
    }
  }, [globalState?.loggedInUser?.user?.membershipId, dispatch, mode]);

  // Debug: log destinyAccount state
  useEffect(() => {
    console.log(`UnifiedSeasonPass (${mode}): destinyAccount updated:`, {
      allPlatformCharacters: destinyAccount?.allPlatformCharacters?.length,
      memberships: destinyAccount?.membershipData?.destinyMemberships?.length,
      selectedMembership: destinyAccount?.selectedMembership?.membershipType,
      isCrossSaved: destinyAccount?.isCrossSaved,
    });
  }, [destinyAccount, mode]);

  const level = (() => {
    const progHash = selectedPassDef?.rewardProgressionHash;
    if (!progHash) return 0;
    // Prefer embedded progressions on the selected character
    const directLevel =
      selectedCharacter?.characterProgressions?.progressions?.[progHash]?.level;
    if (typeof directLevel === "number") return directLevel;
    // Fallback to the slice dictionary by selected character id
    const selectedIdRaw =
      selectedCharacter?.id ??
      selectedCharacter?.characterData?.characterId ??
      selectedCharacter?.characterId;
    const selectedId = selectedIdRaw ? String(selectedIdRaw) : undefined;
    if (!selectedId || !charProgressions?.[selectedId]?.progressions) return 0;
    return charProgressions[selectedId].progressions[progHash]?.level ?? 0;
  })();

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      if (destinyAccount) {
        Platform.Destiny2Service.GetProfile(
          BungieMembershipType.BungieNext,
          globalState?.loggedInUser?.user?.membershipId,
          [DestinyComponentType.Profiles]
        )
          .then((response) => {
            setOwnedPasses(response?.profile.data.seasonPassHashes);
          })
          .catch(ConvertToPlatformError)
          .catch((e: PlatformError) => {});
      }
    }
  }, [destinyAccount, destinyAccount.selectedMembership, globalState, mode]);

  const isCurrentSeason = mode === "current";

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
          ownsPremium={ownedPasses.includes(selectedPassHash)}
        />
      </div>

      <RewardsCarousel
        seasonHash={seasonHash}
        seasonDefinition={seasonDefinition}
        seasonPassHash={selectedPassHash}
        seasonUtilArgs={seasonUtilArgs}
        rewardProgressionHash={selectedPassDef?.rewardProgressionHash}
        level={level}
        definitions={definitions}
        isCurrentSeason={isCurrentSeason}
        isPassActive={mode === "current"}
        ownsPremium={ownedPasses.includes(selectedPassHash)}
      />
    </SeasonProgressLayout>
  );
};

export default UnifiedSeasonPass;
