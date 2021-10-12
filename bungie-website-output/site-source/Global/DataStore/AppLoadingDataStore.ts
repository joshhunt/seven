import { DataStore } from "@bungie/datastore";

class AppLoadingDataStoreInternal extends DataStore<{ loading: boolean }> {
  constructor() {
    super({ loading: false });
  }

  public actions = this.createActions({
    /**
     * Set the loading state
     * @param loading Loading state
     */
    updateLoading: (state, loading: boolean) => ({ loading }),
  });
}

export const AppLoadingDataStore = new AppLoadingDataStoreInternal();
