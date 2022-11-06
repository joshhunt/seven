// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore/DataStore";
import { BungieMembershipType } from "@Enum";
import { Platform, Tokens } from "@Platform";
import React from "react";

export interface IReward {
  rewardId: string;
  bungieRewardDisplay: Tokens.BungieRewardDisplay;
}

interface RewardsPayload {
  membershipType: BungieMembershipType;
  claimedRewards: IReward[];
  lockedBungieRewards: IReward[];
  unclaimedBungieRewards: IReward[];
  unclaimedLoyaltyRewards: IReward[];
  loaded: boolean;
}

class _RewardsDataStore extends DataStore<RewardsPayload> {
  public static readonly InitialState: RewardsPayload = {
    membershipType: BungieMembershipType.None,
    claimedRewards: [],
    lockedBungieRewards: [],
    unclaimedBungieRewards: [],
    unclaimedLoyaltyRewards: [],
    loaded: false,
  };

  public static Instance = new _RewardsDataStore(
    _RewardsDataStore.InitialState
  );

  public actions = this.createActions({
    reset: () => {
      return _RewardsDataStore.InitialState;
    },
    getRewardsList: async (state, membershipId?: string) => {
      //rewards list for anonymous or bungienet user using BungieMembershipType = bnetnext
      const rewards = membershipId
        ? await Platform.TokensService.GetBungieRewardsForUser(membershipId)
        : await Platform.TokensService.GetBungieRewardsList();

      return this.parseRewards(rewards, BungieMembershipType.None);
    },
    getPlatformRewardsList: async (
      state,
      membershipId: string,
      membershipType: BungieMembershipType
    ) => {
      //rewards list for user using BungieMembershipType != bnetnext
      const rewards = await Platform.TokensService.GetBungieRewardsForPlatformUser(
        membershipId,
        membershipType
      );

      return this.parseRewards(rewards, membershipType);
    },
  });

  private parseRewards(
    rewards: { [p: string]: Tokens.BungieRewardDisplay },
    membershipType: BungieMembershipType
  ): RewardsPayload {
    const _claimedRewards: IReward[] = [];
    const _lockedBungieRewards: IReward[] = [];
    const _unclaimedBungieRewards: IReward[] = [];
    const _unclaimedLoyaltyRewards: IReward[] = [];

    Object.keys(rewards).forEach((rewardId) => {
      if (
        rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        !rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .OfferApplied
      ) {
        _unclaimedLoyaltyRewards.push({
          rewardId: rewardId,
          bungieRewardDisplay: rewards[rewardId],
        });
      } else if (
        !rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        !rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .OfferApplied &&
        rewards[rewardId].UserRewardAvailabilityModel.IsUnlockedForUser
      ) {
        _unclaimedBungieRewards.push({
          rewardId: rewardId,
          bungieRewardDisplay: rewards[rewardId],
        });
      } else if (
        !rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        rewards[rewardId].UserRewardAvailabilityModel.IsAvailableForUser
      ) {
        _lockedBungieRewards.push({
          rewardId: rewardId,
          bungieRewardDisplay: rewards[rewardId],
        });
      } else if (
        rewards[rewardId].UserRewardAvailabilityModel.IsUnlockedForUser &&
        rewards[rewardId].UserRewardAvailabilityModel.AvailabilityModel
          .OfferApplied
      ) {
        _claimedRewards.push({
          rewardId: rewardId,
          bungieRewardDisplay: rewards[rewardId],
        });
      }
    });

    return {
      membershipType: membershipType,
      claimedRewards: _claimedRewards,
      lockedBungieRewards: _lockedBungieRewards,
      unclaimedBungieRewards: _unclaimedBungieRewards,
      unclaimedLoyaltyRewards: _unclaimedLoyaltyRewards,
      loaded: true,
    };
  }
}

export const RewardsDataStore = _RewardsDataStore.Instance;
