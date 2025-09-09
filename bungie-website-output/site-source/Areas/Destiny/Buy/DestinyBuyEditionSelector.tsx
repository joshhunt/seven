// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { IDestinyProductDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./DestinyBuyEditionSelector.module.scss";
import { DestinyBuyDataStore } from "./Shared/DestinyBuyDataStore";

interface IDestinyBuyEditionSelectorProps {
  title: string;
  subtitle: string;
  skus: IDestinyProductDefinition[];
  buttonLabel: string;
  productFamily: string;
  disclaimer?: string;
  collectorsEdition?: IDestinyProductDefinition;
}

/**
 * DestinyBuyEditionSelector - Floating module on Product Family detail page where user can select which expansion to purchase
 *  *
 * @param {IDestinyBuyEditionSelectorProps} props
 * @returns
 */
export const DestinyBuyEditionSelector: React.FC<IDestinyBuyEditionSelectorProps> = (
  props
) => {
  const initialIndex = DestinyBuyDataStore.state.selectedSkuIndex ?? 0;
  const initialSkuTag = props.skus[initialIndex]?.skuTag ?? "";
  const [selectedSkuTag, setSelectedSkuTag] = React.useState<string>(
    initialSkuTag
  );
  const [skuConfig, setSkuConfig] = React.useState(null);
  const selectedSku = React.useMemo(
    () => props.skus.find((s) => s.skuTag === selectedSkuTag),
    [props.skus, selectedSkuTag]
  );
  const buttonLabelForSku = selectedSku?.buttonLabel ?? props.buttonLabel;
  const hasSkus = props.skus.length > 0;

  const wqCollectorsEditionSelected =
    props.collectorsEdition?.skuTag === selectedSkuTag;
  const wqCollectorsUrl =
    wqCollectorsEditionSelected && props.collectorsEdition?.relatedPage;

  React.useEffect(() => {
    const subs: DestroyCallback[] = [];

    subs.push(
      DestinyBuyDataStore.observe(
        (data) => {
          const idx = data?.selectedSkuIndex ?? 0;
          const newTag = props.skus[idx]?.skuTag;
          if (newTag) {
            setSelectedSkuTag(newTag);
          }
        },
        null,
        true
      )
    );

    subs.push(
      DestinySkuConfigDataStore.observe((data: IDestinySkuConfig) =>
        setSkuConfig(data)
      )
    );

    return () => DataStore.destroyAll(...subs);
  }, [props.skus]);

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <div className={styles.selectorHeader}>
          <img
            className={styles.tricorn2}
            src={"7/ca/destiny/logos/tricorn_2_icon.svg"}
            alt={""}
            role={"presentation"}
          />
          <div className={styles.titles}>
            <div className={styles.subtitle}>{props.subtitle}</div>
            <div className={styles.title}>{props.title}</div>
          </div>
        </div>
        {props.skus.length > 1
          ? props.skus.map((sku, i) => {
              const productIsOnSale =
                skuConfig &&
                DestinySkuUtils.isProductOnSale(sku.skuTag, skuConfig);

              return (
                <div
                  key={i}
                  className={classNames(styles.expansionLine, {
                    [styles.selected]: sku.skuTag === selectedSkuTag,
                  })}
                  role="button"
                  onClick={() => {
                    setSelectedSkuTag(sku.skuTag);
                    DestinyBuyDataStore.actions.setSelectedSkuIndex(i);
                  }}
                >
                  <img src={sku.imagePath} alt="" role="presentation" />
                  <div className={styles.expansionLineContent}>
                    {productIsOnSale && (
                      <div
                        className={classNames(styles.saleTag, {
                          [styles.selectedSale]: sku.skuTag === selectedSkuTag,
                        })}
                      >
                        {Localizer.Sales[sku.skuTag]}
                      </div>
                    )}
                    <div className={styles.subtitle}>
                      {sku.edition || sku.subtitle}
                    </div>
                  </div>
                </div>
              );
            })
          : props.skus.length === 1 && (
              <>
                <div className={styles.underline} />
                {skuConfig &&
                  DestinySkuUtils.isProductOnSale(
                    props.skus[0].skuTag,
                    skuConfig
                  ) && (
                    <div
                      className={classNames(
                        styles.saleTag,
                        styles.singleProduct
                      )}
                    >
                      {Localizer.Sales[props.productFamily]}
                    </div>
                  )}
              </>
            )}
        <Button
          buttonType={"gold"}
          className={styles.button}
          size={BasicSize.Medium}
          url={wqCollectorsEditionSelected ? wqCollectorsUrl : undefined}
          onClick={() =>
            hasSkus &&
            !wqCollectorsEditionSelected &&
            DestinySkuUtils.showStoreModal(selectedSkuTag)
          }
          disabled={!hasSkus}
          analyticsId={selectedSkuTag}
        >
          {buttonLabelForSku}
        </Button>
      </div>

      {!StringUtils.isNullOrWhiteSpace(props.disclaimer) ? (
        <div className={styles.disclaimer}>
          <Icon
            iconType={"material"}
            iconName={"error"}
            className={styles.icon}
          />
          <div dangerouslySetInnerHTML={sanitizeHTML(props.disclaimer)} />
        </div>
      ) : (
        <div className={styles.spacer} />
      )}
    </div>
  );
};
