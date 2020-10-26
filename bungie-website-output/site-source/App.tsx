import * as React from "react";
import { BasicErrorBoundary } from "@UI/Errors/BasicErrorBoundary";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Helmet from "react-helmet";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { RouteDefs } from "@Routes/RouteDefs";
import AppLayout from "@Boot/AppLayout";
import { DataStore, DestroyCallback, useDataStore } from "@Global/DataStore";
import {
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { FullPageLoadingBar } from "@UI/UIKit/Controls/FullPageLoadingBar";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { ToastContainer } from "@UI/UIKit/Controls/Toast/ToastContainer";
import { ToastContent } from "@UI/UIKit/Controls/Toast/Toast";
import { GlobalElementDataStore } from "@Global/DataStore/GlobalElementDataStore";
import { UrlUtils } from "@Utilities/UrlUtils";
import { BuildVersion } from "@Helpers";

interface IAppProps {}

interface IAppState {
  globalState: GlobalState<any>;
  isLoading: boolean;
}

/**
 * The wrapper component for the rest of the application
 *  *
 * @param {IAppProps} props
 * @returns
 */
export class App extends React.Component<IAppProps, IAppState> {
  private readonly monitors: DestroyCallback[] = [];

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isLoading: false,
      globalState: GlobalStateDataStore.state,
    };
  }

  public componentDidMount() {
    this.monitors.push(
      GlobalStateDataStore.observe((globalState) => {
        this.setState({
          globalState,
        });
      }, [])
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.monitors);
  }

  public render() {
    const AppBaseUrl = UrlUtils.AppBaseUrl;

    return (
      <Router basename={AppBaseUrl}>
        <BasicErrorBoundary>
          <AppLayout>
            <Helmet titleTemplate="%s | Bungie.net" />
            {this.state.globalState.coreSettings && (
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
                </SwitchWithErrors>
              </React.Fragment>
            )}
          </AppLayout>
          <GlobalElements />
        </BasicErrorBoundary>
      </Router>
    );
  }
}

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
