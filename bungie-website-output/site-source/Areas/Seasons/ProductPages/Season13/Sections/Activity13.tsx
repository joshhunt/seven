// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/Seasons/ProductPages/Season13/Sections/Activity13.module.scss";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import ClickableVideoOrImgThumb from "@UI/Marketing/ClickableVideoOrImgThumb";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import React, { LegacyRef } from "react";

interface Activity13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Activity13: React.FC<Activity13Props> = (props) => {
  const s13 = Localizer.Season13;
  const imgDir = "/7/ca/destiny/bgs/season13/";
  const responsive = useDataStore(Responsive);

  return (
    <div className={styles.bg} id={"activities"} ref={props.inputRef}>
      <MarketingTitles
        alignment={"center"}
        sectionTitle={s13.activityTitle}
        smallTitle={s13.activitySmallTitle}
      />
      <div className={styles.blurb}>{s13.activityblurb}</div>
      <div className={styles.boxes}>
        <ClickableVideoOrImgThumb
          thumbnailClass={styles.imageThumbnail}
          thumbnailPath={`${imgDir}battlegrounds_screenshot_1_thumbnail.jpg`}
          screenshotPath={`${imgDir}battlegrounds_screenshot_1.jpg`}
          isMedium={responsive.medium}
        />
        <ClickableVideoOrImgThumb
          thumbnailClass={styles.imageThumbnail}
          thumbnailPath={`${imgDir}battlegrounds_screenshot_2_thumbnail.jpg`}
          screenshotPath={`${imgDir}battlegrounds_screenshot_2.jpg`}
          isMedium={responsive.medium}
        />
        <ClickableVideoOrImgThumb
          thumbnailClass={styles.imageThumbnail}
          thumbnailPath={`${imgDir}battlegrounds_screenshot_3_thumbnail.jpg`}
          screenshotPath={`${imgDir}battlegrounds_screenshot_3.jpg`}
          isMedium={responsive.medium}
        />
      </div>
    </div>
  );
};
