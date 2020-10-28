// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import {
  BeyondLightPhaseFourDataStore,
  BeyondLightPhaseFourDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseFourDataStore";
import {
  BeyondLightPhaseThreeDataStore,
  BeyondLightPhaseThreeDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseThreeDataStore";
import {
  BeyondLightPhaseTwoDataStore,
  BeyondLightPhaseTwoDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseTwoDataStore";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@Global/DataStore";
import { Spinner } from "@UIKit/Controls/Spinner";
import * as React from "react";
import styles from "./BeyondLightOverhaul.module.scss";
import {
  BeyondLightUpdateDataStore,
  BeyondLightUpdateDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import classNames from "classnames";
import { Localizer } from "@Global/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { BeyondLightProducts } from "./BeyondLightProducts";
import {
  TextBlock,
  ScreenShotBlock,
  Hero,
  VideoBlock,
} from "./Components/index";

// Required props
interface IBeyondLightPropsOverhaul
  extends GlobalStateComponentProps<"responsive"> {
  phaseThreeActive?: boolean;
  phaseTwoActive?: boolean;
  phaseFourActive?: boolean;
}

// Default props - these will have values set in BeyondLight.defaultProps
interface DefaultProps {}

export type BeyondLightOverhaulProps = IBeyondLightPropsOverhaul & DefaultProps;

interface IBeyondLightState {
  transparentMode: boolean;
  BeyondLightUpdateData: BeyondLightUpdateDataStorePayload;
  BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStorePayload;
  BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStorePayload;
  BeyondLightPhaseFourData: BeyondLightPhaseFourDataStorePayload;
  responsive: IResponsiveState;
}

enum blockType {
  "centered",
  "sided",
}

/**
 * BeyondLight - Replace this description
 *  *
 * @param {IBeyondLightProps} props
 * @returns
 */
class BeyondLightOverhaul extends React.Component<
  IBeyondLightPropsOverhaul,
  IBeyondLightState
> {
  constructor(props: BeyondLightOverhaulProps) {
    super(props);

    this.state = {
      transparentMode: true,
      responsive: Responsive.state,
      BeyondLightUpdateData: BeyondLightUpdateDataStore.state,
      BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStore.state,
      BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStore.state,
      BeyondLightPhaseFourData: BeyondLightPhaseFourDataStore.state,
    };
  }

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightUpdateDataStore.observe((BeyondLightUpdateData) =>
        this.setState({ BeyondLightUpdateData })
      ),
      Responsive.observe((responsive) => this.setState({ responsive })),
      BeyondLightPhaseTwoDataStore.observe((BeyondLightPhaseTwoData) =>
        this.setState({ BeyondLightPhaseTwoData })
      ),
      BeyondLightPhaseThreeDataStore.observe((BeyondLightPhaseThreeData) =>
        this.setState({ BeyondLightPhaseThreeData })
      ),
      BeyondLightPhaseFourDataStore.observe((BeyondLightPhaseFourData) =>
        this.setState({ BeyondLightPhaseFourData })
      )
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d());
  }

  public static defaultProps: DefaultProps = {
    phaseThreeActive: false,
    phaseTwoActive: false,
  };

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;
    const instant = <em>{beyondlightLoc.Instant}</em>;
    const preorderBonus = Localizer.FormatReact(
      beyondlightLoc.PreOrderNowToGetInstant,
      { instant: instant }
    );

    const { phaseTwoActive, phaseThreeActive } = this.props;
    const { phaseTwo } = this.state.BeyondLightPhaseTwoData;

    const { phaseThree } = this.state.BeyondLightPhaseThreeData;

    const { phaseFour } = this.state.BeyondLightPhaseFourData;

    const { medium, mobile } = this.state.responsive;

    const { homepage } = this.state.BeyondLightUpdateData;

    if (!this.state.BeyondLightUpdateData.loaded) {
      return <Spinner />;
    }

    if (homepage === null) {
      return null;
    }

    return (
      <React.Fragment>
        <Hero
          posterPath={homepage.heroVideoPosterPath}
          videoLoopPath={homepage.heroVideoLoop}
          mobileBgPath={homepage.heroMobileImage}
          heading={beyondlightLoc.BeyondLight}
          logoPath={`/7/ca/destiny/products/beyondlight/logo_${
            Localizer.CurrentCultureName || "en"
          }.png`}
          videoPlayButtonText={homepage.videoPlayButtonText}
          videoPlayButtonType={"white"}
          youTubeVideoId={
            (!mobile && homepage.releaseTrailer) ||
            phaseFour.heroTrailerButtonVideoId
          }
          buttonOneLink={RouteHelper.BeyondLightPhases("story")}
          buttonOneText={phaseFour?.exploreButton}
          buttonOneType={"white"}
          buttonTwoLink={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "beyondlight",
          })}
          buttonTwoText={beyondlightLoc.PreOrder}
          buttonTwoType={"blue"}
          isMedium={medium}
          isMobile={mobile}
          releaseDateEyebrow={beyondlightLoc.GoBeyondTheLight}
          releaseDate={beyondlightLoc.September222020}
          bgColor={homepage.bgHexHero ?? homepage.bgHexHero}
          overlayImage={homepage.heroOverlayImage}
        />
        <div className={styles.preorderBonusWrapper}>
          <div className={styles.preorderBonus}>
            <div className={styles.preorderBonusContent}>
              <div className={styles.preorderBonusText}>
                <p>{preorderBonus}</p>
                <p>{beyondlightLoc.DigitalDeluxeOwnersAlso}</p>
              </div>
            </div>
          </div>
        </div>

        <section
          className={styles.goBeyond}
          style={{ backgroundColor: "#080f1f" }}
        >
          <div
            className={styles.bgContainer}
            style={{
              backgroundImage: mobile
                ? `url(${"/7/ca/destiny/products/beyondlight/bl_overview_bg_mobile.jpg"})`
                : `url(${homepage.sectionTwoDesktopBackgroundImage})`,
            }}
          >
            <div className={styles.contentWrapper}>
              <TextBlock
                title={homepage.sectionTwoHeading}
                body={homepage.sectionTwoBodyCopy}
                videoProps={homepage.sectionTwoVideoID || null}
              />
              {homepage.sectionTwoVideoID && (
                <VideoBlock
                  videoPath={homepage.sectionTwoVideoID}
                  videoThumbnail={homepage.sectionTwoVideoPathThumb}
                  isMedium={medium}
                />
              )}
            </div>
          </div>
        </section>

        <section
          className={styles.textWithButton}
          style={{ backgroundColor: homepage.bgHex3 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${homepage.sectionThreeMobileImage})`
                : `url(${homepage.sectionThreeDesktopImage})`,
            }}
          >
            <div className={styles.textWrapper}>
              <h2>{homepage.sectionThreeHeading}</h2>
              <span className={styles.shortBorder} />
              <p>{homepage.sectionThreeBodyCopy}</p>
              <Button
                caps
                buttonType={"white"}
                url={homepage.exploreButtonLink}
              >
                {homepage.exploreButtonText}
              </Button>
            </div>
          </div>
        </section>

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: homepage.bgHex3 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${homepage.sectionFourMobileImage})`
                : `url(${homepage.sectionFourDesktopImage})`,
            }}
          >
            <div>
              <h2 className={styles.europaTitle}>
                {beyondlightLoc.europaAwaitsTitle}
              </h2>
              <span className={styles.shortBorder} />
              <p>{beyondlightLoc.europaAwaitsDesc}</p>
            </div>

            {!phaseTwoActive && phaseTwo.exploreButton ? (
              <div className={styles.screenshotWrapper}>
                <ScreenShotBlock
                  screenshotPath={
                    "destiny/products/beyondlight/europa_screenshot_1.jpg"
                  }
                  thumbnailPath={`destiny/products/beyondlight/europa_screenshot_1_thumbnail.jpg`}
                  isMedium={medium}
                />
                <ScreenShotBlock
                  screenshotPath={
                    "destiny/products/beyondlight/europa_screenshot_2.jpg"
                  }
                  thumbnailPath={`destiny/products/beyondlight/europa_screenshot_2_thumbnail.jpg`}
                  isMedium={medium}
                />
                <ScreenShotBlock
                  screenshotPath={
                    "destiny/products/beyondlight/europa_screenshot_3.jpg"
                  }
                  thumbnailPath={`destiny/products/beyondlight/europa_screenshot_3_thumbnail.jpg`}
                  isMedium={medium}
                />
              </div>
            ) : (
              <Button
                caps
                buttonType={"white"}
                url={RouteHelper.BeyondLightPhases("europa")}
              >
                {phaseTwo.exploreButton}
              </Button>
            )}
          </div>
        </section>

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: homepage.bgHex4 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={classNames(styles.contentWrapper, styles.arsenalWrapper)}
            style={{
              backgroundImage: mobile
                ? `url(${homepage.sectionFiveMobileImage})`
                : `url(${homepage.sectionFiveDesktopImage})`,
            }}
          >
            <div>
              <h2 className={styles.arsenalTitle}>
                {homepage.sectionFiveHeading}
              </h2>
              <span className={styles.shortBorder} />
              <p>{homepage.sectionSixBodyCopy}</p>
            </div>

            {!phaseThreeActive && phaseThree.exploreButton ? (
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
            ) : (
              <Button
                caps
                buttonType={"white"}
                url={RouteHelper.BeyondLightPhases("gear")}
              >
                {phaseThree.exploreButton}
              </Button>
            )}
          </div>
        </section>

        <section
          className={styles.textWithScreenShots}
          style={{ backgroundColor: homepage.bgHex5 ?? "rgb(33, 40, 51)" }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              backgroundImage: mobile
                ? `url(${homepage.sectionSixMobileImage})`
                : `url(${homepage.sectionSixDesktopImage})`,
            }}
          >
            <div className={styles.textWrapper}>
              <h2>{homepage.sectionSevenHeading}</h2>
              <span className={styles.shortBorder} />
              <p>{homepage.sectionSevenBody}</p>
            </div>
            {phaseFour.exploreButton && (
              <Button
                caps
                buttonType={"white"}
                url={RouteHelper.BeyondLightPhases("story")}
              >
                {phaseFour.exploreButton}
              </Button>
            )}
          </div>
        </section>
        <section
          className={styles.deepStoneCrypt}
          style={{
            backgroundImage: mobile
              ? null
              : `url(${homepage.sectionSevenDesktopImage})`,
          }}
        >
          <div>
            <h2>{beyondlightLoc.deepStoneCryptTitle}</h2>
            <span className={styles.shortBorder} />
            <p>{beyondlightLoc.deepStoneCryptDesc}</p>
          </div>
        </section>

        <div id={"editions"} className={styles.preorder}>
          {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
          <BeyondLightProducts globalState={this.props.globalState} />
        </div>
      </React.Fragment>
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

export default withGlobalState(BeyondLightOverhaul, ["responsive"]);
