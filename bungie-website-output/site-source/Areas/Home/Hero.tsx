// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Button } from "@UIKit/Controls/Button/Button";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  BnetStackFile,
  BnetStackLink,
} from "../../Generated/contentstack-types";
import styles from "./Hero.module.scss";
import { Responsive } from "@Boot/Responsive";

interface HeroProps {
  heroData: {
    hero_image: BnetStackFile;
    hero_video: BnetStackFile;
    title: string;
    title_as_image: BnetStackFile;
    subtitle: string;
    button_one: {
      label: string;
      link: BnetStackLink;
    };
    button_two: {
      label: string;
      link: BnetStackLink;
    };
  };
}

export const Hero: React.FC<HeroProps> = (props) => {
  const responsive = useDataStore(Responsive);

  if (!props) {
    return null;
  }

  const backgroundCSS = {
    backgroundImage: `url(${props.heroData?.hero_image?.url}`,
  };

  const titleImageBackgroundCSS = props.heroData?.title_as_image
    ? {
        backgroundImage: `url(${props.heroData?.title_as_image?.url})`,
      }
    : {};

  //for animation
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (!initialized) {
        setInitialized(true);
      }
    }, 400);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.heroBg} style={backgroundCSS} />
      <div
        className={classNames(styles.textContent, {
          [styles.initialized]: initialized,
        })}
      >
        {props.heroData?.title_as_image ? (
          <div className={styles.titleImage} style={titleImageBackgroundCSS} />
        ) : (
          <div className={styles.title}>{props.heroData?.title}</div>
        )}
        {props.heroData?.subtitle && (
          <div className={styles.subtitle}>{props.heroData?.subtitle}</div>
        )}
        {props.heroData?.button_one && (
          <div className={styles.buttonContainer}>
            {props.heroData?.button_one?.label && (
              <Button
                buttonType={"gold"}
                url={props.heroData?.button_one.link.href}
                analyticsId={`button-one}`}
              >
                {props.heroData?.button_one?.label}
              </Button>
            )}
            {props.heroData?.button_two?.label && (
              <Button
                buttonType={"gold"}
                url={props.heroData?.button_two.link.href}
                analyticsId={`button-two}`}
              >
                {props.heroData?.button_two?.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
