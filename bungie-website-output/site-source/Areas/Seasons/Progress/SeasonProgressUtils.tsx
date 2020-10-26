import { World, Components, Characters } from "@Platform";
import { DestinyDefinitions } from "@Definitions";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import React from "react";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { BungieMembershipType, DestinyProgressionRewardItemState } from "@Enum";

export default class SeasonProgressUtils {
  public static getUnclaimedRewards(
    seasonHash: number,
    definitions: Pick<
      AllDefinitionsFetcherized,
      | "DestinyInventoryItemLiteDefinition"
      | "DestinySeasonDefinition"
      | "DestinySeasonPassDefinition"
      | "DestinyProgressionDefinition"
    >,
    characterProgressions: { [key: number]: World.DestinyProgression },
    characterId: string,
    membershipType: BungieMembershipType
  ) {
    if (
      typeof characterProgressions === "undefined" ||
      typeof characterId === "undefined" ||
      typeof membershipType === "undefined"
    ) {
      return;
    }

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);

    const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
      seasonDef.seasonPassHash
    );

    const progression =
      characterProgressions[seasonDef.seasonPassProgressionHash];

    const rewardsDef = definitions.DestinyProgressionDefinition.get(
      seasonPassDef.rewardProgressionHash
    );

    const unclaimedRewards = rewardsDef.rewardItems.filter(
      (
        value: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
        index: number
      ) => {
        const rewardItemState = progression.rewardItemStates[index];

        if (
          rewardItemState & DestinyProgressionRewardItemState.Earned &&
          rewardItemState & DestinyProgressionRewardItemState.ClaimAllowed &&
          (rewardItemState & DestinyProgressionRewardItemState.Claimed) === 0 &&
          (rewardItemState & DestinyProgressionRewardItemState.Invisible) === 0
        ) {
          const rewardItemDef = definitions.DestinyInventoryItemLiteDefinition.get(
            value.itemHash
          );

          if (rewardItemDef.displayProperties) {
            return value;
          }
        }
      }
    ).length;

    if (unclaimedRewards > 0) {
      return unclaimedRewards;
    }
  }

  public static getUnclaimedRewardsForPlatform(
    seasonHash: number,
    definitions: Pick<
      AllDefinitionsFetcherized,
      | "DestinyInventoryItemLiteDefinition"
      | "DestinySeasonDefinition"
      | "DestinySeasonPassDefinition"
      | "DestinyProgressionDefinition"
    >,
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
  ): number {
    if (typeof characterProgressions === "undefined") {
      return 0;
    }

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);

    const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
      seasonDef.seasonPassHash
    );

    let totalUnclaimedRewards = 0;

    Object.entries(characterProgressions.data).forEach(
      (value: [string, Characters.DestinyCharacterProgressionComponent]) => {
        const progression =
          value[1].progressions[seasonDef.seasonPassProgressionHash];
        const rewardsDef = definitions.DestinyProgressionDefinition.get(
          seasonPassDef.rewardProgressionHash
        );

        const unclaimedRewards = rewardsDef.rewardItems.filter(
          (
            rewardValue: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
            index: number
          ) => {
            const rewardItemState = progression.rewardItemStates[index];

            if (
              rewardItemState & DestinyProgressionRewardItemState.Earned &&
              rewardItemState &
                DestinyProgressionRewardItemState.ClaimAllowed &&
              (rewardItemState & DestinyProgressionRewardItemState.Claimed) ===
                0 &&
              (rewardItemState &
                DestinyProgressionRewardItemState.Invisible) ===
                0
            ) {
              const rewardItemDef = definitions.DestinyInventoryItemLiteDefinition.get(
                rewardValue.itemHash
              );

              if (rewardItemDef.displayProperties) {
                return rewardValue;
              }
            }
          }
        ).length;

        if (unclaimedRewards > 0) {
          totalUnclaimedRewards = totalUnclaimedRewards + unclaimedRewards;
        }
      }
    );

    return totalUnclaimedRewards;
  }
}
