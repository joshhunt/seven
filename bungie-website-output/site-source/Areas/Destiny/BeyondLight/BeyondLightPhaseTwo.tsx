// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import {
  BeyondLightPhaseTwoDataStore,
  BeyondLightPhaseTwoDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseTwoDataStore";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Spinner } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import React from "react";
import styles from "./BeyondLightPhaseTwo.module.scss";
import { BeyondLightProducts } from "./BeyondLightProducts";
import {
  BeyondLightMap,
  Hero,
  PhaseTwoAccordion,
  TextBlock,
  VideoBlock,
} from "./Components/index";

interface PhaseTwoProps extends GlobalStateComponentProps<"responsive"> {}

interface PhaseTwoState {
  BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStorePayload;
  responsive: IResponsiveState;
}

enum blockType {
  "centered",
  "sided",
}

class PhaseTwo extends React.Component<PhaseTwoProps, PhaseTwoState> {
  constructor(props: PhaseTwoProps) {
    super(props);

    this.state = {
      BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStore.state,
      responsive: Responsive.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightPhaseTwoDataStore.observe((BeyondLightPhaseTwoData) =>
        this.setState({ BeyondLightPhaseTwoData })
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

    const { phaseTwo } = this.state.BeyondLightPhaseTwoData;

    if (!this.state.BeyondLightPhaseTwoData.loaded) {
      return <Spinner />;
    }

    if (phaseTwo === null) {
      return null;
    }

    return (
      <>
        <BungieHelmet
          title={phaseTwo.pageTitle}
          description={phaseTwo.heroSubheading}
          image={phaseTwo.heroMobileImage}
        />
        <Hero
          posterPath={phaseTwo.heroPosterImage}
          videoLoopPath={phaseTwo.heroVideoLoopPath}
          mobileBgPath={phaseTwo.heroMobileImage}
          heading={phaseTwo.heroHeading}
          subheading={phaseTwo.heroSubheading}
          videoPlayButtonText={phaseTwo.heroTrailerButtonText}
          videoPlayButtonType={"white"}
          youTubeVideoId={phaseTwo.heroTrailerButtonVideoId}
          buttonOneLink={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "beyondlight",
          })}
          buttonOneText={phaseTwo.heroTrailerPreOrderButtonLink}
          overlayImage={phaseTwo.heroMobileOverlay}
          buttonOneType={"blue"}
          isMedium={medium}
          isMobile={mobile}
        />

        <section
          className={styles.sectionOne}
          style={{
            backgroundColor:
              phaseTwo.sectionOneBackgroundHex ?? "rgb(33, 40, 51)",
          }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${phaseTwo.sectionOneMobileBackground})`
                : `url(${phaseTwo.sectionOneDesktopBackground})`,
            }}
          >
            <TextBlock
              title={phaseTwo.sectionOneHeading}
              body={phaseTwo.sectionOneSubheading}
            />
          </div>
        </section>

        <section
          className={styles.videoSection}
          style={{
            backgroundColor: phaseTwo.videoSectionHex ?? "rgb(33, 40, 51)",
          }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${phaseTwo.videoSectionMobileBackground})`
                : `url(${phaseTwo.videoSectionDesktopBackground})`,
            }}
          >
            <h2 className={styles.videoSectionHeading}>
              {phaseTwo.videoSectionHeading}
            </h2>
            <span className={styles.bottomBorder} />
            <VideoBlock
              classes={{ wrapper: styles.videoWrapper }}
              videoPath={phaseTwo.videoSectionVideoId}
              videoThumbnail={phaseTwo.videoSectionPoster}
              isMedium={medium}
              alignment="center"
            />
            {mobile && (
              <p className={styles.arrowEyebrow}>
                {phaseTwo.sectionTwoEyebrow}
              </p>
            )}
          </div>
          <DownArrows />
        </section>

        {mobile ? (
          <PhaseTwoAccordion
            accordionData={[
              {
                title: phaseTwo.sectionTwoItemOneTitle,
                labelBackground: `${
                  phaseTwo.sectionTwoItemOneMobileBackground +
                  Localizer.CurrentCultureName
                }.jpg`,
                description: phaseTwo.sectionTwoItemOneDescription,
                image: phaseTwo.sectionTwoItemOneImage,
              },
              {
                title: phaseTwo.sectionTwoItemTwoTitle,
                labelBackground: `${
                  phaseTwo.sectionTwoItemTwoMobileBackground +
                  Localizer.CurrentCultureName
                }.jpg`,
                description: phaseTwo.sectionTwoItemTwoDescription,
                image: phaseTwo.sectionTwoItemTwoImage,
              },
              {
                title: phaseTwo.sectionTwoItemThreeTitle,
                labelBackground: `${
                  phaseTwo.sectionTwoItemThreeMobileBackground +
                  Localizer.CurrentCultureName
                }.jpg`,
                description: phaseTwo.sectionTwoItemThreeDescription,
                image: phaseTwo.sectionTwoItemThreeImage,
              },
              {
                title: phaseTwo.sectionTwoItemFourTitle,
                labelBackground: `${
                  phaseTwo.sectionTwoItemFourMobileBackground +
                  Localizer.CurrentCultureName
                }.jpg`,
                description: phaseTwo.sectionTwoItemFourDescription,
                image: phaseTwo.sectionTwoItemFourImage,
              },
              {
                title: phaseTwo.sectionTwoItemFiveTitle,
                labelBackground: `${
                  phaseTwo.sectionTwoItemFiveMobileBackground +
                  Localizer.CurrentCultureName
                }.jpg`,
                description: phaseTwo.sectionTwoItemFiveDescription,
                image: phaseTwo.sectionTwoItemFiveImage,
              },
            ]}
          />
        ) : (
          <BeyondLightMap
            mapPointData={[
              {
                title: phaseTwo.sectionTwoItemOneTitle,
                description: phaseTwo.sectionTwoItemOneDescription,
                imageThumb: phaseTwo.sectionTwoItemOneImageThumb,
                image: phaseTwo.sectionTwoItemOneImage,
              },
              {
                title: phaseTwo.sectionTwoItemTwoTitle,
                description: phaseTwo.sectionTwoItemTwoDescription,
                imageThumb: phaseTwo.sectionTwoItemTwoImageThumb,
                image: phaseTwo.sectionTwoItemTwoImage,
              },
              {
                title: phaseTwo.sectionTwoItemThreeTitle,
                description: phaseTwo.sectionTwoItemThreeDescription,
                imageThumb: phaseTwo.sectionTwoItemThreeImageThumb,
                image: phaseTwo.sectionTwoItemThreeImage,
              },
              {
                title: phaseTwo.sectionTwoItemFourTitle,
                description: phaseTwo.sectionTwoItemFourDescription,
                imageThumb: phaseTwo.sectionTwoItemFourImageThumb,
                image: phaseTwo.sectionTwoItemFourImage,
              },
              {
                title: phaseTwo.sectionTwoItemFiveTitle,
                description: phaseTwo.sectionTwoItemFiveDescription,
                imageThumb: phaseTwo.sectionTwoItemFiveImageThumb,
                image: phaseTwo.sectionTwoItemFiveImage,
              },
            ]}
            sectionHeading={phaseTwo.sectionTwoHeading}
            sectionEyebrow={phaseTwo.sectionTwoEyebrow}
            backgroundImage={`${
              phaseTwo.sectionTwoBackgroundImage + Localizer.CurrentCultureName
            }.jpg`}
            backgroundImageCandy={phaseTwo.sectionTwoBackgroundCandyOne}
            backgroundImageCandyTwo={phaseTwo.sectionTwoBackgroundCandyTwo}
            toolTipFlair={phaseTwo.sectionTwoToolTipBackground}
          />
        )}

        <div id={"editions"} className={styles.preorder}>
          {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
          <BeyondLightProducts globalState={this.props.globalState} />
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

const DownArrows = () => {
  const classes = classNames(styles.arrows, styles.down);

  return (
    <span className={classes}>
      <span className={styles.baseArrows} />
      <span className={styles.animatedArrow} />
    </span>
  );
};

export default withGlobalState(PhaseTwo, ["responsive"]);
