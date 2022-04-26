// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ImageThumbBtn,
  ImageThumbProps,
  ImageVideoThumb,
} from "@UI/Marketing/ImageThumb";
import ImagePaginationModal, {
  getScreenshotPaginationData,
} from "@UIKit/Controls/Modal/ImagePaginationModal";
import React from "react";
import { BnetStackPmpCallout } from "../../../Generated/contentstack-types";
import styles from "./PmpCallout.module.scss";

type PmpCalloutThumbItem = BnetStackPmpCallout["thumbnails"][number];

type PmpCalloutProps = DataReference<"pmp_callout", BnetStackPmpCallout> & {};

export const PmpCallout: React.FC<PmpCalloutProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data } = props;

  const getThumbnail = (thumbItem: PmpCalloutThumbItem | undefined) => {
    const { Image_Thumb, Video_Thumb } = thumbItem ?? {};

    return (
      Image_Thumb?.thumbnail_optional_?.url ??
      Image_Thumb?.image?.url ??
      Video_Thumb?.thumbnail?.url
    );
  };

  const getBgImage = (img: { url?: string }) => {
    return img?.url ? `url(${img?.url})` : undefined;
  };

  const {
    blurb,
    thumbnails,
    heading,
    bg_color,
    desktop_bg,
    mobile_bg,
    thumb_border_color,
  } = data ?? {};

  const handleImageThumbClick = (img?: string) => {
    const { imgIndex, images } = getScreenshotPaginationData(
      thumbnails,
      img,
      (thumb: PmpCalloutThumbItem) => thumb?.Image_Thumb?.image?.url
    );

    ImagePaginationModal.show({ imgIndex, images });
  };

  const bgImg = getBgImage(mobile ? mobile_bg : desktop_bg);

  return (
    <div
      className={styles.callout}
      style={{ backgroundImage: bgImg, backgroundColor: bg_color }}
    >
      <div className={styles.textWrapper}>
        <h3 className={styles.heading}>{heading}</h3>
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(blurb)}
        />
      </div>
      <div className={styles.thumbsWrapper}>
        {thumbnails?.map((thumb, i) => {
          const thumbProps: ImageThumbProps = {
            image: getThumbnail(thumb),
            classes: {
              imageContainer: styles.thumb,
              image: styles.thumbBg,
            },
            style: { borderColor: thumb_border_color },
          };

          if (thumb?.Image_Thumb) {
            return (
              <ImageThumbBtn
                {...thumbProps}
                key={i}
                onClick={() =>
                  handleImageThumbClick(thumb?.Image_Thumb?.image?.url)
                }
              />
            );
          } else if (thumb?.Video_Thumb) {
            return (
              <ImageVideoThumb
                {...thumbProps}
                key={i}
                youtubeUrl={thumb?.Video_Thumb?.youtube_url}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};
