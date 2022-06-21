// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { useCSWebpImages } from "@Utilities/CSUtils";
import React, { useMemo } from "react";
import { BnetStackFreeToPlayProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./ThreeGuardiansGraphic.module.scss";

interface ThreeGuardiansGraphicProps {
  guardians: BnetStackFreeToPlayProductPage["guardians_section"]["guardians"];
}

export const ThreeGuardiansGraphic: React.FC<ThreeGuardiansGraphicProps> = (
  props
) => {
  const { medium } = useDataStore(Responsive);
  const { guardianImagesMobile, guardianImagesDesktop } = useCSWebpImages(
    useMemo(
      () => ({
        guardianImagesDesktop: props.guardians?.map((g) => g?.image?.url),
        guardianImagesMobile: props.guardians?.map((g) => g?.mobile_image?.url),
      }),
      [props.guardians]
    )
  );

  return (
    <div className={styles.flexWrapper}>
      {props.guardians?.map((g, i) => {
        return (
          <div key={i} className={styles.guardianWrapper}>
            <div className={styles.topContent}>
              <img
                src={
                  medium
                    ? guardianImagesMobile?.[i]
                    : guardianImagesDesktop?.[i]
                }
                className={styles.guardian}
              />
              <div className={styles.titleWrapper}>
                <img className={styles.logo} src={g.logo?.url} />
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
