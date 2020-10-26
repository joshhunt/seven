// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinyTooltip.module.scss";
import classNames from "classnames";
import { Tooltip } from "@UI/UIKit/Controls/Tooltip";

// Required props
interface IDestinyTooltipProps {
  /** Custom classname for the entire Destiny tooltip */
  className?: string;
  /** The title */
  title: React.ReactNode;
  /** Props for the entire header */
  headerProps?: {
    /** Class name for the header */
    className?: string;
    /** Class name for the title container */
    titleClassName?: string;
    /** Props for the icon */
    iconProps?: {
      /** If true, the icon will not show */
      hidden?: boolean;
      /** Children of the icon slot */
      children?: React.ReactNode;
      /** A URL for an image to show in the icon slot */
      backgroundImage?: string;
      /** A class name for the icon */
      className?: string;
    };
  };
  /** Props for the body content */
  bodyProps?: {
    /** Class name for the body */
    className?: string;
    /** Children that will render between the header and the body */
    childrenBefore?: React.ReactNode;
    /** Children that will render after the body */
    childrenAfter?: React.ReactNode;
  };
}

// Default props - these will have values set in DestinyTooltip.defaultProps
interface DefaultProps {}

type Props = IDestinyTooltipProps & DefaultProps;

interface IDestinyTooltipState {}

/**
 * DestinyTooltip - Replace this description
 *  *
 * @param {IDestinyTooltipProps} props
 * @returns
 */
export class DestinyTooltip extends React.Component<
  Props,
  IDestinyTooltipState
> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const {
      title,
      className,
      headerProps = {},
      bodyProps = {},
      children,
    } = this.props;

    const {
      className: headerClassName,
      titleClassName,
      iconProps = {},
    } = headerProps;

    const {
      hidden: iconHidden,
      children: iconChildren,
      backgroundImage: iconBackground,
      className: iconClassName,
    } = iconProps;

    const {
      className: bodyClassName,
      childrenAfter,
      childrenBefore,
    } = bodyProps;

    return (
      <div className={classNames(styles.destinyTooltip, className)}>
        <div className={classNames(styles.header, headerClassName)}>
          {!iconHidden && (
            <div
              className={classNames(styles.icon, iconClassName)}
              style={{
                backgroundImage: `url(${iconBackground})`,
              }}
            >
              {iconChildren}
            </div>
          )}
          <div className={classNames(styles.title, titleClassName)}>
            {title}
          </div>
        </div>
        {childrenBefore}
        <div className={classNames(styles.body, bodyClassName)}>{children}</div>
        {childrenAfter}
      </div>
    );
  }
}
