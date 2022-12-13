// Created by a-ahipp, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BnetStackFile } from "../../../../Generated/contentstack-types";
import BuyFlowEditionDropdown from "@Areas/Destiny/Buy/ABTests/Components/BuyFlowEditionDropdown";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import styles from "./BuyFlow2.module.scss";
import { Localizer } from "@bungie/localization";

interface BuyFlowProps {
  data: any;
}

const BuyFlow2 = (props: BuyFlowProps) => {
  const { data } = props;
  const { logo, title, annual_pass, standard, bg, bg_color } = data ?? {};

  const skuConfig = useDataStore(DestinySkuConfigDataStore);
  const responsive = useDataStore(Responsive);

  const getResponsiveBg = useCallback(
    (background: { mobile_bg?: BnetStackFile; desktop_bg?: BnetStackFile }) => {
      const img = responsive.mobile
        ? background?.mobile_bg
        : background?.desktop_bg;

      return img?.url ? `url(${img?.url})` : undefined;
    },
    [responsive]
  );

  const annualStores = annual_pass
    ? DestinySkuUtils.getStoresForProduct(annual_pass?.sku, skuConfig)
    : null;
  const standardStores = standard
    ? DestinySkuUtils.getStoresForProduct(standard?.sku, skuConfig)
    : null;

  return (
    <div
      className={styles.wrap}
      style={{
        backgroundImage: getResponsiveBg(bg),
        backgroundColor: bg_color,
      }}
    >
      <img
        src={logo?.url}
        className={styles.logo}
        loading={"lazy"}
        alt={logo?.title}
      />
      <h1
        className={styles.title}
        dangerouslySetInnerHTML={sanitizeHTML(title)}
      />

      <div className={styles.editions}>
        {annualStores ? (
          <div className={styles.edition}>
            <BuyFlowEditionDropdown
              stores={annualStores}
              placeholder={annual_pass.title}
              skuTag={annual_pass.sku}
              currentOptionClassName={styles.annualOption}
              optionItemClassName={styles.optionItem}
            />
          </div>
        ) : null}
        {standardStores ? (
          <div className={styles.edition}>
            <BuyFlowEditionDropdown
              stores={standardStores}
              placeholder={standard.title}
              skuTag={standard.sku}
              currentOptionClassName={styles.standardOption}
              optionItemClassName={styles.optionItem}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BuyFlow2;
