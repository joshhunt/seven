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

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  useEffect(() => {
    if (!destiny2Disabled && selectedMembership && selectedCharacter) {
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
        });
    }
  }, [
    globalState.loggedInUser,
    selectedMembership,
    selectedCharacter,
    destiny2Disabled,
  ]);

  const seasonPassDef = SeasonProgressUtils?.getCurrentSeasonPass(
    seasonUtilArgs
  );

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

  const prestigeProgression =
    characterSeasonPassRewardProgression?.level > 0
      ? getProgression(seasonPassDef?.prestigeProgressionHash)
      : undefined;

  const characterSeasonPassProgression =
    prestigeProgression?.level > 0
      ? prestigeProgression
      : characterSeasonPassRewardProgression;

  const isPrestige = prestigeProgression?.level > 0;

  function parseRankTemplate(template: string, level: number) {
    const beforeLevel = template.split("{characterSeasonProgressionLevel}")[0];

    return {
      word: beforeLevel,
      number: level,
    };
  }

  const template = Localizer.Seasons.RankCharacterseasonprogressionlevel;
  const level = characterSeasonPassProgression?.level;
  const { word, number } = parseRankTemplate(template, level);
  const premiumPassOwnershipStatus = SeasonProgressUtils?.getSigilVersion(
    seasonUtilArgs,
    characterProgressions
  );

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
