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

interface RankSigilProps {
  seasonUtilArgs: ISeasonUtilArgs;
  ownsPremiumPass?: boolean;
}

const RankSigil: React.FC<RankSigilProps> = ({ seasonUtilArgs }) => {
  const destinyAccount = useAppSelector(selectDestinyAccount);
  const selectedMembership = useAppSelector(selectSelectedMembership);
  const selectedCharacter = useAppSelector(selectSelectedCharacter);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const [characterProgressions, setCharacterProgressions] = useState<
    Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
  >();
  const [
    profileRecords,
    setProfileRecords,
  ] = useState<Components.SingleComponentResponseDestinyProfileRecordsComponent | null>(
    null
  );

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  useEffect(() => {
    if (!destiny2Disabled && selectedCharacter) {
      // Use the character's platform information, not the selected membership
      // This is important when showing all platform characters where the selected character
      // might be from a different platform than the selected membership
      const membershipType = selectedCharacter.membershipType;
      const membershipId = selectedCharacter.characterData.membershipId;

      Promise.all([
        Platform.Destiny2Service.GetProfile(membershipType, membershipId, [
          DestinyComponentType.CharacterProgressions,
        ]),
        Platform.Destiny2Service.GetProfile(membershipType, membershipId, [
          DestinyComponentType.Records,
        ]),
      ])
        .then(([progressionsResponse, recordsResponse]) => {
          setCharacterProgressions(progressionsResponse?.characterProgressions);
          setProfileRecords(recordsResponse?.profileRecords);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          console.error("Error loading profile data:", e);
        });
    }
  }, [selectedCharacter, destiny2Disabled]);

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
