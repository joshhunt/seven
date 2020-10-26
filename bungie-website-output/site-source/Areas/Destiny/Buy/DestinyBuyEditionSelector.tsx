// Created by larobinson, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinyBuyEditionSelector.module.scss";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { IDestinyProductDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import classNames from "classnames";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { DestroyCallback, DataStore } from "@Global/DataStore";
import { DestinyBuyDataStore } from "./Shared/DestinyBuyDataStore";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { StringUtils } from "@Utilities/StringUtils";

interface IDestinyBuyEditionSelectorProps {
  title: string;
  subtitle: string;
  skus: IDestinyProductDefinition[];
  buttonLabel: string;
  disclaimer?: string;
  collectorsEdition?: IDestinyProductDefinition;
  strangerEdition?: IDestinyProductDefinition;
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
  const subs: DestroyCallback[] = [];
  const [selectedSkuTag, setSelectedSkuTag] = React.useState(
    props.skus[DestinyBuyDataStore.state.selectedSkuIndex].skuTag
  );
  const [skuConfig, setSkuConfig] = React.useState(null);

  const strangerEditionSelected =
    props.strangerEdition?.skuTag === selectedSkuTag;

  React.useEffect(() => {
    subs.push(
      DestinyBuyDataStore.observe(
        (data) => {
          data && setSelectedSkuTag(props.skus[data.selectedSkuIndex].skuTag);
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
  });

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <div className={styles.selectorHeader}>
          <img
            className={styles.tricorn2}
            src={"7/ca/destiny/logos/tricorn_2_icon.svg"}
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
              const discountString =
                skuConfig &&
                DestinySkuUtils.getDiscountStringForProduct(
                  sku.skuTag,
                  skuConfig
                );

              return (
                <div
                  key={i}
                  className={classNames(styles.expansionLine, {
                    [styles.selected]: sku.skuTag === selectedSkuTag,
                  })}
                  onClick={() => {
                    setSelectedSkuTag(sku.skuTag);
                    DestinyBuyDataStore.update({ selectedSkuIndex: i });
                  }}
                >
                  <img src={sku.imagePath} />
                  <div className={styles.expansionLineContent}>
                    {productIsOnSale && (
                      <div className={styles.saleTag}>{discountString}</div>
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
                      {DestinySkuUtils.getDiscountStringForProduct(
                        props.skus[0].skuTag,
                        skuConfig
                      )}
                    </div>
                  )}
              </>
            )}
        <Button
          buttonType={"gold"}
          className={styles.button}
          size={BasicSize.Medium}
          url={
            strangerEditionSelected
              ? props.strangerEdition.relatedPage
              : undefined
          }
          onClick={() =>
            !strangerEditionSelected &&
            DestinySkuUtils.showStoreModal(selectedSkuTag)
          }
          analyticsId={selectedSkuTag}
        >
          {props.buttonLabel}
        </Button>
      </div>

      {!StringUtils.isNullOrWhiteSpace(props.disclaimer) ? (
        <div className={styles.disclaimer}>
          <Icon
            iconType={"material"}
            iconName={"error"}
            className={styles.icon}
          />
          <div dangerouslySetInnerHTML={{ __html: props.disclaimer }} />
        </div>
      ) : (
        <div className={styles.spacer} />
      )}
    </div>
  );
};
