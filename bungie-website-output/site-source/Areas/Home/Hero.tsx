// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Button } from "@UIKit/Controls/Button/Button";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { BnetStackHomePageHero } from "../../Generated/contentstack-types";
import styles from "./Hero.module.scss";
import { Responsive } from "@Boot/Responsive";

interface HeroProps {
  heroData: BnetStackHomePageHero;
}

export const Hero: React.FC<HeroProps> = (props) => {
  const responsive = useDataStore(Responsive);

  if (!props) {
    return null;
  }

  const backgroundCSS = props.heroData.background_image
    ? {
        backgroundImage: `url(${
          responsive.mobile && props.heroData.mobile_background_image
            ? props.heroData.mobile_background_image.url
            : props.heroData.background_image.url
        })`,
      }
    : {};

  const titleImageBackgroundCSS = props.heroData.title_as_image
    ? {
        backgroundImage: `url(${props.heroData.title_as_image.url})`,
      }
    : {};

  const buttonId = (num: number) => {
    if (num === 1) {
      return "two";
    }

    return "one";
  };

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
        {props.heroData.title_as_image && (
          <div className={styles.titleImage} style={titleImageBackgroundCSS} />
        )}
        {props.heroData.subtitle && (
          <div className={styles.subtitle}>{props.heroData.subtitle}</div>
        )}
        {props.heroData.link_buttons && (
          <div className={styles.buttonContainer}>
            {props.heroData.link_buttons.link.map((item, num) => {
              return (
                <Button
                  buttonType={"gold"}
                  url={item.href}
                  key={num}
                  analyticsId={`button-${buttonId(num)}`}
                >
                  {item.title}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
