import { BasicSize } from "@UI/UIKit/UIKitUtils";
import classNames from "classnames";
import React, { ReactNode } from "react";
import styles from "./TwoLineItem.module.scss";

export interface ITwoLineItemProps extends React.HTMLProps<HTMLDivElement> {
  /** Item title */
  itemTitle: ReactNode;
  /** Item subtitle */
  itemSubtitle: ReactNode;
  /** Set to true if this should have a hover state */
  clickable?: boolean;
  /** Set subtitle whitespace to normal so that it will wrap */
  normalWhiteSpace?: boolean;
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
      normalWhiteSpace,
      flair,
      size,
      clickable,
      className,
      ...rest
    } = this.props;

    const classes = [styles.twoLineItem];

    if (typeof className !== "undefined") {
      classes.push(this.props.className);
    }

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
          <div
            className={classNames(styles.subtitle, {
              [styles.normalWhiteSpace]: normalWhiteSpace,
            })}
          >
            {itemSubtitle}
          </div>
        </div>
        <div className={styles.flairSlot}>{flair}</div>
      </div>
    );
  }
}
