// Created by atseng, 2023
// Copyright Bungie, Inc.

import {
  BreadcrumbConfiguration,
  FireteamFinderBreadcrumb,
} from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { ButtonConfiguration, HeaderButtons } from "./HeaderButtons";
import styles from "./Header.module.scss";
import React from "react";
import { Localizer } from "@bungie/localization/Localizer";

interface HeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  buttonConfiguration: ButtonConfiguration;
  breadcrumbConfiguration: BreadcrumbConfiguration;
  isLoggedIn?: boolean;
  withBetaTag?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className={styles.header}>
      <FireteamFinderBreadcrumb
        breadcrumbConfig={props.breadcrumbConfiguration}
      />
      <div className={styles.titleWrap}>
        <h3 className={styles.title}>{props.title}</h3>
        {props.withBetaTag && (
          <div className={styles.beta}>{Localizer.fireteams.beta}</div>
        )}
      </div>
      <div id={"headerSecondLine"} className={styles.secondLine}>
        <div className={styles.subtitle}>{props.subtitle}</div>
        <div className={styles.buttons}>
          <HeaderButtons
            buttonConfig={props.buttonConfiguration}
            isLoggedIn={props?.isLoggedIn}
          />
        </div>
      </div>
    </div>
  );
};
