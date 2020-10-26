// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightStackedCardBlock.module.scss";

// Required props
interface IStackedCardBlockProps {
  cardImage: string;
  logoImage: string;
  heading: string;
  subheading: string;
  videoLoop?: string;
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
}: IStackedCardBlockProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.upperCard}>
        <img
          className={styles.logo}
          src={logoImage}
          alt=""
          role="presentation"
        />
        <h3 className={styles.heading}>{heading}</h3>
        <p className={styles.subheading}>{subheading}</p>
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
          className={styles.cardImage}
          src={cardImage}
          alt=""
          role="presentation"
        />
      )}
    </div>
  );
};

export default StackedCardBlock;
