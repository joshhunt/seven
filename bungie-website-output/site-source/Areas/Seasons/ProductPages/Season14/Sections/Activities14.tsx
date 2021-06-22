// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import BlockPlusButton from "@Areas/Seasons/ProductPages/Season14/Components/BlockPlusButton";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import classNames from "classnames";
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Activities14.module.scss";

interface IParallaxElementData {
  anchorRef: React.MutableRefObject<HTMLDivElement>;
  scrollRate: number;
  nameInState: string;
  maxTranslate?: number;
}

interface IParallaxStateProps {
  [key: string]: number;
}

interface Season14ActivitiesProps {
  inputRef: LegacyRef<HTMLDivElement>;
  toggleOverrideModal: () => void;
  toggleExpungeModal: () => void;
}

const Activities14: React.FC<Season14ActivitiesProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const s14 = Localizer.Season14;
  // refs of wrapping anchors for each parallax element
  const block1Ref = useRef<HTMLDivElement | null>(null);
  const block2Ref = useRef<HTMLDivElement | null>(null);
  const block3Ref = useRef<HTMLDivElement | null>(null);
  const bgBlockRef = useRef<HTMLDivElement | null>(null);
  // translation amounts for parallax elements
  const [translations, setTranslations] = useState<IParallaxStateProps>({
    background: 0,
    block1: 0,
    block2: 0,
    block3: 0,
  });

  useEffect(() => {
    window.addEventListener("scroll", throttle(handleScroll, 17));

    return () =>
      window.removeEventListener("scroll", throttle(handleScroll, 17));
  }, []);

  // handle image parallax effects on scroll
  const handleScroll = () => {
    // array with data for parallaxing elements
    const parallaxBlocks = [
      { anchorRef: bgBlockRef, scrollRate: 1.1, nameInState: "background" },
      { anchorRef: block1Ref, scrollRate: 1.3, nameInState: "block1" },
      { anchorRef: block2Ref, scrollRate: 1.2, nameInState: "block2" },
      { anchorRef: block3Ref, scrollRate: 1.2, nameInState: "block3" },
    ];

    parallax(parallaxBlocks);
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
      const { scrollRate, anchorRef, nameInState, maxTranslate } = eleObj;

      // element wrapping parallaxing element, used to calculate parallax amount
      const anchor = anchorRef.current;

      let translateAmount: number;

      if (!anchor) {
        // don't translate if no anchor found
        translateAmount = 0;
      } else {
        const anchorTop = anchor.getBoundingClientRect().top;
        const modifiedRate = scrollRate - 1;

        translateAmount = anchorTop * modifiedRate;

        // compare new translate to max if given
        if (maxTranslate) {
          translateAmount = Math.max(translateAmount, maxTranslate);
        }
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
  const throttle = useCallback((fn: () => void, wait: number) => {
    let time = Date.now();

    return () => {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  }, []);

  return (
    <div className={styles.activities}>
      <div
        className={styles.sectionIdAnchor}
        id={"activities"}
        ref={props.inputRef}
      />
      <div className={styles.sectionBg} />
      <div
        className={classNames(
          styles.parallaxBlockWrapper,
          styles.bgParallaxWrapper
        )}
        ref={bgBlockRef}
      >
        <img
          className={classNames(styles.parallaxBlock, styles.bgParallaxBlock)}
          src={"/7/ca/destiny/bgs/season14/s14_activities_parallax_mid.png"}
          style={{ transform: `translateY(${translations.background}px)` }}
        />
      </div>
      <div className={styles.contentWrapperNormal}>
        <SectionHeader
          title={s14.ActivitiesHeading}
          seasonText={s14.SectionHeaderSeasonText}
          sectionName={s14.ActivitiesSectionName}
        />
        <div className={styles.btnFlexWrapper}>
          <BlockPlusButton
            title={s14.OverrideBtnHeading}
            smallTitle={s14.OverrideBtnSmallHeading}
            toggleModalFunc={props.toggleOverrideModal}
            className={styles.blockBtn}
            isHalfWidth={!responsive.mobile}
            hasRightMargin={!responsive.mobile}
            hasBottomMargin={responsive.mobile}
            backgroundImage={
              "/7/ca/destiny/bgs/season14/s14_activities_modal_button_1.jpg"
            }
          />
          <BlockPlusButton
            title={s14.ExpungeBtnHeading}
            smallTitle={s14.ExpungeBtnSmallHeading}
            toggleModalFunc={props.toggleExpungeModal}
            className={styles.blockBtn}
            isHalfWidth={!responsive.mobile}
            backgroundImage={
              "/7/ca/destiny/bgs/season14/s14_activities_modal_button_2.jpg"
            }
          />
        </div>
        <div
          className={classNames(styles.parallaxBlockWrapper, styles.block1)}
          ref={block1Ref}
        >
          <img
            className={classNames(styles.parallaxBlock)}
            src={
              "/7/ca/destiny/bgs/season14/s14_activities_parallax_block_2.png"
            }
            style={{ transform: `translateY(${translations.block1}px)` }}
          />
        </div>
        <div
          className={classNames(styles.parallaxBlockWrapper, styles.block2)}
          ref={block2Ref}
        >
          <img
            className={classNames(styles.parallaxBlock)}
            src={
              "/7/ca/destiny/bgs/season14/s14_activities_parallax_block_3.png"
            }
            style={{ transform: `translateY(${translations.block2}px)` }}
          />
        </div>
        <div
          className={classNames(styles.parallaxBlockWrapper, styles.block3)}
          ref={block3Ref}
        >
          <img
            className={classNames(styles.parallaxBlock)}
            src={
              "/7/ca/destiny/bgs/season14/s14_activities_parallax_block_1.png"
            }
            style={{ transform: `translateY(${translations.block3}px)` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities14;
