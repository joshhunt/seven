// Created by v-ahipp, 2023
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { bgImage } from "@Utilities/ContentStackUtils";
import React from "react";
import {
  BnetStackFile,
  BnetStackSeasonOfTheHaunted,
} from "../../../../../../Generated/contentstack-types";
import styles from "./S22Hero.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import PlatformsBar from "../PlatformsBar/S22PlatformsBar";
import classNames from "classnames";

type S22HeroProps = {
  data?: any;
  showCTA?: boolean;
  openBuyModal: () => void;
  scrollToEvent: () => void;
  showEventButton?: boolean;
};

type S22ScrollButtonProps = {
  bottom_label: string;
  images: BnetStackFile[];
  mobile_label: string;
  top_label: string;
};

export const S22Hero: React.FC<S22HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, showCTA, scrollToEvent, openBuyModal, showEventButton } =
    props ?? {};

  const {
    bg_desktop_poster,
    bg_desktop_video,
    date,
    bg_mobile,
    bg_mobile_video,
    logo,
    trailer_btn,
    cta,
    scroll_button,
  } = data ?? {};

  const handleTrailerBtnClick = () => {
    YoutubeModal.show({ videoId: trailer_btn?.video_id });
  };

  const params = new URLSearchParams(location.search);
  const paidMediaVideoHero = params.get("hero") === "1";

  const mobileBackground = bg_mobile ? `url(${bg_mobile?.url})` : undefined;
  const desktopBackground = bg_desktop_poster
    ? `url(${bg_desktop_poster?.url})`
    : undefined;

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: mobile ? mobileBackground : desktopBackground,
      }}
    >
      {bg_desktop_video && bg_mobile_video && paidMediaVideoHero && (
        <video
          className={styles.bgVideo}
          poster={bg_desktop_poster?.url}
          loop
          playsInline
          autoPlay
          muted
        >
          <source
            src={mobile ? bg_mobile_video?.url : bg_desktop_video?.url}
            type={"video/mp4"}
          />
        </video>
      )}
      <div className={styles.content}>
        <div className={styles.lowerContent}>
          <img src={logo?.url} className={styles.logo} alt={""} />
          <p
            className={classNames(styles.date, {
              [styles.defaultDateMobile]: !paidMediaVideoHero,
              [styles.testDateMobile]: paidMediaVideoHero,
            })}
            dangerouslySetInnerHTML={sanitizeHTML(date)}
          />

          <div
            className={classNames({
              [styles.btns]: !paidMediaVideoHero,
              [styles.videoBtns]: paidMediaVideoHero,
            })}
          >
            <div>
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

            {showEventButton && (
              <ScrollButton {...scroll_button} scrollToEvent={scrollToEvent} />
            )}
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

const ScrollButton: React.FC<
  S22ScrollButtonProps & { scrollToEvent: () => void }
> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const {
    scrollToEvent,
    top_label,
    bottom_label,
    mobile_label,
    images,
  } = props;

  return (
    <div className={styles.eventBugWrapper}>
      <button className={styles.eventBugContent} onClick={scrollToEvent}>
        {!mobile && <p className={styles.title}>{top_label}</p>}
        <div className={styles.iconOuterWrapper}>
          <div className={styles.iconWrapper}>
            {images?.map((image, i) => (
              <div
                className={styles.eventIcon}
                style={{ backgroundImage: bgImage(image?.url) }}
                key={i}
              />
            ))}
          </div>
        </div>
        <p className={styles.title}>{mobile ? mobile_label : bottom_label}</p>

        <DestinyArrows classes={{ root: styles.arrows }} />
      </button>
    </div>
  );
};
