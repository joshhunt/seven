// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { IMultiSiteLink } from "@Routes/RouteHelper";
import { StringUtils } from "@Utilities/StringUtils";
import React, { memo } from "react";
import classNames from "classnames";
import styles from "./BeyondLightHero.module.scss";
import { Button, ButtonTypes } from "@UI/UIKit/Controls/Button/Button";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";

interface IHeroClassNames {
  /** The heading */
  heading?: string;
  /** the text above the heading */
  eyebrow?: string;
  /** the text below the heading */
  subheading?: string;
  /** The overlay image (if present) */
  overlay?: string;
  /** The div that contains the text */
  textContainer?: string;
  /** The div that contains the buttons */
  buttonContainer?: string;
}

// Required props
interface IHeroProps {
  posterPath: string;
  videoLoopPath?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  logoPath?: string;
  videoPlayButtonText: string;
  youTubeVideoId?: string;
  videoPlayButtonType: ButtonTypes;
  buttonOneText?: string;
  buttonOneLink?: string | IMultiSiteLink;
  buttonOneType?: ButtonTypes;
  buttonTwoText?: string;
  buttonTwoLink?: string | IMultiSiteLink;
  buttonTwoType?: ButtonTypes;
  isMedium: boolean;
  isMobile?: boolean;
  releaseDateEyebrow?: string;
  releaseDate?: string;
  overlayImage?: string;
  mobileBgPath?: string;
  bgColor?: string;
  classes?: IHeroClassNames;
}

/**
 * Hero - Returns top section for Beyond Light Pages that contains a video, a videoloop, a post, button (or buttons), heading, subheading
 *  *
 * @param {IHeroProps} props
 * @returns
 */
const Hero = ({
  youTubeVideoId,
  bgColor,
  isMobile,
  mobileBgPath,
  posterPath,
  videoLoopPath,
  eyebrow,
  subheading,
  heading,
  logoPath,
  buttonOneLink,
  buttonOneType,
  buttonOneText,
  buttonTwoText,
  buttonTwoLink,
  buttonTwoType,
  isMedium,
  releaseDate,
  releaseDateEyebrow,
  overlayImage,
  videoPlayButtonText,
  videoPlayButtonType,
  classes,
}: IHeroProps) => {
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  const textContainerClasses = classNames(
    styles.heroContent,
    classes?.textContainer
  );
  const buttonContainerClasses = classNames(
    styles.buttons,
    classes?.buttonContainer
  );
  const headingClasses = classNames(styles.heading, classes?.heading);
  const eyebrowClasses = classNames(styles.eyebrow, classes?.eyebrow);
  const subheadingClasses = classNames(styles.subtitle, classes?.subheading);
  const overlayClasses = classNames(styles.overlay, classes?.overlay);

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: isMobile
          ? `url(${mobileBgPath})`
          : `url(${posterPath})`,
        backgroundColor: bgColor ? bgColor : "rgb(33, 40, 51)",
      }}
    >
      {videoLoopPath && (
        <div className={styles.videoContainer}>
          <video
            playsInline={true}
            autoPlay={true}
            muted={true}
            loop={true}
            poster={posterPath}
          >
            <source src={videoLoopPath} type="video/mp4" />
          </video>
        </div>
      )}
      {overlayImage && (
        <div
          className={overlayClasses}
          style={{ backgroundImage: `url(${overlayImage})` }}
        />
      )}

      <div className={textContainerClasses}>
        <p className={eyebrowClasses}>{eyebrow}</p>
        {logoPath && (
          <h1
            className={styles.heroTitle}
            style={{ backgroundImage: `url(${logoPath})` }}
          >
            {heading}
          </h1>
        )}
        {heading && !logoPath && <h1 className={headingClasses}>{heading}</h1>}
        {subheading && (
          <div className={subheadingClasses}>
            <span>{subheading}</span>
          </div>
        )}

        <div className={buttonContainerClasses}>
          {!StringUtils.isNullOrWhiteSpace(youTubeVideoId) && (
            <Button
              buttonType={videoPlayButtonType}
              onClick={() => showVideo(youTubeVideoId)}
              analyticsId={"BeyondLightHeroTrailerButton"}
            >
              {videoPlayButtonText}
            </Button>
          )}
          {buttonOneLink && (
            <Button
              buttonType={buttonOneType}
              url={buttonOneLink}
              analyticsId={"BeyondLightHeroBuyButton1"}
            >
              {buttonOneText}
            </Button>
          )}
          {buttonTwoLink && (
            <Button
              buttonType={buttonTwoType}
              url={buttonTwoLink}
              analyticsId={"BeyondLightHeroBuyButton2"}
            >
              {buttonTwoText}
            </Button>
          )}
        </div>
        {releaseDateEyebrow && (
          <span className={styles.releaseDateEyebrow}>
            {releaseDateEyebrow}
          </span>
        )}
        {releaseDate && (
          <span className={styles.releaseDate}>{releaseDate}</span>
        )}
      </div>
    </div>
  );
};

export default memo(Hero);
