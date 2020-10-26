export class ObjectUtils {
  /**
   * Convert a key-value pair object to a query-string-style string. (e.g. {a:1, b:2} -> a=1&b=2)
   * @param item
   */
  public static objectToKvpString(item: any) {
    const keys = Object.keys(item);
    const kvps = keys.map((key) => `${key}=${item[key]}`);

    return kvps.join("&");
  }

  private static isObject(item: any) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
}
