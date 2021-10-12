import AppLayout from "@Boot/AppLayout";
import { ProceduralMarketingPageFallback } from "@Boot/ProceduralMarketingPageFallback";
import { RelayEnvironmentFactory } from "@bungie/contentstack";
import BungieNetRelayEnvironmentPreset from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetRelayEnvironmentPreset";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalElementDataStore } from "@Global/DataStore/GlobalElementDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BuildVersion } from "@Helpers";
import { Models } from "@Platform";
import { LoadingFallback } from "@Routes/AsyncRoute";
import { RouteDefs } from "@Routes/RouteDefs";
import { BasicErrorBoundary } from "@UI/Errors/BasicErrorBoundary";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { ToastContent } from "@UI/UIKit/Controls/Toast/Toast";
import { ToastContainer } from "@UI/UIKit/Controls/Toast/ToastContainer";
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Environment, RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter as Router, Route } from "react-router-dom";

const createRelayEnvironment = async (
  coreSettings: Models.CoreSettingsConfiguration
) => {
  const preset = await BungieNetRelayEnvironmentPreset({
    cachedSettingsObject: coreSettings,
  });
  const relayEnvironmentFactory = new RelayEnvironmentFactory(preset);

  return relayEnvironmentFactory.create();
};

/**
 * The wrapper component for the rest of the application
 *  *
 * @param {IAppProps} props
 * @returns
 */
export const App: React.FC = () => {
  const AppBaseUrl = UrlUtils.AppBaseUrl;
  const { coreSettings } = useDataStore(GlobalStateDataStore, []);
  const [relayEnvironment, setRelayEnvironment] = useState<Environment | null>(
    null
  );

  useEffect(() => {
    GlobalStateDataStore.initialize();
  }, []);

  useEffect(() => {
    if (coreSettings) {
      createRelayEnvironment(coreSettings)
        .then(setRelayEnvironment)
        .catch(console.error);
    }
  }, [coreSettings]);

  if (!relayEnvironment) {
    return null;
  }

  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Router basename={AppBaseUrl}>
        <BasicErrorBoundary>
          <AppLayout>
            <Helmet titleTemplate="%s | Bungie.net" />
            {coreSettings && (
              <React.Fragment>
                <FullPageLoadingBar />
                <SwitchWithErrors>
                  <Route exact={true} path="/version">
                    {
                      /* tslint:disable-next-line: jsx-use-translation-function */
                      <span>Build Version: {BuildVersion}</span>
                    }
                  </Route>
                  {RouteDefs.AllAreaRoutes}
                  <Route path={"/:locale/:slug?"}>
                    <React.Suspense fallback={<LoadingFallback />}>
                      <ProceduralMarketingPageFallback />
                    </React.Suspense>
                  </Route>
                </SwitchWithErrors>
              </React.Fragment>
            )}
          </AppLayout>
          <GlobalElements />
        </BasicErrorBoundary>
      </Router>
    </RelayEnvironmentProvider>
  );
};

const GlobalElements = () => {
  const globalElements = useDataStore(GlobalElementDataStore);

  // Gather the globalElements that are modals
  const modals = globalElements.elements.filter((a) => a.el.type === Modal);

  // Gather the globalElements that are toasts, because these are dealt with differently in ToastContainer
  const toasts = globalElements.elements.filter(
    (a) => a.el.type === ToastContent
  );

  return (
    <>
      {modals.map((m) => m.el)}
      <ToastContainer toasts={toasts} />
      <div id={"dropdown-options-container"} />
    </>
  );
};
