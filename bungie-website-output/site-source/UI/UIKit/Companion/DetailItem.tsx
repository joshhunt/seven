// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { BasicSize } from "../UIKitUtils";
import classNames from "classnames";
import styles from "./DetailItem.module.scss";

interface IDetailItemProps {
  iconCoin?: React.ReactNode;
  flairCoin?: React.ReactNode;
  detailCoin?: React.ReactNode;
  size?: BasicSize;
  title?: string;
  subtitle?: string;
  className?: string;
  /** Set subtitle whitespace to normal so that it will wrap */
  normalWhiteSpace?: boolean;
}

/**
 * DetailItem - Replace this description
 *  *
 * @param {IDetailItemProps} props
 * @returns
 */
export const DetailItem: React.FC<IDetailItemProps> = (props) => {
  return (
    <div
      className={classNames(styles.detailItem, {
        [props.className]: props.className,
      })}
    >
      {props.iconCoin && (
        <div className={styles.iconSlot}>
          <div className={styles.icon}>{props.iconCoin}</div>
        </div>
      )}

      <div className={styles.textContent}>
        <div className={styles.topContent}>
          <div className={styles.innerTextContent}>
            <div className={styles.title}>{props.title}</div>
            <div
              className={classNames(styles.subtitle, {
                [styles.normalWhiteSpace]: props.normalWhiteSpace,
              })}
            >
              {props.subtitle}
            </div>
          </div>
          {props.flairCoin && (
            <div className={styles.flairSlot}>{props.flairCoin}</div>
          )}
        </div>
        {props.detailCoin && (
          <div className={styles.detailSlot}>{props.detailCoin}</div>
        )}
      </div>
    </div>
  );
};
