// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayQuery } from "@Areas/Destiny/FreeToPlay/__generated__/FreeToPlayQuery.graphql";
import {
  FreeToPlayBuyBtn,
  FreeToPlayResponsiveBg,
} from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import React from "react";
import styles from "./FreeHero.module.scss";

interface FreeHeroProps {
  data: FreeToPlayQuery["response"]["free_to_play_product_page"]["hero"];
  PlatformList: React.FC;
}

export const FreeHero: React.FC<FreeHeroProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, PlatformList } = props;
  const { bg, btn_text, logoConnection } = data ?? {};

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: FreeToPlayResponsiveBg(
          bg?.desktopConnection,
          bg?.mobileConnection,
          mobile
        ),
      }}
    >
      <div className={styles.contentWrapper}>
        <img
          className={styles.logo}
          src={imageFromConnection(logoConnection)?.url}
        />
        <FreeToPlayBuyBtn btn_text={btn_text} className={styles.buyBtn} />
        <PlatformList />
      </div>
    </div>
  );
};
