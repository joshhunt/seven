// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { RouteDefs } from "@Routes/RouteDefs";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import { Anchor } from "@UI/Navigation/Anchor";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { MarketingContentBlock } from "@UIKit/Layout/MarketingContentBlock";
import { IMarketingMediaAsset } from "@Utilities/ContentUtils";
import React, { useEffect, useRef, useState } from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@bungie/localization";
import styles from "./SeasonOfTheHunt.module.scss";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { RouteHelper } from "@Routes/RouteHelper";
import { Responsive } from "@Boot/Responsive";
import classNames from "classnames";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { DestinyNewsAndMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { SeasonsDefinitions } from "../../SeasonsDefinitions";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";

interface SeasonOfTheHuntProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

/**
 * Seasons' Index Page
 *  *
 * @param {SeasonOfTheHuntProps} props
 * @returns
 */
const SeasonOfTheHunt: React.FC<SeasonOfTheHuntProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const [calendarImage, setCalendarImage] = useState<string>(
    Img(
      `destiny/bgs/season12/calendar/beyond_light_calendar_${Localizer.CurrentCultureName.toUpperCase()}.jpg`
    )
  );

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
  ]);

  const [heroRef, setHeroRef] = useState<HTMLDivElement>(null);

  const seasonHuntVideoId = ConfigUtils.GetParameter(
    "SeasonHuntYoutube",
    Localizer.CurrentCultureName,
    "en"
  );
  const showSeasonPassVideo = ConfigUtils.SystemStatus(
    "SeasonHuntSeasonPassYoutube"
  );
  const seasonPassVideoId = ConfigUtils.GetParameter(
    "SeasonHuntSeasonPassYoutube",
    Localizer.CurrentCultureName,
    "en"
  );
  const hawkmoonTrailerVideo = ConfigUtils.SystemStatus(
    "SeasonHuntHawkmoonTrailer"
  );
  const hawkmoonTrailerId = ConfigUtils.GetParameter(
    "SeasonHuntHawkmoonTrailer",
    Localizer.CurrentCultureName,
    "en"
  );

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  const showImage = (imageName: string) => {
    Modal.open(
      <img
        src={Img(`destiny/bgs/${imageName}`)}
        className={styles.largeImage}
        alt={imageName}
      />,
      {
        isFrameless: true,
      }
    );
  };

  const showVideo = (videoId: string) => {
    YoutubeModal.show({ videoId });
  };

  const videoCheck = (canShowVideo: boolean, videoId: string) => {
    if (canShowVideo) {
      showVideo(videoId);
    }
  };

  const videos = [
    {
      isVideo: true,
      thumbnail: Img("destiny/bgs/season12/media_trailer_hunt_thumbnail.jpg"),
      detail: seasonHuntVideoId,
    },
  ];

  if (showSeasonPassVideo) {
    videos.push({
      isVideo: true,
      thumbnail: Img(
        "destiny/bgs/season12/media_trailer_season_pass_thumbnail.jpg"
      ),
      detail: seasonPassVideoId,
    });
  }

  if (hawkmoonTrailerVideo) {
    videos.push({
      isVideo: true,
      thumbnail: Img(
        "destiny/bgs/season12/media_trailer_hawkmoon_thumbnail.jpg"
      ),
      detail: hawkmoonTrailerId,
    });
  }

  // Get FAQ content id from Webmaster
  const faq = ConfigUtils.GetParameter("CoreAreaSeasons", "D2SeasonsFAQ", 0);

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

  const imageMediaAsset = (
    imageThumb: string,
    largeImage: string,
    title = ""
  ): IMarketingMediaAsset => {
    return {
      buttonLabel: "",
      buttonLink: "",
      buttonSku: "",
      contentItemTitle: "",
      fontColor: undefined,
      hyperlink: "",
      loopingVideoThumbnail: "",
      subtitle: "",
      textBlock: "",
      title: title,
      videoId: "",
      videoMp4: "",
      videoThumbnail: "",
      videoTitle: "",
      imageThumbnail: imageThumb,
      largeImage: largeImage,
    };
  };

  return (
    <div className={styles.wrapper}>
      <BungieHelmet
        title={SeasonsDefinitions.season12.title}
        image={SeasonsDefinitions.season12.image}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            SpecialBodyClasses(BodyClasses.HideServiceAlert)
          )}
        />
      </BungieHelmet>

      {/* Hero */}

      <div className={styles.hero} ref={setHeroRef}>
        <video
          autoPlay={true}
          loop={true}
          muted={true}
          className={styles.heroVideo}
        >
          <source
            src={Img("destiny/videos/hero_bg_desktop.mp4")}
            type="video/mp4"
          />
        </video>
        <div className={styles.heroContent}>
          <div
            className={styles.heroLogo}
            style={{
              backgroundImage: `url(${Img(
                `destiny/bgs/season12/logo_${Localizer.CurrentCultureName}.png`
              )})`,
            }}
          />
          <div className={styles.heroButtons}>
            <Button
              buttonType={"white"}
              onClick={() => showVideo(seasonHuntVideoId)}
            >
              {Localizer.season12.watchthetrailer}
            </Button>
            <Button buttonType={"green"} url={RouteHelper.DestinyBuy()}>
              {Localizer.season12.playnow}
            </Button>
          </div>
          <div className={styles.dates}>{Localizer.season12.dates}</div>
        </div>
      </div>

      {/* Nav */}

      <div className={styles.nav}>
        <MarketingSubNav
          ids={Object.keys(idToElementsMapping)}
          renderLabel={(id) => Localizer.Destiny[`Submenu_${id}`]}
          primaryColor={"darkgray"}
          accentColor={"teal"}
          buttonProps={{
            children: Localizer.Seasons.MenuCTALabel,
            url: RouteHelper.DestinyBuy(),
            buttonType: "teal",
          }}
        />
      </div>

      {/* Story */}

      <div
        id={"storyonly"}
        ref={(el) => (idToElementsMapping["storyonly"] = el)}
        className={styles.storySection}
      >
        <MarketingContentBlock
          smallTitle={Localizer.Destiny.submenu_storyonly}
          sectionTitle={Localizer.Season12.storyTitle}
          blurb={Localizer.Season12.storyBlurb}
          alignment={globalState.responsive.mobile ? "left" : "center"}
          bgs={
            <div
              style={{
                backgroundPosition: `center top`,
                backgroundImage: `url(${Img(
                  "destiny/bgs/season12/story_bg_desktop.jpg"
                )}`,
              }}
            />
          }
          mobileBg={
            <div
              style={{
                backgroundSize: `contain`,
                backgroundImage: `url(${Img(
                  "destiny/bgs/season12/story_bg_mobile.jpg"
                )}`,
              }}
            />
          }
          bgColor={"rgb(12,18,14)"}
          margin={
            globalState.responsive.mobile
              ? "21rem auto 2rem"
              : "45rem auto 2rem"
          }
        >
          <ThreeItemGrid
            item1={imageMediaAsset(
              Img("destiny/bgs/season12/story_screenshot_1_thumbnail.jpg"),
              "story_screenshot_1.jpg"
            )}
            item2={imageMediaAsset(
              Img("destiny/bgs/season12/story_screenshot_2_thumbnail.jpg"),
              "story_screenshot_2.jpg"
            )}
            item3={imageMediaAsset(
              Img("destiny/bgs/season12/story_screenshot_3_thumbnail.jpg"),
              "story_screenshot_3.jpg"
            )}
          />
        </MarketingContentBlock>
      </div>

      {/* Activities */}

      <div
        id={"activities"}
        ref={(el) => (idToElementsMapping["activities"] = el)}
        className={styles.activitiesSection}
      >
        <MarketingContentBlock
          smallTitle={Localizer.Destiny.submenu_activities}
          sectionTitle={Localizer.Season12.activitiesTitle}
          blurb={Localizer.Season12.activitiesBlurb}
          alignment={globalState.responsive.mobile ? "left" : "center"}
          bgs={
            <div
              style={{
                backgroundPosition: `center top`,
                backgroundImage: `url(${Img(
                  "destiny/bgs/season12/hunt_bg_desktop.jpg"
                )}`,
              }}
            />
          }
          mobileBg={
            <div
              style={{
                backgroundSize: `contain`,
                backgroundImage: `url(${Img(
                  "destiny/bgs/season12/hunt_bg_mobile.jpg"
                )}`,
              }}
            />
          }
          bgColor={"rgb(23,24,19)"}
          margin={
            globalState.responsive.mobile
              ? "21rem auto 2rem"
              : "45rem auto 2rem"
          }
        >
          <ThreeItemGrid
            item1={imageMediaAsset(
              Img("destiny/bgs/season12/hunt_screenshot_1_thumbnail.jpg"),
              "hunt_screenshot_1.jpg"
            )}
            item2={imageMediaAsset(
              Img("destiny/bgs/season12/hunt_screenshot_2_thumbnail.jpg"),
              "hunt_screenshot_2.jpg"
            )}
            item3={imageMediaAsset(
              Img("destiny/bgs/season12/hunt_screenshot_3_thumbnail.jpg"),
              "hunt_screenshot_3.jpg"
            )}
          />
        </MarketingContentBlock>
      </div>

      {/* Exotics & Gear */}

      <div
        id={"exoticsGear"}
        ref={(el) => (idToElementsMapping["exoticsGear"] = el)}
        className={styles.exoticsGearSection}
      >
        <Grid className={styles.exotic} isTextContainer={true}>
          <GridCol cols={12} className={styles.exoticTitleBlock}>
            <MarketingTitles
              smallTitle={Localizer.Destiny.submenu_exoticsgear}
              sectionTitle={Localizer.Season12.BareYourFangs}
              alignment={globalState.responsive.mobile ? "left" : "center"}
            />
          </GridCol>
          <GridCol cols={3} mobile={12}>
            <div
              className={classNames(
                styles.exoticBlock,
                styles.exotic1,
                hawkmoonTrailerVideo ? styles.clickable : null
              )}
              onClick={() =>
                videoCheck(hawkmoonTrailerVideo, hawkmoonTrailerId)
              }
            >
              <div className={styles.clickableVideoButton}>
                <img
                  className={styles.exoticImage}
                  src={Img(
                    "/destiny/bgs/season12/exotics_hawkmoon_thumbnail.jpg"
                  )}
                  role={"presentation"}
                  alt=""
                />
              </div>
              <div className={styles.smallTitle}>
                {Localizer.Season12.exoticQuest}
              </div>
              <div className={styles.exoticTitle}>
                {Localizer.Season12.Hawkmoon}
              </div>
              <p className={styles.blurb}>{Localizer.Season12.HawkmoonText}</p>
            </div>
          </GridCol>
          <GridCol cols={3} mobile={12}>
            <div className={classNames(styles.exoticBlock, styles.exotic2)}>
              <img
                className={styles.exoticImage}
                src={Img(
                  "/destiny/bgs/season12/exotics_artifact_thumbnail.jpg"
                )}
                role={"presentation"}
                alt=""
              />
              <div className={styles.smallTitle}>
                {Localizer.Season12.seasonalartifact}
              </div>
              <div className={styles.exoticTitle}>
                {Localizer.Season12.artifactName}
              </div>
              <p className={styles.blurb}>
                {Localizer.Season12.PulledFromTheJawsOfAHive}
              </p>
            </div>
          </GridCol>
          <GridCol cols={3} mobile={12}>
            <div className={classNames(styles.exoticBlock, styles.exotic3)}>
              <img
                className={styles.exoticImage}
                src={Img("/destiny/bgs/season12/exotics_duality_thumbnail.jpg")}
                role={"presentation"}
                alt=""
              />
              <div className={styles.smallTitle}>
                {Localizer.Season12.exoticShotgun.toUpperCase()}
              </div>
              <div className={styles.exoticTitle}>
                {Localizer.Season12.duality}
              </div>
              <p className={styles.blurb}>
                {Localizer.Season12.CalmlyAimDownTheSights}
              </p>
            </div>
          </GridCol>
        </Grid>
      </div>

      {/* Rewards */}

      <div>
        <div className={styles.seasonPassSection}>
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.submenu_rewards}
            sectionTitle={Localizer.Season12.seasonPass}
            blurb={Localizer.Season12.GetSeason}
            alignment={globalState.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundPosition: `center top`,
                  backgroundImage: `url(${Img(
                    "/destiny/bgs/season12/rewards_bg_desktop.jpg"
                  )}`,
                  backgroundSize: `100% auto`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundSize: `contain`,
                  backgroundImage: `url(${Img(
                    "/destiny/bgs/season12/rewards_bg_mobile.jpg"
                  )}`,
                }}
              />
            }
            bgColor={"#0A0A0A"}
            margin={
              globalState.responsive.mobile
                ? "21rem auto 2rem"
                : "45rem auto 2rem"
            }
          >
            <ThreeItemGrid
              item1={imageMediaAsset(
                Img("destiny/bgs/season12/rewards_screenshot_1_thumbnail.jpg"),
                "rewards_screenshot_1.jpg",
                Localizer.Season12.QualityExoticShotgun
              )}
              icon1={Img("destiny/bgs/season12/s12_icon.svg")}
              item2={imageMediaAsset(
                Img("destiny/bgs/season12/rewards_screenshot_2_thumbnail.jpg"),
                "rewards_screenshot_2.jpg",
                Localizer.Season12.FreeSeasonalArmor
              )}
              icon2={Img("destiny/bgs/season12/s12_icon.svg")}
              item3={imageMediaAsset(
                Img("destiny/bgs/season12/rewards_screenshot_3_thumbnail.jpg"),
                "rewards_screenshot_3.jpg",
                Localizer.Season12.ProgressionBoostsExotic
              )}
              icon3={Img("destiny/bgs/season12/s12_icon.svg")}
            />
          </MarketingContentBlock>
        </div>
        {showSeasonPassVideo && (
          <div className={styles.trailerSection}>
            <div className={styles.titleContainer}>
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/season12/rewards_trailer_thumbnail.jpg"
                  )})`,
                }}
                role={"presentation"}
                onClick={() => showVideo(seasonPassVideoId)}
              >
                <div className={styles.thumbnailPlayButton} role={"button"} />
              </div>
            </div>
            <div className={styles.smallTitle}>
              {Localizer.season12.SeasonOfTheHuntSeason}
            </div>
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
              {responsive.mobile ? mobileRankRows : rankRows}
            </SeasonCarousel>
          </div>
        </div>
      </div>

      <div className={styles.includedSection}>
        <div className={styles.includedWith}>
          {Localizer.season12.includedWith}
        </div>
        <div className={styles.exoticTitle}>
          {Localizer.season12.Seasonofthehunt.toUpperCase()}
        </div>
        <div className={styles.rewardsContainer}>
          <div className={styles.rewardsLists}>
            <div className={styles.passRewardsList}>
              <div
                className={styles.cornerIcon}
                style={{
                  backgroundImage: `url(${Img(
                    "/destiny/bgs/season12/s12_corner.png"
                  )})`,
                }}
              />
              <h2 className={styles.rewardsSmallTitle}>
                {Localizer.Seasons.SeasonPassRewardTitle}
              </h2>
              <ul
                dangerouslySetInnerHTML={sanitizeHTML(
                  Localizer.Season12.htmlPaidRewards
                )}
              />
            </div>
            <div className={styles.freeRewardsList}>
              <div
                className={styles.cornerIcon}
                style={{
                  backgroundImage: `url(${Img(
                    "/destiny/bgs/season12/d2_corner.png"
                  )})`,
                }}
              />
              <h2 className={styles.rewardsSmallTitle}>
                {Localizer.Seasons.ShortAllMarker}
              </h2>
              <ul
                dangerouslySetInnerHTML={sanitizeHTML(
                  Localizer.Season12.htmlFreeRewards
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id={"rewards"}
        ref={(el) => (idToElementsMapping["rewards"] = el)}
        className={styles.rewardsSection}
      >
        <div className={styles.bungieRewards}>
          <div className={styles.rewardsText}>
            <MarketingTitles
              smallTitle={<div className={styles.bungieRewardsLogo} />}
              sectionTitle={Localizer.Season12.BungieRewards}
              alignment={"left"}
            />
            <p className={styles.blurb}>
              {Localizer.season12.BungieRewardsBlurb}
            </p>
          </div>
          <div className={styles.bungieRewardsImage} />
        </div>
      </div>

      <div className={styles.buySection}>
        <img
          className={styles.goodiesImg}
          src={Img("/destiny/bgs/season12/silver_bundle_goodies.png")}
          alt={Localizer.Season12.SilverBundle}
        />
        <div className={styles.textSection}>
          <h2 className={styles.seasonOfTheHunt}>
            {Localizer.Season12.SeasonOfTheHuntSilver}
          </h2>
          <h2 className={styles.sectionTitle}>
            {Localizer.Season12.SilverBundle}
          </h2>
          <p className={styles.blurb}>
            {Localizer.Season12.PurchaseTheSeasonOfThe}
          </p>
          <BuyButton
            buttonType={"teal"}
            url={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "silverbundle",
            })}
          >
            {Localizer.Season12.BeginTheHunt}
          </BuyButton>
          <p className={styles.disclaimer}>
            {Localizer.Season12.OneTimePurchaseOnlyAvailable}
            <br />
            <br />
            {Localizer.Season12.SeasonOfTheHuntNotIncluded}
          </p>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        {/* Calendar */}

        {calendarImage && (
          <div
            id={"calendar"}
            ref={(el) => (idToElementsMapping["calendar"] = el)}
            className={styles.calendarSection}
          >
            <h2 className={styles.title}>{Localizer.Seasons.Calendar}</h2>

            <div
              className={styles.calendar}
              style={{ backgroundImage: `url(${calendarImage})` }}
              role={"article"}
              onClick={() => {
                Modal.open(
                  <img
                    src={calendarImage}
                    className={styles.largeImage}
                    alt={Localizer.Seasons.Calendar}
                  />,
                  {
                    isFrameless: true,
                  }
                );
              }}
            />
          </div>
        )}

        {/* Media */}

        <DestinyNewsAndMedia
          showNews={true}
          sectionTitleNews={Localizer.Season12.News}
          titleIsSmall={true}
          news={
            <Anchor
              url={RouteHelper.HelpArticle(49652)}
              className={styles.newsButton}
            >
              {Localizer.Season12.Destiny2SeasonOfTheHunt}
            </Anchor>
          }
          defaultTab={"videos"}
          lore={null}
          videos={videos}
          wallpapers={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/media_wallaper_1_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/media_wallaper_1.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/media_wallaper_2_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/media_wallaper_2.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/media_wallaper_3_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/media_wallaper_3.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/media_wallaper_4_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/media_wallaper_4.jpg"),
            },
          ]}
          screenshots={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/rewards_screenshot_1_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/rewards_screenshot_1.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/rewards_screenshot_2_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/rewards_screenshot_2.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/story_screenshot_1_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/story_screenshot_1.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/story_screenshot_2_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/story_screenshot_2.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/hunt_screenshot_1_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/hunt_screenshot_1.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/hunt_screenshot_2_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/hunt_screenshot_2.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/hunt_screenshot_3_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/hunt_screenshot_3.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/season12/media_screenshot_8_thumbnail.jpg"
              ),
              detail: Img("destiny/bgs/season12/media_screenshot_8.jpg"),
            },
          ]}
        />
        {/* FAQ */}
        <div id={"FAQ"} ref={(el) => (idToElementsMapping["FAQ"] = el)}>
          <Grid isTextContainer={true}>
            <GridCol cols={12} className={styles.FAQ}>
              <div className={styles.smallTitle}>
                {Localizer.Seasons.FAQTitle}
              </div>
              <InnerErrorBoundary>
                <InfoBlock articleId={Number(faq)} ignoreStyles={true} />
              </InnerErrorBoundary>
            </GridCol>
          </Grid>
        </div>
      </div>
    </div>
  );
};

// Other Functions

interface IThreeItemGrid {
  item1: IMarketingMediaAsset;
  icon1?: React.ReactNode;
  item2: IMarketingMediaAsset;
  icon2?: React.ReactNode;
  item3: IMarketingMediaAsset;
  icon3?: React.ReactNode;
}

const ThreeItemGrid = (props: IThreeItemGrid) => {
  return (
    <Grid className={styles.threeItemGrid}>
      <ImageOrVideoHandler mediaAsset={props.item1} icon={props.icon1} />
      <ImageOrVideoHandler mediaAsset={props.item2} icon={props.icon2} />
      <ImageOrVideoHandler mediaAsset={props.item3} icon={props.icon3} />
    </Grid>
  );
};

interface IImageOrVideoProps {
  mediaAsset: IMarketingMediaAsset;
  icon?: React.ReactNode;
}

const ImageOrVideoHandler = (props: IImageOrVideoProps) => {
  const showImage = (imageName: string) => {
    Modal.open(
      <img
        src={Img(`destiny/bgs/season12/${imageName}`)}
        className={styles.largeImage}
        alt={imageName}
      />,
      {
        isFrameless: true,
      }
    );
  };

  const showVideo = (videoId: string) => {
    YoutubeModal.show({ videoId });
  };

  if (props.mediaAsset?.loopingVideoThumbnail) {
    return (
      <div className={styles.videoContainer}>
        <video autoPlay={true} loop={true} muted={true}>
          <source
            src={props.mediaAsset.loopingVideoThumbnail}
            type="video/mp4"
          />
        </video>
        {props.mediaAsset?.videoId && (
          <div
            className={styles.thumbnailPlayButton}
            onClick={() => showVideo(props.mediaAsset.videoId)}
            role={"button"}
          />
        )}
      </div>
    );
  } else if (props.mediaAsset?.videoThumbnail) {
    return (
      <div className={styles.titleContainer}>
        <div
          style={{
            backgroundImage: `url(${
              props.mediaAsset.videoThumbnail || props.mediaAsset.imageThumbnail
            })`,
          }}
          onClick={() =>
            props.mediaAsset.largeImage &&
            showImage(props.mediaAsset.largeImage)
          }
          role={"presentation"}
        >
          {props.mediaAsset?.videoId && (
            <div
              className={styles.thumbnailPlayButton}
              onClick={() => showVideo(props.mediaAsset.videoId)}
              role={"button"}
            />
          )}
        </div>
        {props.mediaAsset.title && (
          <div className={styles.iconContainer}>
            {props.icon && (
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${props.icon})` }}
              />
            )}
            <p className={styles.imageTitle}>{props.mediaAsset.title}</p>
          </div>
        )}
      </div>
    );
  } else if (props.mediaAsset?.imageThumbnail) {
    return (
      <div className={styles.titleContainer}>
        <div
          className={styles.threeThumbnail}
          style={{ backgroundImage: `url(${props.mediaAsset.imageThumbnail})` }}
          onClick={() =>
            props.mediaAsset.largeImage &&
            showImage(props.mediaAsset.largeImage)
          }
          role={"presentation"}
        />
        {props.mediaAsset.title && (
          <div className={styles.iconContainer}>
            {props.icon && (
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${props.icon})` }}
              />
            )}
            <p className={styles.imageTitle}>{props.mediaAsset.title}</p>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default SeasonOfTheHunt;
