// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { ThumbnailButton } from "@Areas/Destiny/FinalShape/Sections/Components/ThumbnailButton/ThumbnailButton";
import React from "react";
import classNames from "classnames";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import { Responsive } from "@Boot/Responsive";
import {
  PmpButton,
  PmpButtonProps,
} from "@UI/Marketing/FragmentComponents/PmpButton";
import { Icon } from "@UIKit/Controls/Icon";
import { BnetStackFile } from "../../../../../../Generated/contentstack-types";

import styles from "./Hero.module.scss";

interface ButtonProps extends PmpButtonProps {
  label?: string;
}

interface HeroProps {
  data?: any;
  destiny_logo?: BnetStackFile;
  logo?: BnetStackFile;
  subheading?: string;
  buy_button?: ButtonProps;
  trailer_button?: ButtonProps;
  buy_button_thumbnail?: BnetStackFile;
  trailer_button_thumbnail?: BnetStackFile;
  bg?: {
    desktop_bg?: BnetStackFile;
    mobile_bg?: BnetStackFile;
  };
  desktop_video?: BnetStackFile;
  mobile_video?: BnetStackFile;
  alternate_desktop_bg?: BnetStackFile;
}

export const Hero: React.FC<HeroProps> = ({
  destiny_logo,
  logo,
  subheading,
  buy_button,
  trailer_button,
  buy_button_thumbnail,
  trailer_button_thumbnail,
  desktop_video,
  bg,
  alternate_desktop_bg,
  mobile_video,
}) => {
  const { mobile } = useDataStore(Responsive);
  const hasTrailerButton =
    Array.isArray(trailer_button) && trailer_button?.length > 0;
  const hasBuyButton = Array.isArray(buy_button) && buy_button?.length > 0;
  const buyBtn = hasBuyButton ? buy_button[0] : {};
  const trailerBtn = hasTrailerButton ? trailer_button[0] : {};
  const trailerThumb = trailer_button_thumbnail?.url ?? null;
  const buyThumb = buy_button_thumbnail?.url ?? null;

  //url is ?version=Promo
  const params = new URLSearchParams(location.search);
  const promoView = params.get("version");
  const isThumbTest = promoView === "1";
  const isBuyTest = promoView === "2";
  const buyButtonTestVar = {
    ...buyBtn,
    url: `${buyBtn?.url}?variant=collectors`,
  };
  const defaultBg = responsiveBgImageFromStackFile(
    bg?.desktop_bg,
    bg?.mobile_bg,
    mobile
  );
  const testBg = responsiveBgImageFromStackFile(
    alternate_desktop_bg,
    bg?.mobile_bg,
    mobile
  );
  const heroBG = !isThumbTest ? defaultBg : testBg;

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: heroBG,
      }}
    >
      {!mobile && !isBuyTest && desktop_video?.url && (
        <video
          className={styles.heroVid}
          poster={bg?.desktop_bg?.url}
          autoPlay
          muted
          playsInline
          loop
          controls={false}
        >
          <source src={desktop_video?.url} type={"video/mp4"} />
        </video>
      )}

      {mobile && !isBuyTest && mobile_video?.url && (
        <video
          className={styles.heroVid}
          poster={bg?.mobile_bg?.url}
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
        {destiny_logo && (
          <img
            className={styles.destinyLogo}
            src={destiny_logo?.url}
            alt={destiny_logo?.title}
          />
        )}
        {logo && (
          <img className={styles.tfsLogo} src={logo?.url} alt={logo?.title} />
        )}
        {subheading && (
          <p className={styles.date}>
            <SafelySetInnerHTML html={subheading} />
          </p>
        )}
        {!isThumbTest ? (
          <div className={styles.btns}>
            {!isBuyTest && buyBtn ? (
              <PmpButton
                className={classNames(styles.btn, styles.buyBtn)}
                {...buyBtn}
              >
                {buyBtn?.label}
              </PmpButton>
            ) : null}

            {isBuyTest && buyButtonTestVar ? (
              <PmpButton
                className={classNames(styles.btn, styles.buyBtn)}
                {...buyButtonTestVar}
              >
                {buyButtonTestVar?.label}
              </PmpButton>
            ) : null}
            {trailerBtn ? (
              <PmpButton
                className={classNames(styles.btn, styles.trailerBtn)}
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
        ) : (
          <div className={styles.flexBtns}>
            {buyBtn && buyThumb ? (
              <ThumbnailButton
                bg={buyThumb}
                label={buyBtn?.label}
                {...buyBtn}
              />
            ) : null}
            {trailerBtn && trailerThumb ? (
              <ThumbnailButton
                bg={trailerThumb}
                label={trailerBtn?.label}
                function={"Youtube Modal"}
                {...trailerBtn}
              />
            ) : null}
          </div>
        )}
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
