// Created by atseng, 2020
// Copyright Bungie, Inc.

import BeyondLightMedia from "@Areas/Destiny/BeyondLight/BeyondLightMedia";
import BeyondLightPhaseFour from "@Areas/Destiny/BeyondLight/BeyondLightPhaseFour";
import { BeyondLightPhaseFourDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseFourDataStore";
import { BeyondLightUpdateDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { BeyondLightPhaseTwoDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseTwoDataStore";
import { BeyondLightPhaseThreeDataStore } from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseThreeDataStore";
import PhaseOne from "@Areas/Destiny/BeyondLight/PhaseOne";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import PhaseTwo from "./BeyondLightPhaseTwo";
import PhaseThree from "@Areas/Destiny/BeyondLight/PhaseThree";
import { RouteDefs } from "@Routes/RouteDefs";
import * as React from "react";
import { Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { GlobalStateComponentProps } from "@Global/DataStore/GlobalStateDataStore";
import BeyondLightOverhaul from "./BeyondLightOverhaul";
import BeyondLightOriginal from "./BeyondLightOriginal";
import styles from "./BeyondLight.module.scss";

// Required props
interface IBeyondLightProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"responsive"> {}

// Default props - these will have values set in BeyondLight.defaultProps
interface DefaultProps {}

export type BeyondLightProps = IBeyondLightProps & DefaultProps;

interface IBeyondLightState {
  transparentMode: boolean;
  phaseOneActive: boolean;
  phaseTwoActive: boolean;
  phaseThreeActive: boolean;
  phaseFourActive: boolean;
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
class BeyondLight extends React.Component<BeyondLightProps, IBeyondLightState> {
  constructor(props: BeyondLightProps) {
    super(props);

    this.state = {
      phaseOneActive: BeyondLightUpdateDataStore.state.phaseOneActive,
      phaseTwoActive: BeyondLightPhaseTwoDataStore.state.phaseTwoActive,
      phaseThreeActive: BeyondLightPhaseThreeDataStore.state.phaseThreeActive,
      phaseFourActive: BeyondLightPhaseFourDataStore.state.phaseFourActive,
      transparentMode: true,
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    BeyondLightUpdateDataStore.initialize();
    BeyondLightUpdateDataStore.observe((d) =>
      this.setState({
        phaseOneActive: d.phaseOneActive,
      })
    );

    BeyondLightPhaseTwoDataStore.initialize();
    BeyondLightPhaseTwoDataStore.observe((d) =>
      this.setState({
        phaseTwoActive: d.phaseTwoActive,
      })
    );

    BeyondLightPhaseThreeDataStore.initialize();
    BeyondLightPhaseThreeDataStore.observe((d) =>
      this.setState({
        phaseThreeActive: d.phaseThreeActive,
      })
    );

    ConfigUtils.SystemStatus("BeyondLightPhase4") &&
      BeyondLightPhaseFourDataStore.initialize();
    ConfigUtils.SystemStatus("BeyondLightPhase4") &&
      BeyondLightPhaseFourDataStore.observe((d) =>
        this.setState({
          phaseThreeActive: d.phaseFourActive,
        })
      );
  }

  public render() {
    const beyondLightPhase1 = RouteDefs.Areas.Destiny.getAction("PhaseOne")
      .path;
    const beyondLightPhase2 = RouteDefs.Areas.Destiny.getAction("PhaseTwo")
      .path;
    const beyondLightPhase3 = RouteDefs.Areas.Destiny.getAction("PhaseThree")
      .path;
    const beyondLightPhase4 =
      ConfigUtils.SystemStatus("BeyondLightPhase4") &&
      RouteDefs.Areas.Destiny.getAction("BeyondLightPhaseFour").path;
    const beyondLightPath = RouteDefs.Areas.Destiny.getAction("BeyondLight")
      .path;
    const beyondLightMediaPath = RouteDefs.Areas.Destiny.getAction("Media")
      .path;
    const phaseOneActive = this.state.phaseOneActive;
    const phaseTwoActive = this.state.phaseTwoActive;
    const phaseThreeActive = this.state.phaseThreeActive;
    const phaseFourActive = this.state.phaseFourActive;

    return (
      <div className={styles.destinyFont}>
        <Switch>
          <Route path={beyondLightPath} exact>
            {phaseOneActive ? (
              <BeyondLightOverhaul
                phaseTwoActive={phaseTwoActive}
                phaseThreeActive={phaseThreeActive}
                phaseFourActive={phaseFourActive}
              />
            ) : (
              <BeyondLightOriginal />
            )}
          </Route>
          <Route path={beyondLightMediaPath} component={BeyondLightMedia} />
          <Route path={beyondLightPhase1} component={PhaseOne} />
          {phaseTwoActive && (
            <Route path={beyondLightPhase2} component={PhaseTwo} />
          )}
          {phaseThreeActive && (
            <Route path={beyondLightPhase3} component={PhaseThree} />
          )}
          {phaseFourActive && (
            <Route path={beyondLightPhase4} component={BeyondLightPhaseFour} />
          )}
        </Switch>
      </div>
    );
  }
}

export default BeyondLight;
