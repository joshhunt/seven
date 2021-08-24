import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { LocalStorageUtils } from "@Utilities/StorageUtils";
import {
  BnetNotification,
  InternalNotificationDistributor,
  NotificationTypes,
} from "./InternalNotificationDistributor";

export class InternalNotificationCacheDataSource {
  private readonly distributor: InternalNotificationDistributor;
  private readonly notificationsToCache: NotificationTypes[] = [];
  private readonly localStorageKeyPrefix = "liveUpdateItems.";
  private readonly isCountCachedLocalStorageKey = "isCountCached";
  private readonly countExpireLocalStorageKey = "countExpire";
  private readonly notificationSource = "cache";
  private static readonly DefaultGetCountsInterval = 300000;
  private readonly unsubscribers: DestroyCallback[] = [];

  constructor(distributor: InternalNotificationDistributor) {
    this.notificationsToCache = [
      NotificationTypes.Announcements,
      NotificationTypes.GroupMessageCount,
      NotificationTypes.MessageCount,
      NotificationTypes.NotificationCount,
      NotificationTypes.OnlineFriendCount,
      NotificationTypes.ProviderNeedsReauth,
    ];

    this.distributor = distributor;
  }

  public initialize() {
    this.addListeners();
  }

  public destroy() {
    DataStore.destroyAll(...this.unsubscribers);
  }

  private gatherCachedItems(): BnetNotification[] {
    const cachedItems: BnetNotification[] = [];

    for (const notification of this.notificationsToCache) {
      const updatedItemName = NotificationTypes[notification];

      if (
        LocalStorageUtils.getItem(
          this.localStorageKeyPrefix + updatedItemName
        ) !== null
      ) {
        const updatedItemValue = JSON.parse(
          LocalStorageUtils.getItem(
            this.localStorageKeyPrefix + updatedItemName
          )
        );

        updatedItemValue.source = this.notificationSource;

        cachedItems.push(updatedItemValue);
      }
    }

    return cachedItems;
  }

  public updateNotificationDistributor() {
    const cachedItems = this.gatherCachedItems();

    for (const item of cachedItems) {
      this.distributor.broadcast(item);
    }
  }

  private addListeners() {
    for (const notification of this.notificationsToCache) {
      this.unsubscribers.push(
        this.distributor.observe(this.onUpdate, {
          notificationType: notification,
        })
      );
    }
  }

  private readonly onUpdate = (notification: BnetNotification) => {
    // Cache ignores notifications it generated
    if (notification.source !== this.notificationSource) {
      const updatedItemName = NotificationTypes[notification.notificationType];

      notification.source = this.notificationSource;

      LocalStorageUtils.setItem(
        this.localStorageKeyPrefix + updatedItemName,
        JSON.stringify(notification)
      );

      this.setLocalStorageSettings();
    }
  };

  public millisecondsUntilCacheExpires() {
    const isCached =
      LocalStorageUtils.getItem(
        this.localStorageKeyPrefix + this.isCountCachedLocalStorageKey
      ) !== null
        ? true
        : false;

    if (isCached) {
      const expiresTime = LocalStorageUtils.getItem(
        this.localStorageKeyPrefix + this.countExpireLocalStorageKey
      );
      if (expiresTime !== null) {
        const currentTime = new Date().getTime();

        return expiresTime - currentTime;
      }
    }

    return 0;
  }

  public hasCacheExpired() {
    try {
      const isCached =
        LocalStorageUtils.getItem(
          this.localStorageKeyPrefix + this.isCountCachedLocalStorageKey
        ) !== null;
      const countExpire = LocalStorageUtils.getItem(
        this.localStorageKeyPrefix + this.countExpireLocalStorageKey
      );

      if (countExpire !== null) {
        const cacheIsExpired = !isCached || new Date().getTime() > countExpire;

        return cacheIsExpired;
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  }

  private setLocalStorageSettings() {
    // Set the expire date to be in the future.
    const expireDate =
      new Date().getTime() +
      InternalNotificationCacheDataSource.DefaultGetCountsInterval -
      2000;

    const isCountCachedLocalStorageKey =
      this.localStorageKeyPrefix + this.isCountCachedLocalStorageKey;
    const countExpireLocalStorageKey =
      this.localStorageKeyPrefix + this.countExpireLocalStorageKey;

    LocalStorageUtils.setItem(isCountCachedLocalStorageKey, "1");
    LocalStorageUtils.setItem(
      countExpireLocalStorageKey,
      expireDate.toString()
    );
  }
}
