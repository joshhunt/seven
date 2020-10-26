// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinyHeader.module.scss";
import classNames from "classnames";

interface IDestinyHeaderProps {
  breadcrumbs: React.ReactNode[];
  separator: React.ReactNode;
  title?: React.ReactNode;
  textTransform?: any;
}

interface IDestinyHeaderState {}

/**
 * DestinyHeader - Reusable header with "//" and white divider between subtitle and title
 *  *
 * @param {IDestinyHeaderProps} props
 * @returns
 */
export class DestinyHeader extends React.Component<
  IDestinyHeaderProps,
  IDestinyHeaderState
> {
  constructor(props: IDestinyHeaderProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const cl = (bc: React.ReactNode) =>
      classNames({
        [styles.current]:
          this.props.breadcrumbs.indexOf(bc) ===
          this.props.breadcrumbs.length - 1,
      });

    return (
      <div
        className={styles.header}
        style={{ textTransform: this.props.textTransform }}
      >
        <div className={styles.crumbs}>
          {this.props.breadcrumbs.map((bc, i) => (
            <React.Fragment key={i}>
              <span className={cl(bc)}>{bc}</span>
              {i < this.props.breadcrumbs.length - 1 && (
                <span className={styles.separator}>{this.props.separator}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        {this.props.title && (
          <div className={styles.title}>{this.props.title}</div>
        )}
      </div>
    );
  }
}
