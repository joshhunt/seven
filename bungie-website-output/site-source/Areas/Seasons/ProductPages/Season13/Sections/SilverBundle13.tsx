// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@Global/Localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { LegacyRef } from "react";
import styles from "./SilverBundle13.module.scss";

interface SilverBundle13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const SilverBundle13: React.FC<SilverBundle13Props> = (props) => {
  const JoinTheBattleAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season13Page,
    "JoinTheBattleAnalyticsId",
    ""
  );

  return (
    <div className={styles.buySection} id={"silver"} ref={props.inputRef}>
      <img
        className={styles.goodiesImg}
        src={Img("/destiny/bgs/season13/silver_bundle_goodies.png")}
        alt={Localizer.Season13.SilverBundle}
      />
      <div className={styles.textSection}>
        <h2 className={styles.seasonOfTheHunt}>
          {Localizer.Seasons.SeasonOfTheChosen}
        </h2>
        <h2 className={styles.sectionTitle}>
          {Localizer.Season13.SilverBundle}
        </h2>
        <p className={styles.blurb}>{Localizer.Season13.SilverBlurb}</p>
        <BuyButton
          data-analytics-id={JoinTheBattleAnalyticsId}
          buttonType={"teal"}
          url={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "silverbundle",
          })}
        >
          {Localizer.Season13.JoinTheBattle}
        </BuyButton>
        <p className={styles.disclaimer}>
          {Localizer.Season13.SilverDisclaimOne}
          <br />
          <br />
          {Localizer.Season13.SilverDisclaimTwo}
        </p>
      </div>
    </div>
  );
};
