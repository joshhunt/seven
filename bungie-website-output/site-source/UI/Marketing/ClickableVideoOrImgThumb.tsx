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
}

const ClickableVideoOrImgThumb = ({
  thumbnailPath,
  screenshotPath,
  youTubeId,
  isMedium,
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
  const hasVideoId = youTubeId && "playButton";

  return youTubeId ? (
    <div
      role={"button"}
      className={classNames(styles.thumbnail, styles[hasVideoId])}
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
      className={styles.thumbnail}
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
