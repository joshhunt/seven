// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { DataStore } from "@Global/DataStore";
import { FetchUtils } from "@Utilities/FetchUtils";
import { BuildVersion } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";

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
  startDate: Date;
  endDate: Date;
  amount: string;
  type: string;
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
      this.update({
        ...data,
        loaded: true,
      });
    });
  }
}

DestinySkuConfigDataStore.Instance.initialize();

export default DestinySkuConfigDataStore.Instance;
