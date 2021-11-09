// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Icon } from "@UIKit/Controls/Icon";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React from "react";
import styles from "./ClickableMediaThumbnail.module.scss";

export interface ClickableMediaThumbnailProps {
  thumbnail: string;
  videoId?: string;
  /* either the single screenshot to open in a lightbox or all screenshots the user can paginate through */
  singleOrAllScreenshots?: string | string[];
  /* index of screenshot to open in a lightbox when clicked */
  screenshotIndex?: number;
  onClick?: () => void;
  /* enables shade across bottom of btn */
  showBottomShade?: boolean;
  classes?: {
    btnWrapper?: string;
    btnBg?: string;
    playIcon?: string;
    btnBottomShade?: string;
    contentWrapper?: string;
  };
  showShadowBehindPlayIcon?: boolean;
  href?: string;
  analyticsId?: string;
}

export const ClickableMediaThumbnail: React.FC<ClickableMediaThumbnailProps> = (
  props
) => {
  const {
    videoId,
    singleOrAllScreenshots,
    screenshotIndex,
    onClick,
    classes,
    showBottomShade,
    thumbnail,
    showShadowBehindPlayIcon,
  } = props;
  const screenshotsArray = Array.isArray(singleOrAllScreenshots)
    ? singleOrAllScreenshots
    : [singleOrAllScreenshots];

  const handleBtnClick = () => {
    onClick ? onClick() : showMedia();
  };

  const showImage = () => {
    if (singleOrAllScreenshots) {
      ImagePaginationModal.show({
        images: screenshotsArray,
        imgIndex: screenshotIndex ?? 0,
      });
    }
  };

  const showMedia = () => {
    videoId ? YoutubeModal.show({ videoId }) : showImage();
  };

  const btnBgImg = thumbnail && `url(${thumbnail})`;

  const innerContent = (
    <>
      <div
        className={classNames(styles.btnBg, classes?.btnBg)}
        style={{ backgroundImage: btnBgImg }}
      />

      <div
        className={classNames(styles.contentWrapper, classes?.contentWrapper)}
      >
        {videoId && (
          <Icon
            className={classNames(styles.playIcon, classes?.playIcon, {
              [styles.shadow]: showShadowBehindPlayIcon,
            })}
            iconType={"material"}
            iconName={"play_arrow"}
          />
        )}

        {props.children}
      </div>

      {showBottomShade && (
        <div
          className={classNames(styles.bottomShade, classes?.btnBottomShade)}
        />
      )}
    </>
  );

  const btnAttributes = {
    href: props.href,
    className: classNames(styles.mediaBtn, classes?.btnWrapper),
    onClick: !props.href
      ? handleBtnClick
      : () => {
          return;
        },
    ["data-analytics-id"]: props.analyticsId,
  };

  return props.href ? (
    <a {...btnAttributes}>{innerContent}</a>
  ) : (
    <div {...btnAttributes}>{innerContent}</div>
  );
};
