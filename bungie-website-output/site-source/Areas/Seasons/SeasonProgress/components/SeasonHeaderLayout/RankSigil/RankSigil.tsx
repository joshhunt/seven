// Created by larobinson 2025
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  selectSelectedCharacter,
  selectSelectedMembership,
  selectDestinyAccount,
} from "@Global/Redux/slices/destinyAccountSlice";
import { useAppSelector } from "@Global/Redux/store";
import { SystemNames } from "@Global/SystemNames";
import { Components, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./RankSigil.module.scss";
import { UserUtils } from "@Utilities/UserUtils";

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
  const destinyAccount = useAppSelector(selectDestinyAccount);
  const selectedMembership = useAppSelector(selectSelectedMembership);
  const selectedCharacter = useAppSelector(selectSelectedCharacter);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const [characterProgressions, setCharacterProgressions] = useState<
    Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<number | undefined>();
  const [previousPage, setPreviousPage] = useState<string | undefined>();

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  useEffect(() => {
    if (!destiny2Disabled && selectedMembership && selectedCharacter) {
      setIsLoading(true);
      Platform.Destiny2Service.GetProfile(
        selectedMembership.membershipType,
        selectedMembership.membershipId,
        [DestinyComponentType.CharacterProgressions]
      )
        .then((data) => {
          setCharacterProgressions(data?.characterProgressions);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          // don't do anything, we already pop a lot of modals, they'll know if they see no characters on an account
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    globalState.loggedInUser,
    selectedMembership,
    selectedCharacter,
    destiny2Disabled,
    page,
  ]);

  // Use the selected pass hash if provided, otherwise fall back to current pass
  const seasonPassDef = selectedSeasonPassHash
    ? seasonUtilArgs.definitions?.DestinySeasonPassDefinition?.get(
        selectedSeasonPassHash
      )
    : SeasonProgressUtils?.getCurrentSeasonPass(seasonUtilArgs);

  const getProgression = (hash: number) => {
    if (!selectedCharacter?.id || !characterProgressions?.data) {
      return undefined;
    }

    return characterProgressions.data[selectedCharacter.id]?.progressions?.[
      hash
    ];
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

  // Track page changes to show loading during mode transitions
  useEffect(() => {
    if (page !== previousPage) {
      setPreviousPage(page);
      if (previousPage !== undefined) {
        // Page changed, show loading briefly for smooth transition
        setIsLoading(true);
        // Clear loading after a short delay to allow smooth visual transition
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 300);
        return () => clearTimeout(timeout);
      }
    }
  }, [page, previousPage]);

  // Track level changes to show loading during transitions
  useEffect(() => {
    if (level !== undefined && level > 0) {
      setPreviousLevel(level);
    }
  }, [level]);

  // Check if user is authenticated
  const isAuthenticated = UserUtils.isAuthenticated(globalState);

  // If user is not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  // Show loading if we're actively loading, transitioning, or don't have valid level data yet
  const shouldShowLoading = isLoading || !level || level === 0;

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
