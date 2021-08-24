import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import React, { LegacyRef } from "react";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { Localizer } from "@bungie/localization";
import { Responsive } from "@Boot/Responsive";
import classNames from "classnames";
import { useDataStore } from "@bungie/datastore/DataStore";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { BasicSize } from "@UIKit/UIKitUtils";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "./Season11Progression.module.scss";
import { Season11DataStore } from "@Areas/Seasons/ProductPages/Season11/Season11DataStore";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Season11AvailableToAll } from "@Areas/Seasons/ProductPages/Season11/Components/Season11AvailableToAll";
import { Season11PotentialVideo } from "@Areas/Seasons/ProductPages/Season11/Components/Season11PotentialVideo";
import {
  Season11MobileSubtitle,
  Season11VerticalSubtitle,
} from "@Areas/Seasons/ProductPages/Season11/Components/Season11VerticalSubtitle";

interface Season11ProgressionProps {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Season11Progression: React.FC<Season11ProgressionProps> = (
  props
) => {
  const responsive = useDataStore(Responsive);
  const season11Data = useDataStore(Season11DataStore);

  const rowCount = responsive.mobile ? 20 : 10;
  const ranks = [...Array(rowCount).keys()].map((i) => i + 1);

  const rows = ranks.map((rank) => (
    <div
      key={rank}
      className={classNames(styles.rankRow, styles[`rankRow${rank}`])}
    />
  ));

  return (
    <div id={"progression"} ref={props.inputRef}>
      <div
        className={styles.wrapper}
        style={{
          backgroundImage: `url(${Season11Image(
            "S11_SeasonalRanks_desktop_bg.jpg"
          )})`,
        }}
      >
        <Season11VerticalSubtitle separator={"//"}>
          {Localizer.Season11.S11Progression}
        </Season11VerticalSubtitle>
        <Grid className={styles.seasonalRanks}>
          <GridCol
            cols={responsive.mobile ? 12 : 5}
            className={styles.seasonalRanksImage}
          >
            <Season11PotentialVideo
              videoId={season11Data.ranksTrailerYoutubeId}
            >
              <img
                src={Season11Image("S11_SeasonalRanks_Video.jpg")}
                alt={Localizer.Season11.ProgressionTitle}
              />
            </Season11PotentialVideo>
          </GridCol>
          {!responsive.mobile && <GridCol cols={1}>&nbsp;</GridCol>}
          <GridCol
            cols={responsive.mobile ? 12 : 6}
            className={styles.seasonalRanksText}
          >
            <Season11MobileSubtitle separator={"//"}>
              {Localizer.Season11.S11Progression}
            </Season11MobileSubtitle>
            <div className={styles.title}>
              {Localizer.Season11.ProgressionTitle}
            </div>
            <Season11AvailableToAll className={styles.ata} />
            <div className={styles.desc}>
              {Localizer.Season11.ProgressionDesc}
            </div>
          </GridCol>
        </Grid>
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
            {rows}
          </SeasonCarousel>
        </div>
        <div className={styles.rewardsContent}>
          <div className={styles.smallTitle}>
            {Localizer.Season11.IncludedWithTheSeason}
          </div>
          <div className={styles.rewardsContainer}>
            <div className={styles.rewardsLists}>
              <div className={styles.passRewardsList}>
                <div
                  className={styles.cornerIcon}
                  style={{
                    backgroundImage:
                      "url(7/ca/destiny/bgs/season11/s11_SeasonalRanks_corner_pyramid.png)",
                  }}
                />
                <h2 className={styles.rewardsSmallTitle}>
                  {Localizer.Seasonoftheworthy.ListTitleSeasonPass}
                </h2>
                <ul
                  dangerouslySetInnerHTML={sanitizeHTML(
                    Localizer.Season11.SeasonPassRewards
                  )}
                />
              </div>
              <div className={styles.freeRewardsList}>
                <div
                  className={styles.cornerIcon}
                  style={{
                    backgroundImage:
                      "url(7/ca/destiny/bgs/season11/pass_corner_d2.png)",
                  }}
                />
                <h2 className={styles.rewardsSmallTitle}>
                  {Localizer.Seasonoftheworthy.AvailableToAll}
                </h2>
                <ul
                  dangerouslySetInnerHTML={sanitizeHTML(
                    Localizer.Season11.FreeRewards
                  )}
                />
              </div>
            </div>
          </div>

          {/* Buy */}

          <div className={styles.buySection}>
            <div className={styles.smallerTitle}>
              {Localizer.Season11.GetTheSeasonOfArrivals}
            </div>
            <div className={styles.buttonWrapper}>
              <BuyButton
                className={styles.buyButton}
                buttonType={"teal"}
                size={BasicSize.Large}
                url={RouteHelper.DestinyBuy()}
                sheen={0}
              >
                {Localizer.Seasons.MenuCTALabel}
              </BuyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
