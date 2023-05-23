// Created by v-ahipp, 2023
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import React from "react";
import styles from "./S21Hero.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import PlatformsBar from "../PlatformsBar/S21PlatformsBar";
import classNames from "classnames";

type S21HeroProps = {
  data?: any;
  showCTA?: boolean;
  openBuyModal: () => void;
  scrollToEvent: () => void;
};

export const S21Hero: React.FC<S21HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, showCTA, scrollToEvent, openBuyModal } = props ?? {};

  const {
    bg_desktop_poster,
    bg_desktop_video,
    date,
    bg_mobile,
    bg_mobile_platforms,
    bg_mobile_available_now,
    logo,
    trailer_btn,
    cta,
    platforms,
    available_now,
  } = data ?? {};

  const handleTrailerBtnClick = () => {
    YoutubeModal.show({ videoId: trailer_btn?.video_id });
  };

  const params = new URLSearchParams(location.search);
  const paidMediaDefault = !params.get("hero") || !mobile;
  const paidMediaAvailableNow = params.get("hero") === "1" && mobile;
  const paidMediaPlatforms = params.get("hero") === "2" && mobile;

  const defaultMobileBackground = bg_mobile
    ? `url(${bg_mobile?.url})`
    : undefined;
  const platformsMobileBackground = bg_mobile_platforms
    ? `url(${bg_mobile_platforms?.url})`
    : undefined;
  const availableNowMobileBackground = bg_mobile_available_now
    ? `url(${bg_mobile_available_now?.url})`
    : undefined;

  let mobileBackground = defaultMobileBackground;

  if (paidMediaPlatforms) {
    mobileBackground = platformsMobileBackground;
  } else if (paidMediaAvailableNow) {
    mobileBackground = availableNowMobileBackground;
  }

  const desktopBackground = !bg_desktop_video
    ? `url(${bg_desktop_poster?.url})`
    : undefined;

  return (
    <div
      className={classNames([
        styles.hero,
        paidMediaAvailableNow && styles.heroAvailableNow,
        paidMediaPlatforms && styles.heroPlatforms,
      ])}
      style={{
        backgroundImage: mobile ? mobileBackground : desktopBackground,
      }}
    >
      {bg_desktop_video && !mobile && (
        <video
          className={styles.bgVideo}
          poster={bg_desktop_poster?.url}
          loop
          playsInline
          autoPlay
          muted
        >
          <source src={bg_desktop_video?.url} type={"video/mp4"} />
        </video>
      )}
      <div className={styles.content}>
        <div className={styles.lowerContent}>
          <img src={logo?.url} className={styles.logo} alt={""} />
          <p
            className={styles.date}
            dangerouslySetInnerHTML={sanitizeHTML(date)}
          />
          {paidMediaPlatforms ? <PlatformsBar data={platforms} /> : null}

          {paidMediaAvailableNow ? (
            <div className={styles.btns}>
              <Button onClick={openBuyModal} buttonType={"gold"}>
                {available_now?.label}
              </Button>
            </div>
          ) : null}

          {paidMediaDefault ? (
            <div className={styles.btns}>
              <Button
                onClick={handleTrailerBtnClick}
                buttonType={"gold"}
                icon={
                  <Icon
                    className={styles.icon}
                    iconType={"material"}
                    iconName={"play_arrow"}
                  />
                }
              >
                {trailer_btn?.text}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      {showCTA ? <HeroCTA cta={cta} scrollToEvent={scrollToEvent} /> : null}
    </div>
  );
};

const HeroCTA: React.FC<any & { scrollToEvent: () => void }> = (props) => {
  const { scrollToEvent, cta } = props;

  const { graphic, logo, text } = cta || {};

  return (
    <div className={styles.bugWrapper}>
      <button
        className={styles.bugContent}
        onClick={scrollToEvent}
        style={{
          backgroundImage: graphic ? `url(${graphic.url})` : undefined,
        }}
      >
        <img src={logo?.url} alt={""} className={styles.bugIcon} />
        <span dangerouslySetInnerHTML={sanitizeHTML(text)} />
        <DestinyArrows
          classes={{
            root: styles.arrows,
            base: styles.arrowsBase,
            animatedArrow: styles.animatedArrow,
          }}
        />
      </button>
    </div>
  );
};
