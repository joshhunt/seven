// Created by atseng, 2022
// Copyright Bungie, Inc.

import { RewardsDataStore } from "@Areas/Rewards/DataStores/RewardsDataStore";
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
import { ConfigUtils } from "@Utilities/ConfigUtils";
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
  const rewardsData = useDataStore(RewardsDataStore);

  const rewardLoc = Localizer.Bungierewards;

  const resetRewards = () => {
    RewardsDestinyMembershipDataStore.actions.loadUserData();
    RewardsDataStore.actions.reset();
  };

  useEffect(() => {
    resetRewards();

    if (UserUtils.isAuthenticated(globalState)) {
      RewardsDataStore.actions.getRewardsList(
        globalState.loggedInUser.user.membershipId
      );

      RewardsDestinyMembershipDataStore.actions.loadUserData(
        {
          membershipId: globalState.loggedInUser.user.membershipId,
          membershipType: BungieMembershipType.BungieNext,
        },
        true
      );
    } else {
      RewardsDataStore.actions.getRewardsList();
    }
  }, [globalState.loggedInUser]);

  if (!ConfigUtils.SystemStatus(SystemNames.D2RewardsReact)) {
    return null;
  }

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
              rewardsList={rewardsData.unclaimedLoyaltyRewards}
              title={rewardLoc.NewPlayerRewardsHeader}
              keyString={"rewardItemUCL"}
            />
            <RewardsListSection
              rewardsList={rewardsData.unclaimedBungieRewards}
              title={rewardLoc.DigitalRewardsUnlockedHeader}
              keyString={"rewardItemUCB"}
            />
            <RewardsListSection
              rewardsList={rewardsData.lockedBungieRewards}
              title={rewardLoc.AvailableRewardsHeader}
              keyString={"rewardItemLR"}
            />
            <RewardsListSection
              rewardsList={rewardsData.claimedRewards.sort((a, b) => {
                const aIsLoyalty =
                  a.bungieRewardDisplay.UserRewardAvailabilityModel
                    .AvailabilityModel.IsLoyaltyReward;
                const bIsLoyalty =
                  b.bungieRewardDisplay.UserRewardAvailabilityModel
                    .AvailabilityModel.IsLoyaltyReward;

                if (aIsLoyalty && !bIsLoyalty) {
                  return -1;
                } else if (!aIsLoyalty && bIsLoyalty) {
                  return 1;
                }

                return 0;
              })}
              title={rewardLoc.ClaimedRewards}
              keyString={"rewardItemCR"}
            />
          </div>
        </GridCol>
      </Grid>
    </SystemDisabledHandler>
  );
};
