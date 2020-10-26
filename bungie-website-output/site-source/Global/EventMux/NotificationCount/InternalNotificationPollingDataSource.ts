import { EventMux } from "../EventMuxBase";
import { Platform, Contract, Models } from "@Platform";
import { ConvertToPlatformError, PlatformResponse } from "@ApiIntermediary";
import {
  InternalNotificationDistributor,
  BnetNotification,
  NotificationTypes,
} from "./InternalNotificationDistributor";
import { NotificationCountManager } from "./NotificationCountManager";
import { PlatformError } from "@CustomErrors";
import { PlatformErrorCodes } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";

export class InternalNotificationPollingDataSource {
  private readonly distributor: InternalNotificationDistributor;
  private enabled: boolean;
  private getCountsUpdateTimer: number;
  private readonly notificationSource = "polling";

  constructor(
    distributor: InternalNotificationDistributor,
    coreSettings: Models.CoreSettingsConfiguration
  ) {
    this.distributor = distributor;
    this.enabled = ConfigUtils.SystemStatus("RealTimeCounts");
  }

  private isAuthenticated() {
    // Need to utility to do this test.
    return EventMux.isAuthed;
  }

  public destroy() {
    this.stopPolling();
  }

  public getCounts() {
    if (this.enabled && this.isAuthenticated()) {
      this.stopPolling();

      Platform.UserService.GetCountsForCurrentUser()
        .then((result: Contract.UserCounts) => {
          const friendCount: BnetNotification = {
            source: this.notificationSource,
            notificationType: NotificationTypes.OnlineFriendCount,
            onlineFriendCount: result.onlineFriendCount,
          };

          this.distributor.update(friendCount);

          const reauth: BnetNotification = {
            source: this.notificationSource,
            notificationType: NotificationTypes.ProviderNeedsReauth,
            providersNeedingReauth: result.providersNeedingReauth,
          };

          this.distributor.update(reauth);

          const notificationCount: BnetNotification = {
            source: this.notificationSource,
            notificationType: NotificationTypes.NotificationCount,
            notificationCount: result.notificationCount,
          };

          this.distributor.update(notificationCount);

          const messageCount: BnetNotification = {
            source: this.notificationSource,
            notificationType: NotificationTypes.MessageCount,
            messageCount: result.messageCount,
          };

          this.distributor.update(messageCount);

          this.nextGetCounts();
        })
        .catch(ConvertToPlatformError)
        .then((error: PlatformError) => {
          if (
            error.errorCode === PlatformErrorCodes.WebAuthRequired ||
            error.errorCode === PlatformErrorCodes.SystemDisabled
          ) {
            this.enabled = false;
          } else {
            this.nextGetCounts();
          }
        });
    }
  }

  public nextGetCounts() {
    if (!this.enabled) {
      return;
    }

    this.stopPolling();

    const timeout = NotificationCountManager.getPollingTimeoutInMilliseconds();

    this.getCountsUpdateTimer = setTimeout(() => {
      this.getCounts();
    }, timeout);
  }

  private stopPolling() {
    clearTimeout(this.getCountsUpdateTimer);
  }
}
