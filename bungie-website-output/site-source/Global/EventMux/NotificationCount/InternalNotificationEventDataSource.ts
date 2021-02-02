import * as Globals from "@Enum";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import { Notifications } from "@Platform";
import { EventMux } from "../EventMuxBase";
import {
  BnetNotification,
  InternalNotificationDistributor,
  NotificationTypes,
} from "./InternalNotificationDistributor";

interface FriendCounts {
  Xuid: number;
  Psnid: number;
}

export class InternalNotificationEventDataSource {
  private readonly distributor: InternalNotificationDistributor;
  private readonly friendCounts: FriendCounts;
  private readonly notificationSource = "eventing";
  private readonly unsubscribers: DestroyCallback[] = [];

  constructor(distributor: InternalNotificationDistributor) {
    this.distributor = distributor;

    this.friendCounts = {
      Xuid: 0,
      Psnid: 0,
    };
  }

  public initialize() {
    this.addListeners();
  }

  public destroy() {
    DataStore.destroyAll(...this.unsubscribers);
  }

  public addListeners() {
    this.unsubscribers.push(
      EventMux.subscribe(
        this.onNotificationsChanged,
        {
          eventType: Globals.RealTimeEventType.NotificationsChanged,
        },
        false
      ),
      EventMux.subscribe(
        this.onMessageCountsChanged,
        {
          eventType: Globals.RealTimeEventType.MessageCounts,
        },
        false
      ),
      EventMux.subscribe(
        this.onFriendCountsChanged,
        {
          eventType: Globals.RealTimeEventType.FriendCounts,
        },
        false
      ),
      EventMux.subscribe(
        this.onAnnouncementsChanged,
        {
          eventType: Globals.RealTimeEventType.Announcements,
        },
        false
      )
    );
  }

  private readonly onNotificationsChanged = (
    update: Notifications.RealTimeEventData
  ) => {
    const count: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.NotificationCount,
      notificationCount: update.notificationCount,
    };

    this.distributor.broadcast(count);
  };

  private readonly onMessageCountsChanged = (
    update: Notifications.RealTimeEventData
  ) => {
    const privateMessageCount: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.MessageCount,
      messageCount: update.privateMessageCount,
    };

    this.distributor.broadcast(privateMessageCount);

    const groupMessageCount: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.GroupMessageCount,
      groupMessageCount: update.externalMessageCount,
    };

    this.distributor.broadcast(groupMessageCount);
  };

  private readonly onFriendCountsChanged = (
    update: Notifications.RealTimeEventData
  ) => {
    if (update.friendCounts["Xuid"] !== undefined) {
      this.friendCounts.Xuid = update.friendCounts["Xuid"];
    }

    if (update.friendCounts["Psnid"] !== undefined) {
      this.friendCounts.Psnid = update.friendCounts["Psnid"];
    }

    const total = this.friendCounts.Xuid + this.friendCounts.Psnid;

    const count: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.OnlineFriendCount,
      onlineFriendCount: total,
    };

    this.distributor.broadcast(count);

    const reauth: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.ProviderNeedsReauth,
      providersNeedingReauth: update.needsReauth,
    };

    this.distributor.broadcast(reauth);
  };

  private readonly onAnnouncementsChanged = (
    update: Notifications.RealTimeEventData
  ) => {
    const response: BnetNotification = {
      source: this.notificationSource,
      notificationType: NotificationTypes.Announcements,
      acks: update.announcements,
    };

    this.distributor.broadcast(response);
  };
}
