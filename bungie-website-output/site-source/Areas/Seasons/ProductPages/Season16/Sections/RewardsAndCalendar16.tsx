// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SeasonPassRewardsList } from "@Areas/Seasons/ProductPages/Season16/Components/SeasonPassRewardsList";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Platform } from "@Platform";
import { ScrollingSeasonCarousel } from "@UI/Destiny/ScrollingSeasonCarousel";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import {
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./RewardsAndCalendar16.module.scss";

interface RewardsAndCalendar16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["rewards_section"];
}

const RewardsAndCalendar16: React.FC<RewardsAndCalendar16Props> = ({
  inputRef,
  data,
}) => {
  const { mobile } = useDataStore(Responsive);

  // Build seasons pass for the carousel
  const rankRows =
    data?.rewards_carousel.desktop_images.map((img, i) => {
      return (
        <div
          key={i}
          className={classNames(styles.rankRow)}
          style={{ backgroundImage: bgImageFromStackFile(img) }}
        />
      );
    }) ?? [];

  const mobileRankRows =
    data?.rewards_carousel.mobile_images.map((img, i) => {
      return (
        <div
          key={i}
          className={classNames(styles.mobileRankRow)}
          style={{ backgroundImage: bgImageFromStackFile(img) }}
        />
      );
    }) ?? [];

  const sectionBg = bgImageFromStackFile(data?.bg?.desktop);

  return (
    <div className={classNames(styles.rewardsAndCalendar)}>
      <div className={styles.sectionIdAnchor} id={"rewards"} ref={inputRef} />

      <div
        className={styles.sectionBg}
        style={{ backgroundImage: sectionBg }}
      />

      <div className={styles.carouselWrapper}>
        <ScrollingSeasonCarousel
          showProgress={false}
          topLabel={
            <p className={styles.carouselText}>
              {data?.rewards_carousel.top_title}
            </p>
          }
          bottomLabel={
            <p className={styles.carouselText}>
              {data?.rewards_carousel.bottom_title}
            </p>
          }
        >
          {mobile ? mobileRankRows : rankRows}
        </ScrollingSeasonCarousel>
      </div>
      <div className={styles.contentWrapperNormal}>
        <SeasonPassRewardsList data={data?.rewards_table} logo={undefined} />
        <div
          className={classNames(
            styles.sectionIdAnchor,
            styles.calendarIdAnchor
          )}
        />
      </div>
    </div>
  );
};

export default RewardsAndCalendar16;
