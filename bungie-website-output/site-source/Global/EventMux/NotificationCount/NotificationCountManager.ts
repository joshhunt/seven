import { EventMux } from "../EventMuxBase";
import { InternalNotificationCacheDataSource } from "./InternalNotificationCacheDataSource";
import { InternalNotificationPollingDataSource } from "./InternalNotificationPollingDataSource";
import { InternalNotificationEventDataSource } from "./InternalNotificationEventDataSource";
import { InternalNotificationViewModel } from "./InternalNotificationViewModel";
import {
  InternalNotificationDistributor,
  BnetNotification,
  NotificationTypes,
} from "./InternalNotificationDistributor";
import { Models } from "@Platform";
import { Logger } from "@Global/Logger";
import { UserUtils } from "@Utilities/UserUtils";

class NotificationCountManagerBase {
  public static Instance = new NotificationCountManagerBase();
  private readonly distributor = new InternalNotificationDistributor();
  private readonly cacheDataSource = new InternalNotificationCacheDataSource(
    this.distributor
  );
  private readonly eventDataSource = new InternalNotificationEventDataSource(
    this.distributor
  );
  public readonly viewModel = new InternalNotificationViewModel(
    this.distributor
  );
  private pollingDataSource: InternalNotificationPollingDataSource;
  private coreSettings: Models.CoreSettingsConfiguration;

  public initialize(coreSettings: Models.CoreSettingsConfiguration) {
    if (!UserUtils.hasAuthenticationCookie) {
      Logger.log("No user authenticated, stopping notification manager");

      return;
    }

    this.coreSettings = coreSettings;
    this.pollingDataSource = new InternalNotificationPollingDataSource(
      this.distributor,
      this.coreSettings
    );

    this.cacheDataSource.initialize();
    this.eventDataSource.initialize();
    this.viewModel.initialize();

    this.start();
  }

  public start() {
    // Send cache data out to everything that is listening.
    this.cacheDataSource.updateNotificationDistributor();

    this.initializePolling();
  }

  private initializePolling() {
    if (!this.cacheDataSource.hasCacheExpired()) {
      this.pollingDataSource.nextGetCounts();
    } else {
      this.pollingDataSource.getCounts();
    }
  }

  public getPollingTimeoutInMilliseconds(): number {
    let milliseconds = this.cacheDataSource.millisecondsUntilCacheExpires();

    if (milliseconds < 0) {
      milliseconds = 0;
    }

    // Timer pops two seconds after the cache expires.
    return milliseconds + 2000;
  }

  /** Helper for old getCounts() mechanism to force a fixup when eventmux is not used.
   *   This method is obsolete and should no longer be used.
   */
  public forceGetCounts() {
    this.pollingDataSource.getCounts();
  }

  private broadcastUpdates(updates: BnetNotification) {
    this.distributor.broadcast(updates);
  }

  /** Helper for old getCounts() mechanism to force a fixup when eventmux is not used.
   *   This method is obsolete and should no longer be used.
   */
  public broadcastAllUpdates(update: any, isFixup: boolean) {
    // No need to do fix up if the EventMux is active.  Notification counts will
    // be sent by the server and should be trusted.
    if (isFixup && EventMux.isActive) {
      return;
    }

    if (update.notificationCount) {
      this.broadcastUpdates({
        source: "fixup",
        notificationType: NotificationTypes.NotificationCount,
        notificationCount: update.notificationCount,
      });
    } else if (typeof update.messageCount !== "undefined") {
      this.broadcastUpdates({
        source: "fixup",
        notificationType: NotificationTypes.MessageCount,
        messageCount: update.messageCount,
      });
    } else if (typeof update.groupMessageCount !== "undefined") {
      this.broadcastUpdates({
        source: "fixup",
        notificationType: NotificationTypes.GroupMessageCount,
        messageCount: update.groupMessageCount,
      });
    }
  }

  public destroy() {
    try {
      this.cacheDataSource.destroy();
      this.eventDataSource.destroy();
      this.pollingDataSource.destroy();
      this.viewModel.destroy();
    } catch (e) {
      // ignore
    }
  }
}

export const NotificationCountManager = NotificationCountManagerBase.Instance;
