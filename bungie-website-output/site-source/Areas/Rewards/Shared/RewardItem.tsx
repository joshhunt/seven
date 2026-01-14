import { RewardAvailability } from "@Areas/Rewards/Shared/RewardAvailability";
import { RewardButtons } from "@Areas/Rewards/Shared/RewardButtons";
import { RewardsCollectibleDisplay } from "@Areas/Rewards/Shared/RewardsCollectibleDisplay";
import { RewardsTriumphsDisplay } from "@Areas/Rewards/Shared/RewardsTriumphsDisplay";
import { Localizer } from "@bungie/localization/Localizer";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import { ImEnlarge2 } from "@react-icons/all-files/im/ImEnlarge2";
import { Reward } from "../Rewards";
import styles from "./RewardItem.module.scss";

interface RewardItemProps {
  reward: Reward;
}

export const RewardItem: React.FC<RewardItemProps> = (props) => {
  if (!props.reward) {
    return null;
  }

  const rewardLoc = Localizer.BungieRewards;
  const userAvailability =
    props.reward.rewardDisplay?.UserRewardAvailabilityModel;
  const bungieRewardDisplay = props.reward.rewardDisplay;

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
          locale: LocalizerUtils.useAltChineseCultureString(
            Localizer.CurrentCultureName
          ),
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
          locale: LocalizerUtils.useAltChineseCultureString(
            Localizer.CurrentCultureName
          ),
          month: "short",
          year: "numeric",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const showRewardModal = () => {
    Modal.open(
      <img
        src={bungieRewardDisplay.RewardDisplayProperties.ImagePath}
        alt={bungieRewardDisplay.RewardDisplayProperties.Name}
      />
    );
  };

  return (
    <li
      className={classNames(styles.rewardItem, {
        [styles.loyalty]: userAvailability.AvailabilityModel.IsLoyaltyReward,
      })}
    >
      <div className={styles.gridBlock}>
        <div className={styles.rewardContainer}>
          <div className={styles.rewardImageContainer}>
            <img
              className={styles.rewardImage}
              alt={bungieRewardDisplay.RewardDisplayProperties.Name}
              src={bungieRewardDisplay.RewardDisplayProperties.ImagePath}
            />
            {!userAvailability.AvailabilityModel.IsLoyaltyReward && (
              <ImEnlarge2
                onClick={() => showRewardModal()}
                title={Localizer.Actions.ClickToEnlarge}
              />
            )}
          </div>
          <div className={styles.rewardContent}>
            <RewardAvailability reward={props.reward.rewardDisplay} />
            <RewardsTriumphsDisplay reward={bungieRewardDisplay} />
            <RewardsCollectibleDisplay reward={bungieRewardDisplay} />
            <h4 className={styles.sectionHeader}>
              {StringUtils.decodeHtmlEntities(
                props.reward.rewardDisplay.RewardDisplayProperties.Name
              )}
            </h4>
            <p className={styles.rewardDescription}>
              {userAvailability.AvailabilityModel.OfferApplied &&
              userAvailability.AvailabilityModel.IsLoyaltyReward &&
              userAvailability.AvailabilityModel.HasOffer
                ? rewardLoc.rewardAppliedText
                : StringUtils.decodeHtmlEntities(
                    props.reward.rewardDisplay.RewardDisplayProperties
                      .Description
                  )}
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
            <div className={styles.rewardButtonContainer}>
              <RewardButtons reward={props.reward} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
