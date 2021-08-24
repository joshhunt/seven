// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React from "react";
import styles from "./WQClickableImg.module.scss";

export interface WQClickableImgProps {
  thumbnail: string;
  screenshot: string;
  caption: string;
  bottomCaption?: string;
  classes?: { root?: string; img?: string; imgWrapper?: string };
  videoId?: string;
}

export const WQClickableImg: React.FC<WQClickableImgProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const showVideo = (videoId: string) => {
    responsive.medium
      ? (window.location.href = `https://www.youtube.com/watch?v=${videoId}`)
      : YoutubeModal.show({ videoId });
  };

  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  const handleClick = () =>
    props.videoId ? showVideo(props.videoId) : showImage(props.screenshot);

  const bgImage = props.thumbnail ? `url(${props.thumbnail})` : undefined;

  return (
    <div className={classNames(styles.imgWrapper, props.classes?.root)}>
      {props.caption && (
        <div className={styles.captionWrapper}>
          <p
            className={styles.caption}
            dangerouslySetInnerHTML={sanitizeHTML(props.caption)}
          />
        </div>
      )}
      <div
        className={classNames(styles.wqClickableImg, props.classes?.imgWrapper)}
        onClick={handleClick}
      >
        <div
          className={classNames(styles.bgImage, props.classes?.img)}
          style={{ backgroundImage: bgImage }}
        />
        <div className={styles.bottomShade} />
        {props.videoId && (
          <Icon
            className={styles.playIcon}
            iconType={"material"}
            iconName={"play_arrow"}
          />
        )}
      </div>
      {props.bottomCaption && (
        <p className={styles.bottomCaption}>{props.bottomCaption}</p>
      )}
    </div>
  );
};
