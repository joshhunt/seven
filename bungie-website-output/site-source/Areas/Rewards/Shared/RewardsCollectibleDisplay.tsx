// Created by atseng, 2022
// Copyright Bungie, Inc.
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Tokens } from "@Platform";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { BasicSize } from "@UIKit/UIKitUtils";
import classNames from "classnames";
import React from "react";

interface RewardsCollectibleDisplayProps {
  reward: Tokens.BungieRewardDisplay;
}

export const RewardsCollectibleDisplay: React.FC<RewardsCollectibleDisplayProps> = (
  props
) => {
  const hasCustomDisplay = !!props.reward?.ObjectiveDisplayProperties;

  const collectibles =
    props.reward?.UserRewardAvailabilityModel?.AvailabilityModel
      ?.CollectibleDefinitions;

  if (hasCustomDisplay || !collectibles || collectibles.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.requiredTriumphs, styles.multiple)}>
      {collectibles.map((collectible, index) => {
        const cName =
          collectible?.DestinyInventoryItemDefinition?.displayProperties
            ?.name ??
          collectible?.CollectibleDefinition?.displayProperties?.name;
        const cIcon =
          collectible?.DestinyInventoryItemDefinition?.displayProperties
            ?.icon ??
          collectible?.CollectibleDefinition?.displayProperties?.icon;

        return (
          <TwoLineItem
            key={`collectible-${index}`}
            itemTitle={cName}
            itemSubtitle={Localizer.BungieRewards.CollectibleGlobalDescription}
            size={BasicSize.Large}
            icon={<img src={cIcon} alt={cName} />}
            normalWhiteSpace={true}
          />
        );
      })}
    </div>
  );
};
