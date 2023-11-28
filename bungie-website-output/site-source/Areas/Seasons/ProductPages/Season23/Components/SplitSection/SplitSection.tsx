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
import {
  BnetStackFile,
  BnetStackPmpSectionHeader,
} from "../../../../../../Generated/contentstack-types";
import styles from "./SplitSection.module.scss";

type SplitSectionProps = DataReference<
  "pmp_info_thumbnail_group",
  BnetStackPmpSectionHeader
> & {
  backgroundColor?: string;
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

export const SplitSection: React.FC<SplitSectionProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes, backgroundColor } = props;

  if (!data) {
    return null;
  }

  const {
    heading,
    blurb,
    secondary_heading,
    mobile_bg,
    desktop_bg,
    video_btn,
  } = data ?? {};

  const bgImage = responsiveBgImageFromStackFile(desktop_bg, mobile_bg, mobile);

  const responsiveBgImage = (
    desktopImg: BnetStackFile,
    mobileImg: BnetStackFile,
    mobileVp: boolean
  ) => {
    return mobileVp ? mobileImg?.url : desktopImg?.url;
  };

  return (
    <section
      className={styles.sectionWrapper}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={styles.shadowTop} />
      {mobile ? (
        <div className={styles.backgroundContainer}>
          <img src={responsiveBgImage(desktop_bg, mobile_bg, mobile)} />
        </div>
      ) : (
        <div
          className={styles.backgroundContainer}
          style={{ backgroundImage: bgImage }}
        />
      )}
      <div className={styles.copyContainer}>
        <div>
          {secondary_heading ? (
            <h3
              className={classNames(classes?.secondaryHeading)}
              dangerouslySetInnerHTML={sanitizeHTML(secondary_heading)}
            />
          ) : null}
          <h2
            className={classNames(classes?.heading)}
            dangerouslySetInnerHTML={sanitizeHTML(heading)}
          />
        </div>
        {blurb || video_btn ? (
          <div
            className={classNames(classes?.lowerContent, {
              [styles.withVideo]: !!video_btn?.youtube_url,
            })}
          >
            {blurb ? (
              <p
                className={classNames(classes?.blurb)}
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
      <div className={styles.shadowBottom} />
    </section>
  );
};
