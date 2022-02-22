// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { DestinyShadowkeepQueryResponse } from "@Areas/Destiny/__generated__/DestinyShadowkeepQuery.graphql";
import { Responsive } from "@Boot/Responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import React, { LegacyRef, useState } from "react";
import styles from "./ShadowkeepHero.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";

export interface HeroProps {
  data: DestinyShadowkeepQueryResponse["shadowkeep_product_page"]["hero"];
  inputRef: LegacyRef<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ data, inputRef }) => {
  const { background, logoConnection, btn_title } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  let heroBg = imageFromConnection(
    mobile ? background?.mobileConnection : background?.desktopConnection
  )?.url;

  if (heroBg) {
    heroBg = `url(${heroBg})`;
  }

  return (
    <div className={styles.hero} ref={inputRef}>
      <div className={styles.heroBg} style={{ backgroundImage: heroBg }} />
      <div className={styles.contentWrapper}>
        <img
          className={styles.logo}
          src={imageFromConnection(logoConnection)?.url}
        />
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
