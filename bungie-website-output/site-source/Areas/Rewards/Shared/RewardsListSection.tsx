// Created by atseng, 2022
// Copyright Bungie, Inc.

import { IReward } from "@Areas/Rewards/Rewards";
import { RewardItem } from "@Areas/Rewards/Shared/RewardItem";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import React from "react";

interface RewardsListSectionProps {
  rewardsList: IReward[];
  title: string;
  keyString: string;
}

export const RewardsListSection: React.FC<RewardsListSectionProps> = (
  props
) => {
  if (props.rewardsList?.length) {
    return (
      <GridCol cols={12}>
        <h3 className={styles.sectionHeader}>{props.title}</h3>
        <ul>
          {props.rewardsList.map((reward, index) => {
            if (reward) {
              return (
                <RewardItem
                  key={`${props.keyString}${index}`}
                  reward={reward}
                />
              );
            }
          })}
        </ul>
      </GridCol>
    );
  }

  return null;
};
