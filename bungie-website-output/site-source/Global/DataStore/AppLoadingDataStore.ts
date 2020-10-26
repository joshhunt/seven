import { DataStore } from "@Global/DataStore";

class AppLoadingDataStoreInternal extends DataStore<{ loading: boolean }> {
  constructor() {
    super({ loading: false });
  }
}

export const AppLoadingDataStore = new AppLoadingDataStoreInternal();
