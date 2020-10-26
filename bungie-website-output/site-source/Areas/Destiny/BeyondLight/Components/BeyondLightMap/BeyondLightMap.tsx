// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React, { useState, useRef, useEffect, memo } from "react";
import styles from "./BeyondLightMap.module.scss";
import BeyondLightMapToolTip from "./BeyondLightMapToolTip";

interface IMapPointDataDefinition {
  title: string;
  description: string;
  imageThumb: string;
  image?: string;
}

interface BeyondLightMapProps {
  sectionHeading?: string;
  sectionEyebrow?: string;
  backgroundImage?: string;
  backgroundImageCandy?: string;
  backgroundImageCandyTwo?: string;
  toolTipFlair?: string;

  mapPointData?: IMapPointDataDefinition[];
}

const BeyondLightMap: React.FC<BeyondLightMapProps> = (props) => {
  const [isActive, setActive] = useState(null);
  const [parallaxPos, setParallaxPos] = useState();
  const ref = useRef<HTMLElement | undefined>();

  useEffect(() => {
    window.addEventListener("scroll", getTop);
    window.addEventListener("click", (e) => handleClick(e));

    return () => {
      window.removeEventListener("scroll", getTop);
      window.removeEventListener("click", (e) => handleClick(e));
    };
  }, []);

  const getTop = () => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();

      setParallaxPos(top / window.innerHeight);
    }
  };

  const handleClick = (e) => {
    const targetId = e.target.getAttribute("id");

    if (e.target) {
      setActive(targetId);
    }
  };

  const transformer = (max) =>
    `50% ${max * parallaxPos * 1.5}px, 50% ${max * parallaxPos * 0.7}px`;
  const outerMax = 250;
  const outer = transformer(outerMax);

  return (
    <section className={styles.sectionWrapper} ref={ref}>
      <div
        className={styles.backgroundContainer}
        style={{
          backgroundImage: `url(${props.backgroundImageCandy}), url(${props.backgroundImageCandyTwo}),url(${props.backgroundImage})`,
          backgroundPosition: `${outer}, center center`,
        }}
      >
        <p className={styles.eyebrow}>{props.sectionEyebrow}</p>
        <h2 className={styles.heading}>{props.sectionHeading}</h2>
        <div className={styles.tipWrapper}>
          {props.mapPointData &&
            props.mapPointData.map((e) => (
              <BeyondLightMapToolTip
                toolTipId={e.title}
                isActive={isActive === e.title}
                key={e.title}
                title={e.title}
                description={e.description}
                imageThumb={e.imageThumb}
                image={e.image}
                toolTipFlair={props.toolTipFlair}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BeyondLightMap);
