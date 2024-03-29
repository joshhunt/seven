// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpSectionHeader } from "../../../Generated/contentstack-types";
import styles from "./PmpSectionHeader.module.scss";

type PmpSectionHeaderProps = DataReference<
  "pmp_info_thumbnail_group",
  BnetStackPmpSectionHeader
> & {
  id?: string;
  classes?: {
    root?: string;
    headingsFlexWrapper?: string;
    heading?: string;
    secondaryHeading?: string;
    smallTitle?: string;
    blurb?: string;
    textWrapper?: string;
    btnWrapper?: string;
    videoBtn?: string;
    lowerContent?: string;
  };
};

export const PmpSectionHeader: React.FC<PmpSectionHeaderProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes, id } = props;

  if (!data) {
    return null;
  }

  const {
    heading,
    blurb,
    left_small_title,
    right_small_title,
    secondary_heading,
    mobile_bg,
    desktop_bg,
    video_btn,
  } = data ?? {};

  const bgImage = responsiveBgImageFromStackFile(desktop_bg, mobile_bg, mobile);

  return (
    <div
      {...(id && { id: id })}
      className={classNames(styles.headerWrapper, classes?.root)}
      style={{ backgroundImage: bgImage }}
    >
      <div className={classNames(styles.textWrapper, classes?.textWrapper)}>
        <div
          className={classNames(
            styles.headingsFlexWrapper,
            classes?.headingsFlexWrapper
          )}
        >
          <div className={styles.leftHeadings}>
            {secondary_heading ? (
              <h3
                className={classNames(
                  styles.smallHeading,
                  classes?.secondaryHeading
                )}
                dangerouslySetInnerHTML={sanitizeHTML(secondary_heading)}
              />
            ) : null}
            <h2
              className={classNames(styles.heading, classes?.heading)}
              dangerouslySetInnerHTML={sanitizeHTML(heading)}
            />
          </div>
          {(left_small_title ?? right_small_title) && (
            <div className={styles.smallTitles}>
              <p className={classNames(classes?.smallTitle)}>
                {left_small_title}
              </p>
              <p className={classNames(classes?.smallTitle)}>
                {right_small_title}
              </p>
            </div>
          )}
        </div>
        {blurb || video_btn ? (
          <div
            className={classNames(styles.lowerContent, classes?.lowerContent, {
              [styles.withVideo]: !!video_btn?.youtube_url,
            })}
          >
            {blurb ? (
              <p
                className={classNames(styles.blurb, classes?.blurb)}
                dangerouslySetInnerHTML={sanitizeHTML(blurb)}
              />
            ) : null}
            {video_btn?.youtube_url ? (
              <div className={classNames(styles.videoBtn, classes?.videoBtn)}>
                <ImageVideoThumb
                  youtubeUrl={video_btn?.youtube_url}
                  image={video_btn?.thumbnail?.url}
                  classes={{
                    imageContainer: classNames(
                      styles.btnWrapper,
                      classes?.btnWrapper
                    ),
                    image: styles.bg,
                    playIcon: styles.playIcon,
                  }}
                />
                <p className={styles.caption}>{video_btn?.caption}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
