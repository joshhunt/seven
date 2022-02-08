// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import classNames from "classnames";
import React, {
  Dispatch,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./WQArg.module.scss";

interface WQArgProps {}

const bgImg = "/7/ca/destiny/bgs/wq_arg/ce_bg.jpg";
const fxBorderImg = "/7/ca/destiny/bgs/wq_arg/ce_bg_screen_fx_border.png";
const logoImg = "/7/ca/destiny/bgs/wq_arg/ce_logo.png";
const screenImg = "/7/ca/destiny/bgs/wq_arg/ce_sreen.png";
const grainVideo = "/7/ca/destiny/bgs/wq_arg/ce_grain.mp4";

const title = "DESTINY 2 THE WITCH QUEEN | COLLECTOR’S EDITION";
const comingText = "COMING SOON";

const WQArg: React.FC<WQArgProps> = (props) => {
  const [eleTransforms, setEleTransforms] = useState({
    logo: "",
    fx: "",
    grid: "",
  });

  useEffect(() => {
    if (!Responsive.state.mobile) {
      document.addEventListener("mousemove", handleMouseMove);

      return cleanup;
    }
  }, []);

  const cleanup = () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      // get transform strings for each element
      const logo = getParallaxTransform(e, 1);
      const fx = getParallaxTransform(e, 2);
      const grid = getParallaxTransform(e, 3);

      setEleTransforms({ logo, fx, grid });
    });
  };

  const getParallaxTransform = (e: MouseEvent, factor: number) => {
    const { clientY, clientX } = e;

    // mid points of viewport
    const viewMidX = document.body.clientWidth / 2;
    const viewMidY = window.innerHeight / 2;

    const offsetX = clientX - viewMidX;
    const offsetY = viewMidY - clientY;

    // base amount of pixels to move element per px mouse is moved
    const baseParallax = 0.01;

    return `translate(${offsetX * baseParallax * factor * -1}px, ${
      offsetY * factor * baseParallax
    }px)`;
  };

  return (
    <div className={styles.wqArg}>
      <BungieHelmet>
        <body
          className={SpecialBodyClasses(
            BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
          )}
        />
      </BungieHelmet>

      <div
        className={classNames(styles.bg, styles.back)}
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      <div className={classNames(styles.bg, styles.logoWrapper)}>
        <img
          src={logoImg}
          className={styles.logo}
          style={{ transform: eleTransforms.logo }}
        />
      </div>

      <div className={classNames(styles.gridWrapper)}>
        <div
          className={classNames(styles.bg, styles.grid)}
          style={{
            backgroundImage: `url(${screenImg})`,
            transform: eleTransforms.grid,
          }}
        />
      </div>

      <div className={classNames(styles.grainVideoWrapper, styles.bg)}>
        <video
          className={styles.grainVideo}
          autoPlay={true}
          loop={true}
          controls={false}
        >
          <source src={grainVideo} />
        </video>
      </div>

      <div className={classNames(styles.bg, styles.textWrapper)}>
        <p className={styles.title}>{title}</p>
      </div>

      <div className={classNames(styles.bg, styles.comingSoonWrapper)}>
        <p className={styles.text}>{comingText}</p>
      </div>

      <div className={classNames(styles.bg, styles.fxWrapper)}>
        <div
          className={classNames(styles.bg, styles.fx)}
          style={{
            backgroundImage: `url(${fxBorderImg})`,
            transform: eleTransforms.fx,
          }}
        />
      </div>
    </div>
  );
};

export default WQArg;
