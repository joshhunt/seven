// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  bgImage,
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import styles from "./LightfallSectionHeader.module.scss";

interface LightfallSectionHeaderProps {
  largeHeading?: string;
  heading: string;
  blurb: string;
  children?: React.ReactNode;
  withDivider?: boolean;
  /** Alignment of content, defaulting to 'left' */
  alignment?: "left" | "center" | "right";
  /** Image to use as background image for large heading */
  textBg?: string;
  classes?: {
    largeHeading?: string;
    root?: string;
  };
}

export const LightfallSectionHeader: React.FC<LightfallSectionHeaderProps> = (
  props
) => {
  const {
    largeHeading,
    heading,
    blurb,
    alignment,
    withDivider,
    textBg,
    classes,
    children,
  } = props;

  const headingBg = textBg && bgImage(textBg);

  return (
    <div
      className={classNames(
        styles.header,
        styles[alignment ?? "left"],
        classes?.root
      )}
    >
      {largeHeading && textBg && (
        <h2
          className={classNames(styles.floatingHeading, classes?.largeHeading)}
          style={{ backgroundImage: textBg ? `${headingBg}` : undefined }}
        >
          {largeHeading}
        </h2>
      )}
      <div className={styles.textWrapper}>
        <h2 className={styles.heading}>
          <SafelySetInnerHTML html={heading} />
        </h2>
        {children}
        {withDivider && <div className={styles.divider} />}
        <p className={styles.blurb}>
          <SafelySetInnerHTML html={blurb} />
        </p>
      </div>
    </div>
  );
};
