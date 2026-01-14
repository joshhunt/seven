import stylesContainer from "@Areas/Rewards/Rewards.module.scss";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Tokens } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinyAccountComponent } from "@UI/Destiny/DestinyAccountComponent";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "@UIKit/Layout/ParallaxContainer";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { RewardItem } from "./Shared/RewardItem";

export interface Reward {
  rewardId: string;
  rewardDisplay: Tokens.BungieRewardDisplay;
}

export const Rewards: React.FC = () => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const { destinyData } = useGameData();
  const [rewards, setRewards] = useState<
    Record<string, Tokens.BungieRewardDisplay>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const rewardLoc = Localizer.Bungierewards;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        if (destinyData.selectedMembership) {
          //there is a selectedMembership available; use that membershipType
          const rewards = await Platform.TokensService.GetBungieRewardsForPlatformUser(
            destinyData.selectedMembership.membershipId,
            destinyData.selectedMembership.membershipType
          );
          setRewards(rewards);
        } else {
          //there is no selectedMembership available; use their bungienext membershipType and membershipId
          const rewards = globalState.loggedInUser?.user.membershipId
            ? await Platform.TokensService.GetBungieRewardsForUser(
                globalState.loggedInUser?.user.membershipId
              )
            : await Platform.TokensService.GetBungieRewardsList();
          setRewards(rewards);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [destinyData.selectedMembership]);

  const parsedRewards = useMemo(() => {
    const claimedRewards: Reward[] = [];
    const lockedBungieRewards: Reward[] = [];
    const unclaimedBungieRewards: Reward[] = [];
    const unclaimedLoyaltyRewards: Reward[] = [];
    for (const [rewardId, rewardDisplay] of Object.entries(rewards)) {
      if (
        rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        !rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .OfferApplied
      ) {
        unclaimedLoyaltyRewards.push({
          rewardId,
          rewardDisplay,
        });
      } else if (
        !rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        !rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .OfferApplied &&
        rewardDisplay.UserRewardAvailabilityModel.IsUnlockedForUser
      ) {
        unclaimedBungieRewards.push({
          rewardId,
          rewardDisplay,
        });
      } else if (
        !rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward &&
        rewardDisplay.UserRewardAvailabilityModel.IsAvailableForUser
      ) {
        lockedBungieRewards.push({
          rewardId,
          rewardDisplay,
        });
      } else if (
        rewardDisplay.UserRewardAvailabilityModel.IsUnlockedForUser &&
        rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel.OfferApplied
      ) {
        claimedRewards.push({
          rewardId,
          rewardDisplay,
        });
      }
    }

    claimedRewards.sort((a, b) => {
      const aIsLoyalty =
        a.rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward;
      const bIsLoyalty =
        b.rewardDisplay.UserRewardAvailabilityModel.AvailabilityModel
          .IsLoyaltyReward;
      if (aIsLoyalty && !bIsLoyalty) {
        return -1;
      } else if (!aIsLoyalty && bIsLoyalty) {
        return 1;
      }
      return 0;
    });

    return {
      claimedRewards,
      lockedBungieRewards,
      unclaimedBungieRewards,
      unclaimedLoyaltyRewards,
    };
  }, [rewards]);

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
          {destinyData.membershipData?.destinyMemberships?.length > 1 &&
            !destinyData.membershipData.primaryMembershipId && (
              <DestinyAccountComponent
                showCrossSaveBanner={false}
                showAllPlatformCharacters={false}
              >
                {({ platformSelector }) => (
                  <div className={styles.dropdownFlexWrapper}>
                    {platformSelector}
                  </div>
                )}
              </DestinyAccountComponent>
            )}
          <div className={styles.containerRewards}>
            <SpinnerContainer loading={isLoading} className={styles.spinner}>
              <RewardsListSection
                rewardsList={parsedRewards.unclaimedLoyaltyRewards}
                title={rewardLoc.NewPlayerRewardsHeader}
              />
              <RewardsListSection
                rewardsList={parsedRewards.unclaimedBungieRewards}
                title={rewardLoc.DigitalRewardsUnlockedHeader}
              />
              <RewardsListSection
                rewardsList={parsedRewards.lockedBungieRewards}
                title={rewardLoc.AvailableRewardsHeader}
              />
              <RewardsListSection
                rewardsList={parsedRewards.claimedRewards}
                title={rewardLoc.ClaimedRewards}
              />
            </SpinnerContainer>
          </div>
        </GridCol>
      </Grid>
    </SystemDisabledHandler>
  );
};

interface RewardsListSectionProps {
  rewardsList: Reward[];
  title: string;
}

function RewardsListSection({ rewardsList, title }: RewardsListSectionProps) {
  if (rewardsList.length == 0) {
    return null;
  }
  return (
    <GridCol cols={12}>
      <h3 className={styles.sectionHeader}>{title}</h3>
      <ul>
        {rewardsList.map((reward) => (
          <RewardItem key={reward.rewardId} reward={reward} />
        ))}
      </ul>
    </GridCol>
  );
}
