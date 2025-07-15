import styles from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/RankSigil/RankSigil.module.scss";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { BungieMembershipType, DestinyProgressionRewardItemState } from "@Enum";
import { Characters, Components, World } from "@Platform";
import { DateTime } from "luxon";
import React from "react";

export interface ISeasonUtilArgs {
  seasonHash: number;
  definitions?: Pick<
    AllDefinitionsFetcherized,
    | "DestinyClassDefinition"
    | "DestinySeasonDefinition"
    | "DestinyProgressionDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyInventoryItemLiteDefinition"
  >;
}

export default class SeasonProgressUtils {
  public static getUnclaimedRewards(
    seasonUtilArgs: ISeasonUtilArgs,
    characterProgressions: { [key: number]: World.DestinyProgression },
    characterId: string,
    membershipType: BungieMembershipType
  ) {
    const { seasonHash, definitions } = seasonUtilArgs;

    if (
      typeof characterProgressions === "undefined" ||
      typeof characterId === "undefined" ||
      typeof membershipType === "undefined"
    ) {
      return;
    }

    const seasonPassReference = this.getCurrentSeasonPass(seasonUtilArgs);
    // this is the season pass definition
    const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
      seasonPassReference?.rewardProgressionHash
    );
    const progression =
      characterProgressions[seasonPassDef?.rewardProgressionHash];

    const rewardsDef = definitions.DestinyProgressionDefinition.get(
      seasonPassDef.rewardProgressionHash
    );
    if (!rewardsDef) {
      return null;
    }
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

  public static getSigilVersion(
    seasonUtilArgs: ISeasonUtilArgs,
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    characterId?: string
  ): "premium_over_100" | "premium" | "base_over_100" | "base" {
    const { seasonHash, definitions } = seasonUtilArgs;

    if (typeof characterProgressions === "undefined") {
      return "base";
    }

    // Get specific character progression or fall back to first available
    // We need a character's progression data to check the season pass state
    let targetCharacterProgression;
    if (characterId && characterProgressions.data[characterId]) {
      targetCharacterProgression = characterProgressions.data[characterId];
    } else {
      targetCharacterProgression = Object.values(characterProgressions.data)[0];
    }

    if (!targetCharacterProgression) {
      return "base";
    }

    const seasonPassDef = this.getCurrentSeasonPass(seasonUtilArgs);
    const progression =
      targetCharacterProgression.progressions[
        seasonPassDef?.rewardProgressionHash
      ];

    if (!progression) {
      return "base";
    }

    // Check if user owns premium pass (account-wide) by looking at premium rewards
    // Since the season pass is shared across characters, we only need to check one character
    const premiumRewardIndices = [208, 88]; // Check in order of preference
    let ownsPremium = false;

    for (const rewardIndex of premiumRewardIndices) {
      if (rewardIndex < progression.rewardItemStates.length) {
        const rewardItemState = progression.rewardItemStates[rewardIndex];

        // If ClaimAllowed is set, they own the premium pass (account-wide)
        if (rewardItemState & DestinyProgressionRewardItemState.ClaimAllowed) {
          ownsPremium = true;
          break;
        }
      }
    }

    // Check if over level 100
    const isOver100 = progression.level > 100;

    // Determine sigil version based on ownership and level
    if (ownsPremium && isOver100) {
      return "premium_over_100";
    } else if (ownsPremium) {
      return "premium";
    } else if (isOver100) {
      return "base_over_100";
    } else {
      return "base";
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

    const seasonPassDef = this.getCurrentSeasonPass({
      seasonHash,
      definitions,
    });

    let totalUnclaimedRewards = 0;

    Object.entries(characterProgressions.data).forEach(
      (value: [string, Characters.DestinyCharacterProgressionComponent]) => {
        const progression =
          value[1].progressions[seasonPassDef?.rewardProgressionHash];
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
              rewardItemState &
                DestinyProgressionRewardItemState.ClaimAllowed &&
              (rewardItemState & DestinyProgressionRewardItemState.Claimed) ===
                0 &&
              (rewardItemState &
                DestinyProgressionRewardItemState.Invisible) ===
                0
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
          totalUnclaimedRewards = totalUnclaimedRewards + unclaimedRewards;
        }
      }
    );

    return totalUnclaimedRewards;
  }

  public static getSeasonDefinition = (seasonUtilArgs: ISeasonUtilArgs) => {
    const { seasonHash, definitions } = seasonUtilArgs;

    return definitions.DestinySeasonDefinition.get(seasonHash);
  };

  public static getCurrentSeasonPassStartAndEnd = (
    seasonUtilArgs: ISeasonUtilArgs
  ) => {
    const seasonDef = this.getSeasonDefinition(seasonUtilArgs);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    function isDateInRange(date: Date, startDate: string, endDate: string) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    }

    const currentDate = new Date();

    seasonDef.seasonPassList.forEach((seasonPass) => {
      if (
        isDateInRange(
          currentDate,
          seasonPass.seasonPassStartDate,
          seasonPass.seasonPassEndDate
        )
      ) {
        startDate = new Date(seasonPass.seasonPassStartDate);
        endDate = new Date(seasonPass.seasonPassEndDate);
      }
    });

    if (!startDate && !endDate) {
      // set the start date to the beginning of the season if we dont have a season pass with start and end date surrounding today.
      startDate = new Date(seasonDef.startDate);
      endDate = undefined;
    }

    return {
      startDate,
      endDate,
    };
  };

  public static getCurrentSeasonPass = (seasonUtilArgs: ISeasonUtilArgs) => {
    const { seasonHash, definitions } = seasonUtilArgs;
    const seasonDef = this.getSeasonDefinition(seasonUtilArgs);

    const seasonPassReference =
      seasonDef?.seasonPassList?.find(
        (seasonPass: any) =>
          seasonPass?.startTimeInSeconds > 0 &&
          seasonPass?.startTimeInSeconds <= Date.now()
      ) ?? seasonDef?.seasonPassList[0];

    return definitions.DestinySeasonPassDefinition.get(
      seasonPassReference?.seasonPassHash
    );
  };

  public static getSeasonPassByHash = (seasonUtilArgs: ISeasonUtilArgs) => {
    const { seasonHash, definitions } = seasonUtilArgs;
    const seasonDef = this.getSeasonDefinition(seasonUtilArgs);

    const seasonPassReference =
      seasonDef?.seasonPassList?.find(
        (seasonPass: any) =>
          seasonPass?.startTimeInSeconds > 0 &&
          seasonPass?.startTimeInSeconds <= Date.now()
      ) ?? seasonDef?.seasonPassList[0];

    return definitions.DestinySeasonPassDefinition.get(
      seasonPassReference?.seasonPassHash
    );
  };

  public static getPremiumPassOwnershipUnlockFlag = (
    seasonUtilArgs: ISeasonUtilArgs,
    currentPass = true
  ) => {
    const { seasonHash, definitions } = seasonUtilArgs;
    const seasonDef = this.getSeasonDefinition(seasonUtilArgs);
    // if it is the current pass

    const seasonPassReference =
      seasonDef?.seasonPassList?.find(
        (seasonPass: any) =>
          seasonPass?.startTimeInSeconds > 0 &&
          seasonPass?.startTimeInSeconds <= Date.now()
      ) ?? seasonDef?.seasonPassList[0];

    return seasonPassReference?.ownershipUnlockFlagHash;
  };
}
