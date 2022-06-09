// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayBuyBtn } from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import {
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import React from "react";
import { BnetStackFreeToPlayProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./FreeHero.module.scss";

interface FreeHeroProps {
  data: BnetStackFreeToPlayProductPage["hero"];
  V2Data: BnetStackFreeToPlayProductPage["v2_hero"];
  scrollToRewardsCallout: () => void;
}

export const FreeHero: React.FC<FreeHeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, V2Data, scrollToRewardsCallout } = props;
  const { bg, btn_text, logo } = data ?? {};

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          undefined,
          bg?.mobile,
          mobile
        ),
      }}
    >
      {V2Data?.bg_video?.url && !mobile && (
        <video
          className={styles.bgVideo}
          poster={bg?.desktop?.url}
          loop
          playsInline
          autoPlay
          muted
        >
          <source src={V2Data?.bg_video?.url} type={"video/mp4"} />
        </video>
      )}

      <div className={styles.videoOverlay} />

      <div className={styles.contentWrapper}>
        <img className={styles.logo} src={logo?.url} />
        <img
          className={styles.heroesWelcomeLogo}
          src={V2Data?.heroes_welcome_logo?.url}
        />
        <p className={styles.subTitle}>{V2Data?.sub_heading}</p>

        <div className={styles.trailerBtns}>
          {V2Data?.trailer_btns?.map((btn, i) => {
            return (
              <div key={i} className={styles.trailerBtnWrapper}>
                <ImageVideoThumb
                  image={btn?.bg?.url}
                  youtubeUrl={btn?.youtube_url}
                  classes={{
                    image: styles.bg,
                    imageContainer: styles.trailerBtn,
                  }}
                />
                <p className={styles.caption}>{btn?.caption}</p>
              </div>
            );
          })}
        </div>

        <FreeToPlayBuyBtn btn_text={btn_text} className={styles.buyBtn} />

        <div className={styles.heroBug}>
          <div
            className={styles.bgImg}
            style={{
              backgroundImage: bgImageFromStackFile(
                V2Data?.hero_bug?.background
              ),
            }}
          />
          <p className={styles.bugHeading} onClick={scrollToRewardsCallout}>
            {V2Data?.hero_bug?.heading}
          </p>
          <span className={styles.arrows} onClick={scrollToRewardsCallout}>
            <span className={styles.baseArrows} />
            <span className={styles.animatedArrow} />
          </span>
        </div>
      </div>
    </div>
  );
};
