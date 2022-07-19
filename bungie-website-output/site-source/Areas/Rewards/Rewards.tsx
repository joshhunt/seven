// Created by atseng, 2022
// Copyright Bungie, Inc.

import { RewardsDataStore } from "@Areas/Rewards/DataStores/RewardsDataStore";
import { RewardsDestinyMembershipDataStore } from "@Areas/Rewards/DataStores/RewardsDestinyMembershipDataStore";
import stylesContainer from "@Areas/Rewards/Rewards.module.scss";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { RewardsListSection } from "@Areas/Rewards/Shared/RewardsListSection";
import { RewardsWarning } from "@Areas/Rewards/Shared/RewardsWarning";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Tokens } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "@UIKit/Layout/ParallaxContainer";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect } from "react";

export interface IReward {
  rewardId: string;
  bungieRewardDisplay: Tokens.BungieRewardDisplay;
}

interface RewardsProps {}

export const Rewards: React.FC<RewardsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const rewardsData = useDataStore(RewardsDataStore);
  const destinyUser = useDataStore(RewardsDestinyMembershipDataStore);

  const rewardLoc = Localizer.Bungierewards;

  const resetRewards = () => {
    RewardsDestinyMembershipDataStore.actions.loadUserData();
    RewardsDataStore.actions.reset();
  };

  useEffect(() => {
    resetRewards();

    if (!UserUtils.isAuthenticated(globalState)) {
      RewardsDataStore.actions.getRewardsList();
    }
  }, [globalState.loggedInUser]);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState) && destinyUser.loaded) {
      if (
        destinyUser.membershipData?.destinyMemberships &&
        destinyUser?.selectedMembership
      ) {
        //there is a selectedMembership available; use that membershipType
        RewardsDataStore.actions.getPlatformRewardsList(
          destinyUser.selectedMembership.membershipId,
          destinyUser.selectedMembership.membershipType
        );
      } else {
        //there is no selectedMembership available; use their bungienext membershipType and membershipId
        RewardsDataStore.actions.getRewardsList(
          globalState.loggedInUser.user.membershipId
        );
      }
    }
  }, [destinyUser.selectedMembership, destinyUser.loaded]);

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
          {destinyUser?.membershipData?.destinyMemberships &&
            destinyUser.membershipData.destinyMemberships.length > 1 &&
            !destinyUser.isCrossSaved && (
              <div className={stylesContainer.platformSelector}>
                <DestinyPlatformSelector
                  userMembershipData={destinyUser?.membershipData}
                  onChange={(platform) => {
                    RewardsDestinyMembershipDataStore.actions.updatePlatform(
                      platform
                    );
                  }}
                  defaultValue={
                    destinyUser?.selectedMembership?.membershipType ??
                    destinyUser?.membershipData?.destinyMemberships[0]
                      .membershipType
                  }
                  crossSavePairingStatus={globalState.crossSavePairingStatus}
                />
              </div>
            )}
          <div className={styles.containerRewards}>
            <SpinnerContainer
              loading={!rewardsData.loaded}
              className={styles.spinner}
            >
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
            </SpinnerContainer>
          </div>
        </GridCol>
      </Grid>
    </SystemDisabledHandler>
  );
};
