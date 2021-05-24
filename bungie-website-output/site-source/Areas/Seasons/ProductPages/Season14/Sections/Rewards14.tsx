// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import Carousel14 from "@Areas/Seasons/ProductPages/Season14/Components/Carousel14";
import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season14/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Localizer } from "@Global/Localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React from "react";
import styles from "./Rewards14.module.scss";

interface Rewards14Props {}

const Rewards14: React.FC<Rewards14Props> = (props) => {
  const s14 = Localizer.Season14;

  const slides = [
    {
      image: "/7/ca/destiny/bgs/season14/s14_rewards_carousel_1.jpg",
      title: s14.RewardsSlideTitle1,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_rewards_carousel_2.jpg",
      title: s14.RewardsSlideTitle2,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_rewards_carousel_3.jpg",
      title: s14.RewardsSlideTitle3,
    },
  ];

  const learnMoreUrl = `/${LocalizerUtils.currentCultureName}/Profile/Rewards`;
  const learnMoreAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season14Page,
    "Season14RewardsLearnMoreAnalyticsId",
    ""
  );

  return (
    <div className={styles.rewardsSection}>
      <div className={styles.contentWrapperNormal}>
        <LazyLoadWrapper>
          <SectionHeader
            title={s14.RewardsHeading}
            seasonText={s14.SectionHeaderSeasonText}
            sectionName={s14.RewardsSectionName}
            isBold={true}
            className={styles.sectionHeader}
          />
          <div className={classNames(styles.rewardsBlurb)}>
            <p className={styles.paragraphLarge}>
              {s14.RewardsBlurb}{" "}
              <span>
                <a
                  href={learnMoreUrl}
                  className={classNames(styles.learnMore)}
                  data-analytics-id={learnMoreAnalyticsId}
                >
                  {s14.LearnMoreShortText}
                </a>
              </span>
            </p>
          </div>
        </LazyLoadWrapper>
        <Carousel14
          slides={slides}
          arrowColor={"#fff"}
          activeIndicatorColor={"rgb(255, 255, 255)"}
          inactiveIndicatorColor={"rgba(255, 255, 255, .3)"}
        />
      </div>
    </div>
  );
};

export default Rewards14;
