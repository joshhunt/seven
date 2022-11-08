// Created by atseng, 2022
// Copyright Bungie, Inc.

import classNames from "classnames";
import React from "react";
import { Localizer } from "@bungie/localization/Localizer";
import { AiFillCheckSquare } from "@react-icons/all-files/ai/AiFillCheckSquare";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  progressToTotal: number;
  total: number;
  isCompact: boolean;
  showBarWhenComplete: boolean;
  progressPercent: number;
  showText: boolean;
  description: string;
  customText: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const isComplete = props.progressToTotal >= props.total;
  const legendLoc = Localizer.Legend;

  return (
    <div
      className={classNames(styles.progressBar, {
        [styles.complete]: isComplete,
        [styles.compact]: props.isCompact,
      })}
    >
      {!isComplete || props.showBarWhenComplete ? (
        <div
          className={styles.barFill}
          style={{ width: `${props.progressPercent}%` }}
        />
      ) : (
        <div className={styles.complete}>
          <AiFillCheckSquare />
          {legendLoc.Completed}
        </div>
      )}
      {props.showText && !isComplete && (
        <div className={styles.barText}>
          <span className={styles.description}>{props.description}</span>
          {props.customText && props.customText.length && (
            <>
              {isComplete && <AiFillCheckSquare />}
              {props.customText}
            </>
          )}
          {props.total > 0 &&
            (!props.customText ||
              (props.customText && props.customText.length < 1)) && (
              <text>{`${props.progressToTotal} / ${props.total}`}</text>
            )}
        </div>
      )}
    </div>
  );
};
