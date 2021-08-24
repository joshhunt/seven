// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { BeyondLightProducts } from "@Areas/Destiny/BeyondLight/BeyondLightProducts";
import {
  BeyondLightPhaseThreeDataStore,
  BeyondLightPhaseThreeDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseThreeDataStore";
import {
  BeyondLightUpdateDataStore,
  BeyondLightUpdateDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Spinner } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import React from "react";
import {
  BeyondLightBackgroundParallax,
  Hero,
  ScreenShotBlock,
  TextBlock,
  VideoBlock,
  VideoCarousel,
} from "./Components/index";
import styles from "./PhaseThree.module.scss";

interface PhaseThreeProps extends GlobalStateComponentProps<"responsive"> {}

interface PhaseThreeState {
  BeyondLightUpdateData: BeyondLightUpdateDataStorePayload;
  BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStorePayload;
  responsive: IResponsiveState;
}

enum blockType {
  "centered",
  "sided",
}

class PhaseThree extends React.Component<PhaseThreeProps, PhaseThreeState> {
  private readonly sectionTwoRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();

  constructor(props: PhaseThreeProps) {
    super(props);

    this.state = {
      BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStore.state,
      BeyondLightUpdateData: BeyondLightUpdateDataStore.state,
      responsive: Responsive.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightUpdateDataStore.observe((BeyondLightUpdateData) =>
        this.setState({ BeyondLightUpdateData })
      ),
      BeyondLightPhaseThreeDataStore.observe((BeyondLightPhaseThreeData) =>
        this.setState({ BeyondLightPhaseThreeData })
      ),
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d());
  }

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;
    const { medium, mobile } = this.state.responsive;

    const { phaseThree } = this.state.BeyondLightPhaseThreeData;

    const { homepage } = this.state.BeyondLightUpdateData;

    if (!this.state.BeyondLightPhaseThreeData.loaded) {
      return <Spinner />;
    }

    if (phaseThree === null) {
      return null;
    }

    return (
      <>
        <BungieHelmet
          title={phaseThree.pageTitle}
          description={phaseThree.heroSubheading}
          image={phaseThree.heroBackgroundMobile}
        />
        <div className={styles.pageWrapper}>
          <Hero
            posterPath={phaseThree.heroBackgroundDesktop}
            mobileBgPath={phaseThree.heroBackgroundMobile}
            overlayImage={phaseThree.heroOverlay}
            videoLoopPath={phaseThree.heroVideo}
            heading={phaseThree.heroHeading}
            subheading={phaseThree.heroSubheading}
            videoPlayButtonText={phaseThree.heroButtonOneText}
            videoPlayButtonType={"white"}
            youTubeVideoId={phaseThree.heroButtonOneLink}
            buttonOneLink={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "beyondlight",
            })}
            buttonOneText={phaseThree.heroButtonTwoText}
            buttonOneType={"blue"}
            isMedium={medium}
            isMobile={mobile}
            classes={{ overlay: styles.heroOverlay }}
          />

          <BeyondLightBackgroundParallax
            backgroundLayerOne={phaseThree.sectionTwoParallaxLayerOne}
            backgroundLayerOneMobile={phaseThree.sectionTwoBackgroundMobile}
            backgroundLayerTwo={phaseThree.sectionTwoParallaxLayerTwo}
            backgroundLayerThree={phaseThree.sectionTwoParallaxLayerThree}
            backgroundLayerFour={phaseThree.sectionTwoParallaxLayerFour}
            backgroundLayerTwoSpeed={mobile ? 19 : 36}
            backgroundLayerThreeSpeed={mobile ? 10 : 26}
            backgroundLayerOneSpeed={mobile ? 20 : 46}
            backgroundColor={phaseThree.sectionTwoHex}
            classes={{
              backgroundLayerOne: styles.backgroundLayerOneParallax,
              backgroundLayerTwo: styles.backgroundLayerTwoParallax,
              backgroundLayerThree: styles.backgroundLayerThreeParallax,
              backgroundLayerFour: styles.backgroundLayerFourParallax,
              wrapper: styles.backgroundParallaxWrapper,
            }}
            isMobile={mobile}
          >
            <section
              className={classNames(styles.goBeyond, styles.parallaxBeyond)}
            >
              <div className={styles.bgContainer} ref={this.sectionTwoRef}>
                <div
                  className={classNames(
                    styles.contentWrapper,
                    Localizer.CurrentCultureName !== "en" &&
                      styles.contentWideWrapper
                  )}
                >
                  <TextBlock
                    title={phaseThree.sectionTwoHeading}
                    body={phaseThree.sectionTwoSubheading}
                    videoProps={phaseThree.sectionTwoVideoId || null}
                  />
                  {phaseThree.sectionTwoVideoId && (
                    <VideoBlock
                      videoPath={phaseThree.sectionTwoVideoId}
                      videoThumbnail={phaseThree.sectionTwoVideoPoster}
                      isMedium={medium}
                    />
                  )}
                </div>
              </div>
            </section>
          </BeyondLightBackgroundParallax>

          {mobile || medium ? (
            <div className={styles.bannerWrapper}>
              <img
                src={phaseThree.sectionTwoBannerBackgroundMobile}
                alt={""}
                role="presentation"
              />
            </div>
          ) : (
            <div
              className={classNames(
                styles.bannerWrapper,
                Localizer.CurrentCultureName !== "en" && styles.bannerLocWrapper
              )}
              style={{
                backgroundImage: `url(${phaseThree.sectionTwoBannerBackgroundDesktop})`,
              }}
            >
              <h2
                className={classNames(styles.bannerHeading, styles.headingOne)}
              >
                {phaseThree.sectionTwoBannerHeading}
              </h2>
              <img
                src={phaseThree.sectionTwoBannerImage}
                alt={""}
                role="presentation"
              />
            </div>
          )}

          <VideoCarousel
            isMedium={medium}
            backgroundCandy={phaseThree.sectionTwoCarouselBackgroundCandy}
            backgroundImage={phaseThree.sectionTwoCarouselBackgroundDesktop}
            classes={{
              wrapper: styles.carouselSpacing,
              eyebrow: styles.carouselEyebrow,
            }}
            startingIndex={0}
            carouselData={[
              {
                description: phaseThree.sectionTwoCarouselItemOneSubheading,
                title: phaseThree.sectionTwoCarouselItemOneHeading,
                eyebrow: phaseThree.sectionTwoCarouselItemOneEyebrow,
                poster: phaseThree.sectionTwoCarouselItemOneVideoPoster,
                videoId: phaseThree.sectionTwoCarouselItemOneVideoId,
                modalImage: phaseThree.sectionTwoCarouselItemOneImage,
                thumbnailImage: phaseThree.sectionTwoCarouselItemOneThumb,
                disclaimer: phaseThree.sectionTwoCarouselItemOneDisclaimer,
              },
              {
                description: phaseThree.sectionTwoCarouselItemTwoSubheading,
                title: phaseThree.sectionTwoCarouselItemTwoHeading,
                eyebrow: phaseThree.sectionTwoCarouselItemTwoEyebrow,
                poster: phaseThree.sectionTwoCarouselItemTwoVideoPoster,
                videoId: phaseThree.sectionTwoCarouselItemTwoVideoId,
                modalImage: phaseThree.sectionTwoCarouselItemTwoImage,
                thumbnailImage: phaseThree.sectionTwoCarouselItemTwoThumb,
              },
              {
                description: phaseThree.sectionTwoCarouselItemThreeSubheading,
                title: phaseThree.sectionTwoCarouselItemThreeHeading,
                eyebrow: phaseThree.sectionTwoCarouselItemThreeEyebrow,
                poster: phaseThree.sectionTwoCarouselItemThreeVideoPoster,
                videoId: phaseThree.sectionTwoCarouselItemThreeVideoId,
                modalImage: phaseThree.sectionTwoCarouselItemThreeImage,
                thumbnailImage: phaseThree.sectionTwoCarouselItemThreeThumb,
              },
              {
                description: phaseThree.sectionTwoCarouselItemFourSubheading,
                title: phaseThree.sectionTwoCarouselItemFourHeading,
                eyebrow: phaseThree.sectionTwoCarouselItemFourEyebrow,
                poster: phaseThree.sectionTwoCarouselItemFourVideoPoster,
                videoId: phaseThree.sectionTwoCarouselItemFourVideoId,
                modalImage: phaseThree.sectionTwoCarouselItemFourImage,
                thumbnailImage: phaseThree.sectionTwoCarouselItemFourThumb,
              },
            ]}
          />

          <section
            className={styles.underIceTextWithScreen}
            style={{
              backgroundColor: phaseThree.sectionThreeHex
                ? `${phaseThree.sectionThreeHex}`
                : "#080f1f",
            }}
          >
            <div
              className={styles.contentWrapper}
              style={{
                backgroundImage: mobile
                  ? `url(${phaseThree.sectionThreeBackgroundMobile})`
                  : `url(${phaseThree.sectionThreeBackgroundDesktop})`,
              }}
            >
              <div>
                <h2 className={styles.headingSecThree}>
                  {phaseThree.sectionThreeHeading}
                </h2>
                <span className={styles.shortBorder} />
                <p>{phaseThree.sectionThreeSubheading}</p>
              </div>

              <div className={styles.screenshotWrapper}>
                <ScreenShotBlock
                  screenshotPath={homepage.sectionFiveScreenshot1}
                  thumbnailPath={homepage.sectionFiveScreenshot1Thumb}
                  isMedium={medium}
                />
                <ScreenShotBlock
                  screenshotPath={homepage.sectionFiveScreenshot2}
                  thumbnailPath={homepage.sectionFiveScreenshot2Thumb}
                  isMedium={medium}
                />
                <ScreenShotBlock
                  screenshotPath={homepage.sectionFiveScreenshot3}
                  thumbnailPath={homepage.sectionFiveScreenshot3Thumb}
                  isMedium={medium}
                />
              </div>
            </div>
          </section>

          {mobile || medium ? (
            <div className={styles.bannerWrapper}>
              <img
                src={phaseThree.sectionThreeBannerBackgroundMobile}
                alt={""}
                role="presentation"
              />
            </div>
          ) : (
            <div
              className={classNames(
                styles.bannerWrapper,
                Localizer.CurrentCultureName !== "en" && styles.bannerLocWrapper
              )}
              style={{
                backgroundImage: `url(${phaseThree.sectionThreeBannerBackgroundDesktop})`,
              }}
            >
              <h2
                className={classNames(styles.bannerHeading, styles.headingOne)}
              >
                {phaseThree.sectionThreeBannerHeading}
              </h2>
              <img
                src={phaseThree.sectionThreeBannerImage}
                alt={""}
                role="presentation"
              />
            </div>
          )}

          <VideoCarousel
            isMedium={medium}
            backgroundCandy={phaseThree.sectionThreeCarouselBackgroundCandy}
            backgroundImage={phaseThree.sectionThreeCarouselBackgroundDesktop}
            classes={{
              wrapper: styles.carouselSpacing,
              eyebrow: styles.carouselEyebrow,
            }}
            startingIndex={0}
            carouselData={[
              {
                description: phaseThree.sectionThreeCarouselItemOneSubheading,
                title: phaseThree.sectionThreeCarouselItemOneHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemOneEyebrow,
                poster: phaseThree.sectionThreeCarouselItemOneVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemOneVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemOneImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemOneThumb,
              },
              {
                description: phaseThree.sectionThreeCarouselItemTwoSubheading,
                title: phaseThree.sectionThreeCarouselItemTwoHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemTwoEyebrow,
                poster: phaseThree.sectionThreeCarouselItemTwoVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemTwoVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemTwoImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemTwoThumb,
              },
              {
                description: phaseThree.sectionThreeCarouselItemThreeSubheading,
                title: phaseThree.sectionThreeCarouselItemThreeHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemThreeEyebrow,
                poster: phaseThree.sectionThreeCarouselItemThreeVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemThreeVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemThreeImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemThreeThumb,
              },
              {
                description: phaseThree.sectionThreeCarouselItemFourSubheading,
                title: phaseThree.sectionThreeCarouselItemFourHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemFourEyebrow,
                poster: phaseThree.sectionThreeCarouselItemFourVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemFourVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemFourImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemFourThumb,
              },
              {
                description: phaseThree.sectionThreeCarouselItemFiveSubheading,
                title: phaseThree.sectionThreeCarouselItemFiveHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemFiveEyebrow,
                poster: phaseThree.sectionThreeCarouselItemFiveVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemFiveVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemFiveImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemFiveThumb,
              },
              {
                description: phaseThree.sectionThreeCarouselItemSixSubheading,
                title: phaseThree.sectionThreeCarouselItemSixHeading,
                eyebrow: phaseThree.sectionThreeCarouselItemSixEyebrow,
                poster: phaseThree.sectionThreeCarouselItemSixVideoPoster,
                videoId: phaseThree.sectionThreeCarouselItemSixVideoId,
                modalImage: phaseThree.sectionThreeCarouselItemSixImage,
                thumbnailImage: phaseThree.sectionThreeCarouselItemSixThumb,
              },
            ]}
          />

          <section className={styles.sectionFourWrapper}>
            <div
              className={styles.sectionFourBackgroundWrapper}
              style={{
                backgroundImage: mobile
                  ? `url(${phaseThree.sectionFourBackgroundMobile})`
                  : `url(${phaseThree.sectionFourBackgroundDesktop})`,
              }}
            >
              <h2>{phaseThree.sectionFourHeading}</h2>
              <span className={styles.shortBorder} />
              <p>{phaseThree.sectionFourSubheading}</p>
            </div>
          </section>

          <div id={"editions"} className={styles.preorder}>
            {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
            <BeyondLightProducts globalState={this.props.globalState} />
          </div>
        </div>
      </>
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

export default withGlobalState(PhaseThree, ["responsive"]);
