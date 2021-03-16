// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/Destiny/BeyondLight/BeyondLightPhaseFour.module.scss";
import { BeyondLightProducts } from "@Areas/Destiny/BeyondLight/BeyondLightProducts";
import {
  BeyondLightPhaseFourDataStore,
  BeyondLightPhaseFourDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseFourDataStore";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Spinner } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import React from "react";
import {
  BeyondLightBackgroundParallax,
  Hero,
  VideoBlock,
} from "./Components/index";

interface BeyondLightPhaseFourProps
  extends GlobalStateComponentProps<"responsive"> {}

interface BeyondLightPhaseFourState {
  BeyondLightPhaseFourData: BeyondLightPhaseFourDataStorePayload;
  responsive: IResponsiveState;
}

enum blockType {
  "centered",
  "sided",
}

class BeyondLightPhaseFour extends React.Component<
  BeyondLightPhaseFourProps,
  BeyondLightPhaseFourState
> {
  constructor(props: BeyondLightPhaseFourProps) {
    super(props);

    this.state = {
      BeyondLightPhaseFourData: BeyondLightPhaseFourDataStore.state,
      responsive: Responsive.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightPhaseFourDataStore.observe((BeyondLightPhaseFourData) =>
        this.setState({ BeyondLightPhaseFourData })
      ),
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d());
  }

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;

    const { phaseFour } = this.state.BeyondLightPhaseFourData;

    const { medium, mobile } = this.state.responsive;

    if (!this.state.BeyondLightPhaseFourData.loaded) {
      return <Spinner />;
    }

    if (phaseFour === null) {
      return null;
    }

    return (
      <div className={styles.destinyFont}>
        <BungieHelmet
          title={phaseFour.pageTitle}
          description={phaseFour.heroSubheading}
          image={phaseFour?.heroMobileImage}
        />
        <div className={styles.pageWrapper}>
          <Hero
            posterPath={phaseFour?.heroPosterImage}
            videoLoopPath={phaseFour?.heroVideoLoopPath}
            mobileBgPath={phaseFour?.heroMobileImage}
            heading={phaseFour.heroHeading}
            subheading={phaseFour.heroSubheading}
            videoPlayButtonText={phaseFour.heroTrailerButtonText}
            videoPlayButtonType={"white"}
            youTubeVideoId={phaseFour.storySectionHeroTrailerVideoId}
            buttonOneLink={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "beyondlight",
            })}
            buttonOneText={phaseFour.heroTrailerPreOrderButtonText}
            overlayImage={phaseFour?.heroMobileOverlay}
            buttonOneType={"blue"}
            classes={{
              heading: styles.heroHeading,
              subheading: styles.heroSubheading,
            }}
            isMedium={medium}
            isMobile={mobile}
          />
          <div className={styles.overflowWrapper}>
            <section
              className={styles.sectionOneWrapper}
              style={{
                backgroundColor: phaseFour.sectionOneHex
                  ? `${phaseFour.sectionOneHex}`
                  : "#080f1f",
              }}
            >
              <div
                className={styles.sectionOneBackgroundWrapper}
                style={{
                  backgroundImage: mobile
                    ? `url(${phaseFour?.sectionOneBackgroundMobile})`
                    : `url(${phaseFour?.sectionOneBackgroundDesktop})`,
                }}
              >
                <div className={styles.textContainer}>
                  <h2>{phaseFour.sectionOneTitle}</h2>
                  <p>{phaseFour.sectionOneSubheading}</p>
                  <p className={styles.subText}>
                    {phaseFour.sectionOneSubText}
                  </p>
                  {phaseFour.sectionOneVideoId && (
                    <VideoBlock
                      videoPath={phaseFour.sectionOneVideoId}
                      videoThumbnail={phaseFour?.sectionOneVideoPoster}
                      isMedium={medium}
                      classes={{ wrapper: styles.videoWrapper }}
                    />
                  )}
                </div>
              </div>
            </section>

            <BeyondLightBackgroundParallax
              backgroundLayerOne={phaseFour?.sectionTwoBackgroundDesktop}
              backgroundLayerOneMobile={phaseFour?.sectionTwoBackgroundMobile}
              backgroundLayerTwo={phaseFour?.sectionTwoBackgroundCandyTwo}
              backgroundLayerThree={phaseFour?.sectionTwoBackgroundCandyOne}
              backgroundLayerFour={phaseFour?.sectionTwoBackgroundCandyThree}
              backgroundLayerThreeSpeed={mobile ? 19 : 26}
              backgroundLayerTwoSpeed={mobile ? -10 : -16}
              backgroundLayerFourSpeed={mobile ? 20 : 36}
              backgroundColor={phaseFour.sectionTwoHex}
              classes={{
                backgroundLayerOne: styles.backgroundLayerOneParallax,
                backgroundLayerTwo: styles.characterBackgroundLayerTwoParallax,
                backgroundLayerThree:
                  styles.characterBackgroundLayerThreeParallax,
                backgroundLayerFour:
                  styles.characterBackgroundLayerFourParallax,
                wrapper: styles.characterBackgroundParallaxWrapper,
              }}
              isMobile={mobile}
            >
              <section className={styles.riverRight}>
                <div
                  className={styles.rightBackground}
                  style={{
                    backgroundImage: `url(${phaseFour?.sectionTwoCharacterImage})`,
                  }}
                />
                <div className={styles.contentContainer}>
                  <h2>{phaseFour.sectionTwoHeading}</h2>
                  <p>{phaseFour.sectionTwoSubheading}</p>
                  {phaseFour.sectionTwoVideoId && (
                    <VideoBlock
                      videoPath={phaseFour.sectionTwoVideoId}
                      videoThumbnail={phaseFour?.sectionTwoVideoPoster}
                      isMedium={medium}
                      classes={{ wrapper: styles.contentVideoWrapper }}
                    />
                  )}
                </div>
              </section>

              <section className={styles.riverCenter}>
                <div
                  className={styles.centerBackground}
                  style={{
                    backgroundImage: `url(${phaseFour?.sectionThreeCharacterImage})`,
                  }}
                />
                <div className={styles.contentContainer}>
                  <h2>{phaseFour.sectionThreeHeading}</h2>
                  <p>{phaseFour.sectionThreeSubheading}</p>
                </div>
              </section>

              <section className={styles.riverLeft}>
                <div
                  className={styles.leftBackground}
                  style={{
                    backgroundImage: `url(${phaseFour?.sectionFourCharacterImage})`,
                  }}
                />
                <div className={styles.contentContainer}>
                  <h2>{phaseFour.sectionFourHeading}</h2>
                  <p>{phaseFour.sectionFourSubheading}</p>
                  {phaseFour.sectionFourVideoId && (
                    <VideoBlock
                      videoPath={phaseFour.sectionFourVideoId}
                      videoThumbnail={phaseFour?.sectionFourVideoPoster}
                      isMedium={medium}
                      classes={{ wrapper: styles.contentVideoWrapper }}
                    />
                  )}
                </div>
              </section>

              <section className={styles.riverRight}>
                <div
                  className={classNames(
                    styles.rightBackground,
                    styles.stranger
                  )}
                  style={{
                    backgroundImage: `url(${phaseFour?.sectionFiveCharacterImage})`,
                  }}
                />
                <div className={styles.contentContainer}>
                  <h2>{phaseFour.sectionFiveHeading}</h2>
                  <p>{phaseFour.sectionFiveSubheading}</p>
                  {phaseFour.sectionFiveVideoId && (
                    <VideoBlock
                      videoPath={phaseFour.sectionFiveVideoId}
                      videoThumbnail={phaseFour?.sectionFiveVideoPoster}
                      isMedium={medium}
                      classes={{ wrapper: styles.contentVideoWrapper }}
                    />
                  )}
                </div>
              </section>

              <section className={styles.riverDouble}>
                <div className={styles.riverDoubleBackgroundWrapper}>
                  <div className={styles.itemOne}>
                    <img
                      src={phaseFour?.sectionSixCharacterImageOne}
                      alt=""
                      role="presentation"
                    />
                    <div className={styles.contentContainer}>
                      <h2>{phaseFour.sectionSixHeadingOne}</h2>
                      <p>{phaseFour.sectionSixSubheadingOne}</p>
                    </div>
                  </div>
                  <div className={styles.itemTwo}>
                    <img
                      src={phaseFour?.sectionSixCharacterImageTwo}
                      alt=""
                      role="presentation"
                    />
                    <div className={styles.contentContainer}>
                      <h2>{phaseFour.sectionSixHeadingTwo}</h2>
                      <p>{phaseFour.sectionSixSubheadingTwo}</p>
                    </div>
                  </div>
                </div>
              </section>
            </BeyondLightBackgroundParallax>
          </div>

          <div id={"editions"} className={styles.preorder}>
            {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
            <BeyondLightProducts globalState={this.props.globalState} />
          </div>
        </div>
      </div>
    );
  }

  private contentBlock(
    title: React.ReactChild,
    desc: React.ReactChild,
    type: blockType
  ) {
    return (
      <div className={classNames(styles.contentBlock, styles[blockType[type]])}>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    );
  }
}

export default withGlobalState(BeyondLightPhaseFour, ["responsive"]);
