// Created by jlauer, 2019
// Copyright Bungie, Inc.

import styles from "./FullPageLoadingBar.module.scss";
import classNames from "classnames";
import { AppLoadingDataStore } from "@Global/DataStore/AppLoadingDataStore";
import { useDataStore } from "@Utilities/ReactUtils";
import React, { useEffect } from "react";

/**
 * FullPageLoadingBar - Replace this description
 *  *
 * @param {IFullPageLoadingBarProps} props
 * @returns
 */
export const FullPageLoadingBar = () => {
  const [loaded, setLoaded] = React.useState(false);

  const appLoadingData = useDataStore(AppLoadingDataStore);

  useEffect(() => setLoaded(!appLoadingData.loading), [appLoadingData.loading]);

  const classes = classNames(styles.loadingBar, {
    [styles.loading]: !loaded && appLoadingData.loading,
    [styles.loaded]: loaded,
  });

  return <div className={classes} />;
};
