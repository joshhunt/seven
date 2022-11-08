// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { BnetStackNovaProductPage } from "../../../../../Generated/contentstack-types";
import { bgImageFromStackFile } from "../../../../../Utilities/ContentStackUtils";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./WQHero.module.scss";

interface WQHeroProps {
  heroContent: BnetStackNovaProductPage["hero"];
}

const WQHero: React.FC<WQHeroProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const data = props.heroContent;

  const {
    hero_bg_desktop,
    hero_bg_mobile,
    hero_trailer_btn_bg,
    hero_logo_img,
    hero_pre_order_btn_bg,
    hero_pre_order_btn_text,
    hero_trailer_btn_text,
    hero_date_text,
    hero_trailer_id,
    hero_bg_desktop_video,
  } = data ?? {};

  const heroBgImage = bgImageFromStackFile(hero_bg_mobile);
  const heroVideo = hero_bg_desktop_video?.url;

  return (
    <div className={styles.hero} style={{ backgroundImage: heroBgImage }}>
      {heroVideo && !responsive.mobile && (
        <video
          className={styles.heroVideo}
          poster={bgImageFromStackFile(hero_bg_desktop)}
          autoPlay={true}
          loop={true}
          playsInline={true}
          muted={true}
        >
          <source src={heroVideo} type={"video/mp4"} />
        </video>
      )}
      <img src={hero_logo_img?.url} className={styles.titleImg} />
      <div className={styles.flexBtns}>
        <WatchTrailerBtn
          trailerId={hero_trailer_id}
          bgImage={bgImageFromStackFile(hero_trailer_btn_bg)}
          btnText={hero_trailer_btn_text}
        />
        <PreOrderBtn
          bgImage={bgImageFromStackFile(hero_pre_order_btn_bg)}
          btnText={hero_pre_order_btn_text}
        />
      </div>
      <p className={styles.heroDate}>{hero_date_text}</p>
    </div>
  );
};

interface IWQHeroBtn {
  bgImage: string;
  btnText: string;
}

interface IWatchTrailerBtn extends IWQHeroBtn {
  trailerId: string;
}

const WatchTrailerBtn: React.FC<IWatchTrailerBtn> = (props) => {
  const btnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.WitchQueen,
    "HeroTrailerAnalyticsId",
    ""
  );
  const showVideo = () => YoutubeModal.show({ videoId: props.trailerId });

  return (
    <div
      className={styles.heroBtn}
      onClick={showVideo}
      data-analytics-id={btnAnalyticsId}
    >
      <div
        className={styles.heroBtnBg}
        style={{ backgroundImage: props.bgImage }}
      />
      <div className={styles.heroBtnContent}>
        <Icon
          className={styles.playIcon}
          iconType={"material"}
          iconName={"play_arrow"}
        />
        <p className={styles.btnText}>{props.btnText}</p>
      </div>
    </div>
  );
};

const PreOrderBtn: React.FC<IWQHeroBtn> = (props) => {
  const btnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.WitchQueen,
    "HeroPreOrderAnalyticsId",
    ""
  );

  return (
    <Anchor
      url={"/WitchQueenBuyNow"}
      className={classNames(styles.heroBtn, styles.preOrderBtn)}
      data-analytics-id={btnAnalyticsId}
    >
      <div
        className={styles.heroBtnBg}
        style={{ backgroundImage: props.bgImage }}
      />
      <div className={styles.heroBtnContent}>
        <div className={styles.arrowsTextWrapper}>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.left) }}
          />
          <p className={styles.btnText}>{props.btnText}</p>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.right) }}
          />
        </div>
      </div>
    </Anchor>
  );
};

export default WQHero;
