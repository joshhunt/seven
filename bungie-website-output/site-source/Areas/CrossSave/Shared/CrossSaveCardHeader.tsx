// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CrossSaveCardHeader.module.scss";

interface ICrossSaveCardHeaderProps {}

interface ICrossSaveCardHeaderState {}

/**
 * CrossSaveCardHeader - Used to create header for CrossSaveCard
 *  *
 * @param {ICrossSaveCardHeaderProps} props
 * @returns
 */
export class CrossSaveCardHeader extends React.Component<
  ICrossSaveCardHeaderProps,
  ICrossSaveCardHeaderState
> {
  constructor(props: ICrossSaveCardHeaderProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { children } = this.props;

    return <div className={styles.header}>{children}</div>;
  }
}
