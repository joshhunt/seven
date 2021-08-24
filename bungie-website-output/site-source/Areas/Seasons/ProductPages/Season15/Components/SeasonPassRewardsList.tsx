// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useState } from "react";
import styles from "./SeasonPassRewardsList.module.scss";

interface SeasonPassRewardsListProps {
  loc: any;
  oddRowBgColor: string;
  evenRowBgColor: string;
  numberOfRows: number;
  logo: string;
}

export const SeasonPassRewardsList: React.FC<SeasonPassRewardsListProps> = (
  props
) => {
  const [tableData, setTableData] = useState(props.loc);

  return (
    <>
      <div className={styles.seasonRewardsList}>
        <div className={styles.rewardsHeadingRow}>
          <div className={styles.imgWrapper}>
            <img src={props.logo} />
          </div>
          <h3>{Localizer.Destiny.SeasonFeaturesListHeadingMid}</h3>
          <h3>{Localizer.Destiny.SeasonFeaturesListHeadingRight}</h3>
        </div>
        {tableData &&
          Array(Math.floor(props.numberOfRows))
            .fill(0)
            .map((_, i) => {
              const row = i + 1;

              const leftCell = tableData[`row${row}col1`];
              const midCell = tableData[`row${row}col2`];
              const rightCell = tableData[`row${row}col3`];

              return (
                <div
                  className={styles.rewardRow}
                  key={row}
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? props.evenRowBgColor : props.oddRowBgColor,
                  }}
                >
                  <div>{leftCell}</div>
                  <div>
                    {midCell === "CHECK" ? (
                      <Icon
                        iconName={"done"}
                        iconType={"material"}
                        className={styles.checkMark}
                        style={{ fontSize: "2rem" }}
                      />
                    ) : (
                      midCell
                    )}
                  </div>
                  <div>
                    {rightCell === "CHECK" ? (
                      <Icon
                        iconName={"done"}
                        iconType={"material"}
                        className={styles.checkMark}
                        style={{ fontSize: "2rem" }}
                      />
                    ) : (
                      rightCell
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      <p className={styles.disclaimer}>{tableData.Disclaimer}</p>
    </>
  );
};
