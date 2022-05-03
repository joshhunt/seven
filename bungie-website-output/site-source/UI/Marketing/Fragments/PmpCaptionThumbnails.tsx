// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import {
  ImageThumbBtn,
  ImageThumbProps,
  ImageVideoThumb,
} from "@UI/Marketing/ImageThumb";
import ImagePaginationModal, {
  getScreenshotPaginationData,
} from "@UIKit/Controls/Modal/ImagePaginationModal";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpCaptionThumbnails } from "../../../Generated/contentstack-types";
import styles from "./PmpCaptionThumbnails.module.scss";

type PmpCaptionThumbnailsProps = DataReference<
  "pmp_caption_thumbnails",
  BnetStackPmpCaptionThumbnails
> & {
  classes?: {
    root?: string;
    caption?: string;
    thumbnail?: string;
    thumbImg?: string;
  };
};

export const PmpCaptionThumbnails: React.FC<PmpCaptionThumbnailsProps> = (
  props
) => {
  const { data, classes } = props;

  const getThumbItem = (
    item: BnetStackPmpCaptionThumbnails["thumbnails"][number]
  ) => {
    return item?.video_thumb ?? item?.screenshot_thumb;
  };

  return (
    <div className={classNames(styles.thumbnailsFlexWrapper, classes?.root)}>
      {data?.thumbnails?.map((thumb, i) => {
        return (
          <div key={i} className={styles.thumbnailWrapper}>
            <PmpCaptionThumb
              thumbItem={thumb}
              allThumbs={data?.thumbnails}
              classes={{
                imageContainer: classNames(classes?.thumbnail),
                image: classNames(classes?.thumbImg),
              }}
            />
            <p className={classNames(styles.caption, classes?.caption)}>
              {getThumbItem(thumb)?.caption}
            </p>
          </div>
        );
      })}
    </div>
  );
};

interface PmpCaptionThumbnailProps {
  thumbItem: BnetStackPmpCaptionThumbnails["thumbnails"][number];
  allThumbs: BnetStackPmpCaptionThumbnails["thumbnails"];
  classes?: ImageThumbProps["classes"];
}

const PmpCaptionThumb: React.FC<PmpCaptionThumbnailProps> = (props) => {
  const { classes, thumbItem, allThumbs } = props;

  const { screenshot_thumb, video_thumb } = thumbItem;

  const handleImageThumbClick = (imgUrl: string) => {
    const { imgIndex, images } = getScreenshotPaginationData(
      allThumbs,
      imgUrl,
      (thumbObj: typeof thumbItem) =>
        thumbObj?.screenshot_thumb?.screenshot?.url
    );

    ImagePaginationModal.show({ imgIndex, images });
  };

  const thumbProps: ImageThumbProps = {
    image:
      screenshot_thumb?.thumbnail_optional_?.url ??
      screenshot_thumb?.screenshot?.url ??
      video_thumb?.thumbnail?.url,
    classes: {
      image: classNames(styles.thumbImg, classes?.image),
      imageContainer: classNames(styles.thumbnail, classes?.imageContainer),
    },
  };

  if (screenshot_thumb) {
    return (
      <ImageThumbBtn
        {...thumbProps}
        onClick={() => handleImageThumbClick(screenshot_thumb?.screenshot?.url)}
      />
    );
  } else if (video_thumb) {
    return (
      <ImageVideoThumb
        {...thumbProps}
        classes={{ ...thumbProps.classes, playIcon: styles.playIcon }}
        youtubeUrl={video_thumb?.youtube_url}
      />
    );
  } else {
    return null;
  }
};
