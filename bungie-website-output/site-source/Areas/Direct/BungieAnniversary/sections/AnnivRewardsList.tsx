// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useState } from "react";
import styles from "./AnnivRewardsList.module.scss";

interface AnnivRewardsListProps {
  oddRowBgColor: string;
  evenRowBgColor: string;
  logo: string;
  rewardGroups: {
    groupName: string;
    isFree: boolean;
    rows: {
      reward: string;
      isFree: boolean;
    }[];
  }[];
  packOwnerHeading: string;
  freeForAllHeading: string;
}

export const AnnivRewardsList: React.FC<AnnivRewardsListProps> = (props) => {
  return (
    <>
      <div className={styles.seasonRewardsList}>
        <div className={styles.rewardsHeadingRow}>
          <div className={styles.imgWrapper}>
            <img src={props.logo} />
          </div>
          <h3>{props.packOwnerHeading}</h3>
          <h3>{props.freeForAllHeading}</h3>
        </div>
        {props.rewardGroups?.map((group, i) => {
          return (
            <>
              <RewardListRow
                key={i}
                isFree={group.isFree}
                rewardName={group.groupName}
                isGroupHeadingRow
              />
              {group.rows.map((row, j) => {
                return (
                  <RewardListRow
                    key={j}
                    isFree={row.isFree}
                    rewardName={row.reward}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
};

interface IRewardListRow {
  isFree: boolean;
  rewardName: string;
  isGroupHeadingRow?: boolean;
}

const RewardListRow: React.FC<IRewardListRow> = (props) => {
  return (
    <div className={styles.rewardRow}>
      <div className={props.isGroupHeadingRow && styles.rewardGroupHeading}>
        {props.rewardName}
      </div>
      <div>
        <Icon
          iconName={"done"}
          iconType={"material"}
          className={styles.checkMark}
        />
      </div>
      <div>
        {props.isFree ? (
          <Icon
            iconName={"done"}
            iconType={"material"}
            className={styles.checkMark}
          />
        ) : null}
      </div>
    </div>
  );
};
