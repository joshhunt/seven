import React from "react";
import classNames from "classnames";
import styles from "./Season11PotentialVideo.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import {
  Season11PlayButton,
  Season11PlayButtonClasses,
} from "@Areas/Seasons/ProductPages/Season11/Components/Season11PlayButton";

interface Season11PotentialVideoProps {
  videoId: string | null;
  className?: string;
  playButtonClasses?: Season11PlayButtonClasses;
  nonVideoClick?: () => void;
  children?: React.ReactNode;
}

export const Season11PotentialVideo: React.FC<Season11PotentialVideoProps> = (
  props
) => {
  const {
    className,
    videoId,
    children,
    playButtonClasses,
    nonVideoClick,
  } = props;

  const classes = classNames(className, styles.wrapper, {
    [styles.modalClick]: !videoId && !!nonVideoClick,
  });

  const onClick = () => {
    if (videoId) {
      YoutubeModal.show({
        videoId,
      });
    } else if (nonVideoClick) {
      nonVideoClick();
    }
  };

  return (
    <div className={classes} onClick={onClick}>
      <div
        className={classNames(styles.absolute, {
          [styles.clickable]: !!videoId,
        })}
      >
        {videoId && (
          <Season11PlayButton
            classes={{
              ...playButtonClasses,
              root: classNames(styles.playButton, playButtonClasses?.root),
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
};
