// Created by jlauer, 2020
// Copyright Bungie, Inc.

import React from "react";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { AppLoadingDataStore } from "@Global/DataStore/AppLoadingDataStore";

export const retry = (
  fn: Function,
  retriesLeft = 5,
  interval = 500
): Promise<{ default: React.ComponentType<any> }> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: Error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);

            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

export class LoadingFallback extends React.Component {
  public componentDidMount() {
    AppLoadingDataStore.actions.updateLoading(true);
  }

  public componentWillUnmount() {
    AppLoadingDataStore.actions.updateLoading(false);
  }

  public render() {
    return <FullPageLoadingBar />;
  }
}

export const createAsyncComponent = (
  componentPromise: () => Promise<{ default: React.ComponentType<any> }>
) => {
  const LazyComponent = React.lazy(() => retry(componentPromise));

  return (props: any) => (
    <React.Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};
