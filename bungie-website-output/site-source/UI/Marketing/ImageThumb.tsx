// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Anchor, IAnchorProps } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import YoutubeModal, {
  IYoutubeModalBaseProps,
} from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import styles from "./ImageThumb.module.scss";

type BaseImageThumbProps<TClasses extends { [key: string]: string } = {}> = {
  image: string;
  classes?: {
    imageContainer?: string;
    image?: string;
  } & TClasses;
  style?: React.CSSProperties;
};

export type ImageThumbProps = BaseImageThumbProps;

/* Renders a single image at a maintained aspect ratio with optional children to be rendered within the image */
export const ImageThumb: React.FC<PropsWithChildren<ImageThumbProps>> = (
  props
) => {
  const { classes, image, children, style } = props;

  const getImageUrl = (img: string | undefined) => {
    return img ? `url(${img})` : undefined;
  };

  return (
    <div
      className={classNames(styles.imageContainer, classes?.imageContainer)}
      style={style}
    >
      <div
        style={{ backgroundImage: getImageUrl(image) }}
        className={classNames(styles.image, classes?.image)}
      />
      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

type ImageVideoThumbProps = BaseImageThumbProps<{ playIcon?: string }> &
  IYoutubeModalBaseProps & {};

/* Renders <ImageThumbBtn> with a play icon and functionality to open a youtube video */
export const ImageVideoThumb: React.FC<PropsWithChildren<
  ImageVideoThumbProps
>> = (props) => {
  const {
    youtubeUrl,
    videoId,
    playlistId,
    classes,
    children,
    ...restProps
  } = props;
  // pull out play icon class from classes so rest can be passed in to <ImageThumbBtn/>
  const { playIcon, ...restClasses } = classes ?? {};

  const handleBtnClick = () => {
    YoutubeModal.show({ playlistId, youtubeUrl, videoId });
  };

  return (
    <ImageThumbBtn
      {...restProps}
      classes={{ ...restClasses }}
      onClick={handleBtnClick}
    >
      <Icon
        className={classNames(styles.playIcon, playIcon)}
        iconType={"material"}
        iconName={"play_arrow"}
      />
      <div className={styles.childrenContainer}>{children}</div>
    </ImageThumbBtn>
  );
};

type ImageThumbBtnProps = BaseImageThumbProps & {
  onClick?: () => void;
};

/* Renders <ImageThumb> inside <button> wrapper and provides button props & functionality */
export const ImageThumbBtn: React.FC<PropsWithChildren<ImageThumbBtnProps>> = (
  props
) => {
  const { classes, onClick, style, ...restProps } = props;
  // pull out imageContainer class so it can be appended to new <button> wrapper
  const { imageContainer, ...restClasses } = classes ?? {};

  return (
    <button
      className={classNames(styles.imgBtnWrapper, imageContainer)}
      onClick={onClick}
      style={style}
    >
      <ImageThumb {...restProps} classes={{ ...restClasses }} />
    </button>
  );
};

type ImageAnchorProps = BaseImageThumbProps & IAnchorProps & {};

/* Renders <ImageThumb> inside <Anchor> wrapper and provides Anchor props & functionality */
export const ImageAnchor: React.FC<ImageAnchorProps> = (props) => {
  const { url, legacy, classes, sameTab, style, ...restProps } = props;
  const { imageContainer, ...restClasses } = classes ?? {};

  return (
    <Anchor
      url={url}
      legacy={legacy}
      sameTab={sameTab}
      className={classNames(styles.imgAnchor, imageContainer)}
      style={style}
    >
      <ImageThumb {...restProps} classes={{ ...restClasses }} />
    </Anchor>
  );
};
