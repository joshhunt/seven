// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {
  FreePlatformList,
  FreeToPlayBuyBtn,
} from "@Areas/Destiny/DestinyNewLight";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import React from "react";
import {
  BnetStackFile,
  BnetStackNewLightProductPage,
} from "../../Generated/contentstack-types";
import styles from "./DestinyNewLightHero.module.scss";

interface DestinyNewLightHeroProps {
  data?: BnetStackNewLightProductPage["hero"];
  platformIcons?: BnetStackFile[];
}

export const DestinyNewLightHero: React.FC<DestinyNewLightHeroProps> = (
  props
) => {
  const { mobile } = useDataStore(Responsive);

  const { bg, btn_text, logo, subtitle } = props.data ?? {};

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          bg?.desktop,
          bg?.mobile,
          mobile
        ),
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <br />
        <div className={styles.subtitle}>{subtitle}</div>
        <img src={logo?.url} className={styles.logo} />
        <br />
        <FreeToPlayBuyBtn btn_text={btn_text} />
        <br />
        <FreePlatformList
          platforms={props.platformIcons}
          className={styles.platforms}
        />
      </div>
    </div>
  );
};
