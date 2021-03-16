// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { BeyondLightWinBack } from "@Areas/Destiny/BeyondLight/BeyondLightWinBack";
import { NextGenModule } from "@Areas/Destiny/BeyondLight/Components/NextGen/NextGenModule";
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
import {
  BeyondLightUpdateDataStore,
  BeyondLightUpdateDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Spinner } from "@UIKit/Controls/Spinner";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./BeyondLightOverhaul.module.scss";
import { BeyondLightProducts } from "./BeyondLightProducts";
import {
  Hero,
  ScreenShotBlock,
  TextBlock,
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
      <div className={styles.overhaulContainer}>
        <Hero
          posterPath={
            "/7/ca/destiny/products/beyondlight/01_HERO_desktop_bg.jpg"
          }
          videoLoopPath={""}
          mobileBgPath={
            "/7/ca/destiny/products/beyondlight/01_hero_mobile_bg.jpg"
          }
          heading={beyondlightLoc.BeyondLight}
          logoPath={`/7/ca/destiny/products/beyondlight/logo_${
            Localizer.CurrentCultureName || "en"
          }.png`}
          videoPlayButtonText={homepage.videoPlayButtonText}
          videoPlayButtonType={"white"}
          youTubeVideoId={phaseFour.heroTrailerButtonVideoId}
          buttonTwoLink={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "beyondlight",
          })}
          buttonTwoText={beyondlightLoc.PreOrder}
          buttonTwoType={"blue"}
          isMedium={medium}
          isMobile={mobile}
          releaseDateEyebrow={beyondlightLoc.AvailableNow}
          releaseDate={""}
          bgColor={homepage.bgHexHero ?? homepage.bgHexHero}
          overlayImage={""}
        />
        <BeyondLightWinBack trailerId={phaseFour.launchTrailerVideoId} />

        <NextGenModule />
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

  private scrollToNextGen() {
    const el = document.getElementById("nextGen");
    const top = el.getBoundingClientRect().top + window.scrollY;

    BrowserUtils.animatedScrollTo(top, 1000);
  }
}

export default withGlobalState(BeyondLightOverhaul, ["responsive"]);
