import {
  LocalStorageUtils,
  SessionStorageUtils,
} from "@Utilities/StorageUtils";

export class EventMuxStorage {
  public static storageKeys = {
    OverlordTabId: "eventMux.overlordTabId",
    OverlordTabProofPoll: "eventMux.overlordTabProofPoll",
    StoredResponse: "eventMux.storedResponse",
    LastSeqStored: "eventMux.lastStoredSeq",
    TabId: "eventMux.tabId",
    UnloadFlag: "eventMux.unloadFlag",
    IsActive: "eventMux.isActive",
  };
  private callbacks: Function[] = [];

  /**
   * Storage - Handles how EventMux interfaces with localStorage and sessionStorage
   * @returns {}
   */
  constructor() {
    this.setupListeners();
  }

  public addCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  public destroy() {
    this.callbacks = [];

    const keys = Object.keys(EventMuxStorage.storageKeys);
    const vals = keys.map((key) => EventMuxStorage.storageKeys[key]);

    vals.forEach((val) => LocalStorageUtils.removeItem(val));
    vals.forEach((val) => SessionStorageUtils.removeItem(val));
  }

  /**
   * Set localStorage item
   * @param key - localStorage dictionary key
   * @param val - localStorage dictionaryva lue
   * @param triggerStorageEvent - if True, customStorage event will be triggered
   * @returns {}
   */
  public setItem(key: string, val: string, triggerStorageEvent = false) {
    const setItem = LocalStorageUtils.setItem(key, val);

    if (triggerStorageEvent) {
      window.dispatchEvent(
        new CustomEvent("customStorage", { detail: "EventMux" })
      );
    }

    return setItem;
  }

  /**
   * Set sessionStorage item
   * @param key - sessionStorage dictionary key
   * @param val - sessionStorage dictionary value
   * @returns {}
   */
  public sessionSetItem(key: string, val: string) {
    return SessionStorageUtils.setItem(key, val);
  }

  /**
   * Get localStorage item
   * @param key - localStorage dictionary key
   * @returns {}
   */
  public getItem(key: string) {
    return LocalStorageUtils.getItem(key);
  }

  /**
   * Remove localStorage item
   * @param key - sessionStorage dictionary key
   * @param triggerStorageEvent - if True, customStorage event will be triggered
   * @returns {}
   */
  public removeItem(key: string, triggerStorageEvent = false) {
    const removeItem = LocalStorageUtils.removeItem(key);

    if (triggerStorageEvent) {
      window.dispatchEvent(
        new CustomEvent("customStorage", { detail: "EventMux" })
      );
    }

    return removeItem;
  }

  /********
	 PUBLIC EVENTS
	 ********/

  private setupListeners() {
    window.addEventListener("storage", this.onStorage);
    window.addEventListener("customStorage", this.onStorage);
  }

  private readonly onStorage = (event) => {
    const eventTypeString =
      event.type === "storage" ? event["key"] : event["detail"];
    if (eventTypeString.match(/eventmux/gi)) {
      this.callbacks.map((callback) => {
        callback();
      });
    }
  };
}
