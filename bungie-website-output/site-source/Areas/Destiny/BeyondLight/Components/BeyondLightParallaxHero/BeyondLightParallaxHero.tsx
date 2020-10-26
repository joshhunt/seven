// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import styles from "./BeyondLightParallaxHero.module.scss";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Button, ButtonTypes } from "@UIKit/Controls/Button/Button";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React, { memo, useEffect, useRef, useState } from "react";

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

interface ParallaxHeroProps {
  leftItem?: string;
  centerItem?: string;
  rightItem?: string;
  backgroundCandy?: string;
  backgroundCandyTwo?: string;
  desktopBgPath: string;
  mobileBgPath?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  logoPath?: string;
  videoPlayButtonText: string;
  youTubeVideoId: string;
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
  bgColor?: string;
  classes?: IHeroClassNames;
}

const BeyondLightParallaxHero: React.FC<ParallaxHeroProps> = ({
  leftItem,
  centerItem,
  rightItem,
  backgroundCandy,
  youTubeVideoId,
  bgColor,
  isMobile,
  mobileBgPath,
  desktopBgPath,
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
}) => {
  // parallax
  const [parallaxPos, setParallaxPos] = useState();
  const ref = useRef();

  useEffect(() => {
    window.addEventListener("scroll", getTop);

    return () => {
      window.removeEventListener("scroll", getTop);
    };
  }, []);

  const getTop = () => {
    if (ref.current) {
      // @ts-ignore
      const { top } = ref.current.getBoundingClientRect();

      setParallaxPos(top / window.innerHeight);
    }
  };

  const transformer = (max, ratio) =>
    `translateY(${max * parallaxPos * ratio}px)`;
  const outerMax = 250;

  // video modal control
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  // classes to expand css for this
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
      id="scroll-container"
      className={styles.hero}
      style={{
        backgroundImage: isMobile
          ? `url(${mobileBgPath})`
          : `url(${desktopBgPath})`,
        backgroundColor: bgColor ? bgColor : "rgb(33, 40, 51)",
      }}
      ref={ref}
    >
      <div className={styles.itemContainer}>
        <div
          className={styles.leftItem}
          style={{ transform: transformer(outerMax, 0.2) }}
        >
          <img src={leftItem} alt={""} role="presentation" />
        </div>

        <div
          className={styles.centerItem}
          style={{ transform: transformer(outerMax, 0.49) }}
        >
          <img src={centerItem} alt={""} role="presentation" />
        </div>

        <div
          className={styles.rightItem}
          style={{ transform: transformer(outerMax, 0.3) }}
        >
          <img src={rightItem} alt={""} role="presentation" />
        </div>

        <div
          className={styles.backgroundCandy}
          style={{ transform: transformer(outerMax, 0.95) }}
        >
          <img src={backgroundCandy} alt={""} role="presentation" />
        </div>
      </div>

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
          {youTubeVideoId && (
            <Button
              buttonType={videoPlayButtonType}
              onClick={() => showVideo(youTubeVideoId)}
            >
              {videoPlayButtonText}
            </Button>
          )}
          {buttonOneLink && (
            <Button buttonType={buttonOneType} url={buttonOneLink}>
              {buttonOneText}
            </Button>
          )}
          {buttonTwoLink && (
            <Button buttonType={buttonTwoType} url={buttonTwoLink}>
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

export default memo(BeyondLightParallaxHero);
