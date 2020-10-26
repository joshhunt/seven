// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { ContentAlignments } from "@UI/UIKit/Layout/MarketingContentBlock";
import styles from "./MarketingTitles.module.scss";
import classNames from "classnames";

interface IMarketingTitlesProps {
  /** Small, underlined title at the top of the text section */
  smallTitle?: React.ReactNode;
  /** Title under the small title, it is medium for left- or right-aligned content and large for centered content */
  sectionTitle: React.ReactNode;
  /** Explanatory callout under section title */
  callout?: React.ReactNode;
  alignment: ContentAlignments;
  splitScreen?: boolean;
}

interface IMarketingTitlesState {}

/**
 * MarketingTitles - Replace this description
 *  *
 * @param {IMarketingTitlesProps} props
 * @returns
 */
export class MarketingTitles extends React.Component<
  IMarketingTitlesProps,
  IMarketingTitlesState
> {
  constructor(props: IMarketingTitlesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const {
      smallTitle,
      sectionTitle,
      callout,
      alignment,
      splitScreen,
    } = this.props;

    return (
      <div
        className={classNames(
          styles[alignment],
          { [styles.splitScreen]: splitScreen },
          styles.titlesContainer
        )}
      >
        {smallTitle !== "" && (
          <div className={styles.smallTitle}>{smallTitle}</div>
        )}
        <div className={styles.sectionTitle}>{sectionTitle}</div>
        {callout && <div className={styles.callout}>{callout}</div>}
      </div>
    );
  }
}
