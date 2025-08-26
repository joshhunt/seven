import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { DestinyProgressionRewardItemState, DestinyRecordState } from "@Enum";
import { Characters, Components } from "@Platform";

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
  public static getSigilVersion(
    seasonUtilArgs: ISeasonUtilArgs,
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    characterId?: string,
    profileRecords?: Components.SingleComponentResponseDestinyProfileRecordsComponent
  ): "premium_over_100" | "premium" | "base_over_100" | "base" {
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
      targetCharacterProgression.progressions?.[
        seasonPassDef?.rewardProgressionHash
      ];

    if (!progression) {
      return "base";
    }

    // Check premium pass ownership using the unlock flag
    const ownsPremium = this.checkPremiumPassOwnership(
      seasonUtilArgs,
      profileRecords
    );

    // Check if at least level 100
    const isOver100 = progression.level >= 100;

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
          value[1].progressions?.[seasonPassDef?.rewardProgressionHash];
        if (!progression) {
          return;
        }
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

    if (!definitions) {
      return null;
    }

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

    seasonDef?.seasonPassList.forEach((seasonPass) => {
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

    if (!definitions) {
      return null;
    }

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

    if (!definitions) {
      return null;
    }

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

    if (!definitions) {
      return null;
    }

    const seasonDef = this.getSeasonDefinition(seasonUtilArgs);

    // Use seasonPassStartDate since seasonPassStartTime/startTimeInSeconds are coming through as 0
    const currentDate = new Date();
    const seasonPassReference =
      seasonDef?.seasonPassList?.find((seasonPass: any) => {
        if (!seasonPass?.seasonPassStartDate) return false;
        const startDate = new Date(seasonPass.seasonPassStartDate);
        const endDate = seasonPass.seasonPassEndDate
          ? new Date(seasonPass.seasonPassEndDate)
          : null;

        // Check if current date is within the season pass period
        const isActive =
          startDate <= currentDate && (!endDate || currentDate <= endDate);
        return isActive;
      }) ?? seasonDef?.seasonPassList[0];

    return seasonPassReference?.ownershipUnlockFlagHash;
  };

  /**
   * Check if user owns premium pass by checking the ownership unlock flag
   * This is the clean way to check premium ownership instead of checking individual reward states
   */
  public static checkPremiumPassOwnership(
    seasonUtilArgs: ISeasonUtilArgs,
    profileRecords?: Components.SingleComponentResponseDestinyProfileRecordsComponent
  ): boolean {
    const ownershipUnlockFlagHash = this.getPremiumPassOwnershipUnlockFlag(
      seasonUtilArgs
    );

    if (!ownershipUnlockFlagHash || !profileRecords?.data) {
      return false;
    }

    const recordState = (profileRecords.data as any).records[
      ownershipUnlockFlagHash
    ];
    if (!recordState) {
      return false;
    }

    // Check if the record is completed/redeemed (meaning they own the premium pass)
    // A completed record means they have the unlock flag
    return (
      (recordState.state & DestinyRecordState.RecordRedeemed) !== 0 ||
      recordState.state === 0
    ); // No flags set means it could be redeemed (they have access)
  }
}
