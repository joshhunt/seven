1; // This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Localizer } from "@Global/Localizer";
import styles from "./DestinyNewLight.module.scss";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import classNames from "classnames";
import { Responsive, IResponsiveState, ResponsiveSize } from "@Boot/Responsive";
import { DataStore, DestroyCallback } from "@Global/DataStore";
import { PCMigrationUserDataStore } from "@UI/User/PCMigrationUserDataStore";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { Respond } from "@Boot/Respond";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import { Tooltip, TooltipPosition } from "@UI/UIKit/Controls/Tooltip";
import { DestinyNewsAndMedia } from "./Shared/DestinyNewsAndMedia";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingBoxContainer } from "@UI/Marketing/MarketingBoxContainer";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { Img } from "@Helpers";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";

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
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};
  private readonly planetContainerRef = React.createRef<HTMLDivElement>();

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

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private readonly onScroll = () => {
    if (this.props.globalState.responsive.mobile) {
      return;
    }

    if (this.planetContainerRef.current) {
      const box = this.planetContainerRef.current.getBoundingClientRect();
      if (box.top > -window.innerHeight && box.top <= window.innerHeight) {
        this.setState({
          planetParallax: box.top / window.innerHeight,
        });
      }
    }
  };

  private readonly ext = (original) => {
    return this.state.supportsWebp ? "webp" : original;
  };

  private readonly makeClassBanner = (classType: DestinyClasses) => {
    return (
      <div
        role={"button"}
        onClick={() => this.setState({ selectedClass: classType })}
        className={classNames(styles[classType], styles.classBanner, {
          [styles.selected]: this.state.selectedClass === classType,
        })}
      />
    );
  };

  private readonly onHoverPlanet = (e: React.MouseEvent) => {
    const hoveredPlanetId = e.currentTarget.id;

    this.setState({
      hoveredPlanetId,
    });
  };

  private readonly onUnhoverPlanet = () => {
    this.setState({
      hoveredPlanetId: null,
    });
  };

  public render() {
    const destinationsBoxes = (
      <MarketingBoxContainer
        boxes={[
          {
            title: Localizer.Destiny.DestinationsBox1Title,
            content: Localizer.Destiny.DestinationsBox1Content,
          },
          {
            title: Localizer.Destiny.DestinationsBox2Title,
            content: Localizer.Destiny.DestinationsBox2Content,
          },
          {
            title: Localizer.Destiny.DestinationsBox3Title,
            content: Localizer.Destiny.DestinationsBox3Content,
          },
        ]}
        borderColor="rgba(245, 245, 245, 0.5)"
        backgroundColor="rgba(0,0,0, 0.4)"
        titleColor="rgb(245, 245, 245)"
        textColor="rgba(245, 245, 245, 0.5)"
      />
    );

    const playBoxes = (
      <MarketingBoxContainer
        boxes={[
          {
            title: Localizer.Destiny.PlayBox1Title,
            content: Localizer.Destiny.PlayBox1Content,
          },
          {
            title: Localizer.Destiny.PlayBox2Title,
            content: Localizer.Destiny.PlayBox2Content,
          },
          {
            title: Localizer.Destiny.PlayBox3Title,
            content: Localizer.Destiny.PlayBox3Content,
          },
        ]}
        borderColor="rgb(151, 164, 173)"
        backgroundColor="rgb(40, 48, 54)"
        titleColor="rgb(214, 214, 214)"
        textColor="rgba(214, 214, 214, 0.7)"
      />
    );

    const heroLogo =
      Localizer.CurrentCultureName === "ko"
        ? Img("/destiny/logos/destiny_guardians_logo.svg")
        : Img("/destiny/bgs/new_light/destiny2_logo_en.svg");

    const { selectedClass, hoveredPlanetId } = this.state;

    return (
      <React.Fragment>
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
        <div className={styles.hero} ref={this.heroRef}>
          <img className={styles.heroLogo} src={heroLogo} />
          <div className={styles.heroTitle}>
            {Localizer.Destiny.LaunchPadTitle}
          </div>
        </div>

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

        <div
          id={"newlight_world"}
          ref={(el) => (this.idToElementsMapping["newlight_world"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.NewLightWorldSmallTitle}
            sectionTitle={Localizer.Destiny.NewLightWorld1Title}
            blurb={Localizer.Destiny.NewLightWorld1Blurb}
            bgs={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/the_world_1_bg.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/world_1_mobile.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            alignment={"left"}
            bgColor={"#14171A"}
            margin={
              this.state.responsive.mobile
                ? "32rem auto 0px"
                : "12rem auto 21rem 10%"
            }
          />

          <MarketingContentBlock
            smallTitle={Localizer.Destiny.NewLightWorldSmallTitle}
            sectionTitle={Localizer.Destiny.NewLightWorld2Title}
            blurb={Localizer.Destiny.NewLightWorld2Blurb}
            bgs={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/the_world_2_bg.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/world_2_mobile.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            alignment={"left"}
            bgColor={"#14171A"}
            margin={
              this.state.responsive.mobile
                ? "34rem auto 0px"
                : "17rem auto 12rem 54%"
            }
          >
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
          </MarketingContentBlock>
        </div>

        <div
          id={"newlight_destinations"}
          ref={(el) => (this.idToElementsMapping["newlight_destinations"] = el)}
        >
          <div
            className={styles.planetsContainer}
            onMouseOut={() => this.setState({ hoveredPlanetId: "" })}
            ref={this.planetContainerRef}
          >
            <Respond
              responsive={this.props.globalState.responsive}
              at={ResponsiveSize.mobile}
              hide={true}
            >
              <Planet
                className={styles.planet8}
                planetId={"tangledShore"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.TangledShoreLabel}
                tooltipPosition={"tl"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.9}
              />

              <Planet
                className={styles.planet1}
                planetId={"mars"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.MarsLabel}
                tooltipPosition={"r"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.3}
              />

              <Planet
                className={styles.planet2}
                planetId={"mercury"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.MercuryLabel}
                tooltipPosition={"br"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.1}
              />

              <Planet
                className={styles.planet3}
                planetId={"io"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.IoLabel}
                tooltipPosition={"br"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.6}
              />

              <Planet
                className={styles.planet9}
                planetId={"edz"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.EarthLabel}
                tooltipPosition={"r"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.3}
              />

              <Planet
                className={styles.planet7}
                planetId={"traveler"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.TowerLabel}
                tooltipPosition={"b"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.3}
              />

              <Planet
                className={styles.planet5}
                planetId={"moon"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.MoonLabel}
                tooltipPosition={"l"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.35}
              />

              <Planet
                className={styles.planet4}
                planetId={"nessus"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.NessusLabel}
                tooltipPosition={"bl"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.5}
              />

              <Planet
                className={styles.planet6}
                planetId={"dreamingCity"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                tooltipPosition={"l"}
                label={Localizer.Destiny.DreamingCityLabel}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.4}
              />

              <Planet
                className={styles.planet10}
                planetId={"titan"}
                onMouseOver={this.onHoverPlanet}
                onMouseOut={this.onUnhoverPlanet}
                hoveredPlanetId={hoveredPlanetId}
                label={Localizer.Destiny.TitanLabel}
                tooltipPosition={"tr"}
                parallaxPct={this.state.planetParallax}
                parallaxRatio={0.75}
              />
            </Respond>

            <MarketingContentBlock
              smallTitle={Localizer.Destiny.NewLightDestinationsSmallTitle}
              sectionTitle={Localizer.Destiny.NewLightDestinationsTitle}
              alignment={this.state.responsive.mobile ? "left" : "center"}
              margin={
                this.state.responsive.mobile ? "28rem 0px 0px" : "41vw auto 0"
              }
              bgColor={"none"}
            >
              {destinationsBoxes}
            </MarketingContentBlock>
          </div>
        </div>

        <div
          id={"newlight_guardians"}
          ref={(el) => (this.idToElementsMapping["newlight_guardians"] = el)}
          className={styles.guardians}
        >
          <div
            className={styles.classImage}
            style={{
              backgroundImage: `url("7/ca/destiny/bgs/new_light/class_${selectedClass}_desktop.${this.ext(
                "png"
              )}")`,
            }}
          />
          <div className={styles.guardiansContent}>
            <h3>{Localizer.Destiny.NewLightGuardiansTitle}</h3>
            <div className={styles.classBannerContainer}>
              {this.makeClassBanner("titan")}
              {this.makeClassBanner("warlock")}
              {this.makeClassBanner("hunter")}
            </div>
            <div
              className={classNames(styles.classLogo, styles[selectedClass])}
            >
              <div className={styles.thickUnderline} />
              <div className={styles.classType}>
                {Localizer.Destiny[selectedClass]}
              </div>
              <div className={styles.classDesc}>
                {Localizer.Destiny[`${selectedClass}Description`]}
              </div>
            </div>
          </div>
        </div>

        <MarketingContentBlock
          smallTitle={Localizer.Destiny.NewLightGuardiansSmallTitle}
          sectionTitle={Localizer.Destiny.NewLightSuperTitle}
          alignment={this.state.responsive.mobile ? "left" : "center"}
          bgs={
            <Respond
              at={ResponsiveSize.mobile}
              hide={true}
              responsive={this.props.globalState.responsive}
            >
              <video autoPlay={true} muted={true} loop={true}>
                <source
                  src={Img("destiny/videos/supers_newlight.mp4")}
                  type="video/mp4"
                />
              </video>
            </Respond>
          }
          mobileBg={
            <div
              style={{
                backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/supers_mobile.${this.ext(
                  "jpg"
                )}")`,
              }}
            />
          }
          bgColor={"#1c110e"}
          blurb={Localizer.Destiny.NewLightSuperBlurb}
          margin={
            this.state.responsive.mobile ? "30rem 0 2rem" : "43rem auto 2rem"
          }
        />

        <div
          id={"newlight_gear"}
          ref={(el) => (this.idToElementsMapping["newlight_gear"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.NewLightGearSmallTitle}
            sectionTitle={Localizer.Destiny.NewLightGearTitle}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/gear_bg.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/gear_mobile.${this.ext(
                    "jpg"
                  )}")`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"#010d15"}
            margin={this.state.responsive.mobile ? "28rem 0 0" : "39rem auto 0"}
            blurb={Localizer.Destiny.NewLightGearBlurb}
          >
            <div className={classNames(styles.flexContainer, styles.gear)}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_gear_1_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_gear_1_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_gear_2_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_gear_2_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_gear_3_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_gear_3_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
            </div>
          </MarketingContentBlock>
        </div>

        <div
          id={"newlight_activities"}
          ref={(el) => (this.idToElementsMapping["newlight_activities"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.Submenu_newlight_activities}
            sectionTitle={Localizer.Destiny.NewLightActivities1SmallTitle}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/pve_bg.${this.ext(
                    "jpg"
                  )}")`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/pve_mobile.${this.ext(
                    "jpg"
                  )}")`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"#020c17"}
            margin={
              this.state.responsive.mobile ? "28rem 0 0" : "38rem auto 2rem"
            }
          >
            <div className={styles.flexContainer}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pve_1_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pve_1_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pve_2_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pve_2_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pve_3_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pve_3_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
            </div>

            <div className={styles.activities}>
              <ActivityDescription activity={"Strikes"} />
              <ActivityDescription activity={"Raids"} />
            </div>
          </MarketingContentBlock>
        </div>

        <div className={styles.pvpBackground}>
          <MarketingContentBlock
            smallTitle={Localizer.Destiny.Submenu_newlight_activities}
            sectionTitle={Localizer.Destiny.NewLightActivities2SmallTitle}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundSize: "contain",
                  backgroundPosition: "center top",
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/pvp_bg.${this.ext(
                    "jpg"
                  )}")`,
                  padding: "38rem 0 2rem",
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/pvp_mobile.${this.ext(
                    "jpg"
                  )}")`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"transparent"}
            margin={
              this.state.responsive.mobile ? "14rem 0 0" : "38rem auto 2rem"
            }
          >
            <div className={styles.flexContainer}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pvp_1_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pvp_1_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pvp_2_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pvp_2_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    `new_light/newlight_pvp_3_16x9.${this.ext("jpg")}`
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/bgs/new_light/newlight_pvp_3_thumb.${this.ext(
                      "jpg"
                    )}`
                  )}
                  className={styles.mediaBg}
                />
              </Button>
            </div>

            <div className={styles.activities}>
              <ActivityDescription activity={"Crucible"} />
              <ActivityDescription activity={"Gambit"} />
            </div>
          </MarketingContentBlock>
        </div>

        <MarketingContentBlock
          smallTitle={Localizer.Destiny.NewLightPlaySmallTitle}
          sectionTitle={Localizer.Destiny.NewLightPlayTitle}
          alignment={this.state.responsive.mobile ? "left" : "center"}
          bgs={
            <div
              style={{
                backgroundImage: `url("7/ca/destiny/bgs/new_light/play_bg.${this.ext(
                  "jpg"
                )}")`,
              }}
            />
          }
          mobileBg={
            <div
              style={{
                backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/play_bg_mobile.${this.ext(
                  "jpg"
                )}")`,
                backgroundSize: "contain",
              }}
            />
          }
          bgColor={"#0F1311"}
          margin={
            this.state.responsive.mobile ? "26rem 0px 0rem" : "41rem auto 2rem"
          }
        >
          {playBoxes}
        </MarketingContentBlock>

        <MarketingContentBlock
          smallTitle={""}
          sectionTitle={Localizer.Destiny.NewLightBuySmallTitle}
          alignment={"center"}
          bgs={
            <div
              style={{
                backgroundImage: `url("7/ca/destiny/bgs/new_light/CTA_bg.${this.ext(
                  "jpg"
                )}")`,
              }}
            />
          }
          mobileBg={
            <div
              style={{
                backgroundImage: `url("7/ca/destiny/bgs/new_light/mobile/cta_bg_mobile.${this.ext(
                  "jpg"
                )}")`,
                backgroundSize: "cover",
              }}
            />
          }
          bgColor={"#0F1311"}
          margin={
            this.state.responsive.mobile ? "6rem auto 2rem" : "12rem auto 2rem"
          }
        >
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
        </MarketingContentBlock>

        <DestinyNewsAndMedia
          showNews={false}
          defaultTab={"screenshots"}
          videos={null}
          wallpapers={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_wallpaper_thumb_1.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_wallpaper_1.png"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_wallpaper_thumb_2.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_wallpaper_2.png"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_wallpaper_thumb_3.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_wallpaper_3.png"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_wallpaper_thumb_4.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_wallpaper_4.png"),
            },
          ]}
          screenshots={[
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_1.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_1.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_2.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_2.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_3.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_3.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_4.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_4.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_5.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_5.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_6.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_6.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_7.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_7.jpg"),
            },
            {
              isVideo: false,
              thumbnail: Img(
                "destiny/bgs/new_light/media/media_screenshot_thumb_8.jpg"
              ),
              detail: Img("destiny/bgs/new_light/media/media_screenshot_8.jpg"),
            },
          ]}
        />
      </React.Fragment>
    );
  }
}

export type IDestinyActivityTypes = "Crucible" | "Gambit" | "Strikes" | "Raids";

interface IActivityDescriptionProps {
  activity: IDestinyActivityTypes;
}

const ActivityDescription = (props: IActivityDescriptionProps) => {
  /* Not ideal, but I missed a string when submitting to loc and it already exists in the xml file */

  const activityTitle =
    props.activity === "Crucible"
      ? Localizer.Destiny.ActivitiesIcon4Title
      : Localizer.Destiny[`NewLight${props.activity}`];
  const activityText =
    props.activity === "Crucible"
      ? Localizer.Destiny.NewLightCrucible
      : Localizer.Destiny[`NewLight${props.activity}Text`];

  return (
    <div
      className={classNames(styles[props.activity], styles.activityContainer)}
    >
      <div className={styles.activityLogo} />
      <div className={styles.activityTextContent}>
        <div className={styles.thickTopBorder} />
        <div className={styles.activityTitle}>{activityTitle}</div>
        <div className={styles.activityText}>{activityText}</div>
      </div>
    </div>
  );
};

const DownArrows = () => {
  const classes = classNames(styles.arrows, styles.down);

  return (
    <span className={classes}>
      <span className={styles.baseArrows} />
      <span className={styles.animatedArrow} />
    </span>
  );
};

interface IDestinationHoverProps {
  destination: string;
}

const DestinationHover = (props: IDestinationHoverProps) => {
  return (
    <div className={styles.destinationHover}>
      <div className={styles.iconContainer}>
        <div className={styles.destinationIcon} />
        <div className={styles.destinationTitle}>
          {Localizer.Destiny[`${props.destination}HoverTitle`]}
        </div>
      </div>
      <div className={styles.descriptionContainer}>
        {Localizer.Destiny[`${props.destination}HoverDesc`]}
      </div>
    </div>
  );
};

interface IMediaButtonProps {
  onClick: any;
  thumbnail: string;
}

const MediaButton = (props: IMediaButtonProps) => {
  return (
    <Button
      onClick={props.onClick}
      className={classNames(styles.thumbnail, styles.four)}
    >
      <img
        src={Img(props.thumbnail)}
        className={classNames(styles.mediaBg, styles.four)}
      />
    </Button>
  );
};

interface IPlanet {
  className: string;
  planetId: string;
  label: string;
  hoveredPlanetId: string;
  onMouseOver: (e: React.MouseEvent) => void;
  onMouseOut: () => void;
  tooltipPosition?: TooltipPosition;
  parallaxPct: number;
  parallaxRatio: number;
}

const Planet: React.SFC<IPlanet> = ({
  className,
  planetId,
  hoveredPlanetId,
  onMouseOut,
  onMouseOver,
  label,
  tooltipPosition,
  parallaxPct,
  parallaxRatio,
}) => {
  const outerMax = 300;

  const transformer = (max) =>
    `translateY(${max * parallaxPct * parallaxRatio}px)`;

  const outer = transformer(outerMax);

  return (
    <React.Fragment>
      <div
        className={classNames(className, styles.planet)}
        id={planetId}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseOut}
        style={{ transform: outer }}
      >
        <div className={styles.hotspot} />
        <div className={styles.planet}>
          <div className={styles.planet} />
        </div>
        <p>{label}</p>
      </div>
      <Tooltip
        visible={hoveredPlanetId === planetId}
        classNames={{
          tooltip: styles.toolTip,
          container: styles.tooltipContainer,
        }}
        position={tooltipPosition}
        distance={15}
      >
        <DestinationHover destination={planetId} />
      </Tooltip>
    </React.Fragment>
  );
};

export default withGlobalState(DestinyNewLightInternal, ["responsive"]);
