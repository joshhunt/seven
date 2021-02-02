// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "./Strikes13.module.scss";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import classNames from "classnames";
import React, { LegacyRef } from "react";

interface Strikes13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Strikes13: React.FC<Strikes13Props> = (props) => {
  const s13 = Localizer.Season13;
  const imgDir = "/7/ca/destiny/bgs/season13/";
  const responsive = useDataStore(Responsive);

  return (
    <div id={"strikes"} ref={props.inputRef} className={styles.strikes}>
      <Grid isTextContainer={true}>
        <GridCol cols={12} className={styles.strikeTitleBlock}>
          <MarketingTitles
            smallTitle={
              <img
                src={`${imgDir}strikes_icon.png`}
                className={styles.strikeIcon}
                alt={""}
                role={"presentation"}
              />
            }
            sectionTitle={s13.vanguardStrikes}
            alignment={responsive.mobile ? "left" : "center"}
          />
          <div className={styles.icon}>
            <div className={styles.tricorn} />
            <div className={styles.subtitle}>{s13.freeForAllPlayers}</div>
          </div>
        </GridCol>
        <GridCol cols={3} mobile={12}>
          <div className={classNames(styles.strikeBlock, styles.strike1)}>
            <img
              className={styles.strikeImage}
              src={`${imgDir}strikes_devils_lair.jpg`}
              role={"presentation"}
              alt=""
            />
            <div className={styles.strikeTitle}>{s13.strikeOneTitle}</div>
            <div className={styles.blurb}>{s13.strikeOneBlurb}</div>
          </div>
        </GridCol>
        <GridCol cols={3} mobile={12}>
          <div className={classNames(styles.strikeBlock, styles.strike2)}>
            <img
              className={styles.strikeImage}
              src={`${imgDir}strikes_fallen_saber.jpg`}
              role={"presentation"}
              alt=""
            />
            <div className={styles.strikeTitle}>{s13.strikeTwoTitle}</div>
            <div className={styles.blurb}>{s13.strikeTwoBlurb}</div>
          </div>
        </GridCol>
        <GridCol cols={3} mobile={12}>
          <div className={classNames(styles.strikeBlock, styles.strike3)}>
            <img
              className={styles.strikeImage}
              src={`${imgDir}strikes_proving_grounds.jpg`}
              role={"presentation"}
              alt=""
            />
            <div className={styles.strikeTitle}>{s13.strikeThreeTitle}</div>
            <div className={styles.blurb}>{s13.strikeThreeBlurb}</div>
          </div>
        </GridCol>
      </Grid>
    </div>
  );
};
