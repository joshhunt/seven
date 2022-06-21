// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SeasonPassRewardsList } from "@Areas/Seasons/ProductPages/Season16/Components/SeasonPassRewardsList";
import SeasonPassRewardProgression from "@Areas/Seasons/Progress/SeasonPassRewardProgression";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
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
import { SeasonUtils } from "@Utilities/SeasonUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./RewardsAndCalendar16.module.scss";

interface RewardsAndCalendar16Props
  extends D2DatabaseComponentProps<"DestinySeasonDefinition"> {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["rewards_section"];
}

const RewardsAndCalendar16: React.FC<RewardsAndCalendar16Props> = ({
  inputRef,
  data,
  definitions,
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
        <SeasonPassRewardProgression
          seasonHash={SeasonUtils.GetSeasonHashFromSeasonNumber(
            16,
            definitions.DestinySeasonDefinition
          )}
        />
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

export default withDestinyDefinitions(RewardsAndCalendar16, {
  types: ["DestinySeasonDefinition"],
});
