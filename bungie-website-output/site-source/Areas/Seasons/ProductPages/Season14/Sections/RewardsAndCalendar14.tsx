// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import BlockPlusButton from "@Areas/Seasons/ProductPages/Season14/Components/BlockPlusButton";
import { SeasonPassRewardsList } from "@Areas/Seasons/ProductPages/Season14/Components/SeasonPassRewardsList";
import { Responsive } from "@Boot/Responsive";
import { Localizer } from "@Global/Localization/Localizer";
import { Platform } from "@Platform";
import { ScrollingSeasonCarousel } from "@UI/Destiny/ScrollingSeasonCarousel";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./RewardsAndCalendar14.module.scss";

const fetchCalendar = async () => {
  try {
    const images = await Platform.ContentService.GetContentByTagAndType(
      "season-14-calendar",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    );

    return images.properties;
  } catch (err) {
    return null;
  }
};

interface RewardsAndCalendar14Props {
  inputRef: LegacyRef<HTMLDivElement>;
  toggleCalendarModal: () => void;
  calendarBtnTitle: string;
}

const RewardsAndCalendar14: React.FC<RewardsAndCalendar14Props> = (props) => {
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

  const bgImage = Responsive.state.mobile
    ? "/7/ca/destiny/bgs/season14/s14_rewards_bg_mobile.jpg"
    : "/7/ca/destiny/bgs/season14/s14_rewards_bg_desktop.jpg";

  return (
    <div className={classNames(styles.rewardsAndCalendar)}>
      <div
        className={styles.sectionIdAnchor}
        id={"rewards"}
        ref={props.inputRef}
      />
      <img className={styles.sectionBg} src={bgImage} />
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
          {Responsive.state.mobile ? mobileRankRows : rankRows}
        </ScrollingSeasonCarousel>
      </div>
      <div className={styles.contentWrapperNormal}>
        <SeasonPassRewardsList
          loc={Localizer.Season14Features}
          evenRowBgColor={"rgba(35, 15, 30, 1)"}
          oddRowBgColor={"rgba(22, 10, 20, 1)"}
          numberOfRows={10}
          logo={"/7/ca/destiny/bgs/season14/s14_season_icon.png"}
        />
        <BlockPlusButton
          title={props.calendarBtnTitle}
          backgroundImage={calendarImages?.ImageThumbnail}
          onClick={() => showImage(calendarImages?.LargeImage)}
          className={styles.calendarBlockBtn}
        />
      </div>
    </div>
  );
};

export default RewardsAndCalendar14;
