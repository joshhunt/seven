import {
  DataStoreObserver,
  DataStore,
  DestroyCallback,
} from "@Global/DataStore";
import { User } from "@Platform";
import * as Globals from "@Enum";
import {
  BnetNotification,
  InternalNotificationDistributor,
  NotificationTypes,
} from "./InternalNotificationDistributor";

export interface NotificationCounts {
  notifications: number;
  messages: number;
  groupMessages: number;
  onlineFriends: number;
  acks: { [key: string]: User.AckState };
}

class NotificationCountMonitor extends DataStoreObserver<NotificationCounts> {}

export class InternalNotificationViewModel extends DataStore<
  NotificationCounts,
  NotificationCountMonitor
> {
  private readonly unsubscribers: DestroyCallback[] = [];

  constructor(private readonly distributor: InternalNotificationDistributor) {
    super(InternalNotificationViewModel.counts);
  }

  public initialize() {
    this.addSubscriptions();
  }

  public destroy() {
    DataStore.destroyAll(...this.unsubscribers);
  }

  public static counts: NotificationCounts = {
    notifications: 0,
    messages: 0,
    groupMessages: 0,
    onlineFriends: 0,
    acks: {},
  };

  private readonly notificationCount = (item: BnetNotification) => {
    InternalNotificationViewModel.counts.notifications = item.notificationCount;
    this.updateAll();
  };

  private readonly messageCount = (item: BnetNotification) => {
    InternalNotificationViewModel.counts.messages = item.messageCount;
    this.updateAll();
  };

  private readonly groupMessageCount = (item: BnetNotification) => {
    InternalNotificationViewModel.counts.groupMessages = item.groupMessageCount;
    this.updateAll();
  };

  private readonly onlineFriendCount = (item: BnetNotification) => {
    InternalNotificationViewModel.counts.onlineFriends = item.onlineFriendCount;
    this.updateAll();
  };

  private readonly acks = (item: BnetNotification) => {
    InternalNotificationViewModel.counts.acks = item.acks;
    this.updateAll();
  };

  private updateAll() {
    this.update(InternalNotificationViewModel.counts);
  }

  private providersNeedingReauth(notification: BnetNotification) {
    const providersNeedingReauth = notification.providersNeedingReauth;

    if (providersNeedingReauth && providersNeedingReauth.length > 0) {
      // something needs reauth
      for (const provider of providersNeedingReauth) {
        if (provider === Globals.BungieCredentialType.Psnid) {
          // $todo jlauer - trigger reauth subscription (this used to trigger a global jQuery CSS change)
        } else if (provider === Globals.BungieCredentialType.Xuid) {
          // $todo jlauer - trigger reauth subscription (this used to trigger a global jQuery CSS change)
        }
      }
    }
  }

  private addSubscriptions() {
    this.addSub(this.notificationCount, NotificationTypes.NotificationCount);
    this.addSub(this.messageCount, NotificationTypes.MessageCount);
    this.addSub(this.groupMessageCount, NotificationTypes.GroupMessageCount);
    this.addSub(this.onlineFriendCount, NotificationTypes.OnlineFriendCount);
    this.addSub(
      this.providersNeedingReauth,
      NotificationTypes.ProviderNeedsReauth
    );
    this.addSub(this.acks, NotificationTypes.Announcements);
  }

  private addSub(
    callback: (item: BnetNotification) => void,
    type: NotificationTypes
  ) {
    this.unsubscribers.push(
      this.distributor.observe(
        callback,
        {
          notificationType: type,
        },
        false
      )
    );
  }
}
