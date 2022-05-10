// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Tokens } from "@Platform";
import classNames from "classnames";
import React from "react";

interface RewardAvailabilityProps {
  reward: Tokens.BungieRewardDisplay;
}

export const RewardAvailability: React.FC<RewardAvailabilityProps> = (
  props
) => {
  const rewardLoc = Localizer.BungieRewards;

  const availabilityFragment = (): React.ReactElement => {
    const userAvailability = props.reward.UserRewardAvailabilityModel;

    if (
      userAvailability.AvailabilityModel.IsOffer &&
      userAvailability.IsUnlockedForUser &&
      userAvailability.AvailabilityModel.IsLoyaltyReward
    ) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.LoyaltyRewardOfferApplied}
        </p>
      );
    } else if (
      userAvailability.AvailabilityModel.IsOffer &&
      userAvailability.IsUnlockedForUser &&
      userAvailability.AvailabilityModel.OfferApplied &&
      userAvailability.AvailabilityModel.DecryptedToken
    ) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.RewardAsCodeGeneratedAndAvailable}
        </p>
      );
    } else if (
      userAvailability.AvailabilityModel.IsOffer &&
      userAvailability.IsUnlockedForUser &&
      userAvailability.AvailabilityModel.OfferApplied
    ) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.RewardOfferAppliedToCollections}
        </p>
      );
    } else if (
      userAvailability.AvailabilityModel.IsOffer &&
      userAvailability.IsUnlockedForUser &&
      userAvailability.AvailabilityModel.HasOffer
    ) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.RewardEarnedClickHereToApplyToGame}
        </p>
      );
    } else if (
      userAvailability.AvailabilityModel.IsOffer &&
      userAvailability.IsUnlockedForUser
    ) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.RedeemOfferBy}
        </p>
      );
    } else if (userAvailability.AvailabilityModel.IsOffer) {
      return <p className={styles.date}>{rewardLoc.CompleteBy}</p>;
    } else if (userAvailability.IsUnlockedForUser) {
      return (
        <p className={classNames(styles.date, styles.unlocked)}>
          {rewardLoc.RedeemCodeBy}
        </p>
      );
    } else {
      return <p className={styles.date}>{rewardLoc.CompleteBy}</p>;
    }
  };

  return availabilityFragment();
};
