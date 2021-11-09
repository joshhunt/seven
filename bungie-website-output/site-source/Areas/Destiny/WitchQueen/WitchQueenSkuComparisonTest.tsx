// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { WitchQueenSkuComparisonTestQuery } from "@Areas/Destiny/WitchQueen/__generated__/WitchQueenSkuComparisonTestQuery.graphql";
import WQHero from "@Areas/Destiny/WitchQueen/sections/WQHero/WQHero";
import { WQImgUrlFromQueryProp } from "@Areas/Destiny/WitchQueen/WitchQueen";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization/Localizer";
import { Content, Platform } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { IDestinyProductDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./WitchQueenSkuComparisonTest.module.scss";

const WitchQueenSkuComparisonTest: React.FC = () => {
  const [hasHeroLoaded, setHasHeroLoaded] = useState(false);
  const [haveSkusLoaded, setHaveSkusLoaded] = useState(false);
  const [skuItems, setSkuItems] = useState<IDestinyProductDefinition[]>([]);
  const [skuConfig, setSkuConfig] = useState(DestinySkuConfigDataStore.state);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<WitchQueenSkuComparisonTestQuery>(
    graphql`
      query WitchQueenSkuComparisonTestQuery($locale: String!) {
        nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {
          title
          meta_imageConnection {
            edges {
              node {
                url
              }
            }
          }
        }
      }
    `,
    { locale }
  );

  useEffect(() => {
    loadSkuContent();
  }, []);

  useEffect(() => {
    if (skuConfig.loaded) {
      loadSkuContent();
    }
  }, [skuConfig]);

  const loadSkuContent = () => {
    Platform.ContentService.GetContentByTagAndType(
      "destiny-sku-group-set",
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    )
      .then((contentSet) => {
        const allItems: Content.ContentItemPublicContract[] =
          contentSet.properties["ContentItems"];
        if (allItems) {
          const skus = allItems
            .filter((a) => a.cType === "DestinySkuItem")
            .map((contentItem) =>
              DestinySkuUtils.skuDefinitionFromContent(contentItem)
            )
            .filter((skuItem) =>
              DestinySkuUtils.productExists(skuItem.skuTag, skuConfig)
            );

          const wqSkuTags = [
            "witchqueenstandard",
            "witchqueendeluxe",
            "witchqueendeluxeanniversary",
          ];

          const comparisonSkus = skus.filter((s) =>
            wqSkuTags.find((tag) => tag === s.skuTag)
          );

          /* swaps two elements in an array */
          const swapElements = (indexA: number, indexB: number) => {
            const temp = comparisonSkus[indexA];
            comparisonSkus[indexA] = comparisonSkus[indexB];
            comparisonSkus[indexB] = temp;
          };

          // re-order skus array to match order in wqSkuTags array
          wqSkuTags.forEach((tag, i) => {
            const skuAtPos = comparisonSkus[i];

            if (tag !== skuAtPos.skuTag) {
              // index of sku that should be at the current position
              const skuIndex = comparisonSkus.findIndex(
                (s) => s.skuTag === tag
              );

              skuIndex !== -1 && swapElements(i, skuIndex);
            }
          });

          setSkuItems(comparisonSkus);
        }
      })
      .finally(() => {
        setHaveSkusLoaded(true);
      });
  };

  const { title, meta_imageConnection } = data?.nova_product_page ?? {};

  return (
    <SpinnerContainer loading={!hasHeroLoaded || !haveSkusLoaded}>
      <WitchQueenHelmet
        title={title}
        img={WQImgUrlFromQueryProp(meta_imageConnection)}
      />
      <div className={styles.witchQueenContent}>
        <WQHero setHasLoaded={setHasHeroLoaded} />
        <div className={styles.skusSection}>
          <WQComparisonSkus skuItems={skuItems} />
        </div>
      </div>
    </SpinnerContainer>
  );
};

const WitchQueenHelmet: React.FC<{ title: string; img: string }> = ({
  title,
  img,
}) => {
  return (
    <BungieHelmet title={title} image={img}>
      <body
        className={classNames(
          SpecialBodyClasses(BodyClasses.NoSpacer),
          styles.witchQueen
        )}
      />
    </BungieHelmet>
  );
};

const WQComparisonSkus: React.FC<{ skuItems: IDestinyProductDefinition[] }> = (
  props
) => {
  return (
    <div className={styles.comparisonSkus}>
      {props.skuItems?.map((s, i) => {
        return (
          <WQSkuDetailItem
            key={i}
            sku={s}
            allSkuImages={props.skuItems?.map((item) => item.imagePath)}
            currentImgIndex={i}
          />
        );
      })}
    </div>
  );
};

interface IWQSkuDetailItem {
  sku: IDestinyProductDefinition;
  allSkuImages: string[];
  currentImgIndex: number;
}

const WQSkuDetailItem: React.FC<IWQSkuDetailItem> = (props) => {
  const { imagePath, skuTag, blurb, edition, buttonLabel } = props.sku;

  const openSkuModal = () => {
    DestinySkuSelectorModal.show({ skuTag: skuTag });
  };

  return (
    <div className={styles.comparisonSkuWrapper}>
      <ClickableMediaThumbnail
        thumbnail={imagePath}
        singleOrAllScreenshots={props.allSkuImages}
        screenshotIndex={props.currentImgIndex}
        classes={{ btnWrapper: styles.skuImg }}
      />
      <Button
        className={styles.skuBuyBtn}
        buttonType={"queenGreen"}
        onClick={openSkuModal}
      >
        {buttonLabel}
      </Button>
      <h3 className={styles.skuTitle}>{edition}</h3>
      <div
        className={styles.skuBlurb}
        dangerouslySetInnerHTML={sanitizeHTML(blurb)}
      />
    </div>
  );
};

export default WitchQueenSkuComparisonTest;
