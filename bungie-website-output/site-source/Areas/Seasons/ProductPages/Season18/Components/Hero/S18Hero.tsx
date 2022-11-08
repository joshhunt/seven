// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { ImageAnchor, ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { bgImage } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackS18ProductPage } from "../../../../../../Generated/contentstack-types";
import styles from "./S18Hero.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";

type S18HeroProps = {
  data?: BnetStackS18ProductPage["hero"];
  scrollToEvent: () => void;
};

export const S18Hero: React.FC<S18HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const {
    bg_desktop_poster,
    bg_desktop_video,
    date,
    bg_mobile,
    logo,
    trailer_btn,
    bug_group,
  } = props.data ?? {};

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
    </div>
  );
};

const HeroBug: React.FC<
  BnetStackS18ProductPage["hero"]["bug_group"] & { scrollToEvent: () => void }
> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { scrollToEvent, icon, label, bg } = props;

  return (
    <div className={styles.bugWrapper}>
      <button
        className={styles.bugContent}
        onClick={scrollToEvent}
        style={{
          backgroundImage: bg ? `url(${bg.url})` : undefined,
        }}
      >
        <img src={icon?.url} alt={""} className={styles.bugIcon} />
        <span dangerouslySetInnerHTML={sanitizeHTML(label)} />
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
