import { DataStore } from "@bungie/datastore";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer, StringFetcher } from "@bungie/localization";
import {
  DestinyDefinitions,
  ManifestPayload,
} from "@Database/DestinyDefinitions/DestinyDefinitions";
import { GlobalFatalDataStore } from "@Global/DataStore/GlobalFatalDataStore";
import {
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteDataStore } from "@Global/DataStore/RouteDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Environment } from "@Helpers";
import { FirehoseDebugger } from "@UI/Content/FirehoseDebugger";
import { BasicErrorBoundary } from "@UI/Errors/BasicErrorBoundary";
import { EmailValidationGlobalBar } from "@UI/GlobalAlerts/EmailValidationGlobalBar";
import { GlobalAlerts } from "@UI/GlobalAlerts/GlobalAlerts";
import { ServiceAlertBar } from "@UI/GlobalAlerts/ServiceAlertBar";
import { MainNavigation } from "@UI/Navigation/MainNavigation";
import { GlobalErrorModal } from "@UI/UIKit/Controls/Modal/GlobalErrorModal";
import {
  Spinner,
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { NavVisibilityListener } from "@UIKit/Controls/NavVisibilityListener";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import {
  FirehoseDebuggerDataStore,
  IFirehoseDebuggerItemData,
} from "Platform/FirehoseDebuggerDataStore";
import React, { Suspense } from "react";
import Helmet from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router-dom";
// @ts-ignore
import ScrollMemory from "react-router-scroll-memory";
import { ErrorBnetOffline } from "@UI/Errors/ErrorBnetOffline";
import "./AppLayout.scss";
import { CookieConsent } from "./CookieConsent";
import { Footer } from "./Footer";
import { Responsive } from "./Responsive";

interface AppLayoutProps extends RouteComponentProps<ILocaleParams> {
  children?: React.ReactNode;
}

interface IInternalAppLayoutState {
  currentPath: string;
  error: string;
  globalState: GlobalState<"responsive">;
  stringsLoaded: boolean;
  noWebP: boolean;
  definitionsLoading: boolean;
  firehoseContentItems: IFirehoseDebuggerItemData[];
  globalError: string[];
  hideNavigation: boolean;
}

interface ILocaleParams {
  locale: string;
}

class AppLayout extends React.Component<
  AppLayoutProps,
  IInternalAppLayoutState
> {
  private readonly unsubscribers: DestroyCallback[] = [];
  private readonly rendererCoreSystemName = "WebRendererCore";
  private initTracking = false;

  constructor(props: AppLayoutProps) {
    super(props);

    this.state = {
      currentPath: null,
      error: null,
      globalState: GlobalStateDataStore.state,
      stringsLoaded: false,
      noWebP: false,
      definitionsLoading: false,
      firehoseContentItems: FirehoseDebuggerDataStore.state.contentItems,
      globalError: GlobalFatalDataStore.state.error,
      hideNavigation: false,
    };
  }

  public componentDidMount() {
    this.unsubscribers.push(
      RouteDataStore.Instance.observe((routeData) => {
        this.setState({
          currentPath: routeData.currentPath,
        });
      }),
      GlobalStateDataStore.observe(
        async (data) => {
          if (data && data.coreSettings && data.coreSettings.environment) {
            ConfigUtils.setEnvironment(
              data.coreSettings.environment as Environment
            );

            // StringFetcher needs to know the environment before it can fetch, so we wait until here to do so
            StringFetcher.fetch();
          }

          this.setState(
            {
              globalState: data,
            },
            () => this.state.globalState.coreSettings && this.initTrackingOnce()
          );
        },
        ["responsive"]
      ),
      StringFetcher.observe((data) => {
        this.setState({
          stringsLoaded: data.loaded,
        });

        this.forceUpdate();
      }),
      this.props.history.listen(() => {
        this.onHistoryUpdate();
      }),
      DestinyDefinitions.observe(
        ({ isLoading, hasError }: ManifestPayload) => {
          const definitionsLoading = isLoading && !hasError;
          this.setState({ definitionsLoading });
        },
        { types: null },
        true
      ),
      FirehoseDebuggerDataStore.observe((data) => {
        // this will only be populated if the firehoseDebug system is enabled and "_firehoseDebug" query is present
        this.setState({
          firehoseContentItems: data.contentItems,
        });
      }),
      GlobalFatalDataStore.observe((data) => {
        if (data.error?.length > 0) {
          this.setState({ globalError: data.error });
        }
      })
    );

    BrowserUtils.supportsWebp().then((supportsWebp) => {
      this.setState({
        noWebP: !supportsWebp,
      });
    });

    // The mobile app and any sources that might embed one of our pages can provide this query param to hide the header, footer, global alerts -- anything applied globally to the website that navigates you away from the current page.
    const queryParams = new URLSearchParams(this.props.location?.search);
    this.setState({ hideNavigation: queryParams.get("hidenav") === "true" });
  }

  private initTrackingOnce() {
    if (this.initTracking) {
      return;
    }

    this.initTracking = true;

    this.onHistoryUpdate();
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.unsubscribers);
  }

  private get settingsLoaded() {
    return (
      this.state.globalState &&
      this.state.globalState.coreSettings !== undefined
    );
  }

  private get systemEnabled() {
    return (
      this.settingsLoaded &&
      this.state.globalState.coreSettings.systems[
        this.rendererCoreSystemName
      ] &&
      this.state.globalState.coreSettings.systems[this.rendererCoreSystemName]
        .enabled
    );
  }

  private readonly onHistoryUpdate = () => {
    FirehoseDebuggerDataStore.actions.clear();
  };

  public render() {
    if (this.settingsLoaded && !this.systemEnabled) {
      if (
        this.state.globalState?.coreSettings?.systems?.[
          this.rendererCoreSystemName
        ]?.enabled !== null
      ) {
        return <ErrorBnetOffline />;
      }
    }

    const useContentstackGlobalAlerts =
      this.settingsLoaded &&
      this.state.globalState &&
      ConfigUtils?.SystemStatus(SystemNames.ContentstackGlobalAlerts);
    const responsiveClasses =
      this.state.globalState && this.state.globalState.responsive
        ? Responsive.getResponsiveClasses()
        : [];

    const destiny2Disabled =
      this.settingsLoaded &&
      this.state.globalState &&
      !ConfigUtils.SystemStatus(SystemNames.Destiny2);

    const platformClass = BrowserUtils.getPlatformClass();

    const htmlClassList = classNames(
      ...responsiveClasses,
      Localizer.CurrentCultureName,
      platformClass,
      {
        webp: !this.state.noWebP,
      }
    );

    if (!this.state.stringsLoaded) {
      return (
        <SpinnerContainer
          className={`site-loader-spinner`}
          loading={true}
          mode={SpinnerDisplayMode.fullPage}
          iconFontSize={"3rem"}
        />
      );
    }

    const { globalError } = this.state;
    const showDebugger = this.state.firehoseContentItems.length > 0;
    const isSeasonsPage = this.state.currentPath?.includes("/Seasons");

    return (
      <SpinnerContainer
        className={`site-loader-spinner`}
        loading={!this.settingsLoaded}
        delayRenderUntilLoaded={true}
        mode={SpinnerDisplayMode.fullPage}
        loadingLabel={Localizer.Nav.siteloadinglabel}
        iconFontSize={"3rem"}
      >
        <Helmet>
          <html
            className={htmlClassList}
            lang={Localizer.CurrentCultureSpecific}
          />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Bungie.net" />
          <meta
            property="og:locale"
            content={Localizer.CurrentCultureSpecific.replace("-", "_")}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Bungie" />
          <meta name="twitter:creator" content="@Bungie" />
          <meta
            name="twitter:app:url:iphone"
            content={`bungie://bungie.net/${Localizer.CurrentCultureSpecific}`}
          />
          <meta
            name="twitter:app:url:ipad"
            content={`bungie://bungie.net/${Localizer.CurrentCultureSpecific}`}
          />
          <meta
            name="twitter:app:url:googleplay"
            content={`bungie://bungie.net/${Localizer.CurrentCultureSpecific}`}
          />
          <meta name="twitter:domain" content="Bungie.net" />
          <meta name="twitter:app:name:iphone" content="Bungie Mobile" />
          <meta name="twitter:app:name:ipad" content="Bungie Mobile" />
          <meta name="twitter:app:name:googleplay" content="Bungie Mobile" />
          <meta name="twitter:app:id:iphone" content="id441444902" />
          <meta name="twitter:app:id:ipad" content="id441444902" />
          <meta
            name="twitter:app:id:googleplay"
            content="com.bungieinc.bungiemobile"
          />
        </Helmet>

        <div id={`app-layout`}>
          {/** Bug #796153:  https://github.com/ipatate/react-router-scroll-memory - Keeps track of scroll position per-page */}
          <Suspense fallback={<div />}>
            <ScrollMemory />
          </Suspense>

          {this.state.definitionsLoading &&
            !destiny2Disabled &&
            !isSeasonsPage && (
              <SpinnerContainer
                loading={true}
                mode={SpinnerDisplayMode.fullPage}
                loadingLabel={Localizer.Destiny.LoadingDestinyData}
              />
            )}

          {!this.state.hideNavigation && (
            <>
              <Suspense fallback={<div />}>
                <EmailValidationGlobalBar />
              </Suspense>
              <NavVisibilityListener />
              <MainNavigation
                history={this.props.history}
                currentPath={this.state.currentPath}
              />
            </>
          )}

          <div id={`main-content`}>
            {globalError.length > 0 && (
              <GlobalErrorModal errorString={globalError} />
            )}
            <BasicErrorBoundary>{this.props.children}</BasicErrorBoundary>
          </div>

          {showDebugger && (
            <Suspense fallback={<div />}>
              <FirehoseDebugger
                contentItems={this.state.firehoseContentItems}
              />
            </Suspense>
          )}

          {!this.state.hideNavigation && (
            <>
              <div className={`service-alert`}>
                {useContentstackGlobalAlerts ? (
                  <ServiceAlertBar />
                ) : (
                  <GlobalAlerts />
                )}
              </div>
              <Suspense fallback={<Spinner on={true} />}>
                <Footer coreSettings={this.state.globalState.coreSettings} />
              </Suspense>
            </>
          )}
        </div>

        <CookieConsent history={this.props.history} />
      </SpinnerContainer>
    );
  }
}

export default withRouter(AppLayout);
