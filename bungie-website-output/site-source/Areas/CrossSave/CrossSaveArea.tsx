import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import * as React from "react";
import { RouteComponentProps, Route } from "react-router-dom";
import { RouteDefs } from "@Routes/RouteDefs";
import { CrossSaveIndex } from "./CrossSaveIndex";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import CrossSaveActivate from "./CrossSaveActivate";
import { Localizer } from "@Global/Localizer";

import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
  CrossSaveFlowStateContext,
} from "./Shared/CrossSaveFlowStateDataStore";
import { DataStore } from "@Global/DataStore";
import {
  withGlobalState,
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { CrossSaveConfirmation } from "./CrossSaveConfirmation";
import CrossSaveDeactivate from "./CrossSaveDeactivate";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import styles from "./CrossSaveArea.module.scss";
import CrossSaveRecap from "./CrossSaveRecap";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";

import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { CrossSaveIndexDefinitions } from "./CrossSaveIndexDefinitions";
import { UserUtils } from "@Utilities/UserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface ICrossSaveAreaParams {}

interface ICrossSaveAreaState {
  error: PlatformError;
  crossSaveFlowState: ICrossSaveFlowState;
}

interface ICrossSaveAreaProps
  extends RouteComponentProps<ICrossSaveAreaParams>,
    GlobalStateComponentProps<"loggedInUser"> {}

/**
 * The Cross-Save Area
 *  *
 * @param {ICrossSaveAreaProps} props
 * @returns
 */
class CrossSaveArea extends React.Component<
  ICrossSaveAreaProps,
  ICrossSaveAreaState
> {
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICrossSaveAreaProps) {
    super(props);

    this.state = {
      error: null,
      crossSaveFlowState: CrossSaveFlowStateDataStore.state,
    };
  }

  public componentDidMount() {
    this.subs.push(
      CrossSaveFlowStateDataStore.observe((crossSaveFlowState) =>
        this.setState({
          crossSaveFlowState,
        })
      )
    );
  }

  public onGlobalStateUpdated() {
    this.loadUserData();
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  private loadUserData(forceReload = false) {
    const crossSaveEnabled = ConfigUtils.SystemStatus("CrossSave");

    /**
     * If the user isn't logged in, we'll reset the state of everything.
     * That way, if one user logs out and another logs in, they aren't
     * going to see anything from the previous user.
     */
    if (!UserUtils.isAuthenticated(GlobalStateDataStore.state)) {
      CrossSaveFlowStateDataStore.reset();
    }

    if (
      crossSaveEnabled &&
      (forceReload || !this.state.crossSaveFlowState.loaded)
    ) {
      CrossSaveFlowStateDataStore.loadUserData()
        .catch(ConvertToPlatformError)
        .then((error: PlatformError) => {
          this.setState({
            error,
          });
        });
    }
  }

  public render() {
    const crossSaveEnabled = ConfigUtils.SystemStatus("CrossSave");

    if (this.state.error) {
      throw this.state.error;
    }

    const routes = [
      <Route
        key={0}
        path={RouteDefs.Areas.CrossSave.getAction("Index").path}
        component={CrossSaveIndex}
      />,
    ];

    if (crossSaveEnabled) {
      routes.unshift(
        <Route
          key={1}
          path={RouteDefs.Areas.CrossSave.getAction("Activate").path}
          component={CrossSaveActivate}
        />,
        <Route
          key={2}
          path={RouteDefs.Areas.CrossSave.getAction("Confirmation").path}
          component={CrossSaveConfirmation}
        />,
        <Route
          key={3}
          path={RouteDefs.Areas.CrossSave.getAction("Deactivate").path}
          component={CrossSaveDeactivate}
        />,
        <Route
          key={4}
          path={RouteDefs.Areas.CrossSave.getAction("Recap").path}
          component={CrossSaveRecap}
        />
      );
    }

    return (
      <CrossSaveFlowStateContext.Provider value={this.state.crossSaveFlowState}>
        <BungieHelmet
          title={Localizer.Crosssave.CrossSaveAreaHeader}
          image={CrossSaveIndexDefinitions.MetaImage}
        >
          <body className={styles.crossSaveArea} />
        </BungieHelmet>
        <div className={styles.contentWrapper}>
          <SwitchWithErrors>{routes}</SwitchWithErrors>
        </div>
        <div className={styles.helpBar}>
          <Anchor url={"/en/Forums/Topics/?tg=Help"}>
            {Localizer.Crosssave.HelpBarHelp}
          </Anchor>
          <span>|</span>
          <Anchor url={RouteHelper.CrossSave()}>
            {Localizer.Crosssave.HelpBarAboutCrossSave}
          </Anchor>
          <span>|</span>
          <Anchor url={RouteHelper.PCMigration()}>
            {Localizer.Crosssave.HelpBarPcMigration}
          </Anchor>
        </div>
      </CrossSaveFlowStateContext.Provider>
    );
  }
}

export default withGlobalState(CrossSaveArea, ["loggedInUser"]);
