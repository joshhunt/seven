// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { intersectObserver } from "@Boot/IntersectObserver";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const images = useCSWebpImages(
    useMemo(
      () => ({
        screenshots: props.thumbnails?.map((t) => t.image),
      }),
      [props.thumbnails]
    )
  );

  const [loadThumbBg, setLoadThumbBg] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    intersectObserver.observeLazyLoadImgEle(wrapperRef.current, setLoadThumbBg);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.flexWrapper, props.classes?.wrapper)}
    >
      {props.thumbnails?.map((t, i) => {
        let thumbBg = images.screenshots?.[i];
        thumbBg = UrlUtils.addQueryParam(thumbBg, "width", "700");

        return (
          <div
            className={classNames(
              styles.blockWrapper,
              props.classes?.thumbnailWrapper
            )}
            key={i}
          >
            <ClickableMediaThumbnail
              thumbnail={loadThumbBg ? thumbBg : undefined}
              singleOrAllScreenshots={images.screenshots}
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
