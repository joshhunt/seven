// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import * as React from "react";
import styles from "./MarketingTextBox.module.scss";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Responsive, IResponsiveState } from "@Boot/Responsive";

interface IMarketingTextBoxProps
  extends GlobalStateComponentProps<"responsive"> {
  title: React.ReactNode;
  content: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  numberOfBoxes: number;
}

interface IMarketingTextBoxState {
  responsive: IResponsiveState;
}

/**
 * MarketingTextBox - Replace this description
 *  *
 * @param {IMarketingTextBoxProps} props
 * @returns
 */
export class MarketingTextBoxInternal extends React.Component<
  IMarketingTextBoxProps,
  IMarketingTextBoxState
> {
  private readonly destroys: DestroyCallback[] = [];

  constructor(props: IMarketingTextBoxProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
  }

  public render() {
    const {
      title,
      content,
      borderColor,
      backgroundColor,
      titleColor,
      textColor,
      numberOfBoxes,
    } = this.props;

    return (
      <div
        style={{
          borderTop: `4px solid ${borderColor}`,
          backgroundColor,
        }}
        className={styles.box}
      >
        <div className={styles.boxTitle} style={{ color: titleColor }}>
          {title}
        </div>
        <div className={styles.boxContent} style={{ color: textColor }}>
          {content}
        </div>
      </div>
    );
  }
}
export const MarketingTextBox = withGlobalState(MarketingTextBoxInternal, [
  "responsive",
]);
