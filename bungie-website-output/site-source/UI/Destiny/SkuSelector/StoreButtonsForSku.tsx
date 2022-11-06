// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import moment from "moment";
import React from "react";
import { Img } from "../../../Utilities/helpers";
import { StoreSkuButton } from "../../UIKit/Controls/Button/StoreSkuButton";
import { IDestinyProductDefinition } from "./DestinyProductDefinitions";
import {
  IDestinySkuConfig,
  IDestinySkuSale,
  IDestinySkuStore,
} from "./DestinySkuConfigDataStore";
import styles from "./DestinySkuSelectorOptions.module.scss";
import { DestinySkuUtils } from "./DestinySkuUtils";

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
    stores,
    subtitle,
    productFamily,
    skuConfig,
    selectedRegion,
    onStoreSelected,
    utmParams,
  } = props;

  const getSaleDateString = (activeSale: IDestinySkuSale) => {
    const ed = moment(
      moment(activeSale.endDate).local(true),
      "YYYY-MM-DD HH:mm"
    );
    const saleDescription = Localizer.Buyflow.GenericSaleDescription;
    const endDateString = Localizer.Format(Localizer.Time.CompactMonthDayYear, {
      month: ed.format("MM"),
      day: ed.format("DD"),
      year: ed.format("YYYY"),
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
  const region = selectedRegion ?? DestinySkuUtils.REGION_GLOBAL_KEY;

  return (
    <>
      <div className={styles.modalSubtitle}>{subtitle}</div>
      <div className={styles.modalButtons}>
        {stores.map((store) => {
          const url = DestinySkuUtils.getStoreUrlForSku(
            skuDefinition.skuTag,
            store.key,
            skuConfig,
            region,
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
                onClick={(e) => onStoreSelected(e, store, isPlaystation(store))}
                analyticsId={`${store}|${skuDefinition.skuTag}`}
              >
                {activeSale && (
                  <div className={styles.saleTag}>
                    {Localizer.Sales[skuDefinition.skuTag] ??
                      Localizer.Sales[productFamily]}
                  </div>
                )}

                <img
                  className={classNames(styles.icon, {
                    [styles.epic]: store.stringKey === "StoreEpic",
                  })}
                  src={`${Img(
                    `bungie/icons/logos/${storeKeyForIcon}/${storeKeyForIcon}_icon_small.png`
                  )}`}
                  alt={store.key}
                />
                <div className={styles.buttonText}>
                  {storeKeyForTitle}
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
