// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { Icon } from "@UIKit/Controls/Icon";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React, { useState } from "react";
import { BnetStackPmpMedia } from "../../../Generated/contentstack-types";
import styles from "./PmpMedia.module.scss";

type PmpMediaGroup = BnetStackPmpMedia["thumbnail_groups"][number]["Media_Tab"]["media_items"];

type PmpMediaItem = PmpMediaGroup[number];

const getMediaThumbnail = (item: PmpMediaItem) => {
  const { Youtube_Video, Image } = item;

  return Youtube_Video?.thumbnail ?? Image?.thumbnail_optional ?? Image?.image;
};

const getYoutubeIdFromUrl = (url: string | undefined) => {
  const splitString = url?.replaceAll("/", "").split("youtu.be");

  return splitString?.[splitString.length - 1];
};

type PmpNewsAndMediaProps = DataReference<"pmp_media", BnetStackPmpMedia> & {
  classes?: {
    root?: string;
    tab?: string;
    selectedTab?: string;
    thumbnail?: string;
    thumbnailBg?: string;
  };
};

export const PmpMedia: React.FC<PmpNewsAndMediaProps> = (props) => {
  const { classes, data } = props;
  const {
    section_heading,
    small_title_left,
    small_title_right,
    thumbnail_groups,
  } = data ?? {};

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  if (!data) {
    return null;
  }

  const selectedGroup = thumbnail_groups?.[selectedTabIndex];
  const selectedThumbnails = selectedGroup?.Media_Tab?.media_items;
  const screenshotsInSelectedGroup = selectedThumbnails
    ?.map((t) => t.Image?.image?.url)
    .filter((s) => !!s);

  return (
    <div className={classNames(styles.pmpMediaWrapper, classes?.root)}>
      {section_heading && (
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>{section_heading}</h2>
          {small_title_left && small_title_right && (
            <div className={styles.smallTitles}>
              <p>{small_title_left}</p>
              <p>{small_title_right}</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.tabs}>
        {thumbnail_groups?.map((group, i) => {
          const isSelectedTab = i === selectedTabIndex;
          // set all tabs to same width with 1rem of space between them
          const tabWidth = `calc((100% - ${
            thumbnail_groups?.length - 1
          }rem) / ${thumbnail_groups?.length})`;

          const tabClasses = classNames({
            [styles.tab]: true,
            [classes?.tab]: true,
            [styles.selected]: isSelectedTab,
            [classes?.selectedTab]: isSelectedTab,
          });

          return (
            <div
              className={tabClasses}
              key={i}
              onClick={() => setSelectedTabIndex(i)}
              style={{ width: tabWidth }}
            >
              {group.Media_Tab?.tab_label}
            </div>
          );
        })}
      </div>
      <div className={styles.thumbnails}>
        {selectedThumbnails?.map((thumb, i) => {
          const { Image, Youtube_Video } = thumb;

          const thumbnail = getMediaThumbnail(thumb)?.url;

          if (!thumbnail) {
            return null;
          }

          const thumbnailClasses = {
            thumbnail: classes?.thumbnail,
            thumbnailBg: classes?.thumbnailBg,
          };

          if (Image) {
            return (
              <PMPMediaImageThumbnail
                key={i}
                thumbnail={thumbnail}
                image={Image?.image?.url}
                allItemsInTabGroup={selectedThumbnails}
                openInNewTab={selectedGroup.Media_Tab.open_images_in_new_tab}
                classes={thumbnailClasses}
              />
            );
          } else if (Youtube_Video) {
            return (
              <PMPMediaVideoThumbnail
                thumbnail={thumbnail}
                youtubeUrl={Youtube_Video?.video_url}
                classes={thumbnailClasses}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

interface PmpMediaThumbnailProps {
  thumbnail: string;
  onClick: () => void;
  children?: React.ReactNode;
  classes?: {
    thumbnail?: string;
    thumbnailBg?: string;
  };
}

const PMPMediaThumbnail: React.FC<PmpMediaThumbnailProps> = (props) => {
  const { thumbnail, onClick, children, classes } = props;

  const thumbnailBg = props.thumbnail ? `url(${thumbnail})` : undefined;

  return (
    <button
      className={classNames(styles.thumbnail, classes?.thumbnail)}
      onClick={onClick}
    >
      <div
        className={classNames(styles.thumbnailBg, classes?.thumbnailBg)}
        style={{ backgroundImage: thumbnailBg }}
      />
      <div className={styles.thumbnailContentWrapper}>{children}</div>
    </button>
  );
};

interface PMPMediaImageThumbnailProps
  extends Pick<PmpMediaThumbnailProps, "classes"> {
  image: string;
  thumbnail?: string;
  allItemsInTabGroup: PmpMediaGroup;
  openInNewTab: boolean;
}

const PMPMediaImageThumbnail: React.FC<PMPMediaImageThumbnailProps> = (
  props
) => {
  const { image, allItemsInTabGroup, openInNewTab, thumbnail, ...rest } = props;

  const handleClick = () => {
    openInNewTab ? openImageInNewTab() : openInPaginationModal();
  };

  const openImageInNewTab = () => {
    window.open(image);
  };

  const openInPaginationModal = () => {
    const allImagesInTabGroup = allItemsInTabGroup
      .filter((item) => item.Image)
      .map((item) => item.Image?.image?.url);
    const imgIndex = allImagesInTabGroup.indexOf(image);

    if (imgIndex !== -1) {
      ImagePaginationModal.show({ images: allImagesInTabGroup, imgIndex });
    }
  };

  return (
    <PMPMediaThumbnail
      {...rest}
      thumbnail={thumbnail ?? image}
      onClick={handleClick}
    />
  );
};

interface PMPMediaVideoThumbnailProps
  extends Pick<PmpMediaThumbnailProps, "classes"> {
  youtubeUrl: string;
  thumbnail: string;
}

const PMPMediaVideoThumbnail: React.FC<PMPMediaVideoThumbnailProps> = (
  props
) => {
  const { youtubeUrl, thumbnail, ...rest } = props;

  const handleClick = () => {
    YoutubeModal.show({ videoId: getYoutubeIdFromUrl(youtubeUrl) });
  };

  return (
    <PMPMediaThumbnail {...rest} onClick={handleClick} thumbnail={thumbnail}>
      <Icon
        className={classNames(styles.playIcon)}
        iconType={"material"}
        iconName={"play_arrow"}
      />
    </PMPMediaThumbnail>
  );
};
