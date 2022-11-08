import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import CrossSaveActivate from "./CrossSaveActivate";
import styles from "./CrossSaveArea.module.scss";
import { CrossSaveConfirmation } from "./CrossSaveConfirmation";
import CrossSaveDeactivate from "./CrossSaveDeactivate";
import { CrossSaveIndex } from "./CrossSaveIndex";
import { CrossSaveIndexDefinitions } from "./CrossSaveIndexDefinitions";
import CrossSaveRecap from "./CrossSaveRecap";
import { CrossSaveFlowStateDataStore } from "./Shared/CrossSaveFlowStateDataStore";

/**
 * The Cross-Save Area
 *  *
 * @returns
 */
const CrossSaveArea = () => {
  const crossSaveEnabled = ConfigUtils.SystemStatus("CrossSave");
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [error, setError] = useState<PlatformError>(null);

  useEffect(() => {
    loadUserData();
  }, [UserUtils.isAuthenticated(globalState)]);

  useEffect(() => {
    if (error) {
      throw error;
    }

    setError(null);
  }, [error]);

  const loadUserData = (forceReload = false) => {
    /**
     * If the user isn't logged in, we'll reset the state of everything.
     * That way, if one user logs out and another logs in, they aren't
     * going to see anything from the previous user.
     */
    if (!UserUtils.isAuthenticated(globalState)) {
      CrossSaveFlowStateDataStore.actions.reset();
    }

    if (crossSaveEnabled && (forceReload || !flowState.loaded)) {
      CrossSaveFlowStateDataStore.loadUserData()
        .catch(ConvertToPlatformError)
        .catch((err: PlatformError) => {
          setError(err);
        });
    }
  };

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
    <>
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
      </div>
    </>
  );
};

export default CrossSaveArea;
