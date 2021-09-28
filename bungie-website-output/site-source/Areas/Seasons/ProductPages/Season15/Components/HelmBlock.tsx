// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import React from "react";
import styles from "./HelmBlock.module.scss";

interface HelmBlockProps {}

const HelmBlock: React.FC<HelmBlockProps> = (props) => {
  const s15 = Localizer.Season15;

  const screenshots = [
    "/7/ca/destiny/bgs/season15/s15_helm_screenshot_1.jpg",
    "/7/ca/destiny/bgs/season15/s15_helm_screenshot_2.jpg",
  ];

  return (
    <div className={styles.helmBlock}>
      <div className={styles.helmContent}>
        <div className={styles.textContent}>
          <h3>{s15.HelmHeading}</h3>
          <p className={styles.paragraph}>{s15.HelmBlurb}</p>
        </div>
        <div className={styles.screenshots}>
          <ClickableMediaThumbnail
            thumbnail={"/7/ca/destiny/bgs/season15/s15_helm_thumbnail_1.jpg"}
            singleOrAllScreenshots={screenshots}
            screenshotIndex={0}
            classes={{ btnWrapper: styles.screenshot }}
          />
          <ClickableMediaThumbnail
            thumbnail={"/7/ca/destiny/bgs/season15/s15_helm_thumbnail_2.jpg"}
            singleOrAllScreenshots={screenshots}
            screenshotIndex={1}
            classes={{ btnWrapper: styles.screenshot }}
          />
        </div>
      </div>
    </div>
  );
};

export default HelmBlock;
