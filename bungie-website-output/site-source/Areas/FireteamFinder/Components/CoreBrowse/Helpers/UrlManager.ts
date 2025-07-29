import { UrlUtils } from "@Utilities/UrlUtils";

export class UrlManager {
  private static changeCallback: (() => void) | null = null;

  /**
   * Sets a callback to be called when URL changes
   */
  static setChangeCallback(callback: () => void): void {
    this.changeCallback = callback;
  }

  /**
   * Gets current URL parameters as an object
   */
  static getCurrentParams(): Record<string, string> {
    return UrlUtils.QueryToObject(window.location.search);
  }

  /**
   * Adds a parameter to current URL params
   */
  static addParam(key: string, value: string): Record<string, string> {
    const currentParams = this.getCurrentParams();
    currentParams[key] = value;
    return currentParams;
  }

  /**
   * Updates URL without page refresh
   */
  static updateUrl(key: string, value: string): void {
    if (key && value) {
      const currentParams = this.addParam(key, value);
      window.history.replaceState(
        null,
        null,
        window.location.pathname + `?${UrlUtils.ObjectToQuery(currentParams)}`
      );

      // Trigger callback if set
      if (this.changeCallback) {
        this.changeCallback();
      }
    }
  }

  /**
   * Updates URL with multiple parameters
   */
  static updateUrlWithParams(params: Record<string, string>): void {
    const queryString = UrlUtils.ObjectToQuery(params);
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    window.history.replaceState(null, null, newUrl);
  }

  /**
   * Clears all URL parameters
   */
  static clearUrlParams(): void {
    window.history.replaceState(null, null, window.location.pathname);
  }
}
