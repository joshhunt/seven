// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { UrlUtils } from "@Utilities/UrlUtils";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { Icon } from "@UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import {
  bgImageFromConnection,
  bgImageFromStackFile,
  imageFromConnection,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Hero16.module.scss";

interface Hero16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["hero"];
}

export const Hero16: React.FC<Hero16Props> = ({ inputRef, data }) => {
  const { mobile } = useDataStore(Responsive);

  const heroBg = responsiveBgImageFromStackFile(
    undefined,
    data?.bg?.mobile,
    mobile
  );

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
          <ClickableMediaThumbnail
            videoId={data?.trailer_btn.trailer_id}
            showShadowBehindPlayIcon={true}
            classes={{
              btnWrapper: classNames(styles.heroBtn),
              btnBg: styles.heroBtnBg,
              playIcon: styles.defaultPlayIcon,
            }}
            thumbnail={data?.trailer_btn.thumbnail?.url}
            analyticsId={data?.trailer_btn?.analytics_id}
          >
            <div className={styles.heroBtnContent}>
              <Icon
                className={styles.playIcon}
                iconType={"material"}
                iconName={"play_arrow"}
              />
            </div>
          </ClickableMediaThumbnail>
          <ClickableMediaThumbnail
            classes={{
              btnWrapper: classNames(styles.heroBtn, styles.playNowBtn),
              btnBg: styles.heroBtnBg,
            }}
            thumbnail={data?.play_btn.thumbnail?.url}
            href={RouteHelper.DestinyBuy()}
            analyticsId={data?.play_btn?.analytics_id}
          >
            <div className={styles.heroBtnContent}>
              <p>
                <Arrows className={styles.left} />
                {data?.play_btn.btn_text}
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
