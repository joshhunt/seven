// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "@UI/GlobalAlerts/StadiaSunsetGlobalBar.module.scss";
import { GlobalBar } from "@UI/GlobalAlerts/GlobalBar";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";

export const stadiaLocalStorageKey = "show-stadia-alert";

export const StadiaSunsetGlobalBar: React.FC = (props) => {
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  // the specific global alert bar should not control its visibility status, but it should define the requirements for it to show initially and
  // then defer to localStorage which is updated by GlobalBar itself
  // previously, once the localStorage value was set to not show, we never updated it again. Now it will update to show again if someone changes their email
  const isVisibleInitially = () => {
    if (!!window.localStorage?.getItem(stadiaLocalStorageKey)) {
      return window.localStorage.getItem(stadiaLocalStorageKey) === "true";
    } else {
      window.localStorage.setItem(
        stadiaLocalStorageKey,
        ConfigUtils.SystemStatus(SystemNames.StadiaSunsetAlerts).toString()
      );

      return ConfigUtils.SystemStatus(SystemNames.StadiaSunsetAlerts);
    }
  };

  if (!loggedInUser || !loggedInUser?.user?.stadiaDisplayName) {
    return null;
  }

  return (
    <GlobalBar
      initiallyVisible={isVisibleInitially()}
      barClassNames={styles.stadiaSunset}
      url={RouteHelper.HelpArticle(10347044092564)}
      message={Localizer.Nav.StadiaSunsetBanner}
      dismissible={true}
      localStorageKey={stadiaLocalStorageKey}
    />
  );
};
