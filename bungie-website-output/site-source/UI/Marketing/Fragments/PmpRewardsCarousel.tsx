// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Seasons/ProductPages/Season16/Sections/RewardsAndCalendar16.module.scss";
import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ScrollingSeasonCarousel } from "@UI/Destiny/ScrollingSeasonCarousel";
import { bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpRewardsCarousel } from "../../../Generated/contentstack-types";

type PmpRewardsCarouselProps = DataReference<
  "pmp_rewards_carousel",
  BnetStackPmpRewardsCarousel
> & {
  classes?: {
    root?: string;
  };
};

export const PmpRewardsCarousel: React.FC<PmpRewardsCarouselProps> = ({
  data,
  classes,
}) => {
  const { mobile } = useDataStore(Responsive);

  // Build seasons pass for the carousel
  const rankRows =
    data?.desktop_images?.map((img, i) => {
      return (
        <div
          key={i}
          className={classNames(styles.rankRow)}
          style={{ backgroundImage: bgImageFromStackFile(img) }}
        />
      );
    }) ?? [];

  const mobileRankRows =
    data?.mobile_images?.map((img, i) => {
      return (
        <div
          key={i}
          className={classNames(styles.mobileRankRow)}
          style={{ backgroundImage: bgImageFromStackFile(img) }}
        />
      );
    }) ?? [];

  return (
    <div className={classNames(styles.carouselWrapper, classes?.root)}>
      <ScrollingSeasonCarousel
        showProgress={false}
        topLabel={<p className={styles.carouselText}>{data?.top_heading}</p>}
        bottomLabel={
          <p className={styles.carouselText}>{data?.bottom_heading}</p>
        }
      >
        {mobile ? mobileRankRows : rankRows}
      </ScrollingSeasonCarousel>
    </div>
  );
};
