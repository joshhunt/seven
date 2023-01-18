// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  bgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import React from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import { Responsive } from "@Boot/Responsive";
import styles from "./LightfallHero.module.scss";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import classNames from "classnames";
import { Icon } from "@UIKit/Controls/Icon";

interface LightfallHeroProps {
  data?: any;
}

export const LightfallHero: React.FC<LightfallHeroProps> = ({ data }) => {
  const {
    lightfall_logo,
    date_text,
    mobile_bg,
    desktop_bg,
    desktop_video,
    trailer_btn,
    buy_btn,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);
  const trailerBtn = trailer_btn?.[0];
  const buyBtn = buy_btn?.[0];

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          desktop_bg,
          mobile_bg,
          mobile
        ),
      }}
    >
      {!mobile && desktop_video && (
        <video
          className={styles.heroVid}
          poster={desktop_bg?.url}
          autoPlay
          muted
          playsInline
          loop
          controls={false}
        >
          <source src={desktop_video?.url} type={"video/mp4"} />
        </video>
      )}
      <div className={styles.sectionContent}>
        <img
          className={styles.lfLogo}
          src={lightfall_logo?.url}
          alt={lightfall_logo?.title}
        />
        <p className={styles.date}>
          <SafelySetInnerHTML html={date_text} />
        </p>
        <div className={styles.btns}>
          {buyBtn ? (
            <PmpButton
              className={classNames([styles.btn, styles.buyBtn])}
              {...buyBtn}
            >
              {buyBtn.label}
            </PmpButton>
          ) : null}
          {trailerBtn ? (
            <PmpButton
              className={classNames([styles.btn, styles.trailerBtn])}
              {...trailerBtn}
              icon={
                <Icon
                  className={styles.playIcon}
                  iconType={"material"}
                  iconName={"play_arrow"}
                />
              }
            >
              {trailerBtn.label}
            </PmpButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** If false, prevents throttle callback from being called */
let wait = false;

const throttle = (callback: (...args: any) => void, interval: number) => {
  if (!wait) {
    requestAnimationFrame(callback);

    wait = true;

    setTimeout(() => {
      wait = false;
    }, interval);
  }
};
