// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Button } from "@UIKit/Controls/Button/Button";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import {
  bgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { useCallback, useEffect, useRef } from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import { Responsive } from "@Boot/Responsive";
import { Icon } from "@UIKit/Controls/Icon";
import styles from "./LightfallHero.module.scss";

interface LightfallHeroProps {
  data?: BnetStackNebulaProductPage["hero"];
  TestCData?: BnetStackNebulaProductPage["img_swap_test"];
}

export const LightfallHero: React.FC<LightfallHeroProps> = ({
  data,
  TestCData,
}) => {
  const {
    lightfall_logo,
    destiny_logo,
    date_text,
    buy_btn_text,
    trailer_btn_text,
    mobile_bg,
    desktop_images,
    desktop_bg,
    trailer_youtube_url,
    ab_test,
    video_bg_test,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);
  const urlParams = UrlUtils.useQuery();

  const TestB = urlParams.get("t_aug25_hero") === "true";
  const TestC = urlParams.get("t_sept1_ourend") === "true";
  const TestD = urlParams.get("t_sept19_hero") === "true";

  /** Layers of images to parallax */
  const parallaxImages = useRef<{ [key: number]: HTMLDivElement }>([]);

  useEffect(() => {
    if (!mobile && !TestB) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [mobile]);

  /** Parallaxes image layers on mouse move */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    throttle(() => {
      const images = parallaxImages?.current;

      const mousePosition = {
        x: e.x - window.innerWidth / 2,
        y: window.innerHeight / 2 - e.y,
      };

      /* DUST */
      images?.[0] && parallaxImage(mousePosition, images?.[0], 0.0025, 0.0025);
      images?.[1] && parallaxImage(mousePosition, images?.[1], -0.003, -0.003);
      images?.[2] && parallaxImage(mousePosition, images?.[2], 0.006, -0.006);
      // /* Osiris Shard */
      images?.[3] && parallaxImage(mousePosition, images?.[3], 0.01, 0.01);
      // /* Third Shard */
      images?.[4] && parallaxImage(mousePosition, images?.[4], 0.007, -0.014);
      // /* Titan Shard */
      images?.[5] && parallaxImage(mousePosition, images?.[5], -0.018, -0.018);
      // /* Cabal Shard */
      images?.[6] && parallaxImage(mousePosition, images?.[6], -0.015, 0.006);
      // /* Tormentor Shard */
      images?.[7] && parallaxImage(mousePosition, images?.[7], -0.04, -0.07);
      images?.[8] && parallaxImage(mousePosition, images?.[8], -0.01, 0.01);
      images?.[9] && parallaxImage(mousePosition, images?.[9], -0.02, -0.02);
      images?.[10] &&
        parallaxImage(mousePosition, images?.[10], -0.005, -0.005);
    }, 1000 / 30);
  }, []);

  /** Transforms an image based on current mouse position from center of screen */
  const parallaxImage = (
    mousePositionFromCenter: { x: number; y: number },
    imageEle: HTMLDivElement,
    xOffset: number,
    yOffset: number
  ) => {
    imageEle.style.transform = `translate(${
      mousePositionFromCenter.x * xOffset
    }px, ${mousePositionFromCenter.y * yOffset * -1}px)`;
  };

  const desktopBgImage = TestB
    ? ab_test?.bg?.desktop_bg
    : TestC
    ? TestCData?.hero_bg?.desktop_bg
    : desktop_bg;
  const mobileBgImage = TestB
    ? ab_test?.bg?.mobile_bg
    : TestC
    ? TestCData?.hero_bg?.mobile_bg
    : mobile_bg;
  const bgVideo =
    (TestB && ab_test?.bg_vid) || (TestD && video_bg_test?.desktop_bg);
  const bgPoster =
    (TestB && ab_test?.bg?.desktop_bg?.url) ||
    (TestD && video_bg_test?.desktop_poster?.url);

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          desktopBgImage,
          mobileBgImage,
          mobile
        ),
      }}
    >
      {!mobile && !TestB && !TestC && !TestD && (
        <div className={styles.parallaxOuterWrapper}>
          <div className={styles.parallaxBgWrapper}>
            {desktop_images?.map((image, i) => {
              return (
                <div
                  ref={(ref) => (parallaxImages.current[i] = ref)}
                  key={i}
                  className={styles.parallaxLayer}
                  style={{ backgroundImage: bgImage(image?.url) }}
                />
              );
            })}
          </div>
        </div>
      )}
      {!mobile && (TestB || TestD) && !TestC && bgVideo && (
        <video
          className={styles.heroVid}
          poster={bgPoster}
          autoPlay
          muted
          playsInline
          loop
          controls={false}
        >
          <source src={bgVideo?.url} type={"video/mp4"} />
        </video>
      )}
      <div className={styles.sectionContent}>
        <img className={styles.lfLogo} src={lightfall_logo?.url} />
        <p className={styles.date}>
          <SafelySetInnerHTML html={date_text} />
        </p>
        <div className={styles.btns}>
          <Button
            className={styles.btn}
            url={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "lightfall",
            })}
          >
            {buy_btn_text}
          </Button>
          <Button
            className={styles.btn}
            onClick={() =>
              YoutubeModal.show({ youtubeUrl: trailer_youtube_url })
            }
          >
            <span>
              <Icon
                className={styles.playIcon}
                iconType={"material"}
                iconName={"play_arrow"}
              />
            </span>
            {trailer_btn_text}
          </Button>
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
