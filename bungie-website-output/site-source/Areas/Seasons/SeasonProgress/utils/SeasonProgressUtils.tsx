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

// Added: model types for pass selection and reward gating
export interface ISeasonPassModel {
  seasonPassHash: number;
  seasonPassDefinition: any; // DestinySeasonPassDefinition
  rewardProgression?: any; // DestinyProgression
  seasonPassRef?: any; // raw reference from seasonDef.seasonPassList (start/end dates)
}

export interface IEffectiveRewardState {
  locked: boolean;
  invisible: boolean;
  earned: boolean;
  claimed: boolean;
  claimAllowed: boolean;
  canClaim: boolean;
}

export default class SeasonProgressUtils {
  // Provide a production-safe date override via URL (?testNow=YYYY-MM-DD or ISO). Defaults to real now.
  public static getEffectiveNow(): Date {
    try {
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        const p = sp.get("testNow") || sp.get("now");
        if (p) {
          const d = new Date(p);
          if (!isNaN(d.getTime())) {
            return d;
          }
        }
      }
    } catch {}
    return new Date();
  }

  // New: parse server reward item state bits
  public static parseRewardItemState(state: number | undefined) {
    const s = Number(state ?? 0);
    return {
      invisible: (s & DestinyProgressionRewardItemState.Invisible) !== 0,
      earned: (s & DestinyProgressionRewardItemState.Earned) !== 0,
      claimed: (s & DestinyProgressionRewardItemState.Claimed) !== 0,
      claimAllowed: (s & DestinyProgressionRewardItemState.ClaimAllowed) !== 0,
    };
  }

  // New: per-pass premium ownership via profile.profile.data.seasonPassHashes
  public static ownsPremiumPassByProfile(
    seasonPassHash: number | undefined,
    profile?: any
  ): boolean {
    if (!seasonPassHash) return false;
    const owned =
      (profile?.profile?.data?.seasonPassHashes as number[] | undefined) ?? [];
    return owned.some((h: number) => Number(h) === Number(seasonPassHash));
  }

  /**
   * New: Apply ownership gating to raw server bits for a single reward item.
   * - earned: preserved (step eligibility)
   * - claimed: preserved (server truth)
   * - claimAllowed: disabled if premium-locked
   * - locked: true iff isPremiumReward && !ownsPremiumPass
   * - canClaim: claimAllowed && !locked
   */
  public static coerceRewardStateForOwnership(
    state: number | undefined,
    isPremiumReward: boolean,
    ownsPremiumPass: boolean
  ): IEffectiveRewardState {
    const bits = this.parseRewardItemState(state);
    const locked = Boolean(isPremiumReward && !ownsPremiumPass);
    const claimAllowed = Boolean(bits.claimAllowed && !locked);
    return {
      locked,
      invisible: bits.invisible,
      earned: bits.earned,
      claimed: bits.claimed,
      claimAllowed,
      canClaim: claimAllowed && !locked,
    };
  }

  public static getSigilVersionWithValues(level: number, ownsPremium: boolean) {
    if (!level) {
      return "base";
    }

    const isOver100 = level >= 100;

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

  public static getSigilVersion(
    seasonUtilArgs: ISeasonUtilArgs,
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    ownsPremium?: boolean,
    characterId?: string,
    profileRecords?: Components.SingleComponentResponseDestinyProfileRecordsComponent
  ): "premium_over_100" | "premium" | "base_over_100" | "base" {
    if (typeof characterProgressions === "undefined") {
      return "base";
    }

    // Get specific character progression or fall back to first available
    // We need a character's progression data to check the season pass state
    let targetCharacterProgression;
    if (characterId && (characterProgressions as any).data[characterId]) {
      targetCharacterProgression = (characterProgressions as any).data[
        characterId
      ];
    } else {
      targetCharacterProgression = Object.values(
        (characterProgressions as any).data
      )[0];
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

    // Check if user owns premium pass (account-wide) by looking at premium rewards
    // Since the season pass is shared across characters, we only need to check one character
    const premiumRewardIndices = [208, 88]; // Check in order of preference

    if (ownsPremium === undefined) {
      for (const rewardIndex of premiumRewardIndices) {
        if (rewardIndex < progression.rewardItemStates?.length) {
          const rewardItemState = progression?.rewardItemStates[rewardIndex];

          // If ClaimAllowed or Claimed is set, they own the premium pass (account-wide)
          if (
            rewardItemState & DestinyProgressionRewardItemState.ClaimAllowed ||
            rewardItemState & DestinyProgressionRewardItemState.Claimed
          ) {
            ownsPremium = true;
            break;
          }
        }
      }
    }

    // Check if over level 100
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
    characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    seasonPassHash?: number
  ): number {
    if (typeof characterProgressions === "undefined") {
      return 0;
    }

    const seasonPassDef = seasonPassHash
      ? (definitions as any).DestinySeasonPassDefinition.get(seasonPassHash)
      : this.getCurrentSeasonPass({ seasonHash, definitions });

    let totalUnclaimedRewards = 0;

    Object.entries((characterProgressions as any).data).forEach(
      (value: [string, Characters.DestinyCharacterProgressionComponent]) => {
        const progression = (value[1] as any).progressions?.[
          seasonPassDef?.rewardProgressionHash
        ];
        if (!progression) {
          return;
        }
        const rewardsDef = (definitions as any).DestinyProgressionDefinition.get(
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
              const rewardItemDef = (definitions as any).DestinyInventoryItemLiteDefinition.get(
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

    return (definitions as any).DestinySeasonDefinition.get(seasonHash);
  };

  public static getCurrentSeasonPassStartAndEnd = (
    seasonUtilArgs: ISeasonUtilArgs,
    now: Date = SeasonProgressUtils.getEffectiveNow()
  ) => {
    const seasonDef: any = this.getSeasonDefinition(seasonUtilArgs);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    function isDateInRange(date: Date, startDate: string, endDate: string) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    }

    const currentDate = now;

    seasonDef?.seasonPassList.forEach((seasonPass: any) => {
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

  public static getCurrentSeasonPass = (
    seasonUtilArgs: ISeasonUtilArgs,
    now: Date = SeasonProgressUtils.getEffectiveNow()
  ) => {
    const { definitions } = seasonUtilArgs;
    if (!definitions) {
      return null;
    }
    const seasonDef: any = this.getSeasonDefinition(seasonUtilArgs);
    const seasonPassReference =
      seasonDef?.seasonPassList?.find((sp: any) => {
        if (!sp?.seasonPassStartDate) return false;
        const start = new Date(sp.seasonPassStartDate);
        const end = sp.seasonPassEndDate
          ? new Date(sp.seasonPassEndDate)
          : undefined;
        return end ? now >= start && now <= end : now >= start;
      }) ?? seasonDef?.seasonPassList?.[0];

    return (definitions as any).DestinySeasonPassDefinition.get(
      seasonPassReference?.seasonPassHash
    );
  };

  public static getSeasonPassByHash = (
    seasonUtilArgs: ISeasonUtilArgs,
    seasonPassHash?: number
  ) => {
    const { definitions } = seasonUtilArgs;
    if (!definitions) {
      return null;
    }
    if (seasonPassHash) {
      return (definitions as any).DestinySeasonPassDefinition.get(
        seasonPassHash
      );
    }
    return this.getCurrentSeasonPass(seasonUtilArgs);
  };

  public static getPremiumPassOwnershipUnlockFlag = (
    seasonUtilArgs: ISeasonUtilArgs,
    currentPass = true,
    now: Date = SeasonProgressUtils.getEffectiveNow()
  ) => {
    const { definitions } = seasonUtilArgs;

    if (!definitions) {
      return null;
    }

    const seasonDef: any = this.getSeasonDefinition(seasonUtilArgs);

    // Use seasonPassStartDate since seasonPassStartTime/startTimeInSeconds are coming through as 0
    const currentDate = now;
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

  // ===== New: Pass selection helpers for Current/Previous views =====

  public static getSeasonPassReferences(
    seasonUtilArgs: ISeasonUtilArgs
  ): any[] {
    const def: any = this.getSeasonDefinition(seasonUtilArgs);
    return def?.seasonPassList ?? [];
  }

  private static isNowInRange(
    start?: string,
    end?: string,
    now: Date = new Date()
  ) {
    if (!start) return false;
    const s = new Date(start);
    const e = end ? new Date(end) : undefined;
    return e ? now >= s && now <= e : now >= s;
  }

  private static resolveCharacterIdFromProgressions(
    characterProgressions?: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    characterId?: string
  ): string | undefined {
    if (characterId && (characterProgressions as any)?.data?.[characterId])
      return characterId;
    const keys = characterProgressions
      ? Object.keys((characterProgressions as any).data ?? {})
      : [];
    return keys[0];
  }

  public static buildSeasonPassModels(
    seasonUtilArgs: ISeasonUtilArgs,
    characterProgressions?: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent,
    characterId?: string
  ): ISeasonPassModel[] {
    const { definitions } = seasonUtilArgs;
    if (!definitions) return [];

    const seasonDef: any = this.getSeasonDefinition(seasonUtilArgs);
    if (!seasonDef) return [];

    const passRefs: any[] = seasonDef.seasonPassList ?? [];
    const resolvedCharId = this.resolveCharacterIdFromProgressions(
      characterProgressions,
      characterId
    );
    const charProgs = resolvedCharId
      ? (characterProgressions as any)?.data?.[resolvedCharId]?.progressions
      : undefined;

    const models: ISeasonPassModel[] = [];
    for (const ref of passRefs) {
      const seasonPassHash = Number(ref?.seasonPassHash);
      if (!seasonPassHash) continue;

      const passDef = (definitions as any).DestinySeasonPassDefinition.get(
        seasonPassHash
      );
      if (!passDef) continue;

      const rewardHash = Number(passDef?.rewardProgressionHash);

      models.push({
        seasonPassHash,
        seasonPassDefinition: passDef,
        rewardProgression: rewardHash ? charProgs?.[rewardHash] : undefined,
        seasonPassRef: ref,
      });
    }

    return models;
  }

  public static pickActiveSeasonPassIndex(
    models: ISeasonPassModel[],
    now: Date = SeasonProgressUtils.getEffectiveNow()
  ): number {
    if (!models?.length) return -1;

    const byDateIdx = models.findIndex((m) =>
      this.isNowInRange(
        m.seasonPassRef?.seasonPassStartDate,
        m.seasonPassRef?.seasonPassEndDate,
        now
      )
    );
    if (byDateIdx >= 0) return byDateIdx;

    const score = (m: ISeasonPassModel) => {
      const rp: any = m.rewardProgression ?? {};
      const vals = [
        Number(rp.level ?? rp.step ?? 0),
        Number(rp.currentProgress ?? 0),
        Number(rp.progressToNextLevel ?? 0),
      ];
      return vals.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
    };

    let bestIdx = 0;
    let best = score(models[0]);
    for (let i = 1; i < models.length; i++) {
      const s = score(models[i]);
      if (s > best) {
        best = s;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  public static getActivePassIndexForSeason(
    definitions: any,
    seasonHash: number,
    now: Date = SeasonProgressUtils.getEffectiveNow()
  ): number {
    const seasonDef: any = definitions?.DestinySeasonDefinition?.get?.(
      seasonHash
    );
    const list: any[] = seasonDef?.seasonPassList ?? [];
    if (!list.length) return -1;
    const idx = list.findIndex((sp: any) => {
      if (!sp?.seasonPassStartDate) return false;
      const s = new Date(sp.seasonPassStartDate);
      const e = sp.seasonPassEndDate
        ? new Date(sp.seasonPassEndDate)
        : undefined;
      return e ? now >= s && now <= e : now >= s;
    });
    return idx >= 0 ? idx : 0;
  }

  public static getPassHashForSeasonByIndex(
    definitions: any,
    seasonHash: number,
    index: number
  ): number | undefined {
    const seasonDef: any = definitions?.DestinySeasonDefinition?.get?.(
      seasonHash
    );
    const list: any[] = seasonDef?.seasonPassList ?? [];
    return list[index]?.seasonPassHash as number | undefined;
  }

  // Get a SeasonPassDefinition by hash
  public static getSeasonPassDefinition(
    seasonPassHash: number | undefined,
    definitions?: Pick<AllDefinitionsFetcherized, "DestinySeasonPassDefinition">
  ) {
    if (!seasonPassHash || !definitions) {
      return undefined as any;
    }
    return (definitions as any).DestinySeasonPassDefinition.get(seasonPassHash);
  }

  // Reward progression hash for a given pass
  public static getRewardProgressionHashForPass(
    seasonPassHash: number | undefined,
    definitions?: Pick<AllDefinitionsFetcherized, "DestinySeasonPassDefinition">
  ): number | undefined {
    const passDef: any = this.getSeasonPassDefinition(
      seasonPassHash,
      definitions
    );
    return passDef?.rewardProgressionHash as number | undefined;
  }
}
