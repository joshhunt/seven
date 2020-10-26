// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./MarketingBoxContainer.module.scss";
import { MarketingTextBox } from "./MarketingTextBox";

interface IMarketingBoxContainerProps {
  boxes: { title: React.ReactNode; content: React.ReactNode }[];
  borderColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
}

interface IMarketingBoxContainerState {}

/**
 * MarketingBoxContainer - Replace this description
 *  *
 * @param {IMarketingBoxContainerProps} props
 * @returns
 */
export class MarketingBoxContainer extends React.Component<
  IMarketingBoxContainerProps,
  IMarketingBoxContainerState
> {
  constructor(props: IMarketingBoxContainerProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const {
      boxes,
      borderColor,
      backgroundColor,
      titleColor,
      textColor,
    } = this.props;

    return (
      <div className={styles.boxContainer}>
        {boxes.map((box, i) => {
          return (
            <MarketingTextBox
              key={i}
              title={box.title}
              content={box.content}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
              titleColor={titleColor}
              textColor={textColor}
              numberOfBoxes={boxes.length}
            />
          );
        })}
      </div>
    );
  }
}
