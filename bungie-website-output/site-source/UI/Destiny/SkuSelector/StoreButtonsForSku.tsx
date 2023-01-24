// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import React from "react";
import { Img, sortUsingFilterArray } from "../../../Utilities/helpers";
import { StoreSkuButton } from "../../UIKit/Controls/Button/StoreSkuButton";
import { IDestinyProductDefinition } from "./DestinyProductDefinitions";
import {
  IDestinySkuConfig,
  IDestinySkuSale,
  IDestinySkuStore,
} from "./DestinySkuConfigDataStore";
import styles from "./DestinySkuSelectorOptions.module.scss";
import { DestinySkuUtils } from "./DestinySkuUtils";
import luxon, { DateTime } from "luxon";

interface StoreButtonsForSkuProps {
  subtitle: string;
  stores: IDestinySkuStore[];
  skuDefinition: IDestinyProductDefinition;
  productFamily: string;
  skuConfig: IDestinySkuConfig;
  onStoreSelected?: (arg0: any, arg1: IDestinySkuStore, arg3: boolean) => void;
  selectedRegion?: string;
  utmParams?: string;
}

export const StoreButtonsForSku: React.FC<StoreButtonsForSkuProps> = (
  props
) => {
  const {
    skuDefinition,
    subtitle,
    productFamily,
    skuConfig,
    selectedRegion,
    onStoreSelected,
    utmParams,
  } = props;

  const params = new URLSearchParams(location.search);
  const order = params.get("order");

  // Sort stores into specific order
  const stores =
    order === "popularity"
      ? sortUsingFilterArray(props.stores, [
          ({ key }) => key === "Steam",
          ({ key }) => key === "Playstation",
          ({ key }) => key === "Xbox",
          ({ key }) => key === "Epic",
          ({ key }) => key === "MicrosoftPC",
        ])
      : props.stores;

  const getSaleDateString = (activeSale: IDestinySkuSale) => {
    const ed = DateTime.fromISO(activeSale.endDate);
    const saleDescription = Localizer.Buyflow.GenericSaleDescription;
    const endDateString = Localizer.Format(Localizer.Time.CompactMonthDayYear, {
      month: ed.toFormat("M"),
      day: ed.toFormat("dd"),
      year: ed.toFormat("y"),
    });

    return Localizer.Format(Localizer.Buyflow.SaleEndsOn, {
      saleDescription: saleDescription,
      endDate: endDateString,
    });
  };

  const getTitleKey = (key: string) => {
    switch (key) {
      case "StadiaFree":
        return "Stadia";
      case "BungieStore":
        return "Bungie Store";
      case "Playstation":
        return "PlayStation";
      case "MicrosoftPC":
        return "Windows";
      default:
        return key;
    }
  };

  const isPlaystation = (store: IDestinySkuStore) =>
    store.stringKey === "StorePlaystation";

  return (
    <>
      <div className={styles.modalSubtitle}>{subtitle}</div>
      <div className={styles.modalButtons}>
        {stores.map((store) => {
          const storeRegions = DestinySkuUtils.getRegionsForProduct(
            skuDefinition.skuTag,
            store.key,
            skuConfig
          );
          const storeRegion =
            selectedRegion ??
            (storeRegions.length > 1
              ? storeRegions[0].key
              : DestinySkuUtils.REGION_GLOBAL_KEY);

          const url = DestinySkuUtils.getStoreUrlForSku(
            skuDefinition.skuTag,
            store.key,
            skuConfig,
            storeRegion,
            utmParams
          );
          const activeSale =
            DestinySkuUtils.getSaleForProductAndStore(
              skuDefinition.skuTag,
              store.key,
              skuConfig
            ) || null;
          let activeSaleEndDate = "";
          if (activeSale) {
            activeSaleEndDate = getSaleDateString(activeSale);
            if (skuDefinition.disclaimer) {
              activeSaleEndDate += "*";
            }
          }

          const storeKeyForIcon =
            store.key === "StadiaFree" ? "stadia" : store.key.toLowerCase();
          const storeKeyForTitle = getTitleKey(store.key);

          return (
            <div
              key={store.key}
              className={classNames(styles.buttonWrapper, {
                [styles.activeSale]: activeSale,
              })}
            >
              <StoreSkuButton
                buttonStyles={styles.platformTriggerButton}
                url={url}
                sameTab={false}
                onClick={(e) => {
                  if (storeRegion !== DestinySkuUtils.REGION_GLOBAL_KEY) {
                    e.preventDefault();
                  }

                  onStoreSelected(e, store, isPlaystation(store));
                }}
                analyticsId={`${store}|${skuDefinition.skuTag}`}
              >
                <div className={styles.buttonInner}>
                  {activeSale && (
                    <div className={styles.saleTag}>
                      {Localizer.Sales[skuDefinition.skuTag] ??
                        Localizer.Sales[productFamily]}
                    </div>
                  )}
                  <div className={styles.platformInfo}>
                    <img
                      className={classNames(styles.icon, {
                        [styles.epic]: store.stringKey === "StoreEpic",
                      })}
                      src={`${Img(
                        `bungie/icons/logos/${storeKeyForIcon}/${storeKeyForIcon}_icon_small.png`
                      )}`}
                      alt={store.key}
                    />
                    <div className={styles.buttonText}>{storeKeyForTitle}</div>
                  </div>
                  <div className={styles.saleInfo}>
                    <p className={styles.endDate}>{activeSaleEndDate}&nbsp;</p>
                  </div>
                </div>
              </StoreSkuButton>
            </div>
          );
        })}
      </div>
    </>
  );
};
