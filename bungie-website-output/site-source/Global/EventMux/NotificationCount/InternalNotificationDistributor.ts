import * as Globals from "@Enum";
import { BroadcasterObserver } from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import { User } from "@Platform";

export enum NotificationTypes {
  OnlineFriendCount,
  NotificationCount,
  MessageCount,
  GroupMessageCount,
  ProviderNeedsReauth,
  Announcements,
}

export interface BnetNotification {
  notificationType: NotificationTypes;
  source: string;
  notificationCount?: number;
  messageCount?: number;
  groupMessageCount?: number;
  onlineFriendCount?: number;
  providersNeedingReauth?: Globals.BungieCredentialType[];
  acks?: { [key: string]: User.AckState };
}

// The Distributor accepts subscriptions for notification count events and distributes them to
// interested entities.
export class InternalNotificationDistributor extends DataStore<
  BnetNotification,
  DistributorParams,
  BroadcasterObserver<BnetNotification>
> {
  constructor() {
    super(null);
  }

  protected getObserversToUpdate(notification: Partial<BnetNotification>) {
    const toUpdate: BroadcasterObserver<BnetNotification>[] = [];

    this.allObservers.forEach((subscription) => {
      const matches: boolean =
        subscription.params.notificationType instanceof Array
          ? subscription.params.notificationType.indexOf(
              notification.notificationType
            ) > 0
          : subscription.params.notificationType ===
            notification.notificationType;

      if (matches) {
        toUpdate.push(subscription);
      }
    });

    return toUpdate;
  }
}

interface DistributorParams {
  notificationType: NotificationTypes | NotificationTypes[];
}
