// Created by jlauer, 2020
// Copyright Bungie, Inc.

import React, { useEffect } from "react";
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

export const LoadingFallback = () => {
  useEffect(() => {
    AppLoadingDataStore.actions.updateLoading(true);

    return () => {
      AppLoadingDataStore.actions.updateLoading(false);
    };
  }, []);

  return <FullPageLoadingBar />;
};

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
