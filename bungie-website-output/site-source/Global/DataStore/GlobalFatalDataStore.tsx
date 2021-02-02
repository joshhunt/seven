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
    error: [],
  });

  public actions = this.createActions({
    /**
     * Add an error. This should only include errors that are truly fatal, meaning the page is totally broken.
     * @param errorString The error contents
     */
    addError: (errorString: string) => {
      const errorArray = [...this.state.error];

      if (errorString) {
        errorArray.push(errorString);
      }

      return {
        error: errorArray,
      };
    },
  });
}

/**
 * Holds error information related to errors that block fundamental site content from working.
 */
export const GlobalFatalDataStore = GlobalFatalDataStoreInternal.Instance;
