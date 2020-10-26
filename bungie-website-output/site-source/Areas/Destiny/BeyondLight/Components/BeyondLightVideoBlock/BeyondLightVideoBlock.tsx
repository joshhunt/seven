// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightVideoBlock.module.scss";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";

interface IVideoBlockClassNames {
  /** The video wrapper - contains poster image*/
  wrapper?: string;
  /** The trigger of the modal */
  trigger?: string;
  /** The playbutton */
  playButton?: string;
}

interface IVideoBlockProps {
  videoPath: string;
  videoThumbnail: string;
  alignment?: "center" | "right";
  isMedium: boolean;
  classes?: IVideoBlockClassNames;
}

const VideoBlock: React.FC<IVideoBlockProps> = ({
  classes,
  videoPath,
  videoThumbnail,
  alignment,
  isMedium,
}) => {
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  return (
    <div
      className={classNames(
        styles.videoContainer,
        styles[alignment],
        classes?.wrapper
      )}
      style={{ backgroundImage: `url(${videoThumbnail})` }}
    >
      <div
        role="button"
        className={classNames(styles.thumbnail, classes?.trigger)}
        onClick={() => showVideo(videoPath)}
      >
        <div
          className={classNames(styles.videoPlayButton, classes?.playButton)}
        />
      </div>
    </div>
  );
};

export default VideoBlock;
