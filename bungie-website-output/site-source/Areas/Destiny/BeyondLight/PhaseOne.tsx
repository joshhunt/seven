// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { BeyondLightProducts } from "@Areas/Destiny/BeyondLight/BeyondLightProducts";
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
import * as React from "react";
import {
  BeyondLightAccordion,
  Hero,
  InteractiveSection,
  StackedCardBlock,
  TextBlock,
  VideoCarousel,
} from "./Components/index";
import styles from "./PhaseOne.module.scss";

// Required props
interface IPhaseOneProps extends GlobalStateComponentProps<"responsive"> {}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type ComponentProps = IPhaseOneProps & DefaultProps;

interface IPhaseOneState {
  BeyondLightUpdateData: BeyondLightUpdateDataStorePayload;
  responsive: IResponsiveState;
  transparentMode: boolean;
}

enum blockType {
  "centered",
  "sided",
}

/**
 * PhaseOne - Replace this description
 *  *
 * @param {IPhaseOneProps} props
 * @returns
 */
class PhaseOne extends React.Component<IPhaseOneProps, IPhaseOneState> {
  constructor(props: IPhaseOneProps) {
    super(props);

    this.state = {
      transparentMode: true,
      responsive: Responsive.state,
      BeyondLightUpdateData: BeyondLightUpdateDataStore.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightUpdateDataStore.observe((BeyondLightUpdateData) =>
        this.setState({ BeyondLightUpdateData })
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

    const {
      phaseOneA,
      phaseOne,
      phaseOneB,
      phaseOneC,
    } = this.state.BeyondLightUpdateData;

    if (!this.state.BeyondLightUpdateData.loaded) {
      return <Spinner />;
    }

    if (phaseOne === null) {
      return null;
    }

    return (
      <div className={styles.pageWrapper}>
        <BungieHelmet
          title={phaseOne["pageTitle"]}
          description={phaseOne["heroSubheading"]}
          image={phaseOne["pageMetaDataDescription"]}
        />
        <Hero
          posterPath={phaseOne.heroPosterPath}
          mobileBgPath={phaseOne.heroMobileBg}
          overlayImage={phaseOne["heroMobileOverlay"]}
          videoLoopPath={phaseOne["heroVideoLoopPath"]}
          subheading={phaseOne["heroSubheading"]}
          eyebrow={phaseOne["heroEyebrow"]}
          heading={phaseOne["heroHeading"]}
          videoPlayButtonText={phaseOne["heroTrailerButtonText"]}
          videoPlayButtonType={"white"}
          youTubeVideoId={phaseOne["heroTrailerButtonYoutubeLink"]}
          buttonOneLink={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "beyondlight",
          })}
          buttonOneText={phaseOne["heroPreOrderButtonText"]}
          bgColor={phaseOne.bgHexHero ? phaseOne.bgHexHero : "rgb(33, 40, 51)"}
          buttonOneType={"blue"}
          isMedium={medium}
          isMobile={mobile}
        />

        <section
          className={styles.sectionOne}
          style={{ backgroundColor: phaseOne.bgHex2 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${phaseOne["sectionOneMobileBackground"]})`
                : `url(${phaseOne["sectionOneDesktopBackground"]})`,
            }}
          >
            <TextBlock
              title={phaseOne["sectionOneHeading"]}
              body={phaseOne["sectionOneBodyCopy"]}
            />
          </div>
        </section>

        <section
          className={styles.cardsSection}
          style={{ backgroundColor: phaseOne.bgHex3 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${phaseOne["sectionTwoMobileBackgroundImage"]})`
                : `url(${phaseOne["sectionTwoDesktopBackgroundImage"]})`,
            }}
          >
            <div className={styles.textWrapper}>
              <h2 className={styles.cardSectionHeading}>
                {phaseOne["sectionTwoTitle"]}
              </h2>
              <span className={styles.shortBorder} />
              <p className={styles.cardSectionCopy}>
                {phaseOne["sectionTwoSubheading"]}
              </p>
            </div>

            <div className={styles.cardWrapper}>
              <StackedCardBlock
                cardImage={phaseOne["sectionTwoCardOneImage"]}
                logoImage={phaseOne["sectionTwoCardOneLogo"]}
                heading={phaseOne["sectionTwoCardOneTitle"]}
                subheading={phaseOne["sectionTwoCardOneSubhead"]}
              />
              <StackedCardBlock
                cardImage={phaseOne["sectionTwoCardTwoImage"]}
                logoImage={phaseOne["sectionTwoCardTwoLogo"]}
                heading={phaseOne["sectionTwoCardTwoTitle"]}
                subheading={phaseOne["sectionTwoCardTwoSubhead"]}
              />
              <StackedCardBlock
                cardImage={phaseOne["sectionTwoCardThreeImage"]}
                logoImage={phaseOne["sectionTwoCardThreeLogo"]}
                heading={phaseOne["sectionTwoCardThreeTitle"]}
                subheading={phaseOne["sectionTwoCardThreeSubhead"]}
              />
            </div>
          </div>
        </section>

        {medium ? (
          <BeyondLightAccordion
            accordionData={[
              {
                title: phaseOne["SectionThreeItemTwoTitle"],
                eyebrow: phaseOneA["modalItemTwoTitle"]
                  ? phaseOneA["modalItemTwoTitle"]
                  : phaseOne["SectionThreeItemTwoLockedHeading"],
                summary:
                  phaseOneA["modalItemTwoBodyCopy"] &&
                  phaseOneA["modalItemTwoBodyCopy"],
                mainImage: phaseOne["itemOneBackgroundImageAccordion"],
                itemImage:
                  phaseOneA["modalItemTwoImagePath"] &&
                  phaseOneA["modalItemTwoImagePath"],
                itemImageTwo:
                  phaseOneA["modalItemTwoImagePathTwo"] &&
                  phaseOneA["modalItemTwoImagePathTwo"],
                subheadingOne:
                  phaseOneA["itemTwoModalSubheadingOne"] &&
                  phaseOneA["itemTwoModalSubheadingOne"],
                captionOne:
                  phaseOneA["itemTwoModalCaptionOne"] &&
                  phaseOneA["itemTwoModalCaptionOne"],
                subheadingTwo:
                  phaseOneA["itemTwoModalSubheadingTwo"] &&
                  phaseOneA["itemTwoModalSubheadingTwo"],
                captionTwo:
                  phaseOneA["itemTwoModalTitleCaptionTwo"] &&
                  phaseOneA["itemTwoModalTitleCaptionTwo"],
                logoImageOne:
                  phaseOneA["itemTwoModalLogoOne"] &&
                  phaseOneA["itemTwoModalLogoOne"],
                logoImageTwo:
                  phaseOneA["itemTwoModalLogoTwo"] &&
                  phaseOneA["itemTwoModalLogoTwo"],
                detailMainImage:
                  phaseOneA["modalItemTwoMobileMainImage"] &&
                  phaseOneA["modalItemTwoMobileMainImage"],
              },
              {
                title: phaseOne["SectionThreeItemOneTitle"],
                eyebrow: phaseOneB["modalItemOneEyebrow"]
                  ? phaseOneB["modalItemOneEyebrow"]
                  : phaseOne["SectionThreeItemOneLockedHeading"],
                summary:
                  phaseOneB["modalItemOneBodyCopy"] &&
                  phaseOneB["modalItemOneBodyCopy"],
                mainImage: phaseOne["itemTwoBackgroundImageAccordion"],
                itemImage:
                  phaseOneB["modalItemOneImagePath"] &&
                  phaseOneB["modalItemOneImagePath"],
                itemImageTwo:
                  phaseOneB["modalItemOneImagePathTwo"] &&
                  phaseOneB["modalItemOneImagePathTwo"],
                subheadingOne:
                  phaseOneB["modalItemOneSubheadingOne"] &&
                  phaseOneB["modalItemOneSubheadingOne"],
                captionOne:
                  phaseOneB["modalItemOneCaptionOne"] &&
                  phaseOneB["modalItemOneCaptionOne"],
                subheadingTwo:
                  phaseOneB["modalItemOneSubheadingTwo"] &&
                  phaseOneB["modalItemOneSubheadingTwo"],
                captionTwo:
                  phaseOneB["modalItemOneCaptionTwo"] &&
                  phaseOneB["modalItemOneCaptionTwo"],
                logoImageOne:
                  phaseOneB["modalItemOneLogoOne"] &&
                  phaseOneB["modalItemOneLogoOne"],
                logoImageTwo:
                  phaseOneB["modalItemOneLogoTwo"] &&
                  phaseOneB["modalItemOneLogoTwo"],
                detailMainImage:
                  phaseOneB["modalItemOneMobileBackground"] &&
                  phaseOneB["modalItemOneMobileBackground"],
              },
              {
                title: phaseOne["SectionThreeItemThreeTitle"],
                eyebrow: phaseOneC["modalItemThreeEyebrow"]
                  ? phaseOneC["modalItemThreeEyebrow"]
                  : phaseOne["SectionThreeItemThreeLockedHeading"],
                summary:
                  phaseOneC["modalItemThreeBodyCopy"] &&
                  phaseOneC["modalItemThreeBodyCopy"],
                mainImage: phaseOne["itemThreeBackgroundImageAccordion"],
                itemImage:
                  phaseOneC["modalItemThreeImagePath"] &&
                  phaseOneC["modalItemThreeImagePath"],
                itemImageTwo:
                  phaseOneC["modalItemThreeImagePathTwo"] &&
                  phaseOneC["modalItemThreeImagePathTwo"],
                subheadingOne:
                  phaseOneC["modalItemThreeSubheadingOne"] &&
                  phaseOneC["modalItemThreeSubheadingOne"],
                captionOne:
                  phaseOneC["modalItemThreeCaptionOne"] &&
                  phaseOneC["modalItemThreeCaptionOne"],
                subheadingTwo:
                  phaseOneC["modalItemThreeSubheadingTwo"] &&
                  phaseOneC["modalItemThreeSubheadingTwo"],
                captionTwo:
                  phaseOneC["modalItemThreeCaptionTwo"] &&
                  phaseOneC["modalItemThreeCaptionTwo"],
                logoImageOne:
                  phaseOneC["modalItemThreeLogoOne"] &&
                  phaseOneC["modalItemThreeLogoOne"],
                logoImageTwo:
                  phaseOneC["modalItemThreeLogoTwo"] &&
                  phaseOneC["modalItemThreeLogoTwo"],
                detailMainImage:
                  phaseOneC["modalItemThreeMobileBackground"] &&
                  phaseOneC["modalItemThreeMobileBackground"],
              },
            ]}
          />
        ) : (
          <InteractiveSection
            itemOneTitle={phaseOne["SectionThreeItemOneTitle"]}
            itemOneSubtitle={
              phaseOneB["modalItemOneTitle"]
                ? phaseOneB["modalItemOneEyebrow"]
                : phaseOne["SectionThreeItemOneLockedHeading"]
            }
            itemOneImagePath={phaseOne["SectionThreeItemOneImagePath"]}
            ItemOneCandy={phaseOne["SectionThreeItemOneCandy"]}
            itemTwoTitle={phaseOne["SectionThreeItemTwoTitle"]}
            itemTwoSubtitle={
              phaseOneA["modalItemTwoTitle"]
                ? phaseOneA["modalItemTwoTitle"]
                : phaseOne["SectionThreeItemTwoLockedHeading"]
            }
            itemTwoImagePath={phaseOne["SectionThreeItemTwoImagePath"]}
            itemThreeTitle={phaseOne["SectionThreeItemThreeTitle"]}
            itemThreeSubtitle={
              phaseOneC["modalItemThreeEyebrow"]
                ? phaseOneC["modalItemThreeEyebrow"]
                : phaseOne["SectionThreeItemThreeLockedHeading"]
            }
            itemThreeImagePath={phaseOne["SectionThreeItemThreeImagePath"]}
            background={phaseOne["SectionThreeDesktopBackgroundImage"]}
            backgroundCandy={phaseOne["SectionThreeBackgroundCandy"]}
            sectionHeading={phaseOne.sectionThreeTitle}
            itemOneModalEyebrow={
              phaseOneB["modalItemOneEyebrow"] &&
              phaseOneB["modalItemOneEyebrow"]
            }
            itemOneModalTitle={
              phaseOneB["modalItemOneTitle"] && phaseOneB["modalItemOneTitle"]
            }
            itemOneModalBodyCopy={
              phaseOneB["modalItemOneBodyCopy"] &&
              phaseOneB["modalItemOneBodyCopy"]
            }
            itemOneModalImagePath={
              phaseOneB["modalItemOneImagePath"] &&
              phaseOneB["modalItemOneImagePath"]
            }
            itemOneModalImagePathTwo={
              phaseOneB["modalItemOneImagePathTwo"] &&
              phaseOneB["modalItemOneImagePathTwo"]
            }
            itemOneModalBackgroundPoster={
              phaseOneB["modalItemOneBackgroundPoster"] &&
              phaseOneB["modalItemOneBackgroundPoster"]
            }
            itemOneModalBackgroundVideo={
              phaseOneB["modalItemOneBackgroundVideo"] &&
              phaseOneB["modalItemOneBackgroundVideo"]
            }
            itemOneModalLogoOne={
              phaseOneB["modalItemOneLogoOne"] &&
              phaseOneB["modalItemOneLogoOne"]
            }
            itemOneModalLogoTwo={
              phaseOneB["modalItemOneLogoTwo"] &&
              phaseOneB["modalItemOneLogoTwo"]
            }
            itemOneModalSubheadingTwo={
              phaseOneB["modalItemOneSubheadingOne"] &&
              phaseOneB["modalItemOneSubheadingOne"]
            }
            itemOneModalCaptionTwo={
              phaseOneB["modalItemOneCaptionOne"] &&
              phaseOneB["modalItemOneCaptionOne"]
            }
            itemOneModalSubheadingOne={
              phaseOneB["modalItemOneSubheadingTwo"] &&
              phaseOneB["modalItemOneSubheadingTwo"]
            }
            itemOneModalCaptionOne={
              phaseOneB["modalItemOneCaptionTwo"] &&
              phaseOneB["modalItemOneCaptionTwo"]
            }
            itemTwoModalEyebrow={
              phaseOneA["modalItemTwoEyebrow"] &&
              phaseOneA["modalItemTwoEyebrow"]
            }
            itemTwoModalTitle={
              phaseOneA["modalItemTwoTitle"] && phaseOneA["modalItemTwoTitle"]
            }
            itemTwoModalBodyCopy={
              phaseOneA["modalItemTwoBodyCopy"] &&
              phaseOneA["modalItemTwoBodyCopy"]
            }
            itemTwoModalImagePath={
              phaseOneA["modalItemTwoImagePath"] &&
              phaseOneA["modalItemTwoImagePath"]
            }
            itemTwoModalImagePathTwo={
              phaseOneA["modalItemTwoImagePathTwo"] &&
              phaseOneA["modalItemTwoImagePathTwo"]
            }
            itemTwoModalBackgroundPoster={
              phaseOneA["itemTwoModalBackgroundPoster"] &&
              phaseOneA["itemTwoModalBackgroundPoster"]
            }
            itemTwoModalBackgroundVideo={
              phaseOneA["itemTwoModalBackgroundVideo"] &&
              phaseOneA["itemTwoModalBackgroundVideo"]
            }
            itemTwoModalLogoOne={
              phaseOneA["itemTwoModalLogoOne"] &&
              phaseOneA["itemTwoModalLogoOne"]
            }
            itemTwoModalLogoTwo={
              phaseOneA["itemTwoModalLogoTwo"] &&
              phaseOneA["itemTwoModalLogoTwo"]
            }
            itemTwoModalSubheadingOne={
              phaseOneA["itemTwoModalSubheadingTwo"] &&
              phaseOneA["itemTwoModalSubheadingTwo"]
            }
            itemTwoModalCaptionOne={
              phaseOneA["itemTwoModalTitleCaptionTwo"] &&
              phaseOneA["itemTwoModalTitleCaptionTwo"]
            }
            itemTwoModalSubheadingTwo={
              phaseOneA["itemTwoModalSubheadingOne"] &&
              phaseOneA["itemTwoModalSubheadingOne"]
            }
            itemTwoModalCaptionTwo={
              phaseOneA["itemTwoModalCaptionOne"] &&
              phaseOneA["itemTwoModalCaptionOne"]
            }
            itemThreeModalBackgroundPoster={
              phaseOneC["modalItemThreeBackgroundPoster"] &&
              phaseOneC["modalItemThreeBackgroundPoster"]
            }
            itemThreeModalBackgroundVideo={
              phaseOneC["modalItemThreeBackgroundVideo"] &&
              phaseOneC["modalItemThreeBackgroundVideo"]
            }
            itemThreeModalBodyCopy={
              phaseOneC["modalItemThreeBodyCopy"] &&
              phaseOneC["modalItemThreeBodyCopy"]
            }
            itemThreeModalCaptionOne={
              phaseOneC["modalItemThreeCaptionOne"] &&
              phaseOneC["modalItemThreeCaptionOne"]
            }
            itemThreeModalCaptionTwo={
              phaseOneC["modalItemThreeCaptionTwo"] &&
              phaseOneC["modalItemThreeCaptionTwo"]
            }
            itemThreeModalEyebrow={
              phaseOneC["modalItemThreeTitle"] &&
              phaseOneC["modalItemThreeTitle"]
            }
            itemThreeModalImagePathTwo={
              phaseOneC["modalItemThreeImagePathTwo"] &&
              phaseOneC["modalItemThreeImagePathTwo"]
            }
            itemThreeModalImagePath={
              phaseOneC["modalItemThreeImagePath"] &&
              phaseOneC["modalItemThreeImagePath"]
            }
            itemThreeModalLogoOne={
              phaseOneC["modalItemThreeLogoTwo"] &&
              phaseOneC["modalItemThreeLogoTwo"]
            }
            itemThreeModalLogoTwo={
              phaseOneC["modalItemThreeLogoOne"] &&
              phaseOneC["modalItemThreeLogoOne"]
            }
            itemThreeModalSubheadingOne={
              phaseOneC["modalItemThreeSubheadingOne"] &&
              phaseOneC["modalItemThreeSubheadingOne"]
            }
            itemThreeModalSubheadingTwo={
              phaseOneC["modalItemThreeSubheadingTwo"] &&
              phaseOneC["modalItemThreeSubheadingTwo"]
            }
            itemThreeModalTitle={
              phaseOneC["modalItemThreeEyebrow"] &&
              phaseOneC["modalItemThreeEyebrow"]
            }
          />
        )}

        {BeyondLightUpdateDataStore.phaseActive("phaseOneA") &&
          phaseOneA["videoCarouselVideoIdPhaseA"] && (
            <VideoCarousel
              isMedium={medium}
              backgroundCandy={
                phaseOneA["videoCarouselBackgroundCandyPhaseA"] &&
                phaseOneA["videoCarouselBackgroundCandyPhaseA"]
              }
              backgroundImage={
                phaseOneA["videoCarouselBackgroundPhaseA"] &&
                phaseOneA["videoCarouselBackgroundPhaseA"]
              }
              border
              startingIndex={1}
              carouselData={[
                {
                  description:
                    phaseOneA["videoCarouselSubheadingPhaseA"] &&
                    phaseOneA["videoCarouselSubheadingPhaseA"],
                  title:
                    phaseOneA["videoCarouselTitlePhaseA"] &&
                    phaseOneA["videoCarouselTitlePhaseA"],
                  poster:
                    phaseOneA["videoCarouselPosterPhaseA"] &&
                    phaseOneA["videoCarouselPosterPhaseA"],
                  eyebrow:
                    phaseOneA["videoCarouselEyebrowPhaseA"] &&
                    phaseOneA["videoCarouselEyebrowPhaseA"],
                  videoId:
                    phaseOneA["videoCarouselVideoIdPhaseA"] &&
                    phaseOneA["videoCarouselVideoIdPhaseA"],
                },
                {
                  description:
                    phaseOneB["videoCarouselPhaseBSubheading"] &&
                    phaseOneB["videoCarouselPhaseBSubheading"],
                  title:
                    phaseOneB["videoCarouselPhaseBEyebrow"] &&
                    phaseOneB["videoCarouselPhaseBEyebrow"],
                  poster:
                    phaseOneB["videoCarouselPhaseBPoster"] &&
                    phaseOneB["videoCarouselPhaseBPoster"],
                  eyebrow:
                    phaseOneB["videoCarouselPhaseBTitle"] &&
                    phaseOneB["videoCarouselPhaseBTitle"],
                  videoId:
                    phaseOneB["videoCarouselPhaseBYouTubeTrailer"] &&
                    phaseOneB["videoCarouselPhaseBYouTubeTrailer"],
                },
                {
                  description:
                    phaseOneC["videoCarouselPhaseCSubheading"] &&
                    phaseOneC["videoCarouselPhaseCSubheading"],
                  title:
                    phaseOneC["videoCarouselPhaseCEyebrow"] &&
                    phaseOneC["videoCarouselPhaseCEyebrow"],
                  poster:
                    phaseOneC["videoCarouselPhaseCPoster"] &&
                    phaseOneC["videoCarouselPhaseCPoster"],
                  eyebrow:
                    phaseOneC["videoCarouselPhaseCTitle"] &&
                    phaseOneC["videoCarouselPhaseCTitle"],
                  videoId:
                    phaseOneC["videoCarouselPhaseCYoutubeTrailer"] &&
                    phaseOneC["videoCarouselPhaseCYoutubeTrailer"],
                },
              ]}
            />
          )}

        <div id={"editions"} className={styles.preorder}>
          {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
          <BeyondLightProducts globalState={this.props.globalState} />
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

export default withGlobalState(PhaseOne, ["responsive"]);
