export class CookieUtils {
  /**
   * Given a cookie string value, return a key-value pair object.
   * @param cookieValue
   */
  public static ParseCookiePairs(cookieValue: string): any {
    const kv = {};
    if (cookieValue) {
      const pairs = cookieValue.split("&");
      pairs.forEach((pair) => {
        const kvArray = pair.split("=");
        kv[kvArray[0]] = kvArray[1];
      });
    }

    return kv;
  }
}
