// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { Tokens } from "@Platform";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Icon } from "@UIKit/Controls/Icon";
import { BasicSize } from "@UIKit/UIKitUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React from "react";

interface RewardsTriumphsDisplayProps {
  reward: Tokens.BungieRewardDisplay;
}

export const RewardsTriumphsDisplay: React.FC<RewardsTriumphsDisplayProps> = (
  props
) => {
  const hasCustomDisplay = !!props.reward?.ObjectiveDisplayProperties;
  const requiredRecordsToUnlock =
    props.reward?.UserRewardAvailabilityModel?.AvailabilityModel
      ?.RecordDefinitions?.length > 0;

  if (!hasCustomDisplay && !requiredRecordsToUnlock) {
    return null;
  }

  return (
    <div
      className={classNames(styles.requiredTriumphs, {
        [styles.multiple]: hasCustomDisplay,
      })}
    >
      {hasCustomDisplay && (
        <TwoLineItem
          className={styles.twoLineItemTriumph}
          itemTitle={StringUtils.decodeHtmlEntities(
            props.reward.ObjectiveDisplayProperties.Name
          )}
          itemSubtitle={StringUtils.decodeHtmlEntities(
            props.reward.ObjectiveDisplayProperties.Description
          )}
          size={BasicSize.Large}
          icon={
            <IconCoin
              iconImageUrl={props.reward.ObjectiveDisplayProperties.ImagePath}
            />
          }
          normalWhiteSpace={true}
        />
      )}
      {!hasCustomDisplay &&
        requiredRecordsToUnlock &&
        props.reward.UserRewardAvailabilityModel.AvailabilityModel.RecordDefinitions.map(
          (record, index) => {
            return (
              <TwoLineItem
                key={`record-${index}`}
                className={styles.twoLineItemTriumph}
                itemTitle={StringUtils.decodeHtmlEntities(
                  record.displayProperties.name
                )}
                itemSubtitle={StringUtils.decodeHtmlEntities(
                  record.displayProperties.description
                )}
                icon={<IconCoin iconImageUrl={record.displayProperties.icon} />}
                size={BasicSize.Large}
                normalWhiteSpace={true}
              />
            );
          }
        )}
    </div>
  );
};
