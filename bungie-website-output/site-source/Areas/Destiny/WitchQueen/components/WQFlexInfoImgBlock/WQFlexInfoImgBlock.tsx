// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { WQClickableImg } from "@Areas/Destiny/WitchQueen/components/WQClickableImg/WQClickableImg";
import classNames from "classnames";
import React from "react";
import styles from "./WQFlexInfoImgBlock.module.scss";

interface WQFlexInfoImgBlockProps {
  blurb: string;
  blurbHeading: string;
  thumbnail: string;
  screenshotsInSection: string[];
  screenshotIndex: number;
  direction: "normal" | "reverse";
  caption: string;
}

export const WQFlexInfoImgBlock: React.FC<WQFlexInfoImgBlockProps> = (
  props
) => {
  const wrapperStyles: React.CSSProperties =
    props.direction === "reverse" ? { flexDirection: "row-reverse" } : {};

  return (
    <div className={styles.flexInfoImgBlock} style={wrapperStyles}>
      <div
        className={classNames(styles.blurbWrapper, {
          [styles.reversed]: props.direction === "reverse",
        })}
      >
        <p className={styles.blurbHeading}>{props.blurbHeading}</p>
        <p className={styles.blurb}>{props.blurb}</p>
      </div>
      <WQClickableImg
        classes={{
          root: styles.imgOuterWrapper,
          imgWrapper: styles.imgWrapper,
          img: styles.img,
        }}
        thumbnail={props.thumbnail}
        screenshots={props.screenshotsInSection}
        screenshotIndex={props.screenshotIndex}
        caption={props.caption}
      />
    </div>
  );
};
