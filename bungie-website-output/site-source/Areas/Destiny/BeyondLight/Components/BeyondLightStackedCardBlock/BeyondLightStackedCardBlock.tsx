// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import classNames from "classnames";
import * as React from "react";
import styles from "./BeyondLightStackedCardBlock.module.scss";

// class props
interface IStackedCardClasses {
  wrapperStyles?: string;
  // text content section
  upperCardStyles?: string;
  // uppercard heading
  headingStyles?: string;
  // logo
  logoStyles?: string;
  // uppercard body copy
  subheadingStyles?: string;
  // card image
  imageStyles?: string;
}

// Required props
interface IStackedCardBlockProps {
  cardImage: string;
  logoImage: string;
  heading: string;
  subheading: string;
  videoLoop?: string;
  classes?: IStackedCardClasses;
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type StackedCardBlockProps = IStackedCardBlockProps & DefaultProps;

/**
 * StackedCardBlock - Replace this description
 *  *
 * @param {IStackedCardBlockProps} props
 * @returns
 */
const StackedCardBlock = ({
  cardImage,
  logoImage,
  heading,
  subheading,
  videoLoop,
  classes,
}: IStackedCardBlockProps) => {
  const wrapperStyles = classNames(styles.cardWrapper, classes?.wrapperStyles);
  const upperCardStyles = classNames(
    styles.upperCard,
    classes?.upperCardStyles
  );
  const logoStyles = classNames(styles.logo, classes?.logoStyles);
  const headingStyles = classNames(styles.heading, classes?.headingStyles);
  const subheadingStyles = classNames(
    styles.subheading,
    classes?.subheadingStyles
  );
  const imageStyles = classNames(styles.cardImage, classes?.imageStyles);

  return (
    <div className={wrapperStyles}>
      <div className={upperCardStyles}>
        <img
          className={logoStyles}
          src={logoImage}
          alt=""
          role="presentation"
        />
        <h3 className={headingStyles}>{heading}</h3>
        <p className={subheadingStyles}>{subheading}</p>
      </div>
      {videoLoop && (
        <video
          playsInline={true}
          autoPlay={true}
          muted={true}
          loop={true}
          poster={cardImage}
        >
          <source src={videoLoop} type="video/mp4" />
        </video>
      )}
      {cardImage && !videoLoop && (
        <img
          className={imageStyles}
          src={cardImage}
          alt=""
          role="presentation"
        />
      )}
    </div>
  );
};

export default StackedCardBlock;
