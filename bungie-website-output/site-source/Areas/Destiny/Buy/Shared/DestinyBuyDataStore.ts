import { DataStore } from "@Global/DataStore";

export interface IDestinyBuyDataState {
  // ok, so I know you want to just use the skuTag here, it's cleaner, it's more reusable, we all do.
  // This is an index to solve the selected expansion always starting at the first one and UPDATING to the correct one on page load or when the platform selector modal closes, visually gross.
  selectedSkuIndex: number;
}

class DestinyBuyDataStoreGeneral extends DataStore<IDestinyBuyDataState> {
  public static Instance = new DestinyBuyDataStoreGeneral({
    selectedSkuIndex: 0,
  });

  public actions = this.createActions({
    /**
     * Set the SKU index selected in the buy flow
     * @param index
     */
    setSelectedSkuIndex: (index: number) => ({ selectedSkuIndex: index }),
  });
}

export const DestinyBuyDataStore = DestinyBuyDataStoreGeneral.Instance;
