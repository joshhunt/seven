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

  /**
   * Encodes a JSON object into a URL-safe Base64 string (Base64URL).
   * This format is required by Qualtrics for the Q_EED query parameter.
   * It replaces '+' with '-', '/' with '_', and removes trailing '=' padding.
   *
   * @param data The JSON object to encode.
   * @returns A URL-safe Base64 encoded string.
   * @throws {Error} If the data cannot be stringified (e.g., circular references).
   */
  public static jsonToBase64Url(data: Record<string, any>): string {
    try {
      const jsonString = JSON.stringify(data);

      let base64: string;

      // Use the appropriate encoding method for the environment
      if (typeof window !== "undefined" && typeof window.btoa === "function") {
        // Browser environment: ensure proper handling of Unicode
        // encodeURIComponent -> unescape trick converts UTF-8 to Latin1 for btoa
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - unescape is deprecated but acceptable for this conversion
        base64 = window.btoa(unescape(encodeURIComponent(jsonString)));
      } else {
        // Node/SSR environment
        base64 = Buffer.from(jsonString, "utf-8").toString("base64");
      }

      // Make the Base64 string URL-safe
      return base64
        .replace(/\+/g, "-") // Replace '+' with '-'
        .replace(/\//g, "_") // Replace '/' with '_'
        .replace(/=+$/, ""); // Remove trailing '=' padding
    } catch (error) {
      console.error("Failed to encode JSON to Base64URL:", error);
      throw new Error("Invalid data provided for encoding.");
    }
  }

  private static isObject(item: any) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
}
