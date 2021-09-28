// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { Icon } from "@UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { LegacyRef, useState } from "react";
import styles from "./Hero15.module.scss";

interface Hero15Props {
  inputRef: LegacyRef<HTMLDivElement>;
  gameplayTrailerId: string;
}

export const Hero15: React.FC<Hero15Props> = (props) => {
  const s15 = Localizer.Season15;

  const trailerAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    "Season15GamePlayTrailerAnalyticsId",
    ""
  );
  const playNowBtnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    "Season15PlayNowBtnAnalyticsId",
    ""
  );
  const heroLogo = `/7/ca/destiny/bgs/season15/logos/logo_${Localizer.CurrentCultureName}.png`;

  return (
    <div className={styles.hero} id={"hero"} ref={props.inputRef}>
      <video
        className={styles.heroVideo}
        poster={"/7/ca/destiny/bgs/season15/s15_hero_bg_desktop.jpg"}
        autoPlay={true}
        loop={true}
        playsInline={true}
        muted={true}
      >
        <source
          src={"/7/ca/destiny/bgs/season15/s15_hero_bg_desktop.mp4"}
          type={"video/mp4"}
        />
      </video>
      <div className={styles.heroContent}>
        <div
          className={styles.heroLogo}
          style={{ backgroundImage: `url(${heroLogo})` }}
        />
        <div className={styles.date}>{s15.SeasonDate}</div>
        <div className={styles.heroBtnsWrapper}>
          <ClickableMediaThumbnail
            videoId={props.gameplayTrailerId}
            showShadowBehindPlayIcon={true}
            classes={{
              btnWrapper: classNames(styles.heroBtn),
              btnBg: styles.heroBtnBg,
              playIcon: styles.defaultPlayIcon,
            }}
            thumbnail={"/7/ca/destiny/bgs/season15/s15_hero_button_trailer.jpg"}
            analyticsId={trailerAnalyticsId}
          >
            <div className={styles.heroBtnContent}>
              <Icon
                className={styles.playIcon}
                iconType={"material"}
                iconName={"play_arrow"}
              />
              <p>{s15.HeroTrailerBtnTitle}</p>
            </div>
          </ClickableMediaThumbnail>
          <ClickableMediaThumbnail
            classes={{
              btnWrapper: classNames(styles.heroBtn, styles.playNowBtn),
              btnBg: styles.heroBtnBg,
            }}
            thumbnail={"/7/ca/destiny/bgs/season15/s15_hero_button_play.jpg"}
            href={"/7/en/Destiny/Buy"}
            analyticsId={playNowBtnAnalyticsId}
          >
            <div className={styles.heroBtnContent}>
              <p>
                <Arrows className={styles.left} />
                {s15.HeroPlayNowBtnTitle}
                <Arrows className={styles.right} />
              </p>
            </div>
          </ClickableMediaThumbnail>
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
