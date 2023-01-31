// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import {
  bgImage,
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import styles from "./LightfallSectionHeader.module.scss";

interface LightfallSectionHeaderProps extends React.HTMLProps<HTMLDivElement> {
  heading: string;
  blurb?: string;
  dividerColor?: string;
  classes?: {
    largeHeading?: string;
    title?: string;
    root?: string;
    divider?: string;
    content?: string;
  };
}

export const LightfallSectionHeader: React.FC<LightfallSectionHeaderProps> = (
  props
) => {
  const { heading, blurb, dividerColor, classes, children } = props;

  return (
    <div className={classNames([styles.root, classes?.root])}>
      <h3
        className={classNames([styles.title, classes?.title])}
        dangerouslySetInnerHTML={sanitizeHTML(heading)}
      />
      {dividerColor ? (
        <div
          className={classNames([styles.divider, classes?.divider])}
          style={{ backgroundColor: dividerColor }}
        />
      ) : null}
      <div className={classNames([styles.content, classes?.content])}>
        {blurb ? (
          <p className={styles.blurb}>
            <SafelySetInnerHTML html={blurb} />
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
};
