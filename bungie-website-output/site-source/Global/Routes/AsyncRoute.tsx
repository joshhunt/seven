// Created by jlauer, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import { Route, RouteProps } from "react-router-dom";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { AppLoadingDataStore } from "@Global/DataStore/AppLoadingDataStore";

interface IAsyncRouteProps extends Omit<RouteProps, "component"> {
  component: () => Promise<{ default: React.ComponentType<any> }>;
}

/**
 * AsyncRoute - Replace this description
 *  *
 * @param {IAsyncRouteProps} props
 * @returns
 */
export const AsyncRoute: React.FC<IAsyncRouteProps> = (props) => {
  const { component, ...rest } = props;

  return <Route {...rest} component={createAsyncComponent(component)} />;
};

const retry = (
  fn,
  retriesLeft = 5,
  interval = 500
): Promise<{ default: React.ComponentType<any> }> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
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

class LoadingFallback extends React.Component {
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

  return (props) => (
    <React.Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};
