import { DataStore } from "@Global/DataStore";

class AppLoadingDataStoreInternal extends DataStore<{ loading: boolean }> {
  constructor() {
    super({ loading: false });
  }

  public actions = this.createActions({
    /**
     * Set the loading state
     * @param loading Loading state
     */
    updateLoading: (loading: boolean) => ({ loading }),
  });
}

export const AppLoadingDataStore = new AppLoadingDataStoreInternal();
