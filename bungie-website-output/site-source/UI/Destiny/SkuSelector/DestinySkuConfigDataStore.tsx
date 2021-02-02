// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { DetailedError } from "@CustomErrors";
import { DataStore } from "@Global/DataStore";
import { BuildVersion } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FetchUtils } from "@Utilities/FetchUtils";

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

  public async initialize() {
    await this.actions.refresh();
  }

  public actions = this.createActions({
    /**
     * Refresh the SKU config data
     */
    refresh: async () => {
      // Locally, we don't want to have to wait for the string cache to update
      const cacheString = ConfigUtils.EnvironmentIsLocal
        ? Date.now()
        : BuildVersion;

      const data = await FetchUtils.FetchJson<IDestinySkuConfig>(
        `/JsonSkuDestinations.ashx?bv=${cacheString}`
      );
      if (data) {
        return {
          ...data,
          loaded: true,
        };
      }

      throw new DetailedError("Load Failure", "Failed to load SKU data");
    },
  });
}

DestinySkuConfigDataStore.Instance.initialize();

export default DestinySkuConfigDataStore.Instance;
