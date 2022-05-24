// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React, { useCallback } from "react";
import { BnetStackPmpRewardsList } from "../../../../Generated/contentstack-types";
import styles from "./PmpRewardsList.module.scss";

type PmpRewardsListProps = DataReference<
  "pmp_rewards_list",
  BnetStackPmpRewardsList
> & {
  classes?: {
    root?: string;
    list?: string;
    disclaimer?: string;
    row?: string;
  };
};

export const PmpRewardsList: React.FC<PmpRewardsListProps> = (props) => {
  const { data, classes } = props;

  const CheckMarkIcon = useCallback(
    () => (
      <Icon
        iconName={"done"}
        iconType={"material"}
        className={styles.checkMark}
      />
    ),
    []
  );

  return (
    <div className={classNames(styles.outerWrapper, classes?.root)}>
      <div className={classNames(styles.list, classes?.list)}>
        <div className={styles.rewardsHeadingRow}>
          <div className={styles.imgWrapper}>
            <img src={data?.logo_icon?.url} />
          </div>
          <h3>{data?.column_two_heading}</h3>
          <h3>{data?.column_three_heading}</h3>
        </div>
        {data?.reward_rows?.map(({ Row: row }, i) => {
          const isEven = i % 2 === 0;

          const rowBgStyle: React.CSSProperties = {
            backgroundColor: isEven
              ? data?.even_row_color
              : data?.odd_row_color,
          };

          return (
            <div
              className={classNames(styles.rewardRow, classes?.row)}
              key={i}
              style={rowBgStyle}
            >
              <div>{row?.title}</div>
              <div>
                {row?.col_two_text || (row?.col_two_check && <CheckMarkIcon />)}
              </div>
              <div>
                {row?.col_three_text ||
                  (row?.col_three_check && <CheckMarkIcon />)}
              </div>
            </div>
          );
        })}
      </div>
      <p className={classNames(styles.disclaimer, classes?.disclaimer)}>
        {data?.disclaimer}
      </p>
    </div>
  );
};
