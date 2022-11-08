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
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import ImagePaginationModal, {
  getScreenshotPaginationData,
} from "@UIKit/Controls/Modal/ImagePaginationModal";
import { useCSWebpImages } from "@Utilities/CSUtils";
import classNames from "classnames";
import React, { useMemo } from "react";
import { BnetStackPmpCallout } from "../../../Generated/contentstack-types";
import styles from "./PmpCallout.module.scss";

type PmpCalloutThumbItem = BnetStackPmpCallout["thumbnails"][number];

type PmpCalloutProps = DataReference<"pmp_callout", BnetStackPmpCallout> & {
  classes?: {
    root?: string;
    textWrapper?: string;
    heading?: string;
    blurb?: string;
    thumbsWrapper?: string;
    thumbnail?: string;
    thumbnailWrapper?: string;
    upperContent?: string;
  };
  children?: React.ReactNode;
};

export const PmpCallout: React.FC<PmpCalloutProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes, children } = props;

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        desktopBg: data?.desktop_bg?.url,
        mobileBg: data?.mobile_bg?.url,
        mobileAsideImg: data?.aside_img_mobile?.url,
        desktopAsideImg: data?.aside_img_desktop?.url,
      }),
      [data]
    )
  );

  const getThumbnail = (thumbItem: PmpCalloutThumbItem | undefined) => {
    const { Image_Thumb, Video_Thumb } = thumbItem ?? {};

    return (
      Image_Thumb?.thumbnail_optional_?.url ??
      Image_Thumb?.image?.url ??
      Video_Thumb?.thumbnail?.url
    );
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

  const bgImg = mobile ? imgs.mobileBg : imgs.desktopBg;

  const asideImg = mobile ? imgs?.mobileAsideImg : imgs?.desktopAsideImg;

  return (
    <LazyLoadedBgDiv
      img={bgImg}
      className={classNames(
        styles.callout,
        { [styles.withAsideImg]: !!asideImg },
        classes?.root
      )}
      style={{ backgroundColor: bg_color }}
    >
      <div className={classNames(styles.upperContent, classes?.upperContent)}>
        <div className={classNames(styles.textWrapper, classes?.textWrapper)}>
          <h3
            className={classNames(styles.heading, classes?.heading)}
            dangerouslySetInnerHTML={sanitizeHTML(heading)}
          />
          <p
            className={classNames(styles.blurb, classes?.blurb)}
            dangerouslySetInnerHTML={sanitizeHTML(blurb)}
          />
          {children}
        </div>
        {asideImg && (
          <img src={asideImg} className={styles.asideImg} loading={"lazy"} />
        )}
      </div>
      {thumbnails && thumbnails.length > 0 ? (
        <div
          className={classNames(styles.thumbsWrapper, classes?.thumbsWrapper)}
        >
          {thumbnails?.map((thumb, i) => {
            const thumbProps: ImageThumbProps = {
              image: getThumbnail(thumb),
              classes: {
                imageContainer: classNames(
                  styles.thumb,
                  classes?.thumbnailWrapper
                ),
                image: classNames(styles.thumbBg, classes?.thumbnail),
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
      ) : null}
    </LazyLoadedBgDiv>
  );
};
