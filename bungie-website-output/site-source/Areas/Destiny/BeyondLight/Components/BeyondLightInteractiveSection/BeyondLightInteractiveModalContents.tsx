// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React, { useState } from "react";
import styles from "./BeyondLightInteractiveModalContents.module.scss";
import classNames from "classnames";

interface InteractiveModalContentsProps {
  posterPath: string;
  backgroundVideo: string;
  eyebrow: string;
  heading: string;
  bodyCopy: string;
  detailImage: string;
  detailImageTwo: string;
  logoOne: string;
  logoTwo: string;
  subheadingOne: string;
  captionOne: string;
  subheadingTwo: string;
  captionTwo: string;
}

export const InteractiveModalContents: React.FC<InteractiveModalContentsProps> = ({
  posterPath,
  backgroundVideo,
  eyebrow,
  heading,
  bodyCopy,
  detailImage,
  detailImageTwo,
  logoOne,
  logoTwo,
  subheadingOne,
  captionOne,
  subheadingTwo,
  captionTwo,
}) => {
  const [isActive, setActive] = useState(false);

  const handleClick = () => {
    setActive(!isActive);
  };

  return (
    <div
      className={styles.modalWrapper}
      style={{ backgroundImage: `url(${posterPath})` }}
    >
      <div className={styles.videoContainer}>
        <video
          playsInline={true}
          autoPlay={true}
          muted={true}
          loop={true}
          poster={posterPath}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      <div className={styles.textContainer}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <span className={styles.shortBorder} />
        <p className={styles.bodyCopy}>{bodyCopy}</p>

        <div className={styles.imageContainer}>
          <div>
            <img
              className={styles.detailImage}
              src={detailImage}
              style={{ opacity: isActive ? "1" : "0" }}
              alt=""
              role="presentation"
            />
            <img
              className={styles.detailImage}
              src={detailImageTwo}
              style={{ opacity: !isActive ? "1" : "0" }}
              alt=""
              role="presentation"
            />
          </div>
        </div>

        <div className={styles.logoWrapper}>
          <div
            onClick={!isActive ? null : () => handleClick()}
            className={classNames(
              styles.logo,
              !isActive ? styles.active : null
            )}
            style={{ backgroundImage: `url(${logoOne})` }}
          />
          <div
            onClick={isActive ? null : () => handleClick()}
            className={classNames(styles.logo, isActive ? styles.active : null)}
            style={{ backgroundImage: `url(${logoTwo})` }}
          />
        </div>

        <div className={styles.detailsSection}>
          <div
            className={styles.detailsContainer}
            style={{ opacity: !isActive ? "1" : "0" }}
          >
            <h3 className={styles.subheading}>{subheadingOne}</h3>
            <p className={styles.caption}>{captionOne}</p>
          </div>

          <div
            className={styles.detailsContainer}
            style={{ opacity: isActive ? "1" : "0" }}
          >
            <h3 className={styles.subheading}>{subheadingTwo}</h3>
            <p className={styles.caption}>{captionTwo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
