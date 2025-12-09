import Home from "@Areas/Home/Home";
import AppLayout from "@Boot/AppLayout";
import { ProceduralMarketingPageFallback } from "@Boot/ProceduralMarketingPageFallback";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalElementDataStore } from "@Global/DataStore/GlobalElementDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BuildVersion } from "@Helpers";
import { LoadingFallback } from "@Routes/AsyncRoute";
import { RouteDefs } from "@Routes/RouteDefs";
import { BasicErrorBoundary } from "@UI/Errors/BasicErrorBoundary";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import store from "./Global/Redux/store";
import { GlobalProviders } from "@Global/GlobalProviders";
import { ToastProvider } from "@Global/Context/ToastProvider";
import { ModalContainer } from "@UI/UIKit/Controls/Modal/ModalContainer";

/**
 * The wrapper component for the rest of the application
 *  *
 * @returns
 */
export const App: React.FC = () => {
  const AppBaseUrl = UrlUtils.AppBaseUrl;
  const { coreSettings } = useDataStore(GlobalStateDataStore, []);

  useEffect(() => {
    GlobalStateDataStore.initialize();
  }, []);

  return (
    <React.StrictMode>
      <Router basename={AppBaseUrl}>
        <BasicErrorBoundary>
          {coreSettings && (
            <Provider store={store}>
              <GlobalProviders>
                <AppLayout>
                  <Helmet
                    titleTemplate="%s | Bungie.net"
                    defaultTitle={"Bungie.net"}
                  />
                  <FullPageLoadingBar />
                  <SwitchWithErrors>
                    <Route exact={true} path="/">
                      <Home />
                    </Route>
                    <Route exact={true} path="/version">
                      <span>Build Version: {BuildVersion}</span>
                    </Route>
                    {RouteDefs.AllAreaRoutes}
                    <Route path={"/:locale/:slug?"}>
                      <React.Suspense fallback={<LoadingFallback />}>
                        <ProceduralMarketingPageFallback />
                      </React.Suspense>
                    </Route>
                  </SwitchWithErrors>
                </AppLayout>
                <ToastProvider />
                <ModalContainer />
                <div id={"dropdown-options-container"} />
              </GlobalProviders>
            </Provider>
          )}
        </BasicErrorBoundary>
      </Router>
    </React.StrictMode>
  );
};
