// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "./BungieRewards13.module.scss";
import { Localizer } from "@bungie/localization";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import React from "react";

interface BungieRewards13Props {}

export const BungieRewards13: React.FC<BungieRewards13Props> = (props) => {
  const s13 = Localizer.Season13;

  return (
    <div className={styles.rewardsSection}>
      <div className={styles.bungieRewards}>
        <div className={styles.rewardsText}>
          <MarketingTitles
            smallTitle={<div className={styles.bungieRewardsLogo} />}
            sectionTitle={s13.BungieRewards}
            alignment={"left"}
          />
          <p className={styles.blurb}>
            {s13.BRewardsBlurb} {s13.BRewardsLink}
          </p>
        </div>
        <div className={styles.bungieRewardsImage} />
      </div>
    </div>
  );
};
