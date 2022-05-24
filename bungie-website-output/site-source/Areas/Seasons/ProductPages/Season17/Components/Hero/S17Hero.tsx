// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ImageAnchor,
  ImageThumbBtn,
  ImageVideoThumb,
} from "@UI/Marketing/ImageThumb";
import classNames from "classnames";
import React from "react";
import styles from "./S17Hero.module.scss";
import { BnetStackSeasonOfTheHaunted } from "../../../../../../Generated/contentstack-types";

type S17HeroProps = {
  data?: BnetStackSeasonOfTheHaunted["hero"];
};

export const S17Hero: React.FC<S17HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const {
    bg_desktop_poster,
    bg_desktop_video,
    date,
    bg_mobile,
    logo,
    play_now_btn,
    trailer_btn,
  } = props.data ?? {};

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage:
          mobile && bg_mobile ? `url(${bg_mobile?.url})` : undefined,
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
        <img src={logo?.url} className={styles.logo} />
        <div className={styles.lowerContent}>
          <p
            className={styles.date}
            dangerouslySetInnerHTML={sanitizeHTML(date)}
          />
          <div className={styles.btns}>
            <HeroTrailerBtn
              title={trailer_btn?.text}
              bg={trailer_btn?.thumbnail?.url}
              youtubeUrl={trailer_btn?.youtube_url}
            />
            <HeroPlayBtn
              title={play_now_btn?.text}
              bg={play_now_btn?.thumbnail?.url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroPlayBtn: React.FC<{ title: string; bg: string }> = ({
  bg,
  title,
}) => {
  return (
    <ImageAnchor
      image={bg}
      classes={{
        imageContainer: classNames(styles.heroBtn, styles.playBtn),
        image: styles.bg,
      }}
      url={RouteHelper.DestinyBuy()}
    >
      <div className={styles.btnContent}>
        <div className={styles.textWrapper}>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.left) }}
          />
          <p className={styles.btnText}>{title}</p>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.right) }}
          />
        </div>
      </div>
    </ImageAnchor>
  );
};

const HeroTrailerBtn: React.FC<{
  title: string;
  bg: string;
  youtubeUrl: string;
}> = ({ title, bg, youtubeUrl }) => {
  return (
    <ImageVideoThumb
      classes={{
        imageContainer: classNames(styles.heroBtn, styles.trailerBtn),
        image: styles.bg,
      }}
      image={bg}
      youtubeUrl={youtubeUrl}
    >
      <div className={styles.btnContent}>
        <p className={styles.btnText}>{title}</p>
      </div>
    </ImageVideoThumb>
  );
};
