// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import HelmBlock from "@Areas/Seasons/ProductPages/Season14/Components/HelmBlock";
import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season14/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import styles from "./Story14.module.scss";

interface IParallaxElementData {
  /* rate at which to parallax element relative to page scroll speed */
  scrollRate: number;
  /* element wrapping parallax element */
  anchorRef: React.MutableRefObject<HTMLDivElement>;
  /* string used to access the element's current parallax translate value in state */
  nameInState: string;
}

interface Season14StoryProps {
  inputRef: LegacyRef<HTMLDivElement>;
}

const Season14Story: React.FC<Season14StoryProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const s14 = Localizer.Season14;

  // elements wrapping parallax elements, used to calculate parallax amount
  const foregroundParallaxAnchor = useRef<HTMLDivElement | null>(null);
  const backgroundParallaxAnchor = useRef<HTMLDivElement | null>(null);
  // parallax amounts
  const [translations, setTranslations] = useState({
    bgTranslate: 0,
    foregroundTranslate: 0,
  });

  useEffect(() => {
    addEventListeners();

    // call scroll event handler to make initial parallax on load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttle(handleScroll, 17));
    };
  }, []);

  const addEventListeners = () => {
    // add scroll listener for parallax effect throttled at 60fps
    window.addEventListener("scroll", throttle(handleScroll, 17));
  };

  // handle parallax effects on scroll
  const handleScroll = () => {
    // return early if on mobile
    if (responsive.mobile) {
      return;
    }

    // data for parallaxing each element
    const parallaxElements = [
      {
        scrollRate: 1.1,
        anchorRef: backgroundParallaxAnchor,
        nameInState: "bgTranslate",
      },
      {
        scrollRate: 1.2,
        anchorRef: foregroundParallaxAnchor,
        nameInState: "foregroundTranslate",
      },
    ];

    parallax(parallaxElements);
  };

  /**
   * parallax - updates parallax state
   *    *
   * @param parallaxElements - array of objects with data on how to parallax an element
   */
  const parallax = (parallaxElements: IParallaxElementData[]) => {
    // new translations to update state with
    const newTranslations: { [key: string]: number } = {};

    for (const eleObj of parallaxElements) {
      const { scrollRate, anchorRef, nameInState } = eleObj;

      // element wrapping parallaxing element, used to calculate parallax amount
      const anchor = anchorRef.current;

      let translateAmount: number;

      if (!anchor) {
        // don't translate if no anchor found
        translateAmount = 0;
      } else {
        const anchorTop = anchor.getBoundingClientRect()?.top;
        const modifiedRate = scrollRate - 1;
        const anchorTopToScreenBottom = anchorTop - innerHeight;

        translateAmount = anchorTopToScreenBottom * modifiedRate;
      }

      newTranslations[nameInState] = translateAmount;
    }

    // update state with new translations
    setTranslations({ ...translations, ...newTranslations });
  };

  /**
   * throttle - throttle for scroll event listeners
   * @param fn - callback function
   * @param wait - ms to wait between callback function calls
   */
  const throttle = (fn: () => void, wait: number) => {
    let time = Date.now();

    return () => {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  };

  // add a scale transform to transform string for background parallax image
  const backgroundTransforms = `${responsive.mobile ? "" : " scale(1.3)"}`;

  return (
    <div className={styles.storySection}>
      <div
        className={styles.sectionIdAnchor}
        id={"storyOnly"}
        ref={props.inputRef}
      />
      <div className={styles.topSection} ref={backgroundParallaxAnchor}>
        <div
          className={styles.sectionBg}
          style={{
            transform: `translateY(${translations.bgTranslate}px)${backgroundTransforms}`,
          }}
        />
        <div className={classNames(styles.contentWrapperNormal)}>
          <div className={styles.textContent}>
            <LazyLoadWrapper>
              <div className={styles.divider} />
              <SectionHeader
                title={s14.StoryMainHeading}
                seasonText={s14.SectionHeaderSeasonText}
                sectionName={s14.StorySectionName}
              />
              <p
                className={styles.paragraph}
                dangerouslySetInnerHTML={sanitizeHTML(s14.StoryMainBlurb)}
              />
            </LazyLoadWrapper>
          </div>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.sectionBgWrapper} ref={foregroundParallaxAnchor}>
          <div
            className={styles.sectionBg}
            style={{
              transform: `translateY(${translations.foregroundTranslate}px)`,
            }}
          />
        </div>
        <div className={classNames(styles.contentWrapperNormal)}>
          <LazyLoadWrapper>
            <div className={styles.textContent}>
              <SectionHeader
                title={s14.StorySecondHeading}
                seasonText={s14.SectionHeaderSeasonText}
                sectionName={s14.StorySectionName}
              />
              <p
                className={styles.paragraph}
                dangerouslySetInnerHTML={sanitizeHTML(s14.StorySecondBlurb)}
              />
            </div>
          </LazyLoadWrapper>
        </div>
        <div className={classNames(styles.contentWrapperLarge)}>
          <HelmBlock />
        </div>
      </div>
    </div>
  );
};

export default Season14Story;
