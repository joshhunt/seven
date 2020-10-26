// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightScreenShotBlock.module.scss";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Img } from "@Helpers";
import classNames from "classnames";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";

interface ScreenShotBlockProps {
  thumbnailPath: string;
  screenshotPath: string;
  youTubeId?: string;
  isMedium: boolean;
}

const ScreenShotBlock = ({
  thumbnailPath,
  screenshotPath,
  youTubeId,
  isMedium,
}: ScreenShotBlockProps) => {
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  const showImage = (imagePath: string) => {
    Modal.open(<img src={Img(`/${imagePath}`)} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };
  const hasVideoId = youTubeId && "playButton";

  return (
    <div className={styles.thumbnails}>
      {youTubeId ? (
        <Button
          className={classNames(styles.thumbnail, styles[hasVideoId])}
          onClick={() => showVideo(youTubeId)}
        >
          <img src={Img(`${thumbnailPath}`)} alt="" role="presentation" />
        </Button>
      ) : (
        <Button
          className={styles.thumbnail}
          onClick={() => showImage(screenshotPath)}
        >
          <img src={Img(`${thumbnailPath}`)} alt="" role="presentation" />
        </Button>
      )}
    </div>
  );
};

export default ScreenShotBlock;
