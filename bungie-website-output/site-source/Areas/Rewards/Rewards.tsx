// Created by atseng, 2022
// Copyright Bungie, Inc.

import { RewardsDestinyMembershipDataStore } from "@Areas/Rewards/DataStores/RewardsDestinyMembershipDataStore";
import { RewardsListSection } from "@Areas/Rewards/Shared/RewardsListSection";
import { RewardsWarning } from "@Areas/Rewards/Shared/RewardsWarning";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Tokens } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "@UIKit/Layout/ParallaxContainer";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import stylesContainer from "@Areas/Rewards/Rewards.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import classNames from "classnames";

export interface IReward {
  rewardId: string;
  bungieRewardDisplay: Tokens.BungieRewardDisplay;
}

interface RewardsProps {}

export const Rewards: React.FC<RewardsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const rewardLoc = Localizer.Bungierewards;

  const [claimedRewards, setClaimedRewards] = useState<IReward[]>([]);
  const [unclaimedLoyaltyRewards, setUnclaimedLoyaltyRewards] = useState<
    IReward[]
  >([]);
  const [unclaimedBungieRewards, setUnclaimedBungieRewards] = useState<
    IReward[]
  >([]);
  const [lockedBungieRewards, setLockedBungieRewards] = useState<IReward[]>([]);

  const parseRewards = (rewards: {
    [p: string]: Tokens.BungieRewardDisplay;
  }) => {
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

    setClaimedRewards(_claimedRewards);
    setLockedBungieRewards(_lockedBungieRewards);
    setUnclaimedBungieRewards(_unclaimedBungieRewards);
    setUnclaimedLoyaltyRewards(_unclaimedLoyaltyRewards);
  };

  const resetRewards = () => {
    RewardsDestinyMembershipDataStore.actions.loadUserData();
    setClaimedRewards([]);
    setUnclaimedLoyaltyRewards([]);
    setLockedBungieRewards([]);
    setUnclaimedBungieRewards([]);
  };

  useEffect(() => {
    resetRewards();

    if (UserUtils.isAuthenticated(globalState)) {
      Platform.TokensService.GetBungieRewardsForUser(
        globalState.loggedInUser.user.membershipId
      ).then((result) => {
        parseRewards(result);
      });

      RewardsDestinyMembershipDataStore.actions.loadUserData(
        {
          membershipId: globalState.loggedInUser.user.membershipId,
          membershipType: BungieMembershipType.BungieNext,
        },
        true
      );
    } else {
      Platform.TokensService.GetBungieRewardsList().then((result) => {
        parseRewards(result);
      });
    }
  }, [globalState.loggedInUser]);

  return (
    <SystemDisabledHandler systems={[SystemNames.D2Rewards]}>
      <BungieHelmet title={rewardLoc.AvailableRewardsHeader} />
      <ParallaxContainer
        className={stylesContainer.background}
        parallaxSpeed={2.5}
        isFadeEnabled={true}
        fadeOutSpeed={1000}
        backgroundOffset={0}
        style={{
          backgroundImage: `url(${"/img/theme/bungienet/bgs/rewards_hero_bg.png"})`,
        }}
      />
      <Grid className={stylesContainer.pageContainer}>
        <GridCol
          cols={12}
          className={classNames(
            stylesContainer.containerRewards,
            stylesContainer.overwriteGridStyle
          )}
        >
          <div className={stylesContainer.claimRewardsBreadcrumb}>
            <Anchor url={RouteHelper.Rewards()}>
              {rewardLoc.BungieRewards}
            </Anchor>
            <p>{rewardLoc.ClaimRewardsPageTitleMagento}</p>
          </div>
          <h1 className={stylesContainer.claimRewardsTitle}>
            {rewardLoc.ClaimRewardsPageTitleMagento}
          </h1>
          <RewardsWarning />
          <div className={styles.containerRewards}>
            <RewardsListSection
              rewardsList={unclaimedLoyaltyRewards}
              title={rewardLoc.NewPlayerRewardsHeader}
              keyString={"rewardItemUCL"}
            />
            <RewardsListSection
              rewardsList={unclaimedBungieRewards}
              title={rewardLoc.DigitalRewardsUnlockedHeader}
              keyString={"rewardItemUCB"}
            />
            <RewardsListSection
              rewardsList={lockedBungieRewards}
              title={rewardLoc.AvailableRewardsHeader}
              keyString={"rewardItemLR"}
            />
            <RewardsListSection
              rewardsList={claimedRewards}
              title={rewardLoc.ClaimedRewards}
              keyString={"rewardItemCR"}
            />
          </div>
        </GridCol>
      </Grid>
    </SystemDisabledHandler>
  );
};
