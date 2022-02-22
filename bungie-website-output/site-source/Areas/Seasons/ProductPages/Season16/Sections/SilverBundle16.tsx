// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./SilverBundle16.module.scss";

interface SilverBundle16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["silver_bundle_section"];
  headerSeasonText: string;
}

export const SilverBundle16: React.FC<SilverBundle16Props> = ({
  data,
  inputRef,
  headerSeasonText,
}) => {
  const { mobile } = useDataStore(Responsive);

  const sectionBg = responsiveBgImageFromStackFile(
    data?.bg.desktop,
    data?.bg.mobile,
    mobile
  );

  return (
    <div
      className={styles.silverBundle}
      style={{ backgroundImage: sectionBg }}
      id={"bundle"}
      ref={inputRef}
    >
      <div className={styles.contentWrapperNormal}>
        <div
          className={classNames(styles.textContent, styles.indentHeadingBox)}
        >
          <SectionHeader
            title={data?.heading}
            seasonText={headerSeasonText}
            sectionName={data?.section_name}
            isBold={true}
          />
          <p
            className={classNames(styles.paragraph, styles.blurb)}
            dangerouslySetInnerHTML={sanitizeHTML(data?.blurb)}
          />
          <BuyButton
            analyticsId={data?.btn_analytics_id}
            buttonType={"teal"}
            url={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "silverbundle",
            })}
            className={styles.buyNowBtn}
          >
            {data?.buy_btn_text}
          </BuyButton>
          <p
            className={styles.disclaimer}
            dangerouslySetInnerHTML={sanitizeHTML(data?.disclaimer)}
          />
        </div>
      </div>
    </div>
  );
};
