// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import styles from "./SeasonPass13.module.scss";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import ClickableVideoOrImgThumb from "@UI/Marketing/ClickableVideoOrImgThumb";
import { MarketingContentBlock } from "@UIKit/Layout/MarketingContentBlock";
import classNames from "classnames";
import React, { LegacyRef } from "react";

interface SeasonPass13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const SeasonPass13: React.FC<SeasonPass13Props> = (props) => {
  const s13 = Localizer.Season13;
  const imgDir = "/7/ca/destiny/bgs/season13/";
  const responsive = useDataStore(Responsive);

  const seasonPassVideoJsonParamToLocalizedValue = (
    paramName: string
  ): string | null => {
    const seasonPassVideoString = ConfigUtils.GetParameter(
      SystemNames.Season13Page,
      paramName,
      "{}"
    ).replace(/'/g, '"');
    const seasonPassVideoData = JSON.parse(seasonPassVideoString);

    return (
      seasonPassVideoData[Localizer.CurrentCultureName] ??
      seasonPassVideoData["en"] ??
      null
    );
  };

  const seasonPassVideoId = seasonPassVideoJsonParamToLocalizedValue(
    "SeasonPassTrailer"
  );

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

  const showVideo = (videoId: string) => {
    YoutubeModal.show({ videoId });
  };

  return (
    <div id="seasonPass" ref={props.inputRef}>
      <div className={styles.seasonPassSection}>
        <div className={styles.titleBox}>
          <div className={styles.smallTitle}>
            {Localizer.Destiny.submenu_rewards}
          </div>
          <div className={styles.title}>{s13.unlock}</div>
          <div className={styles.blurb}>{s13.unlockBlurb}</div>
        </div>
        <div className={styles.boxes}>
          <div className={styles.seasonElement}>
            <ClickableVideoOrImgThumb
              thumbnailClass={styles.imageThumbnail}
              thumbnailPath={`${imgDir}rewards_screenshot_1_thumbnail.jpg`}
              screenshotPath={`${imgDir}rewards_screenshot_1.jpg`}
              isMedium={responsive.medium}
            />
            <div className={styles.icon}>
              <div className={styles.chosenIcon} />
              <div className={styles.blurb}>{s13.weaponName}</div>
            </div>
          </div>
          <div className={styles.seasonElement}>
            <ClickableVideoOrImgThumb
              thumbnailClass={styles.imageThumbnail}
              thumbnailPath={`${imgDir}rewards_screenshot_2_thumbnail.jpg`}
              screenshotPath={`${imgDir}rewards_screenshot_2.jpg`}
              isMedium={responsive.medium}
            />
            <div className={styles.icon}>
              <div className={styles.tricorn} />
              <div className={styles.blurb}>{s13.armorName}</div>
            </div>
          </div>
          <div className={styles.seasonElement}>
            <ClickableVideoOrImgThumb
              thumbnailClass={styles.imageThumbnail}
              thumbnailPath={`${imgDir}rewards_screenshot_3_thumbnail.jpg`}
              screenshotPath={`${imgDir}rewards_screenshot_3.jpg`}
              isMedium={responsive.medium}
            />
            <div className={styles.icon}>
              <div className={styles.chosenIcon} />
              <div className={styles.blurb}>{s13.rewardsName}</div>
            </div>
          </div>
        </div>
      </div>

      {seasonPassVideoId?.length > 0 && (
        <div className={styles.trailerSection}>
          <div className={styles.titleContainer}>
            <div
              style={{
                backgroundImage: `url(${Img(
                  "destiny/bgs/season13/rewards_trailer_thumbnail.jpg"
                )})`,
              }}
              role={"presentation"}
              onClick={() => showVideo(seasonPassVideoId)}
            >
              <div className={styles.thumbnailPlayButton} role={"button"} />
            </div>
          </div>
          <div className={styles.smallTitle}>{s13.SeasonOfTheChosenSeason}</div>
        </div>
      )}

      <div className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          <SeasonCarousel
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
          </SeasonCarousel>
        </div>
      </div>
    </div>
  );
};
