// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import classNames from "classnames";
import React from "react";
import styles from "./FreeTripleImageSet.module.scss";

interface FreeTripleImageSetProps {
  thumbnails: {
    image: string;
    heading?: string;
    blurb?: string;
  }[];
  classes?: {
    wrapper?: string;
    thumbnail?: string;
    thumbnailWrapper?: string;
  };
}

export const FreeTripleImageSet: React.FC<FreeTripleImageSetProps> = (
  props
) => {
  const screenshots = props.thumbnails?.map((t) => t.image);

  return (
    <div className={classNames(styles.flexWrapper, props.classes?.wrapper)}>
      {props.thumbnails?.map((t, i) => {
        return (
          <div
            className={classNames(
              styles.blockWrapper,
              props.classes?.thumbnailWrapper
            )}
            key={i}
          >
            <ClickableMediaThumbnail
              thumbnail={`${t.image}?width=700`}
              singleOrAllScreenshots={screenshots}
              screenshotIndex={i}
              classes={{
                btnWrapper: classNames(
                  styles.thumbnail,
                  props.classes?.thumbnail
                ),
                btnBg: styles.btnBg,
              }}
              showBottomShade
            />
            {(t.heading || t.blurb) && (
              <>
                <p className={styles.heading}>{t.heading}</p>
                <p className={styles.blurb}>{t.blurb}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
