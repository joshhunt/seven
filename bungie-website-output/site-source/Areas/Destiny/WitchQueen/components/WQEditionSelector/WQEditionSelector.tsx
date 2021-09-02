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
import styles from "./WQEditionSelector.module.scss";

enum WQEditions {
  witchqueendeluxe,
  witchqueendeluxeanniversary,
  witchqueenstandard,
}

interface WQEditionSelectorProps {
  editionsRef: LegacyRef<HTMLDivElement>;
  sectionTitle: string;
  annivPackTabTitle: string;
  deluxeTabTitle: string;
  standardTabTitle: string;
  bgImage: string;
  ceBgImage: string;
}

const WQEditionSelector: React.FC<WQEditionSelectorProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const [selectedEdition, setSelectedEdition] = useState(
    EnumUtils.getStringValue(WQEditions.witchqueendeluxeanniversary, WQEditions)
  );
  const [skuItems, setSkuItems] = useState(null);
  const [
    collectorsSku,
    setCollectorsSku,
  ] = useState<IDestinyProductDefinition | null>(null);
  const [
    wqProductFamily,
    setWQProductFamily,
  ] = useState<null | IDestinyProductFamilyDefinition>();

  useEffect(() => {
    loadWitchQueenProductFamilyContent();
    loadEditionSkuInfo();
  }, []);

  const loadEditionSkuInfo = () => {
    Platform.ContentService.GetContentByTagAndType(
      "destiny-sku-group-set",
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    ).then((contentSet) => {
      const title = contentSet.properties["Title"];
      const allItems: Content.ContentItemPublicContract[] =
        contentSet.properties["ContentItems"];
      if (allItems) {
        const skuItemsArr: IDestinyProductDefinition[] = allItems
          .filter((a) => a.cType === "DestinySkuItem")
          .map((contentItem) =>
            DestinySkuUtils.skuDefinitionFromContent(contentItem)
          );

        setSkuItems(skuItemsArr);

        const collectorsSkuInfo = skuItemsArr.find(
          (sku) => sku.skuTag === "witchqueencollectors"
        );
        setCollectorsSku(collectorsSkuInfo);
      }
    });
  };

  const loadWitchQueenProductFamilyContent = () => {
    Platform.ContentService.GetContentByTagAndType(
      "product-family-witchqueen",
      "DestinyProductFamily",
      Localizer.CurrentCultureName,
      false
    ).then((productFamily) => {
      const witchQueenProductFamily = DestinySkuUtils.productFamilyDefinitionFromContent(
        productFamily
      );

      if (witchQueenProductFamily) {
        setWQProductFamily(witchQueenProductFamily);
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
    wqProductFamily?.comparisonSection?.find((v) => value.skuTag === v.SkuTag)
  );

  const tabs = [
    {
      title: props.annivPackTabTitle,
      edition: WQEditions.witchqueendeluxeanniversary,
    },
    { title: props.deluxeTabTitle, edition: WQEditions.witchqueendeluxe },
    { title: props.standardTabTitle, edition: WQEditions.witchqueenstandard },
  ];

  const editionsBgImage = props.bgImage ? `url(${props.bgImage})` : undefined;
  const ceBgImage =
    !responsive.mobile &&
    (props.ceBgImage ? `url(${props.ceBgImage})` : undefined);
  const ceEditionImage = collectorsSku?.imagePath
    ? `url(${collectorsSku?.imagePath})`
    : undefined;

  return (
    <section className={styles.editionSelector}>
      <div className={styles.editionsAnchor} ref={props.editionsRef} />
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
      <div
        className={styles.comparisonWrapper}
        style={{ backgroundImage: editionsBgImage }}
      >
        {wqComparisonSkus?.map((value: any, i: number) => (
          <WQEditionDisplay
            key={i}
            productDef={value}
            selectedEdition={selectedEdition}
          />
        ))}
      </div>

      <div
        className={styles.collectorsEdition}
        style={{ backgroundImage: ceBgImage }}
      >
        <div className={styles.sectionTopBorder} />
        <div className={styles.ceFlexWrapper}>
          <div className={styles.textContent}>
            <h4>{collectorsSku?.edition}</h4>
            <p
              className={styles.blurb}
              dangerouslySetInnerHTML={sanitizeHTML(collectorsSku?.bigblurb)}
            />
            <Button
              url={collectorsSku?.relatedPage}
              disabled={!collectorsSku?.buyButtonDisabled}
              className={styles.ceBtn}
            >
              {collectorsSku?.buttonLabel}
            </Button>
          </div>
          <div
            className={styles.ceImg}
            style={{ backgroundImage: ceEditionImage }}
          >
            <div className={styles.aspectRatioBox} />
          </div>
        </div>
      </div>
    </section>
  );
};

interface IWQEditionDisplay {
  selectedEdition:
    | "witchqueendeluxe"
    | "witchqueendeluxeanniversary"
    | "witchqueenstandard";
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

  const buyFlowRoute = RouteHelper.DestinyBuyDetail(
    { productFamilyTag: "witchqueen" },
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
