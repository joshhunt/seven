// Created by atseng, 2023
// Copyright Bungie, Inc.

import { BreadcrumbConfiguration } from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { ButtonConfiguration } from "./HeaderButtons";
import styles from "./Layout.module.scss";
import React from "react";
import classNames from "classnames";

export type FireteamFinderErrorViewType =
  | "SignedOut"
  | "NoCharacter"
  | "NotHighEnoughRank";

interface LayoutProps {
  buttonConfig: ButtonConfiguration;
  breadcrumbConfig: BreadcrumbConfiguration;
  title: string;
  subtitle: string;
  className?: string;
  activityFilterString?: string;
  setActivityFilterString?: (value: string) => void;
}

export const Layout = ({
  buttonConfig,
  breadcrumbConfig,
  title,
  subtitle,
  className,
  activityFilterString,
  setActivityFilterString,
  children,
}: PropsWithChildren<LayoutProps>) => {
  const fireteamsLoc = Localizer.Fireteams;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  return (
    <div className={classNames(styles.layout, className)}>
      <BungieHelmet
        title={fireteamsLoc.Fireteams}
        description={fireteamsLoc.Fireteams}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <Grid>
        <GridCol cols={12} className={styles.content}>
          <Header
            setActivityFilterString={setActivityFilterString}
            activityFilterString={activityFilterString}
            breadcrumbConfiguration={breadcrumbConfig}
            buttonConfiguration={buttonConfig}
            title={title}
            subtitle={subtitle}
            isLoggedIn={UserUtils.isAuthenticated(globalState)}
          />
          {children}
        </GridCol>
      </Grid>
    </div>
  );
};
