// Created by atseng, 2022
// Copyright Bungie, Inc.

import { RewardAvailability } from "@Areas/Rewards/Shared/RewardAvailability";
import { RewardButtons } from "@Areas/Rewards/Shared/RewardButtons";
import { RewardsCollectibleDisplay } from "@Areas/Rewards/Shared/RewardsCollectibleDisplay";
import { RewardsTriumphsDisplay } from "@Areas/Rewards/Shared/RewardsTriumphsDisplay";
import { Localizer } from "@bungie/localization/Localizer";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import { IReward } from "../Rewards";
import styles from "./RewardItem.module.scss";

interface RewardItemProps {
  reward: IReward;
}

export const RewardItem: React.FC<RewardItemProps> = (props) => {
  if (!props.reward) {
    return null;
  }

  const rewardLoc = Localizer.BungieRewards;
  const userAvailability =
    props.reward?.bungieRewardDisplay?.UserRewardAvailabilityModel;
  const bungieRewardDisplay = props.reward?.bungieRewardDisplay;

  const gameEarnByDate =
    userAvailability.AvailabilityModel.GameEarnByDate &&
    DateTime.fromISO(userAvailability.AvailabilityModel.GameEarnByDate, {
      zone: "utc",
    });
  const redemptionEndDate = DateTime.fromISO(
    userAvailability.AvailabilityModel.RedemptionEndDate,
    { zone: "utc" }
  );

  const timeZone = DateTime.now().zone;

  const gameEarnByDateFormatted =
    gameEarnByDate && gameEarnByDate > DateTime.now()
      ? gameEarnByDate.setZone(timeZone).toLocaleString({
          locale: Localizer.CurrentCultureName,
          month: "short",
          year: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

  const redemptionEndDateFormatted =
    redemptionEndDate && redemptionEndDate > DateTime.now()
      ? redemptionEndDate.setZone(timeZone).toLocaleString({
          locale: Localizer.CurrentCultureName,
          month: "short",
          year: "numeric",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <>
      <li
        className={classNames(styles.rewardItem, {
          [styles.loyalty]: userAvailability.AvailabilityModel.IsLoyaltyReward,
        })}
      >
        <GridCol cols={12} className={styles.gridBlock}>
          <div className={styles.rewardContainer}>
            <img
              className={styles.rewardImage}
              alt={bungieRewardDisplay.RewardDisplayProperties.Name}
              src={bungieRewardDisplay.RewardDisplayProperties.ImagePath}
            />
            <div className={styles.rewardContent}>
              <RewardAvailability reward={props.reward.bungieRewardDisplay} />
              <RewardsTriumphsDisplay reward={bungieRewardDisplay} />
              <RewardsCollectibleDisplay reward={bungieRewardDisplay} />
              <h4 className={styles.sectionHeader}>
                {props.reward.bungieRewardDisplay.RewardDisplayProperties.Name}
              </h4>
              <p className={styles.rewardDescription}>
                {userAvailability.AvailabilityModel.OfferApplied &&
                userAvailability.AvailabilityModel.IsLoyaltyReward &&
                userAvailability.AvailabilityModel.HasOffer
                  ? rewardLoc.rewardAppliedText
                  : props.reward.bungieRewardDisplay.RewardDisplayProperties
                      .Description}
              </p>
              <ul className={styles.expirationDates}>
                {gameEarnByDateFormatted && (
                  <li className={styles.date}>
                    <strong>{rewardLoc.EarnBy}</strong>{" "}
                    <span>{gameEarnByDateFormatted}</span>
                  </li>
                )}
                {redemptionEndDateFormatted && (
                  <li className={styles.date}>
                    <strong>{rewardLoc.CodeGenerationExpires}</strong>{" "}
                    <span>{redemptionEndDateFormatted}</span>
                  </li>
                )}
              </ul>
              <RewardButtons reward={props.reward} />
            </div>
          </div>
        </GridCol>
      </li>
    </>
  );
};
