// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import classNames from "classnames";
import styles from "./BeyondLightBackgroundParallax.module.scss";
import React, { ReactNode, useState, useRef, useEffect, memo } from "react";

interface BeyondLightBackgroundParallaxClasses {
  wrapper?: string;
  backgroundLayerOne?: string;
  backgroundLayerTwo?: string;
  backgroundLayerThree?: string;
  backgroundLayerFour?: string;
  childStyles?: string;
}

interface BeyondLightBackgroundParallaxProps {
  backgroundLayerOne?: string;
  backgroundLayerOneMobile?: string;
  backgroundLayerTwo?: string;
  backgroundLayerThree?: string;
  backgroundLayerFour?: string;
  backgroundLayerOneSpeed?: number;
  backgroundLayerTwoSpeed?: number;
  backgroundLayerThreeSpeed?: number;
  backgroundLayerFourSpeed?: number;
  childParallaxSpeed?: number;
  backgroundColor?: string;
  children?: ReactNode;
  classes?: BeyondLightBackgroundParallaxClasses;
  isMobile?: boolean;
}

const BeyondLightBackgroundParallax = ({
  backgroundLayerOne,
  backgroundLayerTwo,
  backgroundLayerOneMobile,
  backgroundLayerThree,
  backgroundLayerFour,
  backgroundLayerOneSpeed,
  backgroundLayerTwoSpeed,
  backgroundLayerThreeSpeed,
  backgroundLayerFourSpeed,
  childParallaxSpeed,
  backgroundColor,
  children,
  classes,
  isMobile,
}: BeyondLightBackgroundParallaxProps) => {
  const [parallaxPos, setParallaxPos] = useState(0);
  const ref = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    window.addEventListener("scroll", getTop);

    return () => {
      window.removeEventListener("scroll", getTop);
    };
  }, []);

  const getTop = () => {
    requestAnimationFrame(() => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();

        setParallaxPos(top);
      }
    });
  };

  const backgroundTransformer = (ratio: number) =>
    `50% ${Math.round(-((parallaxPos * ratio) / 100))}px`;
  const transformer = (ratio: number) =>
    `translateY(${Math.round(-((parallaxPos * ratio) / 100))}px)`;

  const childTransform = transformer(childParallaxSpeed);
  const layerTwoTransform = transformer(backgroundLayerTwoSpeed);
  const layerThreeTransform = transformer(backgroundLayerThreeSpeed);
  const layerFourTransform = transformer(backgroundLayerFourSpeed);
  const backgroundPositionSpeed = backgroundTransformer(
    backgroundLayerOneSpeed
  );

  const layerOneClasses = classNames(
    styles.background,
    classes?.backgroundLayerOne
  );
  const layerTwoClasses = classNames(
    styles.backgroundTwo,
    classes?.backgroundLayerTwo
  );
  const layerThreeClasses = classNames(
    styles.backgroundThree,
    classes?.backgroundLayerThree
  );
  const layerFourClasses = classNames(
    styles.backgroundFour,
    classes?.backgroundLayerFour
  );
  const childClasses = classNames(
    styles.childParallaxItem,
    classes?.childStyles
  );
  const wrapperClasses = classNames(styles.parallaxWrapper, classes?.wrapper);

  return (
    <div
      className={wrapperClasses}
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: `${
          backgroundLayerOne && isMobile
            ? `url(${backgroundLayerOneMobile})`
            : `url(${backgroundLayerOne})`
        }`,
        backgroundPosition: `${
          backgroundPositionSpeed && backgroundLayerOne
            ? `${backgroundPositionSpeed}`
            : null
        }`,
      }}
      ref={ref}
    >
      <div className={layerOneClasses}>
        {backgroundLayerTwo !== undefined && backgroundLayerTwo?.length > 1 && (
          <div
            className={layerTwoClasses}
            style={{
              backgroundImage: `${
                backgroundLayerTwo && `url(${backgroundLayerTwo})`
              }`,
              transform: `${
                backgroundLayerTwoSpeed && layerTwoTransform
                  ? `${layerTwoTransform}`
                  : null
              }`,
            }}
          />
        )}
        {children && (
          <div
            className={childClasses}
            style={{
              transform: `${
                childParallaxSpeed && childTransform
                  ? `${childTransform}`
                  : null
              }`,
            }}
          >
            {children}
          </div>
        )}
        {backgroundLayerThree !== undefined &&
          backgroundLayerThree?.length > 1 && (
            <div
              className={layerThreeClasses}
              style={{
                backgroundImage: `${
                  backgroundLayerThree && `url(${backgroundLayerThree})`
                }`,
                transform: `${
                  backgroundLayerThreeSpeed ? `${layerThreeTransform}` : null
                }`,
              }}
            />
          )}

        {backgroundLayerFour !== undefined &&
          backgroundLayerFour?.length > 1 && (
            <div
              className={layerFourClasses}
              style={{
                backgroundImage: `${
                  backgroundLayerFour && `url(${backgroundLayerFour})`
                }`,
                transform: `${
                  backgroundLayerFourSpeed && layerFourTransform
                    ? `${layerFourTransform}`
                    : null
                }`,
              }}
            />
          )}
      </div>
    </div>
  );
};

export default memo(BeyondLightBackgroundParallax);
