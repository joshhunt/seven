import BungieAnalytics from "@bungie/analytics";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { DateTime } from "luxon";
import ReactGA from "react-ga";
import { ConfigUtils } from "./ConfigUtils";
import { SessionStorageUtils } from "./StorageUtils";
import { StringUtils } from "./StringUtils";
import { UserUtils } from "./UserUtils";

interface ISession {
  sessionId: string;
  refreshDate: DateTime;
}

export class AnalyticsUtils {
  private static initSuccess = false;

  private static initOnce() {
    if (AnalyticsUtils.initSuccess) {
      return;
    }

    const reactGaTestMode = !ConfigUtils.SystemStatus(
      SystemNames.GoogleAnalytics
    );

    const hasConsent =
      UserUtils.CookieConsentIsEnabled() && UserUtils.CookieConsentIsCurrent();

    if (hasConsent) {
      ReactGA.initialize("UA-5262186-1", {
        testMode: reactGaTestMode,
        debug: reactGaTestMode,
      });

      AnalyticsUtils.initSuccess = true;
    }
  }

  /** Tracks the current page to Google Analytics */
  public static trackPage() {
    AnalyticsUtils.initOnce();

    if (
      UserUtils.CookieConsentIsEnabled() &&
      UserUtils.CookieConsentIsCurrent()
    ) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    AnalyticsUtils.trackSession();
  }

  public static trackSession() {
    if (!ConfigUtils.SystemStatus("SessionTracking")) {
      return;
    }

    const timeout = ConfigUtils.GetParameter(
      "SessionTracking",
      "SessionTimeoutSeconds",
      1800
    );

    const existingSessionItem = SessionStorageUtils.getItem("Session");
    if (existingSessionItem) {
      const now = DateTime.now();
      const existingSessionObj = JSON.parse(existingSessionItem);
      const existingSession: ISession = {
        sessionId: existingSessionObj.sessionId,
        refreshDate: DateTime.fromISO(existingSessionObj.refreshDate),
      };

      if (
        existingSession.refreshDate < DateTime.now().plus({ seconds: -timeout })
      ) {
        this.createOrUpdateSession();
      } else {
        this.createOrUpdateSession(existingSession.sessionId);
      }
    } else {
      this.createOrUpdateSession();
    }
  }

  private static createOrUpdateSession(existingSessionId?: string) {
    const newSession: ISession = {
      sessionId: existingSessionId || StringUtils.generateGuid(),
      refreshDate: DateTime.now(),
    };

    SessionStorageUtils.setItem("Session", JSON.stringify(newSession));
  }
}
