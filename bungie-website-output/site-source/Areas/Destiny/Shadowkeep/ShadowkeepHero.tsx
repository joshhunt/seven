// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import React, { LegacyRef, useState } from "react";
import styles from "./ShadowkeepHero.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";

export interface HeroProps {
  data: any;
  inputRef: LegacyRef<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ data, inputRef }) => {
  const { background, logo, btn_title } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  let heroBg = mobile ? background?.mobile : background?.desktop?.url;

  if (heroBg) {
    heroBg = `url(${heroBg})`;
  }

  return (
    <div className={styles.hero} ref={inputRef}>
      <div className={styles.heroBg} style={{ backgroundImage: heroBg }} />
      <div className={styles.contentWrapper}>
        <img className={styles.logo} src={logo?.url} />
        <Button
          url={RouteHelper.DestinyBuyDetail({ productFamilyTag: "Shadowkeep" })}
          children={btn_title}
          buttonType={"gold"}
          className={styles.heroBtn}
        />
      </div>
    </div>
  );
};

export default Hero;
