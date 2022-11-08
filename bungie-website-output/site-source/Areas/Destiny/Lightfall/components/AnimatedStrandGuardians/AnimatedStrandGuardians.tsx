// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { bgImage, bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./AnimatedStrandGuardians.module.scss";

const interpolate = (
  value: number,
  input: number[],
  output: number[],
  clamp?: boolean
) => {
  const percentComplete = (value - input[0]) / (input[1] - input[0]);

  let interpolatedValue = (output[1] - output[0]) * percentComplete + output[0];

  if (clamp) {
    interpolatedValue = Math.min(
      Math.max(interpolatedValue, output[0]),
      output[1]
    );
  }

  return interpolatedValue;
};

interface AnimatedStrandGuardiansProps {
  data?: BnetStackNebulaProductPage["strand_section"]["guardians_graphic"];
  aboveContent: React.MutableRefObject<HTMLDivElement>;
  belowContent: React.MutableRefObject<HTMLDivElement>;
  toasts?: BnetStackNebulaProductPage["guardian_toasts"];
}

export const AnimatedStrandGuardians: React.FC<AnimatedStrandGuardiansProps> = ({
  data,
  aboveContent,
  belowContent,
  toasts,
}) => {
  const { normal_img, blur_img, mask_img } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const [scrollPercent, setScrollPercent] = useState(0);

  const scrollerWrapper = useRef<HTMLDivElement | null>(null);
  const graphicWrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.addEventListener("scroll", () => handleScroll(mobile));

    return () =>
      window.removeEventListener("scroll", () => handleScroll(mobile));
  }, [mobile]);

  /** Translates image mask across background image on scroll */
  const handleScroll = useCallback((isMobile: boolean) => {
    requestAnimationFrame(() => {
      const imgRect = graphicWrapper.current?.getBoundingClientRect();
      const scrollerRect = scrollerWrapper.current?.getBoundingClientRect();

      // stop now if problem getting wrapper ele
      if ((graphicWrapper && scrollerWrapper && !imgRect) || !scrollerRect) {
        return;
      }

      /** Distance away from graphic when animation starts */
      const animationStartThreshold = isMobile ? 0 : window.innerHeight;

      const percentScrolled = interpolate(
        scrollerRect.top * -1,
        [
          animationStartThreshold * -1,
          scrollerRect.height - imgRect.height + animationStartThreshold,
        ],
        [0, 1]
      );

      setScrollPercent(percentScrolled);

      /** Top padding being applied to section via css */
      const topPadding = isMobile
        ? window.innerHeight / 2
        : Math.min(document.body.clientWidth, 1920) * 0.26;

      const hasScrolledToAnimation =
        Math.abs(imgRect.top - (window.innerHeight / 2 - imgRect.height / 2)) <=
        1;
      const hasScrolledPastAnimation =
        scrollerRect.bottom - (imgRect.bottom + topPadding) <= 1;

      adjustAboveContent(
        imgRect.height,
        scrollerRect.height,
        topPadding,
        hasScrolledPastAnimation
      );
      adjustBelowContent(
        topPadding,
        imgRect.height,
        scrollerRect.height,
        hasScrolledPastAnimation,
        hasScrolledToAnimation
      );
    });
  }, []);

  /** Adjusts content above graphic to prevent it from scrolling away when graphic is fixed in middle of screen */
  const adjustAboveContent = useCallback(
    (
      imgHeight: number,
      imgWrapperHeight: number,
      topPadding: number,
      hasScrolledPastAnimation: boolean
    ) => {
      const content = aboveContent.current;

      if (content) {
        /* Top position when animated section is frozen: ((top content height) - .5vh - (.5 * graphic height)) * -1 */
        const topPositionSticky =
          (content.clientHeight - (window.innerHeight / 2 - imgHeight / 2)) *
          -1;
        /* Top position once scrolled past animated section: (graphic scroll wrapper height) - (graphic height) */
        const topPositionRelative = imgWrapperHeight - imgHeight - topPadding;

        content.style.top = `${
          hasScrolledPastAnimation ? topPositionRelative : topPositionSticky
        }px`;
        content.style.position = hasScrolledPastAnimation
          ? "relative"
          : "sticky";
      }
    },
    []
  );

  /** Adjusts content below graphic to prevent it from scrolling away when graphic is fixed in middle of screen */
  const adjustBelowContent = useCallback(
    (
      topPadding: number,
      imgHeight: number,
      imgWrapperHeight: number,
      hasScrolledPastAnimation: boolean,
      hasScrolledToAnimation: boolean
    ) => {
      const content = belowContent.current;

      if (content) {
        const isSticky = hasScrolledToAnimation && !hasScrolledPastAnimation;

        // default bottom position before animated section reaches center of viewport
        let bottomPosition = imgWrapperHeight - imgHeight;

        if (isSticky) {
          // bottom position when animated section is sticky in center of viewport
          bottomPosition =
            (content.clientHeight - window.innerHeight / 2 + imgHeight / 2) *
            -1;
        } else if (hasScrolledPastAnimation) {
          // bottom position after scrolling past animated section
          bottomPosition = topPadding;
        }

        content.style.bottom = `${bottomPosition}px`;

        content.style.position = isSticky ? "sticky" : "relative";
      }
    },
    []
  );

  /** Position of image mask */
  const maskPositionX = mobile
    ? undefined
    : interpolate(scrollPercent, [0, 1], [-80, 180]);
  const backgroundPositionX = mobile
    ? interpolate(scrollPercent, [0, 1], [0, 100], true)
    : undefined;

  return (
    <div className={styles.strandGraphic} ref={scrollerWrapper}>
      <div className={styles.imgWrapper} ref={graphicWrapper}>
        <div
          className={styles.blurImg}
          style={{
            backgroundImage: bgImageFromStackFile(blur_img),
            backgroundPosition:
              typeof backgroundPositionX === "number"
                ? `${backgroundPositionX}% 0`
                : undefined,
          }}
        />
        <div
          className={styles.colorImg}
          style={{
            backgroundImage: bgImageFromStackFile(normal_img),
            WebkitMaskPosition: maskPositionX ? `${maskPositionX}%` : undefined,
            backgroundPosition:
              typeof backgroundPositionX === "number"
                ? `${backgroundPositionX}% 0`
                : undefined,
          }}
        />
        <GuardianFloatingToast
          input={mobile ? [-0.1, 0] : [0.25, 0.4]}
          scrollPercent={scrollPercent}
          classes={{ root: styles.warlockToast }}
          data={toasts?.[0]}
        />
        <GuardianFloatingToast
          input={mobile ? [0.3, 0.4] : [0.4, 0.55]}
          scrollPercent={scrollPercent}
          classes={{ root: styles.hunterToast }}
          data={toasts?.[1]}
        />
        <GuardianFloatingToast
          input={mobile ? [0.6, 0.7] : [0.57, 0.72]}
          scrollPercent={scrollPercent}
          classes={{ root: styles.titanToast }}
          data={toasts?.[2]}
        />
        <div className={styles.gradientOverlay} />
      </div>
    </div>
  );
};

type GuardianFloatingToastProps = {
  data?: BnetStackNebulaProductPage["guardian_toasts"][number];
  input: number[];
  scrollPercent: number;
  classes?: {
    root?: string;
  };
};

const GuardianFloatingToast: React.FC<GuardianFloatingToastProps> = ({
  input,
  scrollPercent,
  classes,
  data,
}) => {
  const { heading, blurb, heading_img } = data?.toast ?? {};

  const { mobile } = useDataStore(Responsive);

  // position applied for desktop screens
  const positionTop = 100 - interpolate(scrollPercent, input, [0, 120]);
  // opacity applied for mobile screens
  const opacity = interpolate(scrollPercent, input, [0, 100]);

  return (
    <div
      className={classNames(styles.floatingToast, classes?.root)}
      style={{
        top: mobile ? undefined : `${positionTop}%`,
        opacity: mobile ? `${opacity}%` : undefined,
      }}
    >
      <div
        className={styles.toastHeader}
        style={{ backgroundImage: bgImage(heading_img?.url) }}
      >
        <p className={styles.title}>
          <SafelySetInnerHTML html={heading} />
        </p>
      </div>
      <p className={styles.blurb}>{blurb}</p>
    </div>
  );
};
