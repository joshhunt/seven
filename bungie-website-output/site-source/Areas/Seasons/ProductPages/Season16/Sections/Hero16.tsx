// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { ImageAnchor, ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Hero16.module.scss";

interface Hero16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["hero"];
  scrollToEvent: () => void;
}

export const Hero16: React.FC<Hero16Props> = ({
  inputRef,
  data,
  scrollToEvent,
}) => {
  const { mobile } = useDataStore(Responsive);

  const heroBg = responsiveBgImageFromStackFile(
    undefined,
    data?.bg?.mobile,
    mobile
  );

  const handleTrailerBtnClick = () => {
    YoutubeModal.show({ videoId: data?.trailer_btn?.trailer_id });
  };

  return (
    <div
      className={styles.hero}
      id={"hero"}
      ref={inputRef}
      style={{ backgroundImage: heroBg }}
    >
      <video
        className={styles.heroVideo}
        poster={data?.bg.desktop.poster?.url}
        autoPlay={true}
        loop={true}
        playsInline={true}
        muted={true}
      >
        <source src={data?.bg.desktop.video?.url} type={"video/mp4"} />
      </video>
      <div className={styles.heroContent}>
        <div
          className={styles.heroLogo}
          style={{ backgroundImage: bgImageFromStackFile(data?.logo) }}
        />
        <div className={styles.date}>{data?.date}</div>
        <div className={styles.heroBtnsWrapper}>
          <ImageVideoThumb
            image={data?.trailer_btn?.thumbnail?.url}
            videoId={data?.trailer_btn?.trailer_id}
            classes={{
              imageContainer: styles.heroBtn,
              image: styles.btnBg,
            }}
          />
          <ImageAnchor
            image={data?.play_btn?.thumbnail?.url}
            url={RouteHelper.DestinyBuy()}
            classes={{
              imageContainer: classNames(styles.heroBtn, styles.playNowBtn),
              image: styles.btnBg,
            }}
          >
            <div className={styles.heroBtnContent}>
              <p>
                <Arrows className={styles.left} />
                {data?.play_btn.btn_text}
                <Arrows className={styles.right} />
              </p>
            </div>
          </ImageAnchor>
        </div>
      </div>
      <HeroBug data={data.event_bug} onClick={scrollToEvent} />
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

interface HeroBugProps {
  data: BnetStackSeasonOfTheRisen["hero"]["event_bug"];
  onClick: () => void;
}

const HeroBug: React.FC<HeroBugProps> = (props) => {
  const { guardians_img, logo, sub_logo_text } = props.data ?? {};

  return (
    <div className={styles.heroBugWrapper}>
      <div className={styles.eventStripesWrapper}>
        <div className={styles.eventStripe} />
        <div className={styles.eventStripe} />
        <div className={styles.eventStripe} />
      </div>
      <div className={styles.floatingContent}>
        <img src={guardians_img?.url} className={styles.img} />
        <div className={styles.text} onClick={props.onClick}>
          <img className={styles.logo} src={logo?.url} />
          <h3 className={styles.subText}>{sub_logo_text}</h3>
          <p className={styles.bugArrowsWrapper}>
            <Arrows className={styles.bugArrows} />
          </p>
        </div>
      </div>
    </div>
  );
};
