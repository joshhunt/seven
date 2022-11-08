// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import classNames from "classnames";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./LazyLoadWrapper.module.scss";

interface LazyLoadWrapperProps {
  className?: string;
  shownClassName?: string;
  style?: React.CSSProperties;
  useCustomEffect?: boolean;
  children?: React.ReactNode;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = (props) => {
  const [hasEleLoaded, setHasEleLoaded] = useState(false);
  const eleRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // on scroll, check if element should be lazy loaded in, throttled at 1 check per 50ms max
    window.addEventListener("scroll", throttle(checkLazyLoad, 50));

    // make initial lazy load check
    checkLazyLoad();

    // remove event listener on umount
    return cleanup;
  }, []);

  const checkLazyLoad = () => {
    const ele = eleRef.current;

    // if element not loaded yet, return early
    if (!ele) {
      return;
    }

    const eleRect = ele.getBoundingClientRect();

    // if element is 90vh or less from top of screen, load in element and remove event listener
    if (eleRect.top <= innerHeight * 0.9) {
      setHasEleLoaded(true);
      cleanup();
    }
  };

  /**
   * Removes event listeners from window
   */
  const cleanup = () => {
    window.removeEventListener("scroll", throttle(checkLazyLoad, 50));
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
    <div
      className={classNames(
        { [styles.lazyLoadWrapper]: !props.useCustomEffect },
        { [styles.shown]: hasEleLoaded },
        { [props.shownClassName]: hasEleLoaded && props.shownClassName },
        { [props.className]: props.className }
      )}
      ref={eleRef}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default LazyLoadWrapper;
