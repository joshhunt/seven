import { BasicSize } from "@UI/UIKit/UIKitUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./OneLineItem.module.scss";

interface IOneLineItemProps extends React.HTMLProps<HTMLDivElement> {
  /** Item title */
  itemTitle: React.ReactNode;
  /** Set to true if this should have a hover state */
  clickable?: boolean;
  /** Item size */
  size?: BasicSize;
  /** Item icon slot */
  icon?: React.ReactNode;
  /** Item flair slot */
  flair?: React.ReactNode;
}

interface IOneLineItemState {}

/**
 * One Line Item
 *  *
 * @param {IOneLineItemProps} props
 * @returns
 */
export class OneLineItem extends React.Component<
  IOneLineItemProps,
  IOneLineItemState
> {
  public render() {
    const { icon, itemTitle, flair, size, clickable, ...rest } = this.props;

    const classes = [styles.oneLineItem];

    if (size !== undefined) {
      classes.push(styles[`basicSize${BasicSize[size]}`]);
    }

    if (clickable || this.props.onClick) {
      classes.push(styles.clickable);
    }

    return (
      <div className={classNames(classes)} {...rest}>
        <div className={styles.iconSlot}>
          <div className={styles.icon}>{icon}</div>
        </div>
        <div className={styles.textContent}>
          <div className={styles.title}>{itemTitle}</div>
        </div>
        <div className={styles.flairSlot}>{flair}</div>
      </div>
    );
  }
}
