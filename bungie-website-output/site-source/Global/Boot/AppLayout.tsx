import { ContentfulFetch } from "@Contentful/ContentfulFetch";
import {
  GlobalStateContext,
  GlobalStateDataStore,
  GlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteDataStore } from "@Global/DataStore/RouteDataStore";
import { DestroyCallback, DataStore } from "@Global/DataStore";
import { BasicErrorBoundary } from "@UI/Errors/BasicErrorBoundary";
import {
  SystemDisabledError,
  DetailedError,
  SeoDataError,
} from "@UI/Errors/CustomErrors";
import { MainNavigation } from "@UI/Navigation/MainNavigation";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "./AppLayout.scss";
import { Footer } from "./Footer";
import { Localizer, StringFetcher } from "@Global/Localizer";
import { Responsive } from "./Responsive";
import classNames from "classnames";
import { CookieConsent } from "./CookieConsent";
import PCMigrationGlobalAlertBar from "@UI/GlobalAlerts/PCMigrationGlobalAlertBar";
import { BlizzardPCMigrationModalOpener } from "@UI/User/BlizzardPCMigrationModal";
import ScrollMemory from "react-router-scroll-memory";
import { EmailValidationGlobalAlertsBar } from "@UI/GlobalAlerts/EmailValidationGlobalAlertsBar";
import Helmet from "react-helmet";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import {
  DestinyDefinitions,
  ManifestPayload,
} from "@Database/DestinyDefinitions/DestinyDefinitions";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Environment } from "@Helpers";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { AnalyticsUtils } from "@Utilities/AnalyticsUtils";
import { ServiceAlertBar } from "@UI/GlobalAlerts/ServiceAlertBar";
import {
  FirehoseDebuggerDataStore,
  IFirehoseDebuggerItemData,
} from "Platform/FirehoseDebuggerDataStore";
import { FirehoseDebugger } from "@UI/Content/FirehoseDebugger";
import { GlobalFatalDataStore } from "@Global/DataStore/GlobalFatalDataStore";
import { ConfirmationModalInline } from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { RouteHelper } from "@Routes/RouteHelper";
import { GlobalErrorModal } from "@UI/UIKit/Controls/Modal/GlobalErrorModal";

interface IInternalAppLayoutState {
  currentPath: string;
  error: string;
  globalState: GlobalState<"responsive">;
  stringsLoaded: boolean;
  noWebP: boolean;
  definitionsLoading: boolean;
  firehoseContentItems: IFirehoseDebuggerItemData[];
  globalError: string[];
}

interface ILocaleParams {
  locale: string;
}

class AppLayout extends React.Component<
  RouteComponentProps<ILocaleParams>,
  IInternalAppLayoutState
> {
  private readonly unsubscribers: DestroyCallback[] = [];
  private readonly rendererCoreSystemName = "WebRendererCore";
  private initTracking = false;
  private metaTagTimer: number = null;
  private readonly modalRef = React.createRef<Modal>();

  constructor(props: RouteComponentProps<ILocaleParams>) {
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
    };
  }

  public componentDidMount() {
    GlobalStateDataStore.initialize();

    this.unsubscribers.push(
      RouteDataStore.Instance.observe((routeData) => {
        this.setState({
          currentPath: routeData.currentPath,
        });
      }),
      GlobalStateDataStore.observe(
        (data) => {
          if (data && data.coreSettings && data.coreSettings.environment) {
            ConfigUtils.setEnvironment(
              data.coreSettings.environment as Environment
            );

            // StringFetcher needs to know the environment before it can fetch, so we wait until here to do so
            StringFetcher.fetch();
            //ContentfulFetch.initialize();
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
        //this.checkMetaTags(3000);
      }),
      DestinyDefinitions.observe(
        ({ isLoading: definitionsLoading }: ManifestPayload) =>
          this.setState({ definitionsLoading }),
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
        data && this.setState({ globalError: data.error });
      })
    );

    BrowserUtils.supportsWebp().then((supportsWebp) => {
      this.setState({
        noWebP: !supportsWebp,
      });
    });
  }

  private initTrackingOnce() {
    if (this.initTracking) {
      return;
    }

    this.initTracking = true;

    this.onHistoryUpdate();

    // this.checkMetaTags(3000);
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
    this.trackPage();
    FirehoseDebuggerDataStore.clear();
  };

  private trackPage() {
    if (!this.initTracking) {
      return;
    }

    AnalyticsUtils.trackPage();
  }

  /**
   * Check for pages that need meta tags and error if not
   * @param timeout
   */
  private checkMetaTags(timeout = 1000) {
    clearTimeout(this.metaTagTimer);

    const defaultImage = "/img/theme/bungienet/logo-share-large.png";
    this.metaTagTimer = setTimeout(() => {
      const helmet = Helmet.peek();
      const metaTags = (helmet as any).metaTags as {
        content: string;
        property: string;
      }[];
      const ogImage = metaTags.find((a) => a.property === "og:image");
      const ogTitle = metaTags.find((a) => a.property === "og:title");

      const missingProperties = [];

      if (
        !ogImage ||
        ogImage.content === defaultImage ||
        ogImage.content === ""
      ) {
        if (ConfigUtils.EnvironmentIsLocal) {
          console.log(
            "%c Hey, add an 'image' attribute to BungieHelmet for this page!",
            "color: red; font-size:22px;"
          );
          const message = "This page needs an image attribute on BungieHelmet!";
          Toast.show(message, { type: "error" });
        } else {
          missingProperties.push("og:image");
        }
      }

      if (!ogTitle || ogTitle.content === "") {
        missingProperties.push("og:title");
      }

      if (missingProperties.length > 0) {
        throw new SeoDataError(missingProperties);
      }
    }, timeout);
  }

  public render() {
    if (this.settingsLoaded && !this.systemEnabled) {
      throw new SystemDisabledError(this.rendererCoreSystemName);
    }

    const responsiveClasses =
      this.state.globalState && this.state.globalState.responsive
        ? Responsive.getResponsiveClasses()
        : [];

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
    const supportId = ConfigUtils.GetParameter(
      "WebRendererCore",
      "BrowserSupportHelpArticleID",
      0
    );
    const showDebugger = this.state.firehoseContentItems.length > 0;

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
          <ScrollMemory />

          {this.state.definitionsLoading && (
            <SpinnerContainer
              loading={true}
              mode={SpinnerDisplayMode.fullPage}
              loadingLabel={Localizer.Destiny.LoadingDestinyData}
            />
          )}
          {ConfigUtils.SystemStatus("PCMigrationSunsetPhase1") && (
            <PCMigrationGlobalAlertBar />
          )}
          <EmailValidationGlobalAlertsBar />
          <MainNavigation
            history={this.props.history}
            currentPath={this.state.currentPath}
          />

          <div id={`main-content`}>
            {globalError && <GlobalErrorModal errorString={globalError} />}
            <BasicErrorBoundary>{this.props.children}</BasicErrorBoundary>
          </div>
          {showDebugger && (
            <FirehoseDebugger contentItems={this.state.firehoseContentItems} />
          )}
          <div className={`service-alert`}>
            <ServiceAlertBar />
          </div>

          <Footer coreSettings={this.state.globalState.coreSettings} />
        </div>

        <CookieConsent history={this.props.history} />
      </SpinnerContainer>
    );
  }
}

export default withRouter(AppLayout);
