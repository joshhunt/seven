// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayQueryResponse } from "@Areas/Destiny/FreeToPlay/__generated__/FreeToPlayQuery.graphql";
import { FreeToPlayResponsiveBg } from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import React from "react";
import styles from "./ThreeGuardiansGraphic.module.scss";

interface ThreeGuardiansGraphicProps {
  guardians: FreeToPlayQueryResponse["free_to_play_product_page"]["guardians_section"]["guardians"];
}

export const ThreeGuardiansGraphic: React.FC<ThreeGuardiansGraphicProps> = (
  props
) => {
  const { medium } = useDataStore(Responsive);

  return (
    <div className={styles.flexWrapper}>
      {props.guardians?.map((g, i) => {
        return (
          <div key={i} className={styles.guardianWrapper}>
            <div className={styles.topContent}>
              <img
                src={
                  imageFromConnection(
                    medium ? g.mobile_imageConnection : g.imageConnection
                  )?.url
                }
                className={styles.guardian}
              />
              <div className={styles.titleWrapper}>
                <img
                  className={styles.logo}
                  src={imageFromConnection(g.logoConnection)?.url}
                />
                <p className={styles.title}>{g.title}</p>
              </div>
            </div>
            <div className={styles.lowerContent}>{g.blurb}</div>
          </div>
        );
      })}
    </div>
  );
};
