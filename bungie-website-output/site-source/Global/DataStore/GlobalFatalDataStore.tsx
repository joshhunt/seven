// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { DataStore } from "@Global/DataStore";

export interface IGlobalFatalDataStorePayload {
  error: string[];
}

class GlobalFatalDataStoreInternal extends DataStore<
  IGlobalFatalDataStorePayload
> {
  public static Instance = new GlobalFatalDataStoreInternal({
    error: null,
  });

  public addErrorToStore(errorString: string) {
    const errorArray = [];

    if (errorString) {
      errorArray.push(errorString);

      this.update({
        error: errorArray,
      });
    }
  }
}

export const GlobalFatalDataStore = GlobalFatalDataStoreInternal.Instance;
