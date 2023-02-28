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
import { BnetStackPmpInfoThumbnailGroup } from "../../../Generated/contentstack-types";
import styles from "./PmpInfoThumbnailGroup.module.scss";

type PmpInfoThumbnailGroupProps = DataReference<
  "pmp_info_thumbnail_group",
  BnetStackPmpInfoThumbnailGroup
> & {
  classes?: {
    root?: string;
    thumbBlockWrapper?: string;
    thumbnail?: string;
    thumbBg?: string;
    caption?: string;
    heading?: string;
    blurb?: string;
  };
};

type PmpInfoThumbnailGroupItem = PmpInfoThumbnailGroupProps["data"]["thumbnail_blocks"][number];

export const PmpInfoThumbnailGroup: React.FC<PmpInfoThumbnailGroupProps> = (
  props
) => {
  const { data, classes } = props;

  const { thumbnail_blocks } = data ?? {};

  return (
    <>
      {data && (
        <div className={classNames(styles.flexWrapper, classes?.root)}>
          {thumbnail_blocks?.map((t, i) => {
            // TODO: v-ahipp needs to update the types so caption is available
            // @ts-ignore
            const { heading, caption, blurb } = getThumbBlockItem(t);

            return (
              <div
                key={i}
                className={classNames(
                  styles.blockWrapper,
                  classes?.thumbBlockWrapper
                )}
              >
                {caption ? (
                  <p className={classNames(styles.caption, classes?.caption)}>
                    {caption}
                  </p>
                ) : null}
                <InfoBlockThumbnail
                  thumbItem={t}
                  allImageData={thumbnail_blocks}
                  classes={{
                    thumbBg: classes?.thumbBg,
                    thumbnail: classes?.thumbnail,
                  }}
                />
                {heading ? (
                  <p className={classNames(styles.heading, classes?.heading)}>
                    {heading}
                  </p>
                ) : null}
                {blurb ? (
                  <p className={classNames(styles.blurb, classes?.blurb)}>
                    {blurb}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const getThumbBlockItem = (item: PmpInfoThumbnailGroupItem) => {
  return item?.screenshot_thumb ?? item?.video_thumb;
};

type InfoBlockThumbnailProps = {
  thumbItem: PmpInfoThumbnailGroupItem;
  allImageData: PmpInfoThumbnailGroupItem[];
  classes?: {
    thumbBg?: string;
    thumbnail?: string;
  };
};

/* Renders appropriate thumbnail based on type of modal thumbnail opens on click */
const InfoBlockThumbnail: React.FC<InfoBlockThumbnailProps> = (props) => {
  const { thumbItem, allImageData, classes } = props;
  const { screenshot_thumb, video_thumb } = thumbItem;

  const imgModalData = getScreenshotPaginationData(
    allImageData,
    screenshot_thumb?.screenshot?.url,
    (item: PmpInfoThumbnailGroupItem) => item?.screenshot_thumb?.screenshot?.url
  );

  const handleScreenshotThumbClick = () => {
    ImagePaginationModal.show(imgModalData);
  };

  const thumbProps: ImageThumbProps = {
    classes: {
      image: classNames([styles.thumbBg, classes?.thumbBg]),
      imageContainer: classNames([styles.thumbnail, classes?.thumbnail]),
    },
    image: getThumbBlockItem(thumbItem)?.thumbnail?.url,
  };

  if (screenshot_thumb) {
    return (
      <ImageThumbBtn {...thumbProps} onClick={handleScreenshotThumbClick} />
    );
  } else if (video_thumb) {
    return (
      <ImageVideoThumb {...thumbProps} youtubeUrl={video_thumb?.youtube_url} />
    );
  }
};
