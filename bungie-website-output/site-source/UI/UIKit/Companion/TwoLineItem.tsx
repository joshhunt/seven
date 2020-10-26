import { IFlairCoinProps } from "@UIKit/Companion/Coins/FlairCoin";
import { IIconCoinProps } from "@UIKit/Companion/Coins/IconCoin";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./TwoLineItem.module.scss";

interface ITwoLineItemProps extends React.HTMLProps<HTMLDivElement> {
  /** Item title */
  itemTitle: string;
  /** Item subtitle */
  itemSubtitle: string;
  /** Set to true if this should have a hover state */
  clickable?: boolean;
  /** Item size */
  size?: BasicSize;
  /** Item icon slot */
  icon?: React.ReactNode;
  /** Item flair slot */
  flair?: React.ReactNode;
}

interface ITwoLineItemState {}

/**
 * Two Line Item
 *  *
 * @param {ITwoLineItemProps} props
 * @returns
 */
export class TwoLineItem extends React.Component<
  ITwoLineItemProps,
  ITwoLineItemState
> {
  public render() {
    const {
      icon,
      itemTitle,
      itemSubtitle,
      flair,
      size,
      clickable,
      ...rest
    } = this.props;

    const classes = [styles.twoLineItem];

    if (size !== undefined) {
      classes.push(styles[`basicSize${BasicSize[size]}`]);
    }

    if (clickable) {
      classes.push(styles.clickable);
    }

    return (
      <div className={classNames(classes)} {...rest}>
        {icon && (
          <div className={styles.iconSlot}>
            <div className={styles.icon}>{icon}</div>
          </div>
        )}
        <div className={styles.textContent}>
          <div className={styles.title}>{itemTitle}</div>
          <div className={styles.subtitle}>{itemSubtitle}</div>
        </div>
        <div className={styles.flairSlot}>{flair}</div>
      </div>
    );
  }
}
