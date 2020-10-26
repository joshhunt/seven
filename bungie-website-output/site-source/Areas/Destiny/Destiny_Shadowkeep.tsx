// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import React from "react";
import { Responsive, IResponsiveState, ResponsiveSize } from "@Boot/Responsive";
import { DestroyCallback, DataStore } from "@Global/DataStore";
import styles from "./DestinyShadowkeep.module.scss";
import { ShadowkeepLockingMenu } from "./Shadowkeep/ShadowkeepLockingMenu";
import classNames from "classnames";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { SystemNames } from "@Global/SystemNames";
import { Respond } from "@Boot/Respond";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import {
  DestinyNewsAndMedia,
  IDestinyNewsMedia,
} from "./Shared/DestinyNewsAndMedia";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Img } from "@Helpers";
import { Platform } from "@Platform";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";

interface IDestinyShadowkeepProps
  extends GlobalStateComponentProps<"responsive"> {}

interface IDestinyShadowkeepState {
  responsive: IResponsiveState;
  menuLocked: boolean;
  modsScroll: IScrollViewportData;
  powerParallaxScroll: IScrollViewportData;
  raidScroll: IScrollViewportData;
  supportsWebp: boolean;
  isStandardEditionShowing: boolean;
  selectedMediaTab: string;
  seasonsSection: IMarketingMediaAsset;
  loading: boolean;
}

class DestinyShadowkeepInner extends React.Component<
  IDestinyShadowkeepProps,
  IDestinyShadowkeepState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly modsRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly powerParallaxRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();
  private readonly raidRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IDestinyShadowkeepProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
      menuLocked: false,
      supportsWebp: false,
      modsScroll: {
        isVisible: false,
        percent: 0,
      },
      powerParallaxScroll: {
        isVisible: false,
        percent: 0,
      },
      raidScroll: {
        isVisible: false,
        percent: 0,
      },
      isStandardEditionShowing: true,
      selectedMediaTab: "videos",
      seasonsSection: null,
      loading: true,
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

    Platform.ContentService.GetContentByTagAndType(
      "ShadowkeepSeasonsSection",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    )
      .then((item) => {
        if (item) {
          this.setState({
            seasonsSection: ContentUtils.marketingMediaAssetFromContent(item),
          });
        }
      })
      .finally(() =>
        this.setState({
          loading: false,
        })
      );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);

    window.removeEventListener("scroll", this.onScroll);
  }

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private readonly onScroll = () => {
    if (this.props.globalState.responsive.mobile) {
      return;
    }

    const modsPosition = this.modsRef.current.getBoundingClientRect();
    const powerPosition = this.powerParallaxRef.current.getBoundingClientRect();
    const raidPosition = this.raidRef.current.getBoundingClientRect();
    const modsScrollData = BrowserUtils.viewportElementScrollData(modsPosition);
    const powerParallaxScrollData = BrowserUtils.viewportElementScrollData(
      powerPosition
    );
    const raidScrollData = BrowserUtils.viewportElementScrollData(raidPosition);

    this.setState({
      modsScroll: modsScrollData,
      powerParallaxScroll: powerParallaxScrollData,
      raidScroll: raidScrollData,
    });
  };

  private readonly ext = (original) =>
    this.state.supportsWebp ? "webp" : original;

  private launchYouTube(): boolean {
    // navigate to YouTube if the browser is in the 'medium' size or smaller
    return this.props.globalState.responsive.medium;
  }

  private showVideo(videoId: string) {
    if (this.launchYouTube()) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  }

  private showImage(imageName: string) {
    Modal.open(
      <img
        src={Img(`destiny/bgs/shadowkeep/${imageName}`)}
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

  private readonly openInNewTab = (imageName: string) => {
    window.open(Img(`destiny/bgs/shadowkeep/${imageName}`), "_blank'");
  };

  private readonly showStandard = () => {
    if (!this.state.isStandardEditionShowing) {
      this.setState({
        isStandardEditionShowing: true,
      });
    }
  };

  private readonly showUpgradeEdition = () => {
    if (this.state.isStandardEditionShowing) {
      this.setState({
        isStandardEditionShowing: false,
      });
    }
  };

  private onClickStoreItem(skuTag: string) {
    DestinySkuSelectorModal.show({
      skuTag,
    });
  }

  public render() {
    const videos: IDestinyNewsMedia[] = [];

    const gamescomVideoId = ConfigUtils.GetParameter(
      SystemNames.GamescomVideo,
      Localizer.CurrentCultureName,
      ""
    );
    const gamescomVideoEnabled =
      !StringUtils.isNullOrWhiteSpace(gamescomVideoId) &&
      ConfigUtils.SystemStatus(SystemNames.GamescomVideo);
    if (gamescomVideoEnabled) {
      videos.push({
        isVideo: true,
        thumbnail: Img("destiny/bgs/shadowkeep/story_video_thumbnail_1.jpg"),
        detail: gamescomVideoId,
      });
    }

    const lunaVideoId = ConfigUtils.GetParameter(
      SystemNames.LunaVideo,
      Localizer.CurrentCultureName,
      ""
    );
    const lunaVideoEnabled =
      !StringUtils.isNullOrWhiteSpace(lunaVideoId) &&
      ConfigUtils.SystemStatus(SystemNames.LunaVideo);
    if (lunaVideoEnabled) {
      videos.push({
        isVideo: true,
        thumbnail: Img("destiny/bgs/shadowkeep/story_video_thumbnail_2.jpg"),
        detail: lunaVideoId,
      });
    }

    const seasonUndyingVideoId = ConfigUtils.GetParameter(
      SystemNames.SeasonUndyingVideo,
      Localizer.CurrentCultureName,
      ""
    );
    const seasonUndyingVideoEnabled =
      !StringUtils.isNullOrWhiteSpace(seasonUndyingVideoId) &&
      ConfigUtils.SystemStatus(SystemNames.SeasonUndyingVideo);
    if (seasonUndyingVideoEnabled) {
      videos.push({
        isVideo: true,
        thumbnail: Img("destiny/bgs/shadowkeep/season_thumbnail_2_tall.jpg"),
        detail: seasonUndyingVideoId,
      });
    }

    const modRowKeys = [...Array(7).keys()];
    const modRows = modRowKeys.map((i) => {
      const rowNum = i + 1;
      const reverseRowNum = modRowKeys.length - rowNum;
      const transformAmount =
        reverseRowNum *
        reverseRowNum *
        5 *
        (this.state.modsScroll.percent * 2 - 0.75);

      const transform = false
        ? "translateY(0)"
        : `translateY(-${transformAmount}px)`;

      return (
        <div
          key={rowNum}
          className={classNames(styles.modRow, styles[`modRow${rowNum}`])}
          style={{
            transform,
          }}
        />
      );
    });

    const storyClasses = classNames(styles.sectionStory, {
      [styles.lockedNavPlaceholder]: this.state.menuLocked,
    });

    const psd = this.state.powerParallaxScroll;

    const { isStandardEditionShowing, seasonsSection } = this.state;

    const buttonSkuTag = isStandardEditionShowing
      ? DestinySkuTags.ShadowkeepStandard
      : DestinySkuTags.ShadowkeepForsakenUpgradeEdition;

    return (
      <React.Fragment>
        <BungieHelmet
          image={Img("/destiny/bgs/shadowkeep/hero_desktop_bg.webp")}
          title={Localizer.Destiny.NewLightShadowKeepTitle}
        >
          <body
            className={classNames(
              SpecialBodyClasses(BodyClasses.NoSpacer),
              SpecialBodyClasses(BodyClasses.HideServiceAlert)
            )}
          />
        </BungieHelmet>
        <div>
          <div className={styles.hero} ref={this.heroRef}>
            <button
              className={styles.playButton}
              onClick={() => this.showVideo(gamescomVideoId)}
            >
              <div className={styles.playIcon} />
            </button>
            <div
              className={styles.heroLogo}
              style={{
                backgroundImage: `url(/7/ca/destiny/bgs/shadowkeep/shadowkeep_logo_${Localizer.CurrentCultureName}.png)`,
              }}
            />
            <div className={styles.date}>
              {Localizer.Shadowkeep.AvailableDate}
            </div>
          </div>

          <ShadowkeepLockingMenu
            onChange={this.onMenuLock}
            idToElementsMapping={this.idToElementsMapping}
            relockUnder={this.heroRef}
          />

          {
            // STORY
          }
          <div
            id={"story"}
            ref={(el) => (this.idToElementsMapping["story"] = el)}
          />
          <Section className={storyClasses} alignment={SectionAlignment.left}>
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.StorySmallTitle}</SmallTitle>
              <SectionTitle isSmall={true}>
                {Localizer.Shadowkeep.StoryLargeTitle}
              </SectionTitle>
              <p>{Localizer.Shadowkeep.StoryLargeBlurb}</p>
              <p className={styles.mediumBlurb}>
                {Localizer.Shadowkeep.StorySmallBlurb}
              </p>
              {gamescomVideoEnabled && (
                <MediaButton
                  isVideo={true}
                  onClick={() => this.showVideo(gamescomVideoId)}
                  thumbnail={`destiny/bgs/shadowkeep/story_video_thumbnail_1.${this.ext(
                    "jpg"
                  )}`}
                />
              )}
            </TextContainer>
          </Section>
          <Section
            className={styles.sectionMoon}
            alignment={SectionAlignment.left}
          >
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.StorySmallTitle}</SmallTitle>
              <SectionTitle isSmall={true}>
                {Localizer.Shadowkeep.StoryMoonTitleLarge}
              </SectionTitle>
              <p>{Localizer.Shadowkeep.StoryMoonBlurb}</p>
              <div className={classNames(styles.left, styles.mediaContainer)}>
                {lunaVideoEnabled && (
                  <MediaButton
                    isVideo={true}
                    onClick={() => this.showVideo(lunaVideoId)}
                    thumbnail={`destiny/bgs/shadowkeep/story_video_thumbnail_2.jpg`}
                  />
                )}
                <MediaButton
                  isVideo={false}
                  onClick={() => this.showImage("story_2.jpg")}
                  thumbnail={`destiny/bgs/shadowkeep/story_thumbnail_2.${this.ext(
                    "jpg"
                  )}`}
                />
                <MediaButton
                  isVideo={false}
                  onClick={() => this.showImage("story_3.jpg")}
                  thumbnail={`destiny/bgs/shadowkeep/story_thumbnail_3.${this.ext(
                    "jpg"
                  )}`}
                />
              </div>
            </TextContainer>
          </Section>
        </div>

        {
          // POWER
        }
        <div
          id={"power"}
          ref={(el) => (this.idToElementsMapping["power"] = el)}
        >
          <Section className={styles.sectionPower}>
            <div className={styles.powerParallax} ref={this.powerParallaxRef}>
              <Respond
                at={ResponsiveSize.mobile}
                hide={true}
                responsive={this.props.globalState.responsive}
              >
                <div
                  className={styles.moonBg}
                  style={{
                    transform: `translateY(${
                      psd.percent * -window.innerHeight * 1.25
                    }px)`,
                  }}
                />
                <div
                  className={styles.rock}
                  style={{ transform: `translateY(${psd.percent * -500}px)` }}
                />
                <div
                  className={styles.hunter}
                  style={{ transform: `translateY(${psd.percent * -400}px)` }}
                />
                <div
                  className={styles.titan}
                  style={{ transform: `translateY(${psd.percent * -300}px)` }}
                />
                <div
                  className={styles.warlock}
                  style={{ transform: `translateY(${psd.percent * -200}px)` }}
                />
                <div
                  className={styles.number}
                  style={{
                    transform: `translateY(${
                      psd.percent * -(window.innerHeight / 2)
                    }px)`,
                  }}
                />
              </Respond>
            </div>
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.PowerSmallTitle}</SmallTitle>
              <SectionTitle>
                {Localizer.Shadowkeep.PowerTitleLarge}
              </SectionTitle>
              <p className={styles.mediumBlurb}>
                {Localizer.Shadowkeep.PowerBlurb}
              </p>
            </TextContainer>
          </Section>
          <Section
            className={styles.sectionFinishers}
            bgs={
              <Respond
                at={ResponsiveSize.mobile}
                hide={true}
                responsive={this.props.globalState.responsive}
              >
                <video autoPlay={true} muted={true} loop={true}>
                  <source
                    src={Img("destiny/videos/shadowkeep_finishers.webm")}
                    type="video/webm"
                  />
                  <source
                    src={Img("destiny/videos/shadowkeep_finishers.mp4")}
                    type="video/mp4"
                  />
                </video>
              </Respond>
            }
          >
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.PowerSmallTitle}</SmallTitle>
              <SectionTitle>
                {Localizer.Shadowkeep.PowerFinishersTitleLarge}
              </SectionTitle>
              <div className={styles.armorSubtitle}>
                {Localizer.Shadowkeep.ArmorSubtitle}
              </div>
            </TextContainer>
          </Section>
          <div className={styles.boxes}>
            {/* This is in a different order to visually balance out the amount of text per design direction*/}
            <PowerBox
              title={Localizer.Shadowkeep.PowerFinishersBox2Title}
              blurb={Localizer.Shadowkeep.PowerFinishersBox2Content}
            />
            <PowerBox
              title={Localizer.Shadowkeep.PowerFinishersBox1Title}
              blurb={Localizer.Shadowkeep.PowerFinishersBox1Content}
            />
            <PowerBox
              title={Localizer.Shadowkeep.PowerFinishersBox3Title}
              blurb={Localizer.Shadowkeep.PowerFinishersBox3Content}
            />
          </div>
        </div>

        {
          // GEAR
        }
        <div
          id={"newgear"}
          ref={(el) => (this.idToElementsMapping["newgear"] = el)}
        >
          <Section className={styles.sectionArmor}>
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.ArmorTitleSmall}</SmallTitle>
              <SectionTitle>{Localizer.Shadowkeep.GearTitleLarge}</SectionTitle>
              <div className={styles.armorSubtitle}>
                {Localizer.Shadowkeep.ArmorSubtitle}
              </div>
            </TextContainer>
            <div className={styles.boxes}>
              <PowerBox
                title={Localizer.Shadowkeep.GearBox1Title}
                blurb={Localizer.Shadowkeep.GearBox1Content}
              />
              <PowerBox
                title={Localizer.Shadowkeep.GearBox2Title}
                blurb={Localizer.Shadowkeep.GearBox2Content}
              />
              <PowerBox
                title={Localizer.Shadowkeep.GearBox3Title}
                blurb={Localizer.Shadowkeep.GearBox3Content}
              />
            </div>
          </Section>
          <GraySection>
            <div className={styles.mods} ref={this.modsRef}>
              <Respond
                at={ResponsiveSize.mobile}
                hide={true}
                responsive={this.props.globalState.responsive}
              >
                {modRows}
              </Respond>
            </div>
          </GraySection>
          <Section className={styles.sectionGear}>
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.GearTitleSmall}</SmallTitle>
              <SectionTitle>
                {Localizer.Shadowkeep.GearGridTitleLarge}
              </SectionTitle>
              <p className={styles.mediumBlurb}>
                {Localizer.Shadowkeep.GearBlurb}
              </p>
            </TextContainer>
          </Section>
        </div>

        {
          // RAID
        }
        <div id={"raid"} ref={(el) => (this.idToElementsMapping["raid"] = el)}>
          <Section className={styles.sectionRaid}>
            <div ref={this.raidRef}>
              <TextContainer>
                <SmallTitle>{Localizer.Shadowkeep.RaidTitleSmall}</SmallTitle>
                <SectionTitle>
                  {Localizer.Shadowkeep.RaidTitleLarge}
                </SectionTitle>
                <p className={styles.mediumBlurb}>
                  {Localizer.Shadowkeep.RaidBlurb}
                </p>
              </TextContainer>
            </div>
          </Section>
        </div>

        {
          // SEASONS
        }
        {seasonsSection && (
          <div
            id={"seasons"}
            ref={(el) => (this.idToElementsMapping["seasons"] = el)}
          >
            <Section
              className={styles.sectionSeasons}
              style={{
                backgroundImage: `url(${
                  this.props.globalState.responsive.mobile
                    ? seasonsSection.imageThumbnail
                    : seasonsSection.largeImage
                })`,
              }}
            >
              <TextContainer>
                <SmallTitle>{seasonsSection.subtitle}</SmallTitle>
                <SectionTitle>{seasonsSection.title}</SectionTitle>
                <p className={styles.italicCallout}>
                  {Localizer.Shadowkeep.DawnShadowkeepSubtitle}
                </p>
                <div
                  className={styles.mediumBlurb}
                  dangerouslySetInnerHTML={{ __html: seasonsSection.textBlock }}
                />
              </TextContainer>
            </Section>
          </div>
        )}

        <Section className={styles.sectionGettingStarted}>
          <TextContainer>
            <div className={styles.gettingStartedTitleContainer}>
              <div className={styles.gettingStartedIcon} />
              <div className={styles.gettingStartedTitle}>
                {Localizer.Shadowkeep.GettingStarted}
              </div>
            </div>
            <div className={styles.gettingStartedSubtitle}>
              {Localizer.Shadowkeep.WhatDoINeedToPlay}
            </div>
            <div className={styles.gettingStartedText}>
              {Localizer.Shadowkeep.ShadowkeepStandalone}
            </div>
          </TextContainer>
        </Section>

        {
          // PURCHASE
        }
        <div id={"buy"}>
          <Section className={styles.sectionShadowkeep}>
            <div className={styles.center}>
              <div className={styles.underlineBuy} />
              <SectionTitle isSmall={false}>
                {Localizer.Shadowkeep.ShadowkeepSmallTitle}
              </SectionTitle>
              <p className={styles.textCallout}>
                {Localizer.Shadowkeep.ShadowkeepTextCallout}
              </p>
            </div>

            <div
              className={classNames(
                styles.tabs,
                isStandardEditionShowing ? styles.std : styles.dde
              )}
            >
              <a className={styles.standardTab} onClick={this.showStandard}>
                {Localizer.Destiny.StandardEdition}
              </a>
              <a className={styles.deluxeTab} onClick={this.showUpgradeEdition}>
                {Localizer.Destiny.UpgradeEdition}
              </a>
            </div>
            <div className={styles.shadowkeepBuyContainer}>
              <div className={styles.shadowkeepBuy}>
                <div
                  className={classNames(
                    styles.cover,
                    isStandardEditionShowing ? styles.std : styles.dde
                  )}
                  style={{
                    backgroundImage: isStandardEditionShowing
                      ? `url("7/ca/destiny/products/shadowkeep/bnet_sku_shadowkeep_${Localizer.CurrentCultureName}.jpg")`
                      : `url("7/ca/destiny/products/shadowkeep/bnet_sku_upgrade_edition_${Localizer.CurrentCultureName}.jpg")`,
                  }}
                />
              </div>
              <div className={styles.shadowkeepBuyDescription}>
                <p className={styles.editionTitle}>
                  <span className={styles.destinyTitle}>
                    {Localizer.Shadowkeep.DestinyBuyTItleIntro}
                  </span>
                  <span>
                    {isStandardEditionShowing
                      ? Localizer.Shadowkeep.ShadowkeepBuyTitle
                      : Localizer.Shadowkeep.UpgradeEdition}
                  </span>
                </p>
                <div className={styles.thickTopBorder} />
                <BuyButton
                  className={styles.preorderButton}
                  onClick={() => this.onClickStoreItem(buttonSkuTag)}
                  buttonType={"gold"}
                  sheen={0.35}
                  analyticsId={buttonSkuTag}
                >
                  {Localizer.Shadowkeep.CTAButtonLabel}
                </BuyButton>
                <div>
                  <p className={styles.platformType}>
                    {" "}
                    {Localizer.Shadowkeep.PlatformShortXbox}{" "}
                  </p>
                  <p className={styles.platformType}>
                    {" "}
                    {Localizer.Shadowkeep.PlatformShortPs4}{" "}
                  </p>
                  <p className={styles.platformType}>
                    {" "}
                    {Localizer.Shadowkeep.PlatformShortSteam}{" "}
                  </p>
                </div>
                {isStandardEditionShowing ? (
                  <div className={styles.buyMainContent}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Localizer.Shadowkeep.StandardEditionDesc1,
                      }}
                    />
                    <div className={styles.descBottom}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: Localizer.Shadowkeep.StandardEditionDesc2,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.buyMainContent}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Localizer.Destiny.BuyUpgradeDesc1,
                      }}
                    />
                    <div className={styles.descBottom}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: Localizer.Destiny.BuyUpgradeDesc2,
                        }}
                      />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: Localizer.Destiny.BuyUpgradeDesc3,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {
            // NEWS & MEDIA
          }
          <DestinyNewsAndMedia
            videos={videos}
            wallpapers={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_wallpapers_thumbnail_1.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_wallpapers_1.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_wallpapers_thumbnail_2.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_wallpapers_2.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_wallpapers_thumbnail_3.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_wallpapers_3.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_wallpapers_thumbnail_4.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_wallpapers_4.png"),
              },
            ]}
            screenshots={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_1.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_1.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_2.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_2.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_3.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_3.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_4.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_4.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_5.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_5.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_6.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_6.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_7.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_7.png"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/shadowkeep/media_screenshot_thumbnail_8.jpg"
                ),
                detail: Img("destiny/bgs/shadowkeep/media_screenshot_8.png"),
              },
            ]}
          />
        </div>
      </React.Fragment>
    );
  }
}
interface IBasicDivProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}
interface ISectionTitleProps extends IBasicDivProps {
  isSmall?: boolean;
}
const SectionTitle = (props: ISectionTitleProps) => {
  const { children, isSmall, ...rest } = props;

  return (
    <div
      className={classNames(styles.sectionTitle, { [styles.small]: isSmall })}
      {...rest}
    >
      {children}
    </div>
  );
};
const SmallTitle = (props: IBasicDivProps) => {
  return <div className={styles.smallTitle}>{props.children}</div>;
};
const PowerBox = (props: {
  title: React.ReactNode;
  blurb: React.ReactNode;
}) => {
  return (
    <div className={styles.box}>
      <div className={styles.boxTitle}>{props.title}</div>
      <div>{props.blurb}</div>
    </div>
  );
};

enum SectionAlignment {
  none,
  center,
  left,
}

interface ISectionProps extends IBasicDivProps {
  alignment?: SectionAlignment;
  bgs?: React.ReactNode;
}

const Section = (props: ISectionProps) => {
  const { alignment, bgs, children, className, ...rest } = props;

  const alignmentReal =
    alignment === undefined ? SectionAlignment.center : alignment;

  const sectionClasses = classNames(
    className,
    styles.section,
    styles[SectionAlignment[alignmentReal]]
  );

  return (
    <div className={sectionClasses} {...rest}>
      <div className={styles.bg}>{bgs}</div>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};
const TextContainer = (props: IBasicDivProps) => {
  return <div className={styles.sectionTextContent}>{props.children}</div>;
};
const GraySection = (props: IBasicDivProps) => {
  return (
    <div className={classNames(styles.section, styles.gray)}>
      {props.children}
    </div>
  );
};

interface IMediaButtonProps {
  onClick: any;
  thumbnail: string;
  isVideo: boolean;
  isFourAcross?: boolean;
}

const MediaButton = (props: IMediaButtonProps) => {
  return (
    <Button
      onClick={props.onClick}
      className={classNames(
        styles.thumbnail,
        props.isFourAcross ? styles.four : ""
      )}
    >
      <img
        src={Img(props.thumbnail)}
        className={classNames(
          styles.mediaBg,
          props.isFourAcross ? styles.four : ""
        )}
      />
      {props.isVideo && <div className={styles.playButton} />}
    </Button>
  );
};

export default withGlobalState(DestinyShadowkeepInner, ["responsive"]);
