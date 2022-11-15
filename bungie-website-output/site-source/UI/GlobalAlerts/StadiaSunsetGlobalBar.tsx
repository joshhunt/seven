// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "@UI/GlobalAlerts/StadiaSunsetGlobalBar.module.scss";
import { GlobalBar } from "@UI/GlobalAlerts/GlobalBar";
import React from "react";

export const StadiaSunsetGlobalBar: React.FC = (props) => {
  return (
    <GlobalBar
      initiallyVisible={true}
      barClassNames={styles.stadiaSunset}
      url={RouteHelper.HelpArticle(10347044092564)}
      message={Localizer.Nav.StadiaSunsetBanner}
      dismissible={false}
      localStorageKey={null}
    />
  );
};
