import { EventMuxChannelClient } from "@Global/EventMux/EventMuxChannelClient";
import { EventMuxStorage } from "@Global/EventMux/EventMuxStorage";
import { Logger } from "@Global/Logger";
import { EventMux } from "./EventMuxBase";
import { SessionStorageUtils } from "@Utilities/StorageUtils";

export class EventMuxTabManager {
  private channelClient: EventMuxChannelClient;

  private tabId: number = null;
  private overlordTabId: number = null;

  private overlordTabProofPollTimeout: number = null;
  private readonly overlordTabProofPollInterval = 15 * 1000;

  private minionTabCheckTimeout: number = null;
  private readonly minionTabCheckInterval = 30 * 1000;

  constructor() {
    EventMux.storage.addCallback(() => {
      this.onStorageUpdate();
    });

    this.setupTabId(() => {
      this.onTabIdSetupComplete(true);
    });

    this.setupListeners();
  }

  /**
   * If true, EventMux is active and polling
   * @returns {boolean}
   */
  public isActive(): boolean {
    return this.channelClient.isActive();
  }

  /**
   * Allows determining if the current tab is the overlord tab
   * @returns {boolean}
   */
  public isCurrentTabOverlord(): boolean {
    return this.tabId === this.overlordTabId;
  }

  private setupListeners() {
    let hitUnload = false;

    window.addEventListener("beforeunload", () => {
      if (hitUnload) {
        return;
      }
      hitUnload = true;
      this.setUnloadFlag();
      this.retireSelfAsOverload();
    });

    window.addEventListener("unload", () => {
      if (hitUnload) {
        return;
      }
      hitUnload = true;
      this.setUnloadFlag();
      this.retireSelfAsOverload();
    });
  }

  private setupTabId(callback: () => void = () => null) {
    Logger.logVerbose("[TabManager] Setting up Tab ID");
    this.getStoredTabId();
    if (this.tabId === null) {
      this.setNewTabId(callback);
    } else {
      callback();
    }
  }

  private getStoredTabId() {
    const wasUnloaded =
      SessionStorageUtils.getItem(EventMuxStorage.storageKeys.UnloadFlag) ===
      "true";

    // Only try to get the tab ID from sessionStorage if the page was refreshed
    if (wasUnloaded) {
      this.unsetUnloadFlag();
      this.tabId = SessionStorageUtils.getItem(
        EventMuxStorage.storageKeys.TabId
      );

      if (this.tabId !== null) {
        if (this.tabId === 0) {
          this.tabId = null;
        } else {
          Logger.logVerbose("[TabManager] Tab ID acquired from sessionStorage");
        }
      }
    } else {
      Logger.logVerbose(
        "[TabManager] Tab was never unloaded, setting new tab instead"
      );
    }
  }

  private setUnloadFlag() {
    EventMux.storage.sessionSetItem(
      EventMuxStorage.storageKeys.UnloadFlag,
      true.toString()
    );
  }

  private unsetUnloadFlag() {
    EventMux.storage.sessionSetItem(
      EventMuxStorage.storageKeys.UnloadFlag,
      false.toString()
    );
  }

  private setNewTabId(callback: () => void = () => null) {
    // This is temporary and should be replaced by a GET to the event system
    this.tabId = this.generateId();

    SessionStorageUtils.setItem(
      EventMuxStorage.storageKeys.TabId,
      String(this.tabId)
    );

    Logger.logVerbose("[TabManager] New Tab ID generated!");

    callback();
  }

  private clearTabId() {
    this.tabId = null;
    SessionStorageUtils.removeItem(EventMuxStorage.storageKeys.TabId);

    Logger.logVerbose("[TabManager] Tab ID cleared from sessionStorage");
  }

  private onTabIdSetupComplete(forceNewOverlordIfReplaced: boolean) {
    this.channelClient = new EventMuxChannelClient(this.tabId, () => {
      this.setOverlordAsReplaced();
    });

    this.tryGetSetOverlordTabTimer(true);
    Logger.logVerbose(`[TabManager] Tab ID set to ${this.tabId}`);
  }

  /**
   * When we init each tab, they will attempt to set themselves as the overlord tab if
   * no overlord tab is yet set. If a overlord tab IS set, we will set that value as
   * the overlord tab for this instance
   * @param forceNewOverlordIfReplaced If true, a new overlord tab will be set when real-time gets receive a command to replace the current overlord
   * @returns {void}
   */
  private tryGetSetOverlordTab(forceNewOverlordIfReplaced = false) {
    clearTimeout(this.overlordTabProofPollTimeout);
    clearTimeout(this.minionTabCheckTimeout);

    let overlordTabId = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.OverlordTabId
    );

    // Determines whether we want to replace the overlord even if it still exists, if it has been replaced due to too many devices
    // If the overlord was replaced, but the user does a new page refresh, they will want a new channel
    const forceUpdateDueToOverlordReplaced =
      forceNewOverlordIfReplaced &&
      overlordTabId === EventMux.storageValues.OverlordTabReplaced;

    if (overlordTabId === null || forceUpdateDueToOverlordReplaced) {
      if (forceNewOverlordIfReplaced) {
        Logger.logVerbose(
          "[TabManager] There was an overlord tab, but it was replaced. This tab will take over as overlord."
        );
      }

      overlordTabId = this.setCurrentTabToOverlord();
    } else {
      Logger.logVerbose(`[TabManager] Overlord tab ID : ${overlordTabId}`);
    }

    this.overlordTabId = overlordTabId;

    if (this.overlordTabId === this.tabId) {
      this.onOverlordTabSet();
    } else {
      Logger.logVerbose("[TabManager] This tab is a minion ");
      this.minionTabCheckForOverlord();
    }
  }

  /**
   * We call this using a timer so that we can avoid two tabs racing and both being set as overlord
   * @param forceNewOverlordIfReplaced If true, a new overlord tab will be set when real-time gets receive a command to replace the current overlord
   * @returns {void}
   */
  private tryGetSetOverlordTabTimer(forceNewOverlordIfReplaced: boolean) {
    setTimeout(() => {
      this.tryGetSetOverlordTab(forceNewOverlordIfReplaced);
    }, Math.random() * 2000);
  }

  private setCurrentTabToOverlord() {
    const overlordTabId = this.tabId;
    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.OverlordTabId,
      String(overlordTabId)
    );

    Logger.logVerbose(
      `[TabManager] Set new overlord tab ID : ${overlordTabId}`
    );

    return overlordTabId;
  }

  private onOverlordTabSet() {
    this.channelClient.startGets();
    this.overlordTabProofPoll();
  }

  /**
   * The overlord tab proves that it exists by updating a value on an interval
   * @returns {}
   */
  private overlordTabProofPoll() {
    clearTimeout(this.overlordTabProofPollTimeout);

    const updateTime = performance.now();
    EventMux.storage.setItem(
      EventMuxStorage.storageKeys.OverlordTabProofPoll,
      updateTime.toString()
    );

    this.overlordTabProofPollTimeout = setTimeout(() => {
      this.overlordTabProofPoll();
    }, this.overlordTabProofPollInterval);
  }

  /**
   * Minion tabs check the overlord tab poll value to determine if it still exists
   * @returns {}
   */
  private minionTabCheckForOverlord() {
    clearTimeout(this.minionTabCheckTimeout);

    let overlordTabStillExists = true;

    const proofPollTime = parseInt(
      EventMux.storage.getItem(EventMuxStorage.storageKeys.OverlordTabProofPoll)
    );
    const proofTimeIsInvalid = isNaN(proofPollTime);
    const proofTimeIsOld =
      performance.now() - proofPollTime > this.minionTabCheckInterval;
    const overlordTabIdInvalid = this.overlordTabId === 0;

    if (proofTimeIsInvalid || proofTimeIsOld || overlordTabIdInvalid) {
      overlordTabStillExists = false;
    }

    if (!overlordTabStillExists) {
      Logger.warn("[TabManager] Overlord tab no longer exists!");
      EventMux.storage.removeItem(EventMuxStorage.storageKeys.OverlordTabId);
      this.tryGetSetOverlordTabTimer(false);
    }

    this.minionTabCheckTimeout = setTimeout(() => {
      this.minionTabCheckForOverlord();
    }, this.minionTabCheckInterval);
  }

  private onStorageUpdate() {
    if (!EventMux.isActive) {
      Logger.warn(
        "[TabManager] EventMux is no longer active. Disabling storage updates and overlord proof time poll."
      );
      this.onStorageUpdate = () => null;
      clearTimeout(this.overlordTabProofPollTimeout);

      return;
    }

    const lastSeqStoredString = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.LastSeqStored
    );
    EventMux.lastSeqStored = parseInt(lastSeqStoredString);

    const overlordTabId = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.OverlordTabId
    );

    // If there's no overlord
    if (overlordTabId === null) {
      this.tryGetSetOverlordTabTimer(false);
    }
    // or if there is a new overlord and this one isn't an overlord anymore
    else if (
      this.tabId === EventMux.storageValues.OverlordTabReplaced &&
      overlordTabId !== EventMux.storageValues.OverlordTabReplaced
    ) {
      Logger.logVerbose(
        "[TabManager] This tab used to be an overlord, but was replaced. Making it into a minion..."
      );
      this.setNewTabId(() => {
        this.onTabIdSetupComplete(false);
      });
    }
  }

  private retireSelfAsOverload() {
    const overlordTabId = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.OverlordTabId
    );
    if (overlordTabId === this.tabId) {
      this.overlordTabId = null;
      EventMux.storage.removeItem(EventMuxStorage.storageKeys.OverlordTabId);
      Logger.logVerbose(
        `[TabManager] Tab ${this.tabId} has retired itself as overlord`
      );
    } else {
      Logger.warnVerbose(
        `[TabManager] Tab ${this.tabId} cannot retire because it is not overlord! Overlord tab is currently: ${overlordTabId}`
      );
    }
  }

  private setOverlordAsReplaced() {
    const overlordTabId = EventMux.storage.getItem(
      EventMuxStorage.storageKeys.OverlordTabId
    );
    if (overlordTabId === this.tabId) {
      Logger.warnVerbose("[TabManager] Overlord tab has been replaced!");
      this.tabId = EventMux.storageValues.OverlordTabReplaced;
      EventMux.storage.setItem(
        EventMuxStorage.storageKeys.OverlordTabId,
        String(EventMux.storageValues.OverlordTabReplaced)
      );
    } else {
      Logger.warnVerbose(
        "[TabManager] Cannot set overlord as replaced, because this tab is not the overlord"
      );
    }
  }

  private generateId() {
    let id;
    if ("crypto" in window) {
      const array = new Uint32Array(1);
      id = crypto.getRandomValues(array)[0];
    } else {
      const now = new Date();
      const startOfYear = new Date(new Date().getFullYear().toString());
      id = now.getTime() - startOfYear.getTime();
    }

    id = id & 0x7fffffff;

    return id;
  }

  public destroy() {
    this.retireSelfAsOverload();
  }
}
