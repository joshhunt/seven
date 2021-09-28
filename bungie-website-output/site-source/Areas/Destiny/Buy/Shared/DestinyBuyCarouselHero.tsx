// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import styles from "./DestinyBuyCarouselHero.module.scss";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React, { Dispatch, useEffect, useRef, useState } from "react";

interface DestinyBuyCarouselHeroProps {
  /** optional state passed in to control pause state of carousel */
  isPaused?: boolean;
  setIsPaused?: (s: boolean) => void | Dispatch<boolean>;
  children: React.ReactNode[];
}

let slideIntervalTimeout: number | null = null;
let slideIntervalStart: number | null = null;
let lastSlideResumeTime: number | null = null;
let timeLeftOnCurrentInterval: number | null = null;

const DestinyBuyCarouselHero: React.FC<DestinyBuyCarouselHeroProps> = (
  props
) => {
  const slideIntervalDurationMs = 5000;
  const slideTransitionDurationMs = 400;
  const [currentSlideIndex, setCurrentSlide] = useState(0);
  const [pauseState, setPauseState] = useState(false);
  const [isAnimatingState, setIsAnimatingState] = useState(false);
  const isAnimatingRef = useRef(false);
  const setIsAnimating = (status: boolean) => {
    setIsAnimatingState(status);
    isAnimatingRef.current = status;
  };

  // previously visible slide
  const [prevSlideIndex, setPrevSlideIndex] = useState(null);

  const { children } = props;

  // use pause state from parent if provided
  const isCarouselPaused = props.isPaused ?? pauseState;

  /**
   * this ensures there will always be at least 4 slides, which is required to animate properly
   * since this is a looping animation that needs the current, prev and next slides along with a
   * 4th slide to avoid weird transitions between slides
   */
  const slides = [...children, ...children];

  useEffect(() => {
    // reset slide interval controllers
    slideIntervalStart = Date.now();
    lastSlideResumeTime = null;
    timeLeftOnCurrentInterval = slideIntervalDurationMs;

    if (!isCarouselPaused && (slides?.length ?? 0) > 2) {
      createNewIntervalTimeout();
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    // don't fire pause/resume functions on load, when prevSlideIndex is null
    if (prevSlideIndex !== null) {
      isCarouselPaused ? pauseCarousel() : resumeCarousel();
    } else {
      // on load, set previous slide index to 0 to allow pause/resume functions to be called
      setPrevSlideIndex(0);
    }
  }, [isCarouselPaused]);

  /**
   * Updates pause state on this component and parent component if possible
   */
  const setIsCarouselPaused = (status: boolean) => {
    props.setIsPaused && props.setIsPaused(status);
    setPauseState(status);
  };

  /**
   * creates new timeout function to control when to move to the next slide
   */
  const createNewIntervalTimeout = (duration = slideIntervalDurationMs) => {
    clearTimeout(slideIntervalTimeout);
    slideIntervalTimeout = setTimeout(
      () => goToNext(),
      duration + slideTransitionDurationMs
    );
  };

  const pauseCarousel = () => {
    timeLeftOnCurrentInterval =
      timeLeftOnCurrentInterval -
      (Date.now() - (lastSlideResumeTime ?? slideIntervalStart));
    setIsCarouselPaused(true);
    clearTimeout(slideIntervalTimeout);
  };

  const resumeCarousel = () => {
    lastSlideResumeTime = Date.now();
    createNewIntervalTimeout(timeLeftOnCurrentInterval);
    setIsCarouselPaused(false);
  };

  const goToNext = () => {
    !isAnimatingRef.current && goToSlideIndex(getNextSlideIndex());
  };

  const goToPrev = () => {
    !isAnimatingRef.current && goToSlideIndex(getPrevSlideIndex());
  };

  const goToSlideIndex = (index: number) => {
    setPrevSlideIndex(currentSlideIndex);
    setCurrentSlide(index);
    lockCarouselBtns();
  };

  /**
   * Locks carousel buttons from firing while carousel is animating
   */
  const lockCarouselBtns = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, slideTransitionDurationMs);
  };

  /**
   * returns index of slide to right of current slide
   */
  const getNextSlideIndex = () => {
    return currentSlideIndex + 1 >= slides.length ? 0 : currentSlideIndex + 1;
  };

  /**
   * returns index of slide to left of current slide
   */
  const getPrevSlideIndex = () => {
    return currentSlideIndex - 1 < 0
      ? slides.length - 1
      : currentSlideIndex - 1;
  };

  const handlePaginationBarClick = (selectedIndex: number) => {
    // only move to new slide if selected slide is not the currently shown slide
    if (
      selectedIndex !== currentSlideIndex &&
      selectedIndex !== currentSlideIndex - slides.length / 2
    ) {
      let newSlideIndex = selectedIndex;

      // if current slide's index is greater than the number of pagination options
      if (currentSlideIndex >= slides.length / 2) {
        // add half the total number of slides to the selected index to get the correct slide to go to
        newSlideIndex = selectedIndex + slides.length / 2;
      }

      goToSlideIndex(newSlideIndex);
      pauseCarousel();
    }
  };

  // slide hidden to left of current slide
  const leftSlideIndex = getPrevSlideIndex();

  // slide hidden to right of current slide
  const rightSlideIndex = getNextSlideIndex();
  const showButtons = slides.length > 2;

  return (
    <div className={styles.carousel}>
      {showButtons && (
        <>
          <button
            className={classNames(styles.carouselArrow, styles.left)}
            onClick={goToPrev}
          >
            <Icon
              className={styles.arrowIcon}
              iconName={"arrow_left"}
              iconType={"material"}
            />
          </button>
          <button
            className={classNames(styles.carouselArrow, styles.right)}
            onClick={goToNext}
          >
            <Icon
              className={styles.arrowIcon}
              iconName={"arrow_right"}
              iconType={"material"}
            />
          </button>
        </>
      )}

      {slides.map((slide, i) => {
        const isVisibleSlide = i === currentSlideIndex;
        const isHiddenToLeft =
          i === leftSlideIndex ||
          (i !== rightSlideIndex && i < currentSlideIndex);
        const isHiddenToRight =
          i === rightSlideIndex ||
          (i !== leftSlideIndex && i > currentSlideIndex);

        const slideClasses = classNames(styles.slideWrapper, {
          [styles.current]: isVisibleSlide,
          [styles.toLeft]: isHiddenToLeft,
          [styles.toRight]: isHiddenToRight,
          // keeps track of which slide is transitioning out so it's z-index stays above all other slides
          [styles.transitioningOut]: i === prevSlideIndex,
        });

        return (
          <div key={i} className={slideClasses}>
            {slide}
          </div>
        );
      })}
      {slides.length > 2 && (
        <div className={styles.paginationBars}>
          <button
            className={classNames(styles.playPauseBtn, {
              [styles.pauseIcon]: !isCarouselPaused,
            })}
            onClick={() => setIsCarouselPaused(!isCarouselPaused)}
          />

          {children?.map((_, i) => {
            const barClasses = classNames(styles.paginationBar, {
              // since we duplicated all the slides on component mount, each pagination button corresponds to 2 slides
              [styles.current]:
                i === currentSlideIndex ||
                i + slides.length / 2 === currentSlideIndex,
              [styles.pause]: isCarouselPaused,
              [styles.fadeOut]:
                isAnimatingState &&
                (i === prevSlideIndex ||
                  i === prevSlideIndex - slides.length / 2),
            });

            return (
              <div
                key={i}
                className={barClasses}
                onClick={() => handlePaginationBarClick(i)}
              >
                <div className={styles.progressBar} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DestinyBuyCarouselHero;
