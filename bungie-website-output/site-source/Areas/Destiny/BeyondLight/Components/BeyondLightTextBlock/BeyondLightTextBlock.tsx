// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightTextBlock.module.scss";
import classNames from "classnames";

interface IBeyondLightTextBlock {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  alignment?: "center" | "right";
  videoProps?: string;
  reverseColumn?: boolean;
}

const TextBlock: React.FC<IBeyondLightTextBlock> = ({
  eyebrow,
  title,
  subtitle,
  reverseColumn,
  body,
  alignment,
  videoProps,
}) => {
  const containsVideo = videoProps
    ? styles.textContainerWithMedia
    : styles.textContainerNoMedia;

  return (
    <div
      className={classNames(containsVideo, styles[alignment])}
      style={{ paddingTop: reverseColumn ? "3rem" : null }}
    >
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      {title && <h2 className={styles.title}>{title}</h2>}
      <span className={styles.shortBorder} />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {body && <p className={styles.bodyText}>{body}</p>}
    </div>
  );
};

export default TextBlock;
