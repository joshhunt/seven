// Created by larobinson, 2021
// Copyright Bungie, Inc.

import React from "react";
import styles from "./Helm13.module.scss";
import { Localizer } from "@Global/Localization/Localizer";

interface Helm13Props {}

export const Helm13: React.FC<Helm13Props> = (props) => {
  const s13 = Localizer.Season13;

  return (
    <div className={styles.bg}>
      <div className={styles.innerContainer}>
        <div className={styles.content}>
          <div className={styles.smallTitle}>{s13.HelmSmallTitle}</div>
          <div className={styles.title}>{s13.HelmTitle}</div>
          <div className={styles.blurb}>{s13.HelmBlurb}</div>
        </div>
      </div>
    </div>
  );
};
