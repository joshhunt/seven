1; // This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import {
  ScreenShotBlock,
  StackedCardBlock,
  VideoCarousel,
} from "@Areas/Destiny/BeyondLight/Components";
import { PCMigrationUserDataStore } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import styles from "./DestinyNewLight.module.scss";
import { DestinyNewsAndMedia } from "./Shared/DestinyNewsAndMedia";

export type DestinyClasses = "warlock" | "hunter" | "titan";

interface IDestinyNewLightProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"responsive"> {}

interface IDestinyNewLightState {
  supportsWebp: boolean;
  responsive: IResponsiveState;
  menuLocked: boolean;
  selectedClass: DestinyClasses;
  pcAlertShown: boolean;
  hoveredPlanetId: string;
  planetParallax: number;
}

/**
 * The Destiny New Light page
 * */
class DestinyNewLightInternal extends React.Component<
  IDestinyNewLightProps,
  IDestinyNewLightState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly idToElementsMapping: { [key: string]: HTMLElement } = {};

  constructor(props: IDestinyNewLightProps) {
    super(props);

    this.state = {
      supportsWebp: true,
      responsive: Responsive.state,
      menuLocked: false,
      selectedClass: "titan",
      pcAlertShown: true,
      hoveredPlanetId: "",
      planetParallax: 0,
    };
  }

  public componentDidMount() {
    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );

    window.addEventListener("scroll", this.onScroll);

    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    PCMigrationUserDataStore.setForceHiddenState(true);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
    DataStore.destroyAll(...this.destroys);
    PCMigrationUserDataStore.setForceHiddenState(false);
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
  };

  private readonly ext = (original: string) => {
    return this.state.supportsWebp ? "webp" : original;
  };

  public render() {
    const heroLogo =
      Localizer.CurrentCultureName === "ko"
        ? Img("/destiny/logos/destiny_guardians_hero_logo.svg")
        : Img("/destiny/bgs/new_light/destiny2_logo_en_light.svg");

    return (
      <div className={styles.destinyFont}>
        <BungieHelmet
          title={Localizer.Destiny.Destiny2PlayForFree}
          image={Img("/destiny/bgs/new_light/hero_desktop_bg.jpg")}
        >
          <body
            className={SpecialBodyClasses(
              BodyClasses.HideServiceAlert | BodyClasses.NoSpacer
            )}
          />
        </BungieHelmet>

        {/* HERO */}
        <div className={styles.hero} ref={this.heroRef}>
          <img
            className={styles.heroLogo}
            src={heroLogo}
            alt={""}
            role={"presentation"}
          />
          <div className={styles.subLogoContent}>
            <BuyButton
              className={styles.buyButton}
              buttonType={"gold"}
              onClick={() =>
                DestinySkuSelectorModal.show({
                  skuTag: DestinySkuTags.NewLightDetail,
                })
              }
              sheen={0}
              size={BasicSize.Large}
            >
              {Localizer.Destiny.NewLightBuyTitle}
            </BuyButton>
            <div className={styles.supportedPlatforms} />
          </div>
        </div>

        {/* SUB NAV */}
        <MarketingSubNav
          onChange={this.onMenuLock}
          idToElementsMapping={this.idToElementsMapping}
          stringFinder={(id) => {
            if (id === "media") {
              return Localizer.Destiny.Media;
            } else {
              return Localizer.Destiny[`Submenu_${id}`];
            }
          }}
          relockUnder={this.heroRef.current}
          buttonProps={{
            children: Localizer.Destiny.LaunchPadTitle,
            onClick: () =>
              DestinySkuSelectorModal.show({
                skuTag: DestinySkuTags.NewLightDetail,
              }),
          }}
          primaryColor={"taupe"}
          accentColor={"gold"}
        />

        {/* GAME */}

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: "#121212" }}
          id={"newlight_game"}
          ref={(el) => (this.idToElementsMapping["newlight_game"] = el)}
        >
          <div
            className={classNames(styles.contentWrapper, styles.worldSection)}
          >
            <div>
              <p className={styles.eyebrow}>
                {Localizer.newlight.theWorldEyebrow}
              </p>
              <h2 className={styles.title}>
                {Localizer.newlight.theWorldTitle}
              </h2>
              <p className={styles.copy}>
                {Localizer.newlight.theWorldDescription}
              </p>
            </div>

            <div className={styles.flexContentWrapper}>
              <div className={styles.flexContainer}>
                <div className={styles.flexItem}>
                  <ScreenShotBlock
                    screenshotPath={`destiny/bgs/new_light/media/overview_screenshot_1.jpg`}
                    thumbnailPath={`destiny/bgs/new_light/media/overview_screenshot_1_thumbnail.jpg`}
                    isMedium={this.state.responsive.medium}
                  />
                  <h3>{Localizer.newlight.theWorldFirstColumnTitle}</h3>
                  <p>{Localizer.newlight.theWorldFirstColumnDescription}</p>
                </div>
                <div className={styles.flexItem}>
                  <ScreenShotBlock
                    screenshotPath={`destiny/bgs/new_light/media/overview_screenshot_2.jpg`}
                    thumbnailPath={`destiny/bgs/new_light/media/overview_screenshot_2_thumbnail.jpg`}
                    isMedium={this.state.responsive.medium}
                  />
                  <h3>{Localizer.newlight.theWorldSecondColumnTitle}</h3>
                  <p>{Localizer.newlight.theWorldSecondColumnDescription}</p>
                </div>
                <div className={styles.flexItem}>
                  <ScreenShotBlock
                    screenshotPath={`destiny/bgs/new_light/media/overview_screenshot_3.jpg`}
                    thumbnailPath={`destiny/bgs/new_light/media/overview_screenshot_3_thumbnail.jpg`}
                    isMedium={this.state.responsive.medium}
                  />
                  <h3>{Localizer.newlight.theWorldThirdColumnTitle}</h3>
                  <p>{Localizer.newlight.theWorldThirdColumnDescription}</p>
                </div>
              </div>

              {!this.state.responsive.mobile && (
                <div className={styles.arrowContainer}>
                  <p className={styles.arrowsCallout}>
                    {Localizer.Destiny.ArrowsCallout}
                  </p>
                  <div className={styles.flexContainer}>
                    <DownArrows />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DESTINATION */}
        <section
          id={"newlight_destinations"}
          ref={(el) => (this.idToElementsMapping["newlight_destinations"] = el)}
        >
          <VideoCarousel
            isMedium={this.state.responsive.medium}
            backgroundImage={`/7/ca/destiny/bgs/new_light/destinations_bg_desktop.jpg`}
            classes={{
              wrapper: styles.carouselSpacing,
              eyebrow: styles.carouselEyebrow,
            }}
            startingIndex={3}
            carouselData={[
              {
                description: Localizer.newlight.cosmodromeDescription,
                title: Localizer.newlight.cosmodromeTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_1_cosmodrome.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_1_cosmodrome.jpg`,
              },
              {
                description: Localizer.newlight.edzDescription,
                title: Localizer.newlight.edzTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_2_edz.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_2_edz.jpg`,
              },
              {
                description: Localizer.newlight.nessusDescription,
                title: Localizer.newlight.nessusTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_3_nessus.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_3_nessus.jpg`,
              },
              {
                description: Localizer.newlight.moonDescription,
                title: Localizer.newlight.moonTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_4_moon.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_4_moon.jpg`,
              },
              {
                description: Localizer.newlight.tangledShoreDescription,
                title: Localizer.newlight.tangledShoreTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_5_tangled_shore.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_5_tangled_shore.jpg`,
              },
              {
                description: Localizer.newlight.dreamingCityDescription,
                title: Localizer.newlight.dreamingCityTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_6_dreaming_city.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_6_dreaming_city.jpg`,
              },
              {
                description: Localizer.newlight.europaDescription,
                title: Localizer.newlight.europaTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_7_europa.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_7_europa.jpg`,
              },
              {
                description: Localizer.newlight.theTowerDescription,
                title: Localizer.newlight.theTowerTitle,
                eyebrow: Localizer.newlight.destinationsEyebrow,
                modalImage: `/7/ca/destiny/bgs/new_light/media/destinations_8_tower.jpg`,
                thumbnailImage: `/7/ca/destiny/bgs/new_light/media/destinations_8_tower.jpg`,
              },
            ]}
          />
        </section>

        {/* GUARDIANS */}

        <section
          className={styles.cardsSection}
          style={{ backgroundColor: "#080d11" }}
          id={"newlight_guardians"}
          ref={(el) => (this.idToElementsMapping["newlight_guardians"] = el)}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.textWrapper}>
              <h2 className={styles.cardSectionHeading}>
                {Localizer.newlight.guardiansTitle}
              </h2>
              <span className={styles.shortBorder} />
              <p className={styles.cardSectionCopy}>
                {Localizer.newlight.guardiansDescription}
              </p>
            </div>

            <div className={styles.cardWrapper}>
              <StackedCardBlock
                cardImage={"/7/ca/destiny/bgs/new_light/class_titan.jpg"}
                logoImage={
                  "/7/ca/destiny/bgs/new_light/classes_titan_shield.png"
                }
                heading={Localizer.Destiny.titan}
                subheading={Localizer.newLight.titanDescription}
                classes={{
                  subheadingStyles: styles.cardSubheading,
                  upperCardStyles: styles.titanBackground,
                  logoStyles: styles.guardianLogoStyles,
                }}
              />
              <StackedCardBlock
                cardImage={"/7/ca/destiny/bgs/new_light/class_hunter.jpg"}
                logoImage={
                  "/7/ca/destiny/bgs/new_light/classes_hunter_shield.png"
                }
                heading={Localizer.Destiny.hunter}
                subheading={Localizer.newLight.hunterDescription}
                classes={{
                  subheadingStyles: styles.cardSubheading,
                  upperCardStyles: styles.hunterBackground,
                  logoStyles: styles.guardianLogoStyles,
                }}
              />
              <StackedCardBlock
                cardImage={"/7/ca/destiny/bgs/new_light/class_warlock.jpg"}
                logoImage={
                  "/7/ca/destiny/bgs/new_light/classes_warlock_shield.png"
                }
                heading={Localizer.Destiny.warlock}
                subheading={Localizer.Destiny.warlockDescription}
                classes={{
                  subheadingStyles: styles.cardSubheading,
                  upperCardStyles: styles.warlockBackground,
                  logoStyles: styles.guardianLogoStyles,
                }}
              />
            </div>
          </div>
        </section>

        {/* SUPERS */}

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: "#090708" }}
        >
          <div
            className={classNames(styles.contentWrapper, styles.supersSection)}
          >
            <div>
              <p className={styles.eyebrow}>
                {Localizer.newlight.supersEyebrow}
              </p>
              <h2 className={styles.title}>{Localizer.newlight.supersTitle}</h2>
              <p className={styles.copy}>
                {Localizer.newlight.supersDescription}
              </p>
            </div>

            <div className={styles.screenshotWrapper}>
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/supers_screenshot_1.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/supers_screenshot_1_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/supers_screenshot_2.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/supers_screenshot_2_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/supers_screenshot_3.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/supers_screenshot_3_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
            </div>
          </div>
        </section>

        {/* WEAPONS AND GEAR */}

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: "#0c0b10" }}
          id={"newlight_gear"}
          ref={(el) => (this.idToElementsMapping["newlight_gear"] = el)}
        >
          <div
            className={classNames(styles.contentWrapper, styles.weaponsSection)}
          >
            <div>
              <p className={styles.eyebrow}>
                {Localizer.newlight.weaponsEyebrow}
              </p>
              <h2 className={styles.title}>
                {Localizer.newlight.weaponsTitle}
              </h2>
              <p className={styles.copy}>
                {Localizer.newlight.weaponsDescription}
              </p>
            </div>

            <div className={styles.screenshotWrapper}>
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/arsenal_screenshot_1.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/arsenal_screenshot_1_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/arsenal_screenshot_2.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/arsenal_screenshot_2_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/arsenal_screenshot_3.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/arsenal_screenshot_3_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
            </div>
          </div>
        </section>

        {/* ACTIVITIES -- PVE */}

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: "#000d15" }}
          id={"newlight_activities"}
          ref={(el) => (this.idToElementsMapping["newlight_activities"] = el)}
        >
          <div className={classNames(styles.contentWrapper, styles.pveSection)}>
            <div>
              <p className={styles.eyebrow}>{Localizer.newlight.pveEyebrow}</p>
              <h2 className={styles.title}>{Localizer.newlight.pveTitle}</h2>
              <p className={styles.copy}>{Localizer.newlight.pveDescription}</p>
            </div>

            <div className={styles.screenshotWrapper}>
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pve_screenshot_1.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pve_screenshot_1_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pve_screenshot_2.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pve_screenshot_2_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pve_screenshot_3.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pve_screenshot_3_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
            </div>
          </div>
        </section>

        {/* ACTIVITIES -- PVP */}

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: "#0e0e0e" }}
        >
          <div className={classNames(styles.contentWrapper, styles.pvpSection)}>
            <div>
              <p className={styles.eyebrow}>{Localizer.newlight.pvpEyebrow}</p>
              <h2 className={styles.title}>{Localizer.newlight.pvpTitle}</h2>
              <p className={styles.copy}>{Localizer.newlight.pvpDescription}</p>
            </div>

            <div className={styles.screenshotWrapper}>
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pvp_screenshot_1.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pvp_screenshot_1_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pvp_screenshot_2.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pvp_screenshot_2_thumbnail.jpg`}
                isMedium={this.state.responsive.medium}
              />
              <ScreenShotBlock
                screenshotPath={`destiny/bgs/new_light/media/pvp_screenshot_3_v2.jpg`}
                thumbnailPath={`destiny/bgs/new_light/media/pvp_screenshot_3_thumbnail_v2.jpg`}
                isMedium={this.state.responsive.medium}
              />
            </div>
          </div>
        </section>

        {/* BUY CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContentWrapper}>
            <h2>{Localizer.Destiny.NewLightBuySmallTitle}</h2>
            <BuyButton
              className={styles.buyButton}
              buttonType={"gold"}
              onClick={() =>
                DestinySkuSelectorModal.show({
                  skuTag: DestinySkuTags.NewLightDetail,
                })
              }
              sheen={0}
              size={BasicSize.Large}
            >
              {Localizer.Destiny.NewLightBuyTitle}
            </BuyButton>
            <div className={styles.supportedPlatforms} />
          </div>
        </section>

        {/* LEGAL DISCLAIMERS */}

        <div className={styles.disclaimerGrid}>
          <ul>
            <li>{Localizer.newlight.purchaseDisclaimer}</li>
            <li>{Localizer.newlight.bungieRightsDisclaimer}</li>
            <li>{Localizer.Destiny.imagesLegalDetail}</li>
          </ul>
          <hr className={styles.horizontalRule} />
        </div>

        {/*NEW PLAYER GUIDE*/}

        <section
          className={styles.guide}
          id={"newlight_guide"}
          ref={(el) => (this.idToElementsMapping["newlight_guide"] = el)}
        >
          <Anchor
            className={styles.guideContent}
            url={RouteHelper.GuideDestiny()}
          >
            <div
              className={styles.bgContainer}
              style={{
                backgroundImage: `url(${Img(
                  "destiny/bgs/new_light/new_player_guide_thumbnail.jpg"
                )})`,
              }}
            >
              <div className={styles.textArea}>
                <h3 className={styles.title}>
                  {Localizer.newlight.playerGuideTitle}
                </h3>
                <p className={styles.subTitle}>
                  {Localizer.newlight.playerGuideSubtitle}
                </p>
              </div>
            </div>
          </Anchor>
        </section>

        {/* MEDIA */}

        <div>
          <DestinyNewsAndMedia
            showNews={false}
            defaultTab={"screenshots"}
            videos={null}
            wallpapers={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_thumb_2.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_2.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_thumb_3.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_3.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_thumb_4.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_wallpaper_4.png"
                ),
              },
            ]}
            screenshots={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_1.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_1.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_2.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_2.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_4.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_4.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_6.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_6.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_7.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_7.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_thumb_8.jpg"
                ),
                detail: Img(
                  "destiny/bgs/new_light/media/media_screenshot_8.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/pvp_screenshot_2_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/new_light/media/pvp_screenshot_2.jpg"),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/bgs/new_light/media/pve_screenshot_2_thumbnail.jpg"
                ),
                detail: Img("destiny/bgs/new_light/media/pve_screenshot_2.jpg"),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

const DownArrows = () => {
  const classes = classNames(styles.arrows, styles.down);

  return (
    <span className={classes}>
      <span className={styles.baseArrows} />
      <span className={styles.animatedArrow} />
    </span>
  );
};

export default withGlobalState(DestinyNewLightInternal, ["responsive"]);
