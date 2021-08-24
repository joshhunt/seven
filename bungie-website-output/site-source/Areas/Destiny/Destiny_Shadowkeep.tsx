// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { MarketingContentBlock } from "@UIKit/Layout/MarketingContentBlock";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React from "react";
import styles from "./DestinyShadowkeep.module.scss";
import { ShadowkeepLockingMenu } from "./Shadowkeep/ShadowkeepLockingMenu";
import {
  DestinyNewsAndMedia,
  IDestinyNewsMedia,
} from "./Shared/DestinyNewsAndMedia";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";

interface IDestinyShadowkeepProps
  extends GlobalStateComponentProps<"responsive"> {}

interface IDestinyShadowkeepState {
  responsive: IResponsiveState;
  menuLocked: boolean;
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
  private readonly raidRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly titanSuperVideoId = Localizer.Destiny.ForsakenTitanVideoID;
  private readonly warlockSuperVideoId =
    Localizer.Destiny.ForsakenWarlockVideoID;
  private readonly hunterSuperVideoId = Localizer.Destiny.ForsakenHunterVideoID;
  private readonly storyVideoId = Localizer.Destiny.ForsakenStoryVideoID;

  constructor(props: IDestinyShadowkeepProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
      menuLocked: false,
      supportsWebp: false,
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

    const raidPosition = this.raidRef.current.getBoundingClientRect();
    const raidScrollData = BrowserUtils.viewportElementScrollData(raidPosition);

    this.setState({
      raidScroll: raidScrollData,
    });
  };

  private readonly ext = (original: string) =>
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
        src={Img(`destiny/products/shadowkeep/${imageName}`)}
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

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

    const shadowKeepRevealTrailerVideoId = ConfigUtils.GetParameter(
      SystemNames.shadowKeepRevealTrailerVideo,
      Localizer.CurrentCultureName,
      ""
    );
    const revealTrailerVideoEnabled =
      !StringUtils.isNullOrWhiteSpace(shadowKeepRevealTrailerVideoId) &&
      ConfigUtils.SystemStatus(SystemNames.shadowKeepRevealTrailerVideo);
    if (revealTrailerVideoEnabled) {
      videos.push({
        isVideo: true,
        thumbnail: Img(
          "destiny/products/shadowkeep/media_video_thumbnail_reveal.jpg"
        ),
        detail: shadowKeepRevealTrailerVideoId,
      });
    }

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

    const storyClasses = classNames(styles.sectionStory, {
      [styles.lockedNavPlaceholder]: this.state.menuLocked,
    });

    const { isStandardEditionShowing } = this.state;

    const buttonSkuTag = isStandardEditionShowing
      ? DestinySkuTags.ShadowkeepStandard
      : DestinySkuTags.LegendaryEdition;

    return (
      <div className={styles.destinyFont}>
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
            <p className={styles.heroEyebrow}>
              {Localizer.Shadowkeep.ExpansionYear}
            </p>
            <div
              className={styles.heroLogo}
              style={{
                backgroundImage: `url(/7/ca/destiny/bgs/shadowkeep/shadowkeep_logo_${Localizer.CurrentCultureName}.png)`,
              }}
            />
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
          // GEAR
        }
        <div
          id={"newgear"}
          ref={(el) => (this.idToElementsMapping["newgear"] = el)}
        >
          <div className={styles.sectionGear}>
            <TextContainer>
              <SmallTitle>{Localizer.Shadowkeep.NewGearTitleSmall}</SmallTitle>
              <SectionTitle>
                {Localizer.Shadowkeep.GearGridTitleLarge}
              </SectionTitle>
              <p className={styles.mediumBlurb}>
                {Localizer.Shadowkeep.GearBlurb}
              </p>
            </TextContainer>
          </div>
        </div>

        {
          // SUPERS -- Beyond Light Release Update
        }
        <div
          className={classNames(styles.supersBlock, styles.forsakenSection)}
          id={"supers"}
          ref={(el) => (this.idToElementsMapping["supers"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Shadowkeep.SupersSmallTitle}
            sectionTitle={Localizer.Shadowkeep.SupersTitleLarge}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/products/shadowkeep/supers_bg_desktop.jpg"
                  )}`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/mobile/supers_bg_mobile.jpg"
                  )}`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"#0f1a26"}
            margin={
              this.props.globalState.responsive.mobile
                ? "29rem auto 2rem"
                : "41rem auto 2rem"
            }
            blurb={Localizer.FormatReact(
              Localizer.Shadowkeep.SupersBlurbPartOne,
              {
                linkToForsaken: (
                  <Anchor
                    className={styles.linkToShadowkeep}
                    url={RouteHelper.Forsaken()}
                  >
                    {Localizer.Shadowkeep.SupersBlurbPartTwo}
                  </Anchor>
                ),
              }
            )}
          >
            <div className={styles.imageContainer}>
              <div className={styles.supersThumbnail}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showVideo(this.titanSuperVideoId)}
                >
                  <img
                    src={Img(
                      "destiny/products/forsaken/v2/desktop/forsaken_supers_1_thumb.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                  <div className={styles.playButton} />
                </Button>
                <div className={classNames(styles.supersSub, styles.titanSub)}>
                  {Localizer.Destiny.TitanSub}
                </div>
              </div>
              <div className={styles.supersThumbnail}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showVideo(this.warlockSuperVideoId)}
                >
                  <img
                    src={Img(
                      "destiny/products/forsaken/v2/desktop/forsaken_supers_2_thumb.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                  <div className={styles.playButton} />
                </Button>
                <div
                  className={classNames(styles.supersSub, styles.warlockSub)}
                >
                  {Localizer.Destiny.WarlockSub}
                </div>
              </div>
              <div className={styles.supersThumbnail}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showVideo(this.hunterSuperVideoId)}
                >
                  <img
                    src={Img(
                      "destiny/products/forsaken/v2/desktop/forsaken_supers_3_thumb.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                  <div className={styles.playButton} />
                </Button>
                <div className={classNames(styles.supersSub, styles.hunterSub)}>
                  {Localizer.Destiny.HunterSub}
                </div>
              </div>
            </div>
          </MarketingContentBlock>
        </div>

        {
          // DUNGEON -- Beyond Light Release Update
        }
        <div
          id={"dungeon"}
          ref={(el) => (this.idToElementsMapping["dungeon"] = el)}
        >
          <Section
            className={classNames(styles.sectionRaid, styles.sectionDungeon)}
          >
            <div className={styles.innerRaid} ref={this.raidRef}>
              <TextContainer>
                <SmallTitle>
                  {Localizer.Shadowkeep.DungeonTitleSmall}
                </SmallTitle>
                <SectionTitle>
                  {Localizer.Shadowkeep.DungeonTitleLarge}
                </SectionTitle>
                <p className={styles.mediumBlurb}>
                  {Localizer.Shadowkeep.DungeonBlurb}
                </p>
              </TextContainer>
              <div className={styles.imageContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("dungeon_screenshot_1.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_1.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("dungeon_screenshot_2.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_2.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("dungeon_screenshot_3.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_3.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
              </div>
            </div>
          </Section>
        </div>

        {
          // RAID
        }
        <div id={"raid"} ref={(el) => (this.idToElementsMapping["raid"] = el)}>
          <Section className={styles.sectionRaid}>
            <div className={styles.innerRaid} ref={this.raidRef}>
              <TextContainer>
                <SmallTitle>{Localizer.Shadowkeep.RaidTitleSmall}</SmallTitle>
                <SectionTitle>
                  {Localizer.Shadowkeep.RaidTitleLarge}
                </SectionTitle>
                <p className={styles.mediumBlurb}>
                  {Localizer.Shadowkeep.RaidBlurb}
                </p>
              </TextContainer>
              <div className={styles.imageContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("raid_screenshot_1.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/raid_screenshot_thumbnail_1.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("raid_screenshot_2.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/raid_screenshot_thumbnail_2.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("raid_screenshot_3.jpg")}
                >
                  <img
                    src={Img(
                      "destiny/products/shadowkeep/raid_screenshot_thumbnail_3.jpg"
                    )}
                    alt={""}
                    role={"presentation"}
                  />
                </Button>
              </div>
            </div>
          </Section>
        </div>

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
                {Localizer.Destiny.buyFlowLegendaryEditionTitle}
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
                      ? `url("7/ca/destiny/products/shadowkeep/shadowkeep_buy_cover_${Localizer.CurrentCultureName}.jpg")`
                      : `url("7/ca/destiny/products/shadowkeep/legendaryEdition_buy_cover_${Localizer.CurrentCultureName}.jpg")`,
                  }}
                />
                <div className={styles.disclaimerGrid}>
                  <ul>
                    <li>{Localizer.Destiny.shadowkeepPurchaseLegalDetail}</li>
                    <li>{Localizer.Destiny.shadowkeepLegalDetail}</li>
                    <li>{Localizer.Destiny.imagesLegalDetail}</li>
                  </ul>
                </div>
              </div>
              <div className={styles.shadowkeepBuyDescription}>
                <p className={styles.editionTitle}>
                  <span className={styles.destinyTitle}>
                    {Localizer.Shadowkeep.DestinyBuyTItleIntro}
                  </span>
                  <span>
                    {isStandardEditionShowing
                      ? Localizer.Shadowkeep.ShadowkeepBuyTitle
                      : Localizer.Destiny.buyFlowLegendaryEditionTitle}
                  </span>
                </p>
                <div className={styles.thickTopBorder} />
                {!ConfigUtils.SystemStatus("LegendaryEditionEnabled") &&
                  !isStandardEditionShowing && (
                    <Button size={BasicSize.Medium} buttonType={"disabled"}>
                      {Localizer.bungierewards.ComingSoon_NAME}
                    </Button>
                  )}
                {((ConfigUtils.SystemStatus("LegendaryEditionEnabled") &&
                  !isStandardEditionShowing) ||
                  isStandardEditionShowing) && (
                  <BuyButton
                    className={styles.preorderButton}
                    onClick={() => this.onClickStoreItem(buttonSkuTag)}
                    buttonType={"gold"}
                    sheen={0.35}
                    analyticsId={buttonSkuTag}
                  >
                    {Localizer.Shadowkeep.CTAButtonLabel}
                  </BuyButton>
                )}
                {isStandardEditionShowing ? (
                  <div className={styles.buyMainContent}>
                    <div
                      dangerouslySetInnerHTML={sanitizeHTML(
                        Localizer.Shadowkeep.StandardEditionDesc1
                      )}
                    />
                    <div className={styles.descBottom}>
                      <div
                        dangerouslySetInnerHTML={sanitizeHTML(
                          Localizer.Shadowkeep.StandardEditionDesc2
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.buyMainContent}>
                    <div
                      dangerouslySetInnerHTML={sanitizeHTML(
                        Localizer.Destiny.legendaryEditionDesc1
                      )}
                    />
                    <div className={styles.descBottom}>
                      <div
                        dangerouslySetInnerHTML={sanitizeHTML(
                          Localizer.Destiny.legendaryEditionDesc2
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>

        {
          // NEWS & MEDIA
        }
        <div
          id={"media"}
          ref={(el) => (this.idToElementsMapping["media"] = el)}
        >
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
                  "destiny/products/shadowkeep/raid_screenshot_thumbnail_1.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/raid_screenshot_1.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/shadowkeep/raid_screenshot_thumbnail_2.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/raid_screenshot_2.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/shadowkeep/raid_screenshot_thumbnail_3.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/raid_screenshot_3.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_1.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_1.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_2.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_2.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_thumbnail_3.jpg"
                ),
                detail: Img(
                  "destiny/products/shadowkeep/dungeon_screenshot_3.jpg"
                ),
              },
            ]}
          />
        </div>
      </div>
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
