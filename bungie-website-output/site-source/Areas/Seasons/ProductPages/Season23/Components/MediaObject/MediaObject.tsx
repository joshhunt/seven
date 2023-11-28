import React from "react";
import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import {
  BnetStackFile,
  BnetStackPmpSectionHeader,
} from "../../../../../../Generated/contentstack-types";

import styles from "./MediaObject.module.scss";

interface MediaObjectProps extends BnetStackPmpSectionHeader {
  data?: BnetStackPmpSectionHeader;
  featuredImage?: BnetStackFile;
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
    featuredImage?: string;
    featuredImageWrapper?: string;
  };
}

export const MediaObject: React.FC<MediaObjectProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes, id, featuredImage } = props;

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
  const featuredImg = featuredImage?.url;

  return data?.heading && data?.blurb ? (
    <div
      id={id}
      className={classNames(styles.headerWrapper, classes?.root)}
      style={{ backgroundImage: bgImage }}
    >
      {featuredImg && (
        <div
          className={classNames(
            styles.featuredImgWrapper,
            classes?.featuredImageWrapper
          )}
        >
          <img
            className={classNames(classes?.featuredImage, styles.featuredImg)}
            src={featuredImg}
          />
        </div>
      )}
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
  ) : null;
};
