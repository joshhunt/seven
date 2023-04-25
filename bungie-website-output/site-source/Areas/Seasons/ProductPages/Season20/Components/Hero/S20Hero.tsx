// Created by v-ahipp, 2023
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import React from "react";
import styles from "./S20Hero.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";

type S20HeroProps = {
  data?: any;
  showCTA?: boolean;
  scrollToEvent: () => void;
};

export const S20Hero: React.FC<S20HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, showCTA, scrollToEvent } = props ?? {};

  const {
    bg_desktop_poster,
    bg_desktop_video,
    date,
    bg_mobile,
    logo,
    trailer_btn,
    cta,
  } = data ?? {};

  const handleTrailerBtnClick = () => {
    YoutubeModal.show({ videoId: trailer_btn?.video_id });
  };

  const mobileBackground = bg_mobile ? `url(${bg_mobile?.url})` : undefined;
  const desktopBackground = !bg_desktop_video
    ? `url(${bg_desktop_poster?.url})`
    : undefined;

  return (
    <div
      className={styles.hero}
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
