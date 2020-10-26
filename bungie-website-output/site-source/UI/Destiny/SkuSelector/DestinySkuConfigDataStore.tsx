// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { DataStore } from "@Global/DataStore";
import { FetchUtils } from "@Utilities/FetchUtils";
import { BuildVersion } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localizer";
import { ContentUtils } from "@Utilities/ContentUtils";
import moment from "moment";
import { Logger } from "@Global/Logger";

export interface IDestinySkuValidRegion {
  key: string;
  stringKey: string;
}

export interface IDestinySkuSection {
  key: string;
  firehoseContentSetTag: string;
}

export interface IDestinySkuStore {
  key: string;
  urlTemplate: string;
  stringKey: string;
  validRegions: IDestinySkuValidRegion[];
}

export interface IDestinySkuSale {
  productSkuTag: string;
  store: string;
  startDate: string;
  endDate: string;
  discountString: string;
}

export interface IDestinySkuProductStoreRegion {
  key: string;
  sku: string;
  templateOverride?: string;
}

export interface IDestinySkuProductStore {
  key: string;
  regions: IDestinySkuProductStoreRegion[];
  activeSale: IDestinySkuSale;
}

export interface IDestinySkuProductGroup {
  key: string;
  section: string;
  products: IDestinySkuProduct[];
}

export interface IDestinySkuProduct {
  key: string;
  stores: IDestinySkuProductStore[];
}

export interface IDestinySkuConfig {
  stores: IDestinySkuStore[];
  productGroups: IDestinySkuProductGroup[];
  sections: IDestinySkuSection[];
  loaded: boolean;
}

/**
 * DestinyConfigDataStore - Replace this description
 *  *
 * @param {IDestinyConfigDataStoreProps} props
 * @returns
 */
class DestinySkuConfigDataStore extends DataStore<IDestinySkuConfig> {
  public static Instance = new DestinySkuConfigDataStore();

  constructor() {
    super({
      productGroups: [],
      stores: [],
      sections: [],
      loaded: false,
    });
  }

  public initialize() {
    // Locally, we don't want to have to wait for the string cache to update
    const cacheString = ConfigUtils.EnvironmentIsLocal
      ? Date.now()
      : BuildVersion;

    FetchUtils.FetchJson<IDestinySkuConfig>(
      `/JsonSkuDestinations.ashx?bv=${cacheString}`
    ).then((data) => {
      if (data) {
        const productGroupsCopy = [...data.productGroups];

        Platform.ContentService.GetContentByTagAndType(
          "current-sales",
          "ContentSet",
          Localizer.CurrentCultureName,
          false
        ).then((contentSet) => {
          const currentSales: Content.ContentItemPublicContract[] =
            contentSet.properties["ContentItems"];

          currentSales?.forEach((s) => {
            const sale = ContentUtils.saleFromContent(s);
            const start = moment(sale.startDate).utc();
            const end = moment(sale.endDate).utc();

            if (moment.utc().isBetween(start, end)) {
              productGroupsCopy.map((pg) => {
                const productOnSale = pg.products.find(
                  (p) => p.key === sale.productSkuTag
                );

                if (productOnSale) {
                  const storeWithSale = productOnSale.stores.find(
                    (st) => st.key === sale.store
                  );
                  storeWithSale.activeSale = sale;
                }
              });
            }
          });
        });

        this.update({
          ...data,
          productGroups: productGroupsCopy,
          loaded: true,
        });
      }
    });
  }
}

DestinySkuConfigDataStore.Instance.initialize();

export default DestinySkuConfigDataStore.Instance;
