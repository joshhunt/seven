// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./SeasonPassRewardsList.module.scss";

interface SeasonPassRewardsListProps {
  data: BnetStackSeasonOfTheRisen["rewards_section"]["rewards_table"];
  logo: string;
}

export const SeasonPassRewardsList: React.FC<SeasonPassRewardsListProps> = (
  props
) => {
  const { data, logo } = props;

  return (
    <>
      <div className={styles.seasonRewardsList}>
        <div className={styles.rewardsHeadingRow}>
          <div className={styles.imgWrapper}>
            <img src={logo} />
          </div>
          <h3>{Localizer.Destiny.SeasonFeaturesListHeadingMid}</h3>
          <h3>{Localizer.Destiny.SeasonFeaturesListHeadingRight}</h3>
        </div>
        {data?.row.map((row, i) => {
          return (
            <div className={styles.rewardRow} key={i}>
              <div>{row.name}</div>
              <div>
                {row.owners_col_text ? (
                  row.owners_col_text
                ) : (
                  <Icon
                    iconName={"done"}
                    iconType={"material"}
                    className={styles.checkMark}
                  />
                )}
              </div>
              <div>
                {row.free_col_text
                  ? row.free_col_text
                  : row.is_free && (
                      <Icon
                        iconName={"done"}
                        iconType={"material"}
                        className={styles.checkMark}
                      />
                    )}
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.disclaimer}>{data?.disclaimer}</p>
    </>
  );
};
