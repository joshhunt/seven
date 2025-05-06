// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Button, ButtonTypes } from "@UIKit/Controls/Button/Button";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  BnetStackFile,
  BnetStackLink,
} from "../../Generated/contentstack-types";
import styles from "./Hero.module.scss";

interface HeroProps {
  heroData: {
    hero_image: string;
    mobile_hero_image: string;
    hero_video: BnetStackFile;
    title: string;
    title_as_image: string;
    subtitle: string;
    button_one: {
      label: string;
      link: BnetStackLink;
      color: string;
    };
    button_two: {
      label: string;
      link: BnetStackLink;
      color: string;
    };
  };
}

export const Hero: React.FC<HeroProps> = (props) => {
  if (!props) {
    return null;
  }

  //for animation
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (!initialized) {
        setInitialized(true);
      }
    }, 400);
  }, []);

  const responsive = useDataStore(Responsive);

  const bgImageUrl = responsive.mobile
    ? props.heroData?.mobile_hero_image
    : props.heroData?.hero_image;

  return (
    <div className={styles.hero}>
      <div
        className={styles.heroBg}
        style={{
          backgroundImage: `url(${bgImageUrl})`,
        }}
        title={props.heroData?.title}
      >
        {props.heroData?.hero_video && !responsive.mobile && (
          <video autoPlay loop muted>
            <source src={props.heroData?.hero_video.url} type={"video/mp4"} />
          </video>
        )}
      </div>
      <div
        className={classNames(styles.textContent, {
          [styles.initialized]: initialized,
        })}
      >
        {props.heroData?.title_as_image ? (
          <img
            className={styles.titleImage}
            src={props.heroData?.title_as_image}
          />
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
                buttonType={props?.heroData?.button_one?.color as ButtonTypes}
                url={props.heroData?.button_one.link.href}
                analyticsId={`button-one}`}
              >
                {props.heroData?.button_one?.label}
              </Button>
            )}
            {props.heroData?.button_two?.label && (
              <Button
                buttonType={props?.heroData?.button_two?.color as ButtonTypes}
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
