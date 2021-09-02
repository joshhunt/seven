// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  IDestinyProductDefinition,
  IDestinyProductFamilyDefinition,
} from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { Button } from "@UIKit/Controls/Button/Button";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./AnnivEditionSelector.module.scss";

enum WQEditions {
  witchqueendeluxeanniversary,
  anniversarypack,
}

interface WQEditionSelectorProps {
  sectionTitle: string;
  annivPackTabTitle: string;
  deluxePackTabTitle: string;
  bgImage: string;
}

const WQEditionSelector: React.FC<WQEditionSelectorProps> = (props) => {
  const [selectedEdition, setSelectedEdition] = useState(
    EnumUtils.getStringValue(WQEditions.witchqueendeluxeanniversary, WQEditions)
  );
  const [skuConfig, setSkuConfig] = useState(DestinySkuConfigDataStore.state);
  const [skuItems, setSkuItems] = useState(null);
  const [
    annivProductFamily,
    setAnnivProductFamily,
  ] = useState<null | IDestinyProductFamilyDefinition>();

  useEffect(() => {
    loadAnniversaryProductFamilyContent();
    loadEditionSkuInfo();
  }, []);

  const loadEditionSkuInfo = () => {
    Platform.ContentService.GetContentByTagAndType(
      "destiny-sku-group-set",
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    ).then((contentSet) => {
      const allItems: Content.ContentItemPublicContract[] =
        contentSet.properties["ContentItems"];
      if (allItems) {
        const skuItemsArr: IDestinyProductDefinition[] = allItems
          .filter((a) => a.cType === "DestinySkuItem")
          .map((contentItem) =>
            DestinySkuUtils.skuDefinitionFromContent(contentItem)
          );

        setSkuItems(skuItemsArr);
      }
    });
  };

  const loadAnniversaryProductFamilyContent = () => {
    Platform.ContentService.GetContentByTagAndType(
      "product-family-anniversary",
      "DestinyProductFamily",
      Localizer.CurrentCultureName,
      false
    ).then((productFamily) => {
      const witchQueenProductFamily = DestinySkuUtils.productFamilyDefinitionFromContent(
        productFamily
      );

      if (witchQueenProductFamily) {
        setAnnivProductFamily(witchQueenProductFamily);
      }
    });
  };

  if (
    !skuItems ||
    (!WQEditions[selectedEdition] && WQEditions[selectedEdition] !== 0) ||
    typeof selectedEdition !== "string"
  ) {
    return null;
  }

  const wqComparisonSkus = skuItems?.filter((value: any) =>
    annivProductFamily?.comparisonSection?.find(
      (v) => value.skuTag === v.SkuTag
    )
  );

  const tabs = [
    {
      title: props.deluxePackTabTitle,
      edition: WQEditions.witchqueendeluxeanniversary,
    },
    { title: props.annivPackTabTitle, edition: WQEditions.anniversarypack },
  ];

  const editionsBgImage = props.bgImage ? `url(${props.bgImage})` : undefined;

  return (
    <section
      className={styles.editionSelector}
      style={{ backgroundImage: editionsBgImage }}
    >
      <h3 className={styles.sectionTitle}>{props.sectionTitle}</h3>
      <div className={styles.tabsWrapper}>
        {tabs.map(({ title, edition }, i) => {
          const editionAsString = EnumUtils.getStringValue(edition, WQEditions);

          return (
            <Button
              className={classNames(styles.tab, {
                [styles.selected]: editionAsString === selectedEdition,
              })}
              key={i}
              onClick={() => setSelectedEdition(editionAsString)}
            >
              {title}
            </Button>
          );
        })}
      </div>
      <div className={styles.comparisonWrapper}>
        {wqComparisonSkus?.map((value: any, i: number) => (
          <WQEditionDisplay
            key={i}
            productDef={value}
            selectedEdition={selectedEdition}
          />
        ))}
      </div>
    </section>
  );
};

interface IWQEditionDisplay {
  selectedEdition: "anniversarypack" | "witchqueendeluxeanniversary";
  productDef: IDestinyProductDefinition;
}

const WQEditionDisplay: React.FC<IWQEditionDisplay> = (props) => {
  const responsive = useDataStore(Responsive);

  const {
    title,
    subtitle,
    edition,
    imagePath,
    bigblurb,
    skuTag,
    buttonLabel,
  } = props.productDef;

  const productFamilyTag =
    props.selectedEdition === "anniversarypack" ? "anniversary" : "witchqueen";

  const buyFlowRoute = RouteHelper.DestinyBuyDetail(
    { productFamilyTag },
    { productSku: responsive.medium ? skuTag : props.selectedEdition }
  );

  const isSelected = props.selectedEdition === skuTag;
  const editionImage = imagePath ? `url(${imagePath})` : undefined;

  return (
    <div
      className={classNames(styles.editionDisplay, {
        [styles.selected]: isSelected,
      })}
    >
      <div className={styles.imgWrapper}>
        <div
          className={styles.editionImg}
          style={{ backgroundImage: editionImage }}
        >
          <div className={styles.aspectRatioBox} />
        </div>
      </div>
      <div className={styles.textWrapper}>
        <h5>
          {title}: {subtitle}
        </h5>
        <p className={styles.editionTitle}>{edition}</p>
        <Button
          url={buyFlowRoute}
          className={styles.buyFlowBtn}
          buttonType={"blue"}
        >
          {buttonLabel}
        </Button>
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={{ __html: bigblurb }}
        />
      </div>
    </div>
  );
};

export default WQEditionSelector;
