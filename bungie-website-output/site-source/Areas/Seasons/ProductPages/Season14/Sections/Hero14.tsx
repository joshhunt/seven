// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { Icon } from "@UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { LegacyRef, useState } from "react";
import styles from "./Hero14.module.scss";

interface Season14HeroProps {
  trailerId?: string;
  heroLogo: string;
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Season14Hero: React.FC<Season14HeroProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const s14 = Localizer.Season14;

  const showVideo = (trailerId: string) => {
    if (responsive.medium) {
      window.location.href = `https://www.youtube.com/watch?v=${trailerId}`;
    } else {
      YoutubeModal.show({ videoId: trailerId });
    }
  };

  const trailerAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season14Page,
    "season14GamePlayTrailerAnalyticsId",
    ""
  );
  const playNowBtnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season14Page,
    "season14BuyAnalyticsId",
    ""
  );

  return (
    <div className={styles.hero} id={"hero"} ref={props.inputRef}>
      <video
        autoPlay={true}
        loop={true}
        playsInline={true}
        muted={true}
        className={styles.heroVideo}
      >
        <source
          src={"/7/ca/destiny/bgs/season14/s14_hero_trailer_web_ALT.mp4"}
          type={"video/mp4"}
        />
      </video>
      <div className={styles.heroContent}>
        <div
          className={styles.heroLogo}
          style={{ backgroundImage: `url(${props.heroLogo})` }}
        />
        <div className={styles.date}>{s14.SeasonDate}</div>
        <div className={styles.heroBtnsWrapper}>
          <div
            className={classNames(styles.heroBtn, styles.trailerBtn)}
            onClick={() => showVideo(props.trailerId)}
            data-analytics-id={trailerAnalyticsId}
          >
            <img
              src={"/7/ca/destiny/bgs/season14/s14_hero_button_trailer.jpg"}
            />
            <div className={styles.heroBtnContent}>
              <Icon
                className={styles.playIcon}
                iconType={"material"}
                iconName={"play_arrow"}
              />
              <p>{s14.HeroTrailerBtnTitle}</p>
            </div>
          </div>
          <a
            className={classNames(styles.heroBtn, styles.playNowBtn)}
            href={"/7/en/Destiny/Buy"}
            data-analytics-id={playNowBtnAnalyticsId}
          >
            <img src={"/7/ca/destiny/bgs/season14/s14_hero_button_play.jpg"} />
            <div className={styles.heroBtnContent}>
              <p>
                <Arrows className={styles.left} />
                {s14.HeroPlayNowBtnTitle}
                <Arrows className={styles.right} />
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Arrows for "Play Now" button
 *  *
 * @param props
 * @constructor
 */
const Arrows = (props: { className: string }) => {
  const classes = classNames(styles.arrows, props.className);

  return (
    <span className={classes}>
      <span className={styles.baseArrows} />
      <span className={styles.animatedArrow} />
    </span>
  );
};
