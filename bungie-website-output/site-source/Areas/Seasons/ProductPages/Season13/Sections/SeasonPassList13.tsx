// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import styles from "./SeasonPassList.module.scss";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import React from "react";

interface SeasonPassList13Props {}

export const SeasonPassList13: React.FC<SeasonPassList13Props> = (props) => {
  const s13 = Localizer.Season13;
  const imgDir = "/7/ca/destiny/bgs/season13/";

  return (
    <>
      <div className={styles.includedSection}>
        <div className={styles.includedWith}>{s13.included}</div>
        <div className={styles.exoticTitle}>
          {SeasonsDefinitions.seasonOfTheChosen.title}
        </div>
        <div className={styles.rewardsContainer}>
          <div className={styles.rewardsLists}>
            <div className={styles.passRewardsList}>
              <div
                className={styles.cornerIcon}
                style={{ backgroundImage: `url(${imgDir}s13_corner.png)` }}
              />
              <h2 className={styles.rewardsSmallTitle}>
                {Localizer.Seasons.SeasonPassRewardTitle}
              </h2>
              <ul dangerouslySetInnerHTML={sanitizeHTML(s13.passList)} />
            </div>
            <div className={styles.freeRewardsList}>
              <div
                className={styles.cornerIcon}
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/season12/d2_corner.png"
                  )})`,
                }}
              />
              <h2 className={styles.rewardsSmallTitle}>
                {s13.FreeForAllDestiny2Players}
              </h2>
              <ul dangerouslySetInnerHTML={sanitizeHTML(s13.freeList)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
