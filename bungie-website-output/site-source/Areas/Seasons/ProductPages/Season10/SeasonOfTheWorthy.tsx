// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count
// Created by a-larobinson, 2020
// Copyright Bungie, Inc.

import { PCMigrationUserDataStore } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { ResponsiveSize } from "@bungie/responsive";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import * as React from "react";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";
import { DataStore } from "@bungie/datastore";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import styles from "./SeasonOfTheWorthy.module.scss";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import classNames from "classnames";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { Platform } from "@Platform";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { Respond } from "@Boot/Respond";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { UserUtils } from "@Utilities/UserUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";

interface ISeasonOfTheWorthyProps
  extends GlobalStateComponentProps<"responsive" | "loggedInUser"> {}

interface ISeasonOfTheWorthyState {
  supportsWebp: boolean;
  menuLocked: boolean;
  responsive: IResponsiveState;
  mediaAssets: IMarketingMediaAsset[];
  visibleContentItems: Record<string, any>;
  trialsParallaxScroll: IScrollViewportData;
  gearParallaxScroll: IScrollViewportData;
  seasonPageLive: boolean;
}

/**
 * SeasonOfTheWorthy - Product Page for Season 10: Season of the Worthy
 *  *
 * @param {ISeasonOfTheWorthyProps} props
 * @returns
 */
class SeasonOfTheWorthyInner extends React.Component<
  ISeasonOfTheWorthyProps,
  ISeasonOfTheWorthyState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};
  private readonly trialsParallaxRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();
  private readonly gearParallaxRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();

  constructor(props: ISeasonOfTheWorthyProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
      supportsWebp: false,
      menuLocked: false,
      mediaAssets: [],
      visibleContentItems: {
        storyContent: false,
        rasputinContent: false,
        trialsContent: false,
        bungieRewardsContent: false,
      },
      trialsParallaxScroll: {
        isVisible: false,
        percent: 0,
      },
      gearParallaxScroll: {
        isVisible: false,
        percent: 0,
      },
      seasonPageLive: false,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    this.setState({
      seasonPageLive: ConfigUtils.SystemStatus("Season10GoLive"),
    });

    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );

    // Grab assets from the firehose
    Platform.ContentService.GetContentByTagAndType(
      "S10_product_page_assets",
      "ContentSet",
      Localizer.CurrentCultureName,
      true
    ).then((response) =>
      this.setState({
        mediaAssets: response.properties.ContentItems.map((ci: any) =>
          ContentUtils.marketingMediaAssetFromContent(ci)
        ),
      })
    );

    PCMigrationUserDataStore.setForceHiddenState(true);
    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);

    PCMigrationUserDataStore.setForceHiddenState(false);
    window.removeEventListener("scroll", this.onScroll);
  }

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private showVideo(videoId: string) {
    YoutubeModal.show({ videoId });
  }

  private readonly onScroll = () => {
    if (
      this.props.globalState.responsive.mobile ||
      !this.state.seasonPageLive
    ) {
      return;
    }

    const trialsPosition = this.trialsParallaxRef?.current?.getBoundingClientRect();
    const trialsParallaxScrollData = BrowserUtils.viewportElementScrollData(
      trialsPosition
    );
    const gearPosition = this.gearParallaxRef?.current?.getBoundingClientRect();
    const gearParallaxScrollData = BrowserUtils.viewportElementScrollData(
      gearPosition
    );

    this.setState({
      trialsParallaxScroll: trialsParallaxScrollData,
      gearParallaxScroll: gearParallaxScrollData,
    });

    Object.keys(this.state.visibleContentItems).forEach((k) => {
      if (!this.state.visibleContentItems[k] && !this.state.responsive.mobile) {
        if (this.isScrolledIntoView(k)) {
          const visibleContentItems = this.state.visibleContentItems;
          visibleContentItems[k] = true;
          this.setState({ visibleContentItems });
        }
      }
    });
  };

  private readonly isScrolledIntoView = (id: string) => {
    let isVisible = false;
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;

      isVisible = elemTop >= 0 && elemTop <= window.innerHeight;
    }

    return isVisible;
  };

  // tslint:disable-next-line: react-a11y-accessible-headings
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

    const heroTrailer = this.state.mediaAssets[0] || null;
    const heroLogo = this.state.mediaAssets[1] || null;
    const storyVideo = this.state.mediaAssets[2] || null;
    const trialsTrailer = this.state.mediaAssets[3] || null;
    const gear1 = this.state.mediaAssets[4] || null;
    const gear2 = this.state.mediaAssets[5] || null;
    const gear3 = this.state.mediaAssets[6] || null;
    const progressionVideo = this.state.mediaAssets[7] || null;
    const calendar = this.state.mediaAssets[8] || null;

    const progressionVideoBackground = !this.props.globalState.responsive.mobile
      ? progressionVideo?.videoThumbnail
      : "";
    const tsd = this.state.trialsParallaxScroll;
    const gsd = this.state.gearParallaxScroll;

    return (
      <div
        className={classNames(styles.contentWrapper, {
          [styles.notEnglish]: Localizer.CurrentCultureName !== "en",
        })}
      >
        <BungieHelmet
          title={SeasonsDefinitions.seasonOfTheWorthy.title}
          image={SeasonsDefinitions.seasonOfTheWorthy.image}
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
          {heroTrailer?.videoId && (
            <button
              className={styles.playButton}
              onClick={() => this.showVideo(heroTrailer.videoId)}
            >
              <div className={styles.playCircle}>
                <div className={styles.playIcon} />
              </div>
            </button>
          )}
          {heroLogo && (
            <div
              className={styles.heroLogo}
              style={{ backgroundImage: `url(${heroLogo.largeImage})` }}
            />
          )}

          <div className={styles.date}>{Localizer.SeasonOfTheWorthy.date}</div>
        </div>

        {/* Nav */}

        <MarketingSubNav
          onChange={this.onMenuLock}
          ids={Object.keys(this.idToElementsMapping)}
          renderLabel={(id) => Localizer.SeasonOfTheWorthy[`Submenu_${id}`]}
          buttonProps={{
            children: Localizer.Seasons.MenuCTALabel,
            url: RouteHelper.DestinyBuy(),
            buttonType: "teal",
          }}
          primaryColor={"purple"}
          accentColor={"teal"}
        />

        {/* Story & Activities */}
        <Respond
          at={ResponsiveSize.mobile}
          hide={true}
          responsive={this.state.responsive}
        >
          <div className={styles.storySection}>
            <div
              id={"story"}
              ref={(el) => (this.idToElementsMapping["story"] = el)}
              className={styles.storyAnchor}
            />
            <VerticalSubtitle
              subtitle={Localizer.SeasonOfTheWorthy.StoryActivities}
              section={"story"}
            />
            <div className={styles.centerContainer}>
              <ImageOrVideoHandler
                mediaAsset={storyVideo}
                currentVisibleItems={this.state.visibleContentItems}
              />
              <div className={classNames(styles.titleSection, styles.story1)}>
                <div className={styles.dash} />
                <h1 className={styles.title}>
                  {Localizer.Seasonoftheworthy.StoryTitle1}
                </h1>
                <div className={styles.textBox}>
                  {Localizer.Seasonoftheworthy.StoryBlurb1}
                </div>
              </div>
            </div>
            <div className={styles.centerContainer}>
              <div className={styles.almightyBackground}>
                <div
                  className={classNames(styles.mediumTitle, styles.rasputin)}
                >
                  {Localizer.Seasonoftheworthy.StorySubsectionTitle}
                </div>
              </div>
            </div>
            <div className={styles.centerContainer}>
              <div className={styles.bunkerBackground} />
              <div
                id={"rasputinContent"}
                className={classNames(styles.squares, {
                  [styles.inView]: this.state.visibleContentItems[
                    "rasputinContent"
                  ],
                })}
              >
                <ContentSquare order={1} />
                <ContentSquare order={2} />
                <ContentSquare order={3} />
              </div>
            </div>
          </div>
          {/* PvP */}
          <div className={styles.pvpTopSection}>
            <div
              id={"pvp"}
              ref={(el) => (this.idToElementsMapping["pvp"] = el)}
              className={styles.pvpAnchor}
            />
            <VerticalSubtitle
              subtitle={Localizer.SeasonOfTheWorthy.TrialsSubtitle}
              section={"trials"}
            />
            <div
              className={styles.trialsGuardians}
              ref={this.trialsParallaxRef}
            >
              <div
                className={classNames(styles.guardian, styles.trialsTitan)}
                style={{ transform: `translateY(${tsd.percent * -220}px)` }}
              />
              <div
                className={classNames(styles.guardian, styles.trialsHunter)}
                style={{ transform: `translateY(${tsd.percent * -250}px)` }}
              />
              <div
                className={classNames(styles.guardian, styles.trialsWarlock)}
                style={{ transform: `translateY(${tsd.percent * -300}px)` }}
              />
            </div>
          </div>
          <div className={styles.pvpSection}>
            <div className={styles.pvpBottomBackground} />
            <div className={styles.centerContainer}>
              <ImageOrVideoHandler
                mediaAsset={trialsTrailer}
                currentVisibleItems={this.state.visibleContentItems}
              />
              <div className={classNames(styles.titleSection)}>
                <div className={styles.dash} />
                <h1 className={styles.title}>
                  {Localizer.Seasonoftheworthy.StoryLargeTitle2}
                </h1>
                <div className={styles.textBox}>
                  {Localizer.Seasonoftheworthy.StoryBlurb2}
                </div>
              </div>
            </div>
            <div>
              <div
                id={"trialsContent"}
                className={classNames(styles.squares, {
                  [styles.inView]: this.state.visibleContentItems[
                    "trialsContent"
                  ],
                })}
              >
                <ContentSquare order={4} />
                <ContentSquare order={5} />
                <ContentSquare order={6} />
              </div>
            </div>
            <div className={styles.centerContainer}>
              <div
                id={"bungieRewardsContent"}
                className={classNames(styles.bungieRewardsContent, {
                  [styles.inView]: this.state.visibleContentItems[
                    "bungieRewardsContent"
                  ],
                })}
              >
                <div className={styles.bungieRewardsLogo} />
                <div className={styles.textBox}>
                  {Localizer.Seasonoftheworthy.bungieRewardsText}
                </div>
                <div className={styles.smallText}>
                  {Localizer.Seasonoftheworthy.HatSmallText}
                </div>
                <Button
                  className={styles.bungieRewardsButton}
                  url={RouteHelper.Rewards()}
                  buttonType="blue"
                  size={BasicSize.Small}
                >
                  {Localizer.Buyflow.LearnMoreLinkLabel}
                </Button>
                <div className={styles.rewardsHat} />
              </div>
            </div>
          </div>

          {/* Exotic Gear */}
          <div
            id={"gear"}
            ref={(el) => (this.idToElementsMapping["gear"] = el)}
            className={styles.gearTopSection}
          >
            <VerticalSubtitle
              subtitle={Localizer.SeasonOfTheWorthy.ExoticWeapon}
              section={"gear"}
            />
            <div className={styles.gearTopBackground} />
            <div className={styles.tommys} />
          </div>
          <div className={styles.gearMidSection}>
            <div className={styles.gearMidContent}>
              <div className={styles.mediumTitle}>
                {Localizer.Seasonoftheworthy.gearTitle}
              </div>
              <div className={styles.textBox}>
                {Localizer.Seasonoftheworthy.gearSubtitle}
              </div>
            </div>
            <div className={classNames(styles.dash, styles.gearDash)} />
          </div>
          <div className={styles.gearBottomSection}>
            <div
              id={"artifact"}
              ref={(el) => (this.idToElementsMapping["artifact"] = el)}
              className={styles.artifactAnchor}
            />
            <VerticalSubtitle
              subtitle={Localizer.SeasonOfTheWorthy.Submenu_artifact}
              section={"artifact"}
            />
            <div className={styles.gearBottomBackground} />
            <div className={styles.artifact} />
            <div className={styles.gearBottomContent}>
              <div className={styles.mediumTitle}>
                {Localizer.Seasonoftheworthy.artifactTitle}
              </div>
              <div className={styles.textBox}>
                {Localizer.Seasonoftheworthy.artifactSubtitle}
              </div>
            </div>
          </div>

          {/* Season Rewards */}
          <div className={styles.rewardsSection}>
            <div className={styles.rewardsBackground} />
            <VerticalSubtitle
              subtitle={Localizer.SeasonOfTheWorthy.SeasonRewardsSubtitle}
              section={"rewards"}
            />
            <div className={styles.centerContainer}>
              <div className={styles.titleSection}>
                <div className={styles.dash} />
                <h1 className={styles.title}>
                  {Localizer.Seasonoftheworthy.SeasonRewardsTitle}
                </h1>
                <div className={styles.textBox}>
                  {Localizer.Seasonoftheworthy.SeasonRewardsText}
                </div>
              </div>
              <div className={styles.gearGuardians} ref={this.gearParallaxRef}>
                <div
                  className={classNames(styles.guardian, styles.gearTitan)}
                  style={{ transform: `translateY(${gsd.percent * -300}px)` }}
                />
                <div
                  className={classNames(styles.guardian, styles.gearWarlock)}
                  style={{ transform: `translateY(${gsd.percent * -400}px)` }}
                />
                <div
                  className={classNames(styles.guardian, styles.gearHunter)}
                  style={{ transform: `translateY(${gsd.percent * -250}px)` }}
                />
              </div>
            </div>
          </div>
        </Respond>

        {/* Mobile Size*/}
        {/* Story */}
        <Respond
          at={ResponsiveSize.mobile}
          responsive={this.props.globalState.responsive}
        >
          <div className={styles.storySection}>
            <div
              id={"story"}
              ref={(el) => (this.idToElementsMapping["story"] = el)}
              className={styles.storyAnchor}
            />
            <MarketingContentBlock
              alignment={"left"}
              sectionTitle={Localizer.Seasonoftheworthy.StoryTitle1}
              smallTitle={Localizer.SeasonOfTheWorthy.StoryActivities}
              bgColor={"#100902"}
              blurb={Localizer.Seasonoftheworthy.StoryBlurb1}
              mobileBg={
                <div
                  style={{
                    backgroundImage: `url("7/ca/destiny/bgs/season10/s10_story_hero_mobile_bg.jpg")`,
                    backgroundSize: "contain",
                  }}
                />
              }
              margin={"20rem auto 0"}
            >
              <div className={styles.smallTitle}>
                {Localizer.Seasonoftheworthy.StorySubsectionTitle}
              </div>
              <div className={styles.squares}>
                <ContentSquare order={1} />
                <ContentSquare order={2} />
                <ContentSquare order={3} />
              </div>
              <div className={styles.bunkerBackground} />
            </MarketingContentBlock>
          </div>

          {/* PvP */}
          <div className={styles.pvpTopSection}>
            <div
              id={"pvp"}
              ref={(el) => (this.idToElementsMapping["pvp"] = el)}
              className={styles.pvpAnchor}
            />
            {trialsTrailer?.videoId && (
              <div
                className={styles.thumbnailPlayButton}
                onClick={() => this.showVideo(trialsTrailer.videoId)}
              />
            )}
            <div className={styles.eyeBackground} />
            <MarketingContentBlock
              alignment={"left"}
              sectionTitle={Localizer.Seasonoftheworthy.StoryLargeTitle2}
              smallTitle={Localizer.Seasonoftheworthy.Submenu_pvp}
              bgColor={"#7e5212"}
              blurb={Localizer.Seasonoftheworthy.StoryBlurb2}
              mobileBg={
                <div
                  style={{
                    backgroundImage: `url("7/ca/destiny/bgs/season10/trials_hero_mobile_bg1.jpg")`,
                    backgroundSize: "contain",
                  }}
                />
              }
              margin={"35rem auto 0"}
            >
              <div className={styles.squares}>
                <ContentSquare order={4} />
                <ContentSquare order={5} />
                <ContentSquare order={6} />
                <div
                  className={classNames(styles.square, styles.bungieRewards)}
                >
                  <div className={styles.innerSquare}>
                    <div className={styles.bungieRewardsLogo} />
                    <div className={styles.textBox}>
                      {Localizer.Seasonoftheworthy.bungieRewardsText}
                    </div>
                    <div className={styles.smallText}>
                      {Localizer.Seasonoftheworthy.HatSmallText}
                    </div>
                    <Button
                      className={styles.bungieRewardsButton}
                      url={RouteHelper.Rewards()}
                      buttonType="blue"
                      size={BasicSize.Small}
                    >
                      {Localizer.Buyflow.LearnMoreLinkLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </MarketingContentBlock>
          </div>

          {/* Gear */}
          <div className={styles.gearTopSection}>
            <div
              id={"gear"}
              ref={(el) => (this.idToElementsMapping["gear"] = el)}
              className={styles.gearAnchor}
            />
            <MarketingContentBlock
              alignment={"left"}
              sectionTitle={Localizer.Seasonoftheworthy.gearTitle}
              smallTitle={Localizer.SeasonOfTheWorthy.ExoticWeapon}
              bgColor={"#151515"}
              blurb={Localizer.Seasonoftheworthy.gearSubtitle}
              mobileBg={
                <div
                  style={{
                    backgroundImage: `url("7/ca/destiny/bgs/season10/exotic_tommys_matchbook_mobile_bg.jpg")`,
                    backgroundSize: "contain",
                  }}
                />
              }
              margin={"37rem auto 0"}
            />
          </div>

          {/* Artifact */}
          <div className={styles.gearBottomSection}>
            <div
              id={"artifact"}
              ref={(el) => (this.idToElementsMapping["artifact"] = el)}
              className={styles.artifactAnchor}
            />
            <MarketingContentBlock
              alignment={"left"}
              sectionTitle={Localizer.Seasonoftheworthy.artifactTitle}
              smallTitle={Localizer.SeasonOfTheWorthy.submenu_artifact}
              bgColor={"#171E25"}
              blurb={Localizer.Seasonoftheworthy.artifactSubtitle}
              mobileBg={
                <div
                  style={{
                    backgroundImage: `url("7/ca/destiny/bgs/season10/artifact_mobile_bg.jpg")`,
                    backgroundSize: "contain",
                  }}
                />
              }
              margin={"37rem auto 0"}
            />
          </div>

          {/* Season Rewards */}
          <div className={styles.rewardsSection}>
            <div className={styles.gearGuardians} />
          </div>

          <div
            className={classNames(styles.titleSection, styles.rewardsMobile)}
          >
            <div className={styles.sectionTitle}>
              {Localizer.Seasonoftheworthy.SeasonRewardsTitle}{" "}
            </div>
            <p className={styles.mediumBlurb}>
              {Localizer.Seasonoftheworthy.SeasonRewardsText}
            </p>
          </div>
        </Respond>

        {gear1 && gear2 && gear3 && (
          <div className={styles.itemContainer}>
            <GearItem
              contentItem={gear1}
              subtitle={Localizer.Seasonoftheworthy.RequiresPass}
              icon={"7/ca/destiny/bgs/season10/gear_rasputin_icon.png"}
            />
            <GearItem
              contentItem={gear2}
              subtitle={Localizer.Seasonoftheworthy.FreeToAll}
              icon={"7/ca/destiny/bgs/season10/gear_d2_icon.png"}
            />
            <GearItem
              contentItem={gear3}
              subtitle={Localizer.Seasonoftheworthy.RequiresPass}
              icon={"7/ca/destiny/bgs/season10/gear_rasputin_icon.png"}
            />
          </div>
        )}

        {/* Season Pass */}
        <div
          className={styles.seasonPassSection}
          style={{
            backgroundImage:
              progressionVideoBackground &&
              `url(${progressionVideoBackground})`,
          }}
        >
          <div
            id={"rewards"}
            ref={(el) => (this.idToElementsMapping["rewards"] = el)}
            className={styles.rewardsAnchor}
          />
          <VerticalSubtitle
            subtitle={Localizer.Seasonoftheworthy.SeasonalRanksTitle}
            section={"rewards"}
          />

          {progressionVideo?.videoId && (
            <div
              className={styles.thumbnailPlayButton}
              onClick={() => this.showVideo(progressionVideo?.videoId)}
            />
          )}
          <div className={styles.mediumTitle}>
            {Localizer.Seasonoftheworthy.ProgressionSubtitle}
          </div>
          <div className={styles.textBox}>
            {Localizer.Seasonoftheworthy.SeasonalRanksText}
          </div>
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
                {this.state.responsive.mobile ? mobileRankRows : rankRows}
              </SeasonCarousel>
            </div>
          </div>
          <div className={styles.rewardsContent}>
            <div className={styles.smallTitle}>
              {Localizer.Seasonoftheworthy.SeasonOfferingsTitle}
            </div>
            <div className={styles.rewardsContainer}>
              <div className={styles.rewardsLists}>
                <div className={styles.passRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage:
                        "url(7/ca/destiny/bgs/season10/pass_corner_rasputin.png)",
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasonoftheworthy.ListTitleSeasonPass}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={sanitizeHTML(
                      Localizer.Seasonoftheworthy.SeasonPassRewards
                    )}
                  />
                </div>
                <div className={styles.freeRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage:
                        "url(7/ca/destiny/bgs/season10/pass_corner_d2.png)",
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasonoftheworthy.AvailableToAll}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={sanitizeHTML(
                      Localizer.Seasonoftheworthy.FreeRewards
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Buy */}

            <div className={styles.buySection}>
              <div className={styles.smallTitle}>
                {Localizer.Seasonoftheworthy.CTATitle}
              </div>
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

        {/* Calendar */}

        {calendar?.imageThumbnail && (
          <div className={styles.calendarSection}>
            <div
              id={"calendar"}
              ref={(el) => (this.idToElementsMapping["calendar"] = el)}
              className={styles.calendarAnchor}
            />
            <div>
              <h1 className={styles.smallTitle}>
                {Localizer.Seasons.Calendar}
              </h1>
            </div>
            <div
              className={styles.calendar}
              style={{ backgroundImage: `url(${calendar.imageThumbnail})` }}
              onClick={() => {
                Modal.open(
                  <img
                    src={calendar.largeImage}
                    className={styles.largeImage}
                    style={{ maxWidth: "80vw" }}
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

        <div id={"media"}>
          <FirehoseNewsAndMedia tag={"S10_product_page_media"} />
        </div>

        {/* FAQ */}

        <div id={"FAQ"}>
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
          <div className={styles.buyButton}>
            <Button
              className={styles.seasonsButtonMore}
              url={RouteHelper.NewsArticle(48105)}
              buttonType="teal"
              size={BasicSize.Large}
            >
              {Localizer.Seasons.SeasonsButtonMore}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

interface IVerticalSubtitleProps {
  subtitle?: string;
  section: string;
}

const VerticalSubtitle = (props: IVerticalSubtitleProps) => {
  const colorTable: Record<string, string> = {
    story: "#C78A33",
    trials: "#7B4F11",
    gear: "#285A6F",
    artifact: "#285A6F",
    rewards: "#008081",
  };

  const classes = styles.verticalSubtitle;

  return (
    <div className={classes}>
      {
        <div className={styles.verticalContent}>
          <div className={styles.verticalText}>
            <span>{Localizer.Seasonoftheworthy.S10}</span>
            <span style={{ color: colorTable[props.section] }}>{` // `}</span>
            <span>{props.subtitle?.toUpperCase()}</span>
          </div>
          <div className={styles.tricornRotate} />
        </div>
      }
    </div>
  );
};

interface IContentSquareProps {
  order: number;
}

const ContentSquare = (props: IContentSquareProps) => {
  return (
    <div className={classNames(styles.square, styles[`square${props.order}`])}>
      <div className={styles.innerSquare}>
        <div className={styles.squareTitle}>
          {Localizer.Seasonoftheworthy[`StoryBox${props.order}Title`]}
        </div>
        <div className={styles.textBox}>
          {Localizer.Seasonoftheworthy[`StoryBox${props.order}Text`]}
        </div>
      </div>
    </div>
  );
};

export default withGlobalState(SeasonOfTheWorthyInner, [
  "responsive",
  "loggedInUser",
]);

interface IGearItemProps {
  contentItem: IMarketingMediaAsset;
  icon?: string;
  subtitle?: string;
}

const GearItem = (props: IGearItemProps) => {
  const isVideo = !StringUtils.isNullOrWhiteSpace(props.contentItem.videoId);

  const onClick = () => {
    isVideo
      ? YoutubeModal.show({ videoId: props.contentItem.videoId })
      : Modal.open(
          <img
            src={props.contentItem.largeImage}
            className={styles.largeImage}
          />,
          {
            isFrameless: true,
          }
        );
  };

  return (
    <div className={styles.flexContainer}>
      <Button className={styles.thumbnail} onClick={onClick}>
        <img
          src={
            props.contentItem.videoThumbnail || props.contentItem.imageThumbnail
          }
          className={styles.mediaBg}
        />
        {isVideo && <div className={styles.thumbnailPlayButton} />}
      </Button>
      <div className={styles.gearTitle}>{props.contentItem.title}</div>
      <div className={styles.mediaBox}>
        {props.icon && (
          <i
            className={styles.seasonIcon}
            style={{ backgroundImage: `url(${props.icon})` }}
          />
        )}
        {props.subtitle}
      </div>
    </div>
  );
};

interface IImageOrVideoProps {
  mediaAsset: IMarketingMediaAsset;
  currentVisibleItems: Record<string, string>;
}

const ImageOrVideoHandler = (props: IImageOrVideoProps) => {
  if (props.mediaAsset?.loopingVideoThumbnail) {
    return (
      <div
        id={"storyContent"}
        className={classNames(styles.videoContainer, {
          [styles.inView]: props.currentVisibleItems["storyContent"],
        })}
      >
        <video autoPlay={true} loop={true} muted={true} data-reactid={".0.1.1"}>
          <source
            src={props.mediaAsset.loopingVideoThumbnail}
            type="video/mp4"
            data-reactid={".0.1.2"}
          />
        </video>

        {props.mediaAsset?.videoId && (
          <div
            className={styles.thumbnailPlayButton}
            onClick={() =>
              YoutubeModal.show({ videoId: props.mediaAsset.videoId })
            }
          />
        )}
      </div>
    );
  } else if (props.mediaAsset?.videoThumbnail) {
    return (
      <div
        id={"storyContent"}
        className={classNames(styles.storyImage, {
          [styles.inView]: props.currentVisibleItems["storyContent"],
        })}
        style={{ backgroundImage: `url(${props.mediaAsset.videoThumbnail})` }}
      >
        {props.mediaAsset?.videoId && (
          <div
            className={styles.thumbnailPlayButton}
            onClick={() =>
              YoutubeModal.show({ videoId: props.mediaAsset.videoId })
            }
          />
        )}
      </div>
    );
  } else {
    return null;
  }
};
