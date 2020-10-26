// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import * as React from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@Global/Localizer";
import styles from "./SeasonOfDawn.module.scss";
import {
  GlobalStateComponentProps,
  withGlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { RouteHelper } from "@Routes/RouteHelper";
import { Respond } from "@Boot/Respond";
import { ResponsiveSize, Responsive, IResponsiveState } from "@Boot/Responsive";
import classNames from "classnames";
import { DataStore, DestroyCallback } from "@Global/DataStore";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { PCMigrationUserDataStore } from "@UI/User/PCMigrationUserDataStore";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { DestinyNewsAndMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { Platform, Content } from "@Platform";
import { SeasonsDefinitions } from "../../SeasonsDefinitions";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Toast, ToastContent } from "@UI/UIKit/Controls/Toast/Toast";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";

interface ISeasonOfDawnProps
  extends GlobalStateComponentProps<"responsive" | "loggedInUser"> {}

interface ISeasonOfDawnState {
  supportsWebp: boolean;
  menuLocked: boolean;
  responsive: IResponsiveState;
  rewardPage: number;
  visibleContentItems: {};
  calendarImage: string;
  lore: Content.ContentItemPublicContract[];
  heroTrailerId: string;
  haveShownToast: boolean;
}

/**
 * Seasons' Index Page
 *  *
 * @param {ISeasonOfDawnProps} props
 * @returns
 */
class SeasonOfDawnInternal extends React.Component<
  ISeasonOfDawnProps,
  ISeasonOfDawnState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  constructor(props: ISeasonOfDawnProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
      supportsWebp: false,
      menuLocked: false,
      rewardPage: 0,
      visibleContentItems: {
        storyContent: false,
        sundialContent: false,
        artifactContent: false,
        calendarTitle: false,
        gearContent: false,
      },
      calendarImage: "",
      lore: null,
      heroTrailerId: "",
      haveShownToast: false,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    window.addEventListener("scroll", this.onScroll);

    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );

    PCMigrationUserDataStore.setForceHiddenState(true);

    // Grab calendar image from the firehose
    Platform.ContentService.GetContentByTagAndType(
      "season9calendar",
      "StaticAsset",
      Localizer.CurrentCultureName,
      true
    ).then((response) =>
      this.setState({
        calendarImage: response.properties.Path,
      })
    );

    // Grab as many lore articles that are live and in the lore content set from the firehose
    Platform.ContentService.GetContentByTagAndType(
      "season9lore",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    ).then((response) =>
      this.setState({
        lore: response.properties.ContentItems,
      })
    );

    Localizer.Seasons.SeasonOfDawnTrailerId !== "" &&
      this.setState({
        heroTrailerId: Localizer.Seasons.SeasonOfDawnTrailerId,
      });
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);

    window.removeEventListener("scroll", this.onScroll);

    PCMigrationUserDataStore.setForceHiddenState(false);
  }

  private readonly onScroll = () => {
    if (
      !this.state.haveShownToast &&
      UserUtils.isAuthenticated(this.props.globalState)
    ) {
      Toast.show(
        <TwoLineItem
          itemTitle={Localizer.Seasons.ViewYourProgress}
          itemSubtitle={Localizer.Seasons.ViewSeasonOfDawnProgress}
          icon={
            <img
              src={"7/ca/destiny/logos/seasons_icon_2019.svg"}
              style={{ width: "3rem", height: "3rem" }}
            />
          }
        />,
        {
          position: "b",
          classes: {
            toast: styles.toast,
          },
          url: RouteHelper.PreviousSeason(),
          type: "none",
        }
      );

      this.setState({ haveShownToast: true });
    }

    Object.keys(this.state.visibleContentItems).forEach((k) => {
      if (!this.state.visibleContentItems[k]) {
        if (this.isScrolledIntoView(k)) {
          const visibleContentItems = this.state.visibleContentItems;
          visibleContentItems[k] = true;
          this.setState({ visibleContentItems });
        }
      }
    });
  };

  private readonly isScrolledIntoView = (id) => {
    let isVisible = false;
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;

      isVisible = elemTop >= 0 && elemTop <= window.innerHeight;
    }

    return isVisible;
  };

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private readonly ext = (original) =>
    this.state.supportsWebp ? "webp" : original;

  private isMedium(): boolean {
    // navigate to YouTube if the browser is in the 'medium' size or smaller
    return this.props.globalState.responsive.medium;
  }

  private showVideo(videoId: string) {
    if (this.isMedium()) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  }

  private showImage(imageName: string) {
    Modal.open(
      <img
        src={Img(`destiny/bgs/${imageName}`)}
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

  public render() {
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

    const lore = [];
    this.state.lore &&
      this.state.lore.forEach((li) => {
        const lorePath = RouteHelper.NewsArticle(Number(li.contentId));

        lore.push({
          isVideo: false,
          thumbnail: li.properties.ArticleBanner,
          detail: li.properties.FrontPageBanner,
          isLore: true,
          lorePath: lorePath.url,
          title: li.properties.Title,
        });
      });

    return (
      <div className={styles.contentWrapper}>
        <BungieHelmet
          title={SeasonsDefinitions.seasonOfDawn.title}
          image={SeasonsDefinitions.seasonOfDawn.image}
        >
          <body
            className={classNames(
              SpecialBodyClasses(BodyClasses.NoSpacer),
              SpecialBodyClasses(BodyClasses.HideServiceAlert)
            )}
          />
        </BungieHelmet>

        {/* Hero */}

        <div className={styles.hero} ref={this.heroRef}>
          {this.state.heroTrailerId && (
            <button
              className={styles.playButton}
              onClick={() => this.showVideo(this.state.heroTrailerId)}
            >
              <div className={styles.playCircle}>
                <div className={styles.playIcon} />
              </div>
            </button>
          )}
          <div
            className={styles.heroLogo}
            style={{
              backgroundImage: `url("7/ca/destiny/bgs/season_of_dawn/hero_logo_${Localizer.CurrentCultureName}.png")`,
            }}
          />

          <div className={styles.date}>{Localizer.Seasons.DawnDatesAlt}</div>
        </div>

        {/* Nav */}

        <MarketingSubNav
          onChange={this.onMenuLock}
          idToElementsMapping={this.idToElementsMapping}
          stringFinder={(id) => Localizer.Destiny[`Submenu_${id}`]}
          relockUnder={this.heroRef.current}
          buttonProps={{
            children: Localizer.Seasons.MenuCTALabel,
            url: RouteHelper.DestinyBuy(),
            buttonType: "teal",
          }}
          primaryColor={"purple"}
          accentColor={"teal"}
        />
        {/* Story */}

        <div
          id={"storyonly"}
          ref={(el) => (this.idToElementsMapping["storyonly"] = el)}
          className={styles.storySection}
        >
          <div
            id={"storyContent"}
            className={classNames(styles.fadeInContent, {
              [styles.inView]: this.state.visibleContentItems["storyContent"],
            })}
          >
            <p className={styles.smallTitle}>
              {Localizer.Seasons.StoryAndActivitiesSmallTitle}
            </p>
            <h1 className={styles.title}>
              {Localizer.Seasons.DawnStoryTitle1}
            </h1>
            <p className={styles.blurb}>{Localizer.Seasons.DawnStoryBlurb1}</p>
          </div>
        </div>

        <div>
          <div className={styles.storySundialSection}>
            {/* Sundial Video */}

            <Respond
              at={ResponsiveSize.mobile}
              hide={true}
              responsive={this.props.globalState.responsive}
            >
              <video autoPlay={true} muted={true} loop={true}>
                <source
                  src={Img("destiny/videos/sundial_bg_video_web.mp4")}
                  type="video/mp4"
                />
              </video>
            </Respond>

            {/* Sundial */}

            <div id={"sundialSection"} className={styles.sundialSection}>
              <div className={styles.videoOverlay} />
              <div
                id={"sundialContent"}
                className={classNames(styles.fadeInContent, {
                  [styles.inView]: this.state.visibleContentItems[
                    "sundialContent"
                  ],
                })}
              >
                <p className={styles.smallTitle}>
                  {Localizer.Seasons.StoryAndActivitiesSmallTitle}
                </p>
                <h1 className={styles.title}>
                  {Localizer.Seasons.DawnStoryTitle2}
                </h1>
                <AvailabilityTag
                  availability={"seasonPass"}
                  shortString={true}
                />

                <div
                  className={classNames(
                    styles.itemContainer,
                    styles.sundialItemContainer
                  )}
                >
                  <div className={styles.flexContainer}>
                    <div className={styles.item1} />
                    <div className={styles.itemTitle}>
                      {Localizer.Seasons.SundialTitle1}
                    </div>
                    <div className={styles.itemDesc}>
                      {Localizer.Seasons.SundialDesc1}
                    </div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.item2} />
                    <div className={styles.itemTitle}>
                      {Localizer.Seasons.SundialTitle2}
                    </div>
                    <div className={styles.itemDesc}>
                      {Localizer.Seasons.SundialDesc2}
                    </div>
                  </div>
                  <div className={styles.flexContainer}>
                    <div className={styles.item3} />
                    <div className={styles.itemTitle}>
                      {Localizer.Seasons.SundialTitle3}
                    </div>
                    <div className={styles.itemDesc}>
                      {Localizer.Seasons.SundialDesc3}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artifact/Lantern */}

            <div className={styles.artifactSection}>
              <div
                id={"artifactContent"}
                className={classNames(styles.fadeInContent, {
                  [styles.inView]: this.state.visibleContentItems[
                    "artifactContent"
                  ],
                })}
              >
                <p className={styles.smallTitle}>
                  {Localizer.Seasons.ArtifactSmallTitle}
                </p>
                <h1
                  className={styles.title}
                  dangerouslySetInnerHTML={{
                    __html: Localizer.Seasons.DawnArtifactTitle,
                  }}
                />
                <p className={styles.blurb}>
                  {Localizer.Seasons.DawnArtifactBlurb}
                </p>
                <AvailabilityTag availability={"all"} />
              </div>
              <div className={styles.lantern}>
                <div
                  id={"artifact"}
                  ref={(el) => (this.idToElementsMapping["artifact"] = el)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gear */}

        {this.props.globalState.responsive.mobile && (
          <div
            id={"gearRewards"}
            ref={(el) => (this.idToElementsMapping["gearRewards"] = el)}
          />
        )}
        <div className={styles.gearSection}>
          <div className={styles.gearHeads}>
            {!this.props.globalState.responsive.mobile && (
              <div
                id={"gearRewards"}
                ref={(el) => (this.idToElementsMapping["gearRewards"] = el)}
              />
            )}
          </div>
          <div
            id={"gearContent"}
            className={classNames(styles.fadeInContent, {
              [styles.inView]: this.state.visibleContentItems["gearContent"],
            })}
          >
            <p className={styles.smallTitle}>
              {Localizer.Destiny.submenu_gearRewards}
            </p>
            <h1 className={styles.title}>
              {Localizer.Seasons.GearSectionTitle}
            </h1>
          </div>

          <div>
            <div className={styles.greenRewardsBox}>
              <h3>{Localizer.Seasons.DawnGreenBoxTitle}</h3>
              <p>{Localizer.Seasons.DawnGreenBoxDesc}</p>
            </div>
            <div className={classNames(styles.gear, styles.itemContainer)}>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() =>
                    this.showVideo(Localizer.Seasons.DevilsRuinTrailerId)
                  }
                >
                  <img
                    src={Img(
                      `destiny/bgs/season_of_dawn/s9_rewards_sidearm_thumbnail.${this.ext(
                        "jpg"
                      )}`
                    )}
                    className={styles.mediaBg}
                  />
                  <div className={styles.thumbnailPlayButton} />
                </Button>
                <SeasonPassMarker
                  className={styles.itemName}
                  availability={"seasonPass"}
                  shortString={true}
                />
              </div>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() =>
                    this.showImage("/season_of_dawn/s9_rewards_armor.jpg")
                  }
                >
                  <img
                    src={Img(
                      `destiny/bgs/season_of_dawn/s9_rewards_armor_thumbnail.${this.ext(
                        "jpg"
                      )}`
                    )}
                    className={styles.mediaBg}
                  />
                </Button>
                <SeasonPassMarker
                  className={styles.itemName}
                  availability={"all"}
                  shortString={true}
                />
              </div>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() =>
                    this.showVideo(Localizer.Seasons.BastionTrailerId)
                  }
                >
                  <img
                    src={Img(
                      `destiny/bgs/season_of_dawn/s9_rewards_fusion_thumbnail.${this.ext(
                        "jpg"
                      )}`
                    )}
                    className={styles.mediaBg}
                  />
                  <div className={styles.thumbnailPlayButton} />
                </Button>
                <SeasonPassMarker
                  className={styles.itemName}
                  availability={"seasonPass"}
                  shortString={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}

        <div>
          <div className={styles.carouselSection}>
            <h1 className={styles.smallHeader}>
              {Localizer.Seasons.SeasonalRankRewards}
            </h1>
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
          <div className={styles.rewardsSection}>
            <h1 className={styles.smallHeader}>
              {Localizer.Seasons.DawnIncluded}
            </h1>
            <div className={styles.rewardsContainer}>
              <div className={styles.rewardsLists}>
                <div className={styles.passRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage: `url(${Img(
                        "/destiny/bgs/season_of_dawn/s9_corner.png"
                      )})`,
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasons.SeasonPassRewardTitle}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={{
                      __html: Localizer.Seasons.SeasonPassRewardListDawn,
                    }}
                  />
                </div>
                <div className={styles.freeRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage: `url(${Img(
                        "/destiny/bgs/seasons/d2_corner.png"
                      )})`,
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasons.ShortAllMarker}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={{
                      __html: Localizer.Seasons.AllPlayersRewardListDawn,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Buy */}

            <div className={styles.buySection}>
              <div className={styles.smallHeader}>
                {Localizer.Seasons.GetTheSeasonOfDawnPass}
              </div>
              <BuyButton
                className={styles.buyButton}
                buttonType={"teal"}
                url={RouteHelper.DestinyBuy()}
                sheen={0}
              >
                {Localizer.Seasons.MenuCTALabel}
              </BuyButton>
            </div>
          </div>
        </div>

        {/* Calendar */}

        {this.state.calendarImage && (
          <div
            id={"calendar"}
            ref={(el) => (this.idToElementsMapping["calendar"] = el)}
            className={styles.calendarSection}
          >
            <div
              id={"calendarTitle"}
              className={classNames(styles.fadeInContent, {
                [styles.inView]: this.state.visibleContentItems[
                  "calendarTitle"
                ],
              })}
            >
              <div className={styles.underline} />
              <h1 className={styles.title}>{Localizer.Seasons.Calendar}</h1>
            </div>
            <div
              className={styles.calendar}
              style={{ backgroundImage: `url(${this.state.calendarImage})` }}
              onClick={() => {
                Modal.open(
                  <img
                    src={this.state.calendarImage}
                    className={styles.largeImage}
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

        <div
          id={"media"}
          ref={(el) => (this.idToElementsMapping["media"] = el)}
        >
          <DestinyNewsAndMedia
            titleIsSmall={true}
            defaultTab={"lore"}
            lore={lore.length > 0 ? lore : null}
            videos={[
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_trailer_thumbnail.jpg"
                ),
                detail: Localizer.Seasons.SeasonOfDawnTrailerId,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/dev_insight_thumbnail.jpg"
                ),
                detail: Localizer.Seasons.S9DevInsightsTrailerId,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  `destiny/bgs/season_of_dawn/s9_rewards_sidearm_thumbnail.${this.ext(
                    "jpg"
                  )}`
                ),
                detail: Localizer.Seasons.DevilsRuinTrailerId,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  `destiny/bgs/season_of_dawn/s9_rewards_fusion_thumbnail.${this.ext(
                    "jpg"
                  )}`
                ),
                detail: Localizer.Seasons.BastionTrailerId,
              },
            ]}
            wallpapers={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_wallpapers_1_thumbnails.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_wallpapers_1.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_wallpapers_2_thumbnails.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_wallpapers_2.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_wallpapers_3_thumbnails.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_wallpapers_3.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_wallpapers_4_thumbnails.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_wallpapers_4.png"),
              },
            ]}
            screenshots={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_1_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_1.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_2_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_2.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_3_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_3.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_4_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_4.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_5_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_5.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshots_6_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshots_6.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshot_7_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshot_7.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/season_of_dawn/s9_screenshot_8_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/season_of_dawn/s9_screenshot_8.jpg"),
              },
            ]}
          />
        </div>

        {/* FAQ */}

        <div id={"FAQ"} ref={(el) => (this.idToElementsMapping["FAQ"] = el)}>
          <Grid isTextContainer={true}>
            <GridCol cols={12} className={styles.FAQ}>
              <div className={styles.smallHeader}>
                {Localizer.Seasons.FAQTitle}
              </div>
              <InnerErrorBoundary>
                <InfoBlock articleId={Number(faq)} ignoreStyles={true} />
              </InnerErrorBoundary>
            </GridCol>
          </Grid>
          <div className={styles.buyButton}>
            <Button
              className={styles.seasonsButtonMore}
              url={RouteHelper.NewsArticle(48105)}
              buttonType="teal"
            >
              {Localizer.Seasons.SeasonsButtonMore}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

interface ISeasonPassMarkerProps {
  className?: string;
  availability: "seasonPass" | "all";
  shortString?: boolean;
}

const SeasonPassMarker = (props: ISeasonPassMarkerProps) => {
  const iconClass =
    props.availability === "all" ? styles.tricorn : styles.hawkIcon;
  const markerString =
    props.availability === "all"
      ? props.shortString
        ? Localizer.Seasons.ShortAllMarker
        : Localizer.Seasons.AvailableToAllDestinyPlayers
      : props.shortString
      ? Localizer.Seasons.ShortSeasonPassMarker
      : Localizer.Seasons.DawnSeasonPassLong;

  return (
    <div className={classNames(styles.seasonPassMarker, props.className)}>
      <i className={iconClass} />
      {markerString}
    </div>
  );
};

interface IAvailabilityTagProps {
  availability: "seasonPass" | "all";
  className?: string;
  shortString?: boolean;
}

const AvailabilityTag = (props: IAvailabilityTagProps) => {
  return (
    <div className={classNames(styles.tagContainer, props.className)}>
      <div className={styles.rectContainer}>
        <div className={styles.rect} />
        <div className={styles.rect} />
      </div>
      <div className={styles.tag}>
        {
          <SeasonPassMarker
            availability={props.availability}
            shortString={props.shortString}
          />
        }
      </div>
    </div>
  );
};

export default withGlobalState(SeasonOfDawnInternal, ["responsive"]);
