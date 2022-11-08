// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayBuyBtn } from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import { useCSWebpImages } from "@Utilities/CSUtils";
import {
  bgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import React, { useMemo } from "react";
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

  const images = useCSWebpImages(
    useMemo(
      () => ({
        poster: bg?.desktop?.url,
        logo: logo?.url,
        hwLogo: V2Data?.heroes_welcome_logo?.url,
        bugBg: V2Data?.hero_bug?.background?.url,
        trailerBtnThumbs: V2Data?.trailer_btns?.map((btn) => btn?.bg?.url),
      }),
      [data, V2Data]
    )
  );

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
          poster={images.poster}
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
        <img className={styles.logo} src={images.logo} />
        <img className={styles.heroesWelcomeLogo} src={images.hwLogo} />
        <p className={styles.subTitle}>{V2Data?.sub_heading}</p>

        <div className={styles.trailerBtns}>
          {V2Data?.trailer_btns?.map((btn, i) => {
            return (
              <div key={i} className={styles.trailerBtnWrapper}>
                <ImageVideoThumb
                  image={images.trailerBtnThumbs?.[i]}
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
            style={{ backgroundImage: bgImage(images.bugBg) }}
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
