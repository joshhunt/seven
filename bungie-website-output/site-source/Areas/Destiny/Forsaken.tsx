// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import styles from "./Forsaken.module.scss";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { Localizer } from "@Global/Localizer";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Responsive, IResponsiveState } from "@Boot/Responsive";
import { PCMigrationUserDataStore } from "@UI/User/PCMigrationUserDataStore";
import { DataStore, DestroyCallback } from "@Global/DataStore";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import classNames from "classnames";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { DestinyNewsAndMedia } from "./Shared/DestinyNewsAndMedia";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { Img } from "@Helpers";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";

interface IForsakenPageState {
  supportsWebp: boolean;
  responsive: IResponsiveState;
  menuLocked: boolean;
  forsakenIsShowing: boolean;
}

interface IForsakenPageProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"responsive"> {}

class ForsakenPageInternal extends React.Component<
  IForsakenPageProps,
  IForsakenPageState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  private readonly forsakenLogo = `/7/ca/destiny/products/forsaken/v2/desktop/${Localizer.Destiny.ForsakenLogo}.svg`;

  private readonly storyVideoId = Localizer.Destiny.ForsakenStoryVideoID;
  private readonly titanSuperVideoId = Localizer.Destiny.ForsakenTitanVideoID;
  private readonly warlockSuperVideoId =
    Localizer.Destiny.ForsakenWarlockVideoID;
  private readonly hunterSuperVideoId = Localizer.Destiny.ForsakenHunterVideoID;

  constructor(props: IForsakenPageProps) {
    super(props);

    this.state = {
      supportsWebp: false,
      responsive: Responsive.state,
      menuLocked: false,
      forsakenIsShowing: true,
    };
  }

  public componentDidMount() {
    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );

    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    PCMigrationUserDataStore.setForceHiddenState(true);
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
    PCMigrationUserDataStore.setForceHiddenState(false);
  }

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

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private readonly showForsaken = () => {
    if (!this.state.forsakenIsShowing) {
      this.setState({
        forsakenIsShowing: true,
      });
    }
  };

  private readonly showUpgradeEdition = () => {
    if (this.state.forsakenIsShowing) {
      this.setState({
        forsakenIsShowing: false,
      });
    }
  };

  private onClickStoreItem(skuTag: string) {
    DestinySkuSelectorModal.show({
      skuTag,
    });
  }

  private showImage(imageName: string) {
    Modal.open(
      <img
        src={Img(`/${imageName}`)}
        alt=""
        role="presentation"
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

  private readonly showSkuSelector = () =>
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.ForsakenDetail });

  public render() {
    const storyBlurb = Localizer.Destiny.ForsakenStoryDetail;
    const exoticBlurb = Localizer.Destiny.ForsakenExoticsDetail;
    const raidsBlurb = Localizer.Destiny.ForsakenRaidsDetail;

    const buttonSkuTag = this.state.forsakenIsShowing
      ? DestinySkuTags.ForsakenDetail
      : DestinySkuTags.LegendaryEdition;

    return (
      <React.Fragment>
        <BungieHelmet
          image={Img(
            "/destiny/products/forsaken/forsaken_hero_poster_hires_bg.jpg"
          )}
          title={Localizer.Destiny.NewLightForsakenTitle}
        >
          <body className={SpecialBodyClasses(BodyClasses.HideServiceAlert)} />
        </BungieHelmet>
        {
          // hero
        }
        <div className={styles.hero} ref={this.heroRef}>
          <p className={styles.heroEyebrow}>
            {Localizer.Destiny.ForsakenExpansionYear}
          </p>
          <div
            className={styles.heroLogo}
            style={{ backgroundImage: `url(${this.forsakenLogo})` }}
          />
        </div>
        {
          // subnav
        }
        <MarketingSubNav
          onChange={this.onMenuLock}
          idToElementsMapping={this.idToElementsMapping}
          stringFinder={(id) => Localizer.Destiny[`Submenu_${id}`]}
          relockUnder={this.heroRef.current}
          buttonProps={{
            children: Localizer.Destiny.BuyNow,
            onClick: () =>
              document
                .getElementById("buy")
                .scrollIntoView({ behavior: "smooth" }),
          }}
          accentColor={"gold"}
        />

        {
          //story
        }
        <div
          className={styles.forsakenSection}
          id={"forsaken_story"}
          ref={(el) => (this.idToElementsMapping["forsaken_story"] = el)}
        >
          <MarketingContentBlock
            smallTitle={`${Localizer.Destiny.ForsakenTitle} // ${Localizer.Destiny.Submenu_forsaken_story}`}
            sectionTitle={Localizer.Destiny.ForsakenCampaignTitle}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundPosition: `center top`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/desktop/story_bg.jpg"
                  )}`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundSize: `contain`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/mobile/story_bg_mobile.jpg"
                  )}`,
                }}
              />
            }
            bgColor={"#0a0512"}
            margin={
              this.props.globalState.responsive.mobile
                ? "21rem auto 2rem"
                : "45rem auto 2rem"
            }
            blurb={storyBlurb}
          >
            <div className={styles.imageContainer}>
              <Button
                className={styles.thumbnail}
                onClick={() => this.showVideo(this.storyVideoId)}
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_story_1_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
                <div className={styles.playButton} />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_story_2_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_story_2_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_story_3_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_story_3_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
            </div>
          </MarketingContentBlock>
        </div>

        {
          //exotics
        }
        <div
          className={styles.forsakenSection}
          id={"forsaken_exotics"}
          ref={(el) => (this.idToElementsMapping["forsaken_exotics"] = el)}
        >
          <MarketingContentBlock
            smallTitle={`${Localizer.Destiny.ForsakenTitle} // ${Localizer.Destiny.Submenu_forsaken_exotics}`}
            sectionTitle={Localizer.Destiny.ForsakenExoticsTitle}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundPosition: `center top`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/desktop/exotics_bg.jpg"
                  )}`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundSize: `contain`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/mobile/exotics_bg_mobile.jpg"
                  )}`,
                }}
              />
            }
            bgColor={"#14131e"}
            margin={
              this.props.globalState.responsive.mobile
                ? "30rem auto 2rem"
                : "53rem auto 2rem"
            }
            blurb={exoticBlurb}
          >
            <div className={styles.imageContainer}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_exotics_1_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_exotics_1_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/forsaken_exotics_2.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/forsaken_exotics_2_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_exotics_3_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_exotics_3_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
            </div>
          </MarketingContentBlock>
        </div>

        {
          //supers
        }
        <div
          className={classNames(styles.supersBlock, styles.forsakenSection)}
          id={"forsaken_supers"}
          ref={(el) => (this.idToElementsMapping["forsaken_supers"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.Submenu_forsaken_supers}
            sectionTitle={Localizer.Destiny.ForsakenSupersTitle}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/desktop/supers_bg.jpg"
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
            blurb={Localizer.Destiny.ForsakenSupersDetail}
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
          //dungeon - shattered throne
        }
        <div
          className={styles.forsakenSection}
          id={"forsaken_dungeon"}
          ref={(el) => (this.idToElementsMapping["forsaken_dungeon"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.forsaken_yearTwo_dungeon}
            sectionTitle={Localizer.Destiny.ForsakenDungeonTitle}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/desktop/dungeon_bg.jpg"
                  )}`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/mobile/dungeon_bg_mobile.jpg"
                  )}`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"#05090c"}
            margin={
              this.props.globalState.responsive.mobile
                ? "30rem auto 2rem"
                : "41rem auto 2rem"
            }
            blurb={Localizer.Destiny.ForsakenDungeonDetail}
          >
            <div className={styles.imageContainer}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_1_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_1_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_2_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_2_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_3_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_dungeon_3_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
            </div>
          </MarketingContentBlock>
        </div>

        {
          //raids
        }
        <div
          className={styles.forsakenSection}
          id={"forsaken_raids"}
          ref={(el) => (this.idToElementsMapping["forsaken_raids"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.forsaken_yearTwo_raids}
            sectionTitle={Localizer.Destiny.ForsakenLastWishTitle}
            alignment={
              this.props.globalState.responsive.mobile ? "left" : "center"
            }
            bgs={
              <div
                style={{
                  backgroundPosition: `center top`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/desktop/raids_lastwish_bg.jpg"
                  )}`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundSize: `contain`,
                  backgroundImage: `url(${Img(
                    "destiny/products/forsaken/v2/mobile/raids_lastwish_bg_mobile.jpg"
                  )}`,
                }}
              />
            }
            bgColor={"#01050e"}
            margin={
              this.props.globalState.responsive.mobile
                ? "20rem auto 2rem"
                : "42rem auto 2rem"
            }
            blurb={raidsBlurb}
          >
            <div className={styles.imageContainer}>
              <Button
                className={classNames(styles.thumbnail, styles.playButton)}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_1_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_1_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_2_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_2_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_3_16x9.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    "destiny/products/forsaken/v2/desktop/forsaken_raids_lastwish_3_thumb.jpg"
                  )}
                  alt={""}
                  role={"presentation"}
                />
              </Button>
            </div>
          </MarketingContentBlock>
        </div>

        {
          //buy
        }
        <div className={styles.buyForsaken} id={"buy"}>
          <div className={styles.underlineBuy} />
          <div className={styles.forsakenBuyTitle}>
            {Localizer.Destiny.GetForsaken}
          </div>
          <div
            className={classNames(
              styles.tabs,
              this.state.forsakenIsShowing ? styles.std : styles.ue
            )}
          >
            <div
              role={"button"}
              className={styles.standardTab}
              onClick={this.showForsaken}
            >
              {Localizer.Destiny.ForsakenTitle}
            </div>
            <div
              role={"button"}
              className={styles.collectionTab}
              onClick={this.showUpgradeEdition}
            >
              {Localizer.Destiny.buyFlowLegendaryEditionTitle}
            </div>
          </div>
          <div className={styles.shadowkeepBuyContainer}>
            <div className={styles.shadowkeepBuy}>
              <div
                className={classNames(
                  styles.cover,
                  this.state.forsakenIsShowing ? styles.std : styles.ue
                )}
                style={{
                  backgroundImage: this.state.forsakenIsShowing
                    ? `url("7/ca/destiny/products/forsaken/forsaken_buy_cover_${Localizer.CurrentCultureName}.jpg")`
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
              <h1 className={styles.editionTitle}>
                <span className={styles.destinyTitle}>
                  {Localizer.Shadowkeep.DestinyBuyTItleIntro}
                </span>
                <span>
                  {this.state.forsakenIsShowing
                    ? Localizer.Destiny.ForsakenTitle
                    : Localizer.Destiny.buyFlowLegendaryEditionTitle}
                </span>
              </h1>
              <div className={styles.thickTopBorder} />
              {!ConfigUtils.SystemStatus("LegendaryEditionEnabled") &&
                !this.state.forsakenIsShowing && (
                  <Button size={BasicSize.Medium} buttonType={"disabled"}>
                    {Localizer.bungierewards.ComingSoon_NAME}
                  </Button>
                )}
              {((ConfigUtils.SystemStatus("LegendaryEditionEnabled") &&
                !this.state.forsakenIsShowing) ||
                this.state.forsakenIsShowing) && (
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
              {this.state.forsakenIsShowing ? (
                <div className={styles.buyMainContent}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Localizer.Destiny.ForsakenEditionDesc1,
                    }}
                  />
                  <div className={styles.descBottom}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Localizer.Destiny.BuyUpgradeDesc3,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.buyMainContent}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Localizer.Destiny.legendaryEditionDesc1,
                    }}
                  />
                  <div className={styles.descBottom}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Localizer.Destiny.legendaryEditionDesc2,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DestinyNewsAndMedia
          showNews={false}
          defaultTab={"videos"}
          videos={[
            {
              isVideo: true,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_video_1_thumb.jpg"
              ),
              detail: Localizer.Destiny.ForsakenLaunchTrailerID,
            },
            {
              isVideo: true,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_video_2_thumb.jpg"
              ),
              detail: Localizer.Destiny.LocationsVideoId,
            },
            {
              isVideo: true,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_video_3_thumb.jpg"
              ),
              detail: Localizer.Destiny.EnemiesVideoId,
            },
            {
              isVideo: true,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_video_4_thumb.jpg"
              ),
              detail: Localizer.Destiny.WeaponsVideoId,
            },
          ]}
          wallpapers={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_wallpaper_1_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_wallpaper_1_4K.png"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_wallpaper_2_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_wallpaper_2_4K.png"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_wallpaper_3_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_wallpaper_3_4K.png"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_wallpaper_4_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_wallpaper_4_4K.png"
              ),
            },
          ]}
          screenshots={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_1_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_1_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_2_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_2_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_3_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_3_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_4_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_4_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_5_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_5_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_6_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_6_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_7_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_7_16x9.jpg"
              ),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/products/forsaken/media/media_screenshot_8_thumb.jpg"
              ),
              detail: Img(
                "destiny/products/forsaken/media/media_screenshot_8_16x9.jpg"
              ),
            },
          ]}
        />
      </React.Fragment>
    );
  }
}

export default withGlobalState(ForsakenPageInternal, ["responsive"]);
