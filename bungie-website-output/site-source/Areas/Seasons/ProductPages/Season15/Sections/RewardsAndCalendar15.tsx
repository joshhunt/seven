// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SeasonPassRewardsList } from "@Areas/Seasons/ProductPages/Season15/Components/SeasonPassRewardsList";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Platform } from "@Platform";
import { ScrollingSeasonCarousel } from "@UI/Destiny/ScrollingSeasonCarousel";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./RewardsAndCalendar15.module.scss";

const fetchCalendar = async () => {
  try {
    const images = await Platform.ContentService.GetContentByTagAndType(
      "season-15-calendar",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    );

    return images?.properties;
  } catch (err) {
    return null;
  }
};

interface RewardsAndCalendar15Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

const RewardsAndCalendar15: React.FC<RewardsAndCalendar15Props> = (props) => {
  const responsive = useDataStore(Responsive);
  const [calendarImages, setCalendarImages] = useState(null);

  useEffect(() => {
    fetchCalendar().then((response) => {
      setCalendarImages(response);
    });
  }, []);

  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  // Build seasons pass for the carousel
  const rankRowKeys = [...Array(10).keys()];
  const rankRows = rankRowKeys.map((i) => {
    const rank = i + 1;

    return (
      <div
        key={rank}
        className={classNames(styles.rankRow, styles[`rankRow${rank}`])}
      />
    );
  });

  const mobileRankRowKeys = [...Array(20).keys()];
  const mobileRankRows = mobileRankRowKeys.map((i) => {
    const rank = i + 1;

    return (
      <div
        key={rank}
        className={classNames(
          styles.mobileRankRow,
          styles[`mobileRankRow${rank}`]
        )}
      />
    );
  });

  const calendarAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    "Season15CalendarAnalyticsId",
    ""
  );

  return (
    <div className={classNames(styles.rewardsAndCalendar)}>
      <div
        className={styles.sectionIdAnchor}
        id={"rewards"}
        ref={props.inputRef}
      />

      <div className={styles.sectionBg} />

      <div className={styles.carouselWrapper}>
        <ScrollingSeasonCarousel
          showProgress={false}
          topLabel={
            <p className={styles.carouselText}>
              {Localizer.Seasons.FreeSeasonalRewards}
            </p>
          }
          bottomLabel={
            <p className={styles.carouselText}>
              {Localizer.Seasons.SeasonPassRewards}
            </p>
          }
        >
          {responsive.mobile ? mobileRankRows : rankRows}
        </ScrollingSeasonCarousel>
      </div>
      <div className={styles.contentWrapperNormal}>
        <SeasonPassRewardsList
          loc={Localizer.Season15Features}
          evenRowBgColor={"rgba(74, 61, 137, 0.83)"}
          oddRowBgColor={"rgba(56, 47, 104, 0.83)"}
          numberOfRows={12}
          logo={"/7/ca/destiny/bgs/season15/s15_season_icon.svg"}
        />
        <div
          className={classNames(
            styles.sectionIdAnchor,
            styles.calendarIdAnchor
          )}
        />
        {calendarImages && (
          <IconActionCard
            analyticsId={calendarAnalyticsId}
            cardTitle={Localizer.Season15.CalendarBtnTitle}
            backgroundImage={calendarImages?.ImageThumbnail}
            action={() => showImage(calendarImages?.LargeImage)}
            classes={{ root: styles.calendarBlockBtn }}
          />
        )}
      </div>
    </div>
  );
};

export default RewardsAndCalendar15;
