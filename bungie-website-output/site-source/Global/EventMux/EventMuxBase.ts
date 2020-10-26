import { EventMuxStorage } from "@Global/EventMux/EventMuxStorage";
import {
  EventMuxSubManager,
  IEventMuxSubscriptionParams,
} from "@Global/EventMux/EventMuxSubManager";
import { EventMuxTabManager } from "@Global/EventMux/EventMuxTabManager";
import { Logger } from "@Global/Logger";
import { Notifications } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";

class EventMuxBase {
  /**
   * If true, user is authenticated
   * @returns {boolean}
   */
  public get isAuthed(): boolean {
    return UserUtils.hasAuthenticationCookie;
  }

  /**
   * If true, EventMux is currently active and polling
   * @returns {boolean}
   */
  public get isActive(): boolean {
    return this.tabManager.isActive();
  }

  public static Instance = new EventMuxBase();

  public lastSeqStored = 0;

  public storageValues = {
    OverlordTabReplaced: 0,
  };
  public storage: EventMuxStorage;

  private subManager: EventMuxSubManager;
  private tabManager: EventMuxTabManager;

  /**
   * Create EventMux
   * @returns {}
   */
  public initialize() {
    this.storage = new EventMuxStorage();

    this.subManager = new EventMuxSubManager();

    if (!this.isAuthed) {
      Logger.warn("User is not authenticated. Resetting and disabling");
      this.storage.destroy();

      return;
    }

    this.tabManager = new EventMuxTabManager();
  }

  public destroy() {
    if (this.storage) {
      this.storage.destroy();
    }

    if (this.tabManager) {
      this.tabManager.destroy();
    }

    this.lastSeqStored = 0;
    this.storageValues = {
      OverlordTabReplaced: 0,
    };

    EventMuxBase.Instance = new EventMuxBase();
  }

  public isCurrentTabOverlord(): boolean {
    return this.tabManager.isCurrentTabOverlord();
  }

  public subscribe(
    callback: (newData: Notifications.RealTimeEventData) => void,
    input: IEventMuxSubscriptionParams = null,
    updateOnSubscribe = true
  ) {
    if (!this.subManager) {
      Logger.errorVerbose("EventMux not instantiated - cannot subscribe");

      return null;
    }

    return this.subManager.observe(callback, input, updateOnSubscribe);
  }
}

export const EventMux = EventMuxBase.Instance;
