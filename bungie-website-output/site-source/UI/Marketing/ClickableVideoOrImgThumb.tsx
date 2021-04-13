// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./ClickableVideoOrImgThumb.module.scss";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";

interface ClickableVideoOrImgThumbProps {
  thumbnailPath: string;
  screenshotPath?: string;
  youTubeId?: string;
  isMedium: boolean;
  height?: string;
  thumbnailClass?: string;
}

const ClickableVideoOrImgThumb = ({
  thumbnailPath,
  screenshotPath,
  youTubeId,
  isMedium,
  thumbnailClass,
}: ClickableVideoOrImgThumbProps) => {
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };
  const hasVideoId = youTubeId ? "playButton" : "";
  const videoThumbnailStyles = classNames(styles.thumbnail, styles[hasVideoId]);
  const imageThumbnailStyles = classNames(styles.thumbnail, {
    [thumbnailClass]: thumbnailClass,
  });

  return youTubeId ? (
    <div
      role={"button"}
      className={videoThumbnailStyles}
      onClick={() => showVideo(youTubeId)}
    >
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${thumbnailPath})` }}
      />
    </div>
  ) : (
    <div
      role={"button"}
      className={imageThumbnailStyles}
      onClick={() => showImage(screenshotPath)}
    >
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${thumbnailPath})` }}
      />
    </div>
  );
};

export default ClickableVideoOrImgThumb;
