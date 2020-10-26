import { Logger } from "@Global/Logger";

class BrowserStorage {
  protected facility: Storage = null;

  constructor(facility: Storage) {
    this.facility = facility;
  }

  /**
   * Safely gets an item from Local or SessionStorage if storage is available
   * @param key The item's storage key
   */
  public getItem(key: string): any {
    try {
      return this.facility.getItem(key);
    } catch (e) {
      Logger.error(e);
    }

    return null;
  }

  /**
   * Safely gets the item at the index specified
   * @param index
   */
  public key(index: number): string {
    try {
      return this.facility.key(index);
    } catch (e) {
      Logger.error(e);
    }

    return null;
  }

  /**
   * Safely sets an item for the facility
   * @param key
   * @param value
   */
  public setItem(key: string, value: string): boolean {
    try {
      this.facility.setItem(key, value);

      return true;
    } catch (e) {
      Logger.error(e);
    }

    return false;
  }

  /**
   * Safely removes an item
   * @param key
   */
  public removeItem(key: string): boolean {
    try {
      this.facility.removeItem(key);

      return true;
    } catch (e) {
      Logger.error(e);
    }

    return false;
  }

  /** Clears the specified storage */
  public clear(): boolean {
    try {
      this.facility.clear();

      return true;
    } catch (e) {
      Logger.error(e);
    }

    return false;
  }
}

export const LocalStorageUtils = new BrowserStorage(localStorage);
export const SessionStorageUtils = new BrowserStorage(sessionStorage);
