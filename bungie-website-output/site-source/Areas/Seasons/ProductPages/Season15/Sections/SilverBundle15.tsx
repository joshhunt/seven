// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./SilverBundle15.module.scss";

interface ISilverBundleSC {
  SectionHeading?: string;
  SectionBlurb?: string;
  SectionDisclaimer?: string;
  SectionBtnText?: string;
}

interface SilverBundle15Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const SilverBundle15: React.FC<SilverBundle15Props> = (props) => {
  const s15 = Localizer.Season15;

  const buyBtnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    "Season15SilverBundleAnalyticsId",
    ""
  );

  return (
    <div className={styles.silverBundle} id={"silver"} ref={props.inputRef}>
      <div className={styles.contentWrapperNormal}>
        <div
          className={classNames(styles.textContent, styles.indentHeadingBox)}
        >
          <SectionHeader
            title={s15.SilverBundleHeading}
            seasonText={s15.SectionHeaderSeasonText}
            sectionName={s15.SilverBundleSectionName}
            isBold={true}
          />
          <p
            className={classNames(styles.paragraph, styles.blurb)}
            dangerouslySetInnerHTML={sanitizeHTML(s15.SilverBundleBlurb)}
          />
          <BuyButton
            analyticsId={buyBtnAnalyticsId}
            buttonType={"teal"}
            url={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "silverbundle",
            })}
            className={styles.buyNowBtn}
          >
            {s15.SilverBundleBtnText}
          </BuyButton>
          <p className={styles.disclaimer}>{s15.SilverBundleDisclaimerOne}</p>
          <p className={styles.disclaimer}>{s15.SilverBundleDisclaimerTwo}</p>
        </div>
      </div>
    </div>
  );
};
