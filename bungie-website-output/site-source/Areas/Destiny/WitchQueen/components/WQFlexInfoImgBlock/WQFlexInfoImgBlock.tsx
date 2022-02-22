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
  videoId?: string;
  //alt style show all boxes in a row like clickable thumbnails but has a text heading and blurb and has square-sized thumbs
  isAltStyle: boolean;
}

export const WQFlexInfoImgBlock: React.FC<WQFlexInfoImgBlockProps> = (
  props
) => {
  const wrapperStyles: React.CSSProperties =
    props.direction === "reverse" && !props.isAltStyle
      ? { flexDirection: "row-reverse" }
      : {};

  const wrapperClassName = props.isAltStyle
    ? styles.flexInfoImgBlockOneLine
    : styles.flexInfoImgBlock;

  return (
    <div className={wrapperClassName} style={wrapperStyles}>
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
        screenshotIndex={!props.videoId ? props.screenshotIndex : undefined}
        videoId={props.videoId}
        caption={props.caption}
      />
    </div>
  );
};
