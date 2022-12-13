// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React from "react";
import { BnetStackFile } from "../../../../../../Generated/contentstack-types";
import styles from "./S19Hero.module.scss";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import parallax from "../../parallax";

const parallaxConfig: {
  style?: React.CSSProperties;
  speed?: number;
  centered?: boolean;
  min?: number;
  max?: number;
}[] = [
  // sky
  {
    speed: 1,
    centered: true,
    style: {
      top: 0,
      left: "50%",
    },
  },
  // rsp
  {
    speed: 1.05,
    centered: true,
    max: 0,
    style: {
      top: 0,
      left: "50%",
    },
  },
  // earth
  {
    speed: 0.7,
    centered: true,
    style: {
      bottom: 0,
      left: "50%",
    },
  },
  // tvr
  {
    centered: true,
    speed: 0.88,
    style: {
      bottom: 117,
      left: "50%",
      marginLeft: -10,
    },
  },
  // plt
  {
    centered: true,
    speed: 0.61,
    style: {
      bottom: 0,
      left: "50%",
    },
  },
  // warlock
  {
    speed: 0.91,
    style: {
      bottom: 290,
      left: `${(1112 / 1920) * 100}%`,
    },
  },
  // hunter
  {
    speed: 0.65,
    style: {
      bottom: 9,
      left: `${(938 / 1920) * 100}%`,
    },
  },
  // titan
  {
    speed: 0.6,
    style: {
      bottom: 83,
      left: `${(982 / 1920) * 100}%`,
    },
  },
];

type S19HeroProps = {
  data?: {
    date?: string;
    bg_mobile?: BnetStackFile;
    trailer_btn?: {
      text?: string;
      video_id?: string;
    };
    cta?: {
      icon: BnetStackFile;
      text: string;
      display_cta: boolean;
    };
    logo?: BnetStackFile;
    desktop_parallax_images?: BnetStackFile[];
    smg_label?: string;
    smg_bg?: {
      desktop_bg?: BnetStackFile;
      mobile_bg?: BnetStackFile;
    };
  };
  scrollToEvent?: () => void;
};

export const S19Hero: React.FC<S19HeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);
  const block = React.useRef(null);

  React.useEffect(() => {
    if (!mobile) {
      const { init, destroy } = parallax(block.current, { viewable: 0 });

      init();

      return destroy;
    }
  }, [mobile, block.current]);

  const { data, scrollToEvent } = props;
  const {
    desktop_parallax_images,
    date,
    bg_mobile,
    logo,
    trailer_btn,
    cta,
    smg_bg,
    smg_label,
  } = data ?? {};

  const handleTrailerBtnClick = () => {
    YoutubeModal.show({ videoId: trailer_btn?.video_id });
  };

  const params = new URLSearchParams(location.search);
  const heroVariant = params.get("hero") || "1";
  const variant1Bg = mobile ? `url(${bg_mobile?.url})` : undefined;
  const variant2Bg = mobile
    ? `url(${smg_bg?.mobile_bg.url})`
    : `url(${smg_bg?.desktop_bg.url})`;

  const bg = heroVariant === "1" ? variant1Bg : variant2Bg;
  const enableParallax =
    desktop_parallax_images && !mobile && heroVariant === "1";

  return (
    <div
      ref={block}
      className={classNames(styles.hero, heroVariant === "2" && styles.heroSMG)}
      style={{
        backgroundImage: bg,
      }}
    >
      {enableParallax ? (
        <div className={styles.parallaxContainer} aria-hidden>
          {desktop_parallax_images.slice(0, 3).map((image, imageIndex) => {
            const layerConfig = parallaxConfig?.[imageIndex];

            return (
              <img
                key={image?.uid}
                src={image?.url}
                alt=""
                style={layerConfig?.style}
                data-centered={layerConfig?.centered}
                data-speed={layerConfig?.speed}
                data-min={layerConfig?.min}
                data-max={layerConfig?.max}
                className={classNames(styles.parallaxLayer, "layer")}
              />
            );
          })}
        </div>
      ) : null}
      <div className={styles.content}>
        <div className={styles.lowerContent}>
          {heroVariant === "2" ? (
            <div
              className={styles.smgLabel}
              dangerouslySetInnerHTML={sanitizeHTML(smg_label)}
            />
          ) : null}
          <img src={logo?.url} className={styles.logo} alt={""} />
          <p
            className={styles.date}
            dangerouslySetInnerHTML={sanitizeHTML(date)}
          />
          <div className={styles.btns}>
            <Button
              className={styles.trailerBtn}
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
            <EventCTA {...cta} scrollToEvent={scrollToEvent} />
          </div>
        </div>
      </div>
      {enableParallax ? (
        <div className={styles.parallaxContainer} aria-hidden>
          {desktop_parallax_images.slice(3).map((image, imageIndex) => {
            const layerConfig = parallaxConfig?.[imageIndex + 3];

            return (
              <img
                key={image?.uid}
                src={image?.url}
                alt=""
                style={layerConfig?.style}
                data-centered={layerConfig?.centered}
                data-speed={layerConfig?.speed}
                data-min={layerConfig?.min}
                data-max={layerConfig?.max}
                className={classNames(styles.parallaxLayer, "layer")}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const EventCTA: React.FC<{
  icon: BnetStackFile;
  text: string;
  display_cta: boolean;
  scrollToEvent: () => void;
}> = (props) => {
  const { scrollToEvent, icon, display_cta, text } = props;

  if (!display_cta) {
    return null;
  }

  return (
    <div className={styles.ctaWrapper}>
      <button className={styles.ctaContent} onClick={scrollToEvent}>
        <img src={icon?.url} alt={""} className={styles.ctaIcon} />
        <span dangerouslySetInnerHTML={sanitizeHTML(text)} />
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
