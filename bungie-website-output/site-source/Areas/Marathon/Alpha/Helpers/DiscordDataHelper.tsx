// Created by larobinson, 2025
// Copyright Bungie, Inc.
export class DiscordDataHelper {
  private static DISCORD_NAME_PARAM: string = "discordName";
  private static DISCORD_ID_PARAM: string = "discordId";

  public static getDiscordNameFromUrl(url: string): string {
    let discordName = "";
    const discordnameIndex = url.lastIndexOf("discordName=");

    if (discordnameIndex !== -1) {
      const fullDiscordParam = url.substring(
        discordnameIndex + "discordName=".length
      );
      const ampersandIndex = fullDiscordParam.indexOf("&");
      const discordNameRaw =
        ampersandIndex !== -1
          ? fullDiscordParam.substring(0, ampersandIndex)
          : fullDiscordParam;
      discordName = decodeURIComponent(discordNameRaw);
    }

    return discordName;
  }

  public static storeDiscordNameInSession(discordName: string) {
    sessionStorage.setItem(this.DISCORD_NAME_PARAM, discordName);
  }

  public static storeDiscordIdInSession(discordId: string) {
    sessionStorage.setItem(this.DISCORD_ID_PARAM, discordId);
  }

  public static fetchDiscordName = (url: string) => {
    const sessionDiscordName = sessionStorage.getItem(this.DISCORD_NAME_PARAM);
    if (sessionDiscordName) {
      return sessionDiscordName;
    }

    const urlDiscordName = this.getDiscordNameFromUrl(url);
    if (urlDiscordName) {
      this.storeDiscordNameInSession(urlDiscordName);
      return urlDiscordName;
    }

    return "";
  };

  public static fetchDiscordId = (url: string) => {
    const discordIdIndex = url.indexOf(this.DISCORD_ID_PARAM + "=");

    if (discordIdIndex !== -1) {
      const fullIdParam = url.substring(
        discordIdIndex + this.DISCORD_ID_PARAM.length + 1
      );
      const ampersandIndex = fullIdParam.indexOf("&");
      const discordIdRaw =
        ampersandIndex !== -1
          ? fullIdParam.substring(0, ampersandIndex)
          : fullIdParam;
      const discordId = decodeURIComponent(discordIdRaw);

      this.storeDiscordIdInSession(discordId);

      return discordId;
    }

    const sessionDiscordId = sessionStorage.getItem(this.DISCORD_ID_PARAM);
    if (sessionDiscordId) {
      return sessionDiscordId;
    }

    return "";
  };

  /**
   * Clears all Discord-related data from sessionStorage.
   * Call this function when a user logs out to ensure Discord credentials are removed.
   *
   * @returns {void}
   */
  public static clearDiscordData(): void {
    sessionStorage.removeItem(this.DISCORD_NAME_PARAM);
    sessionStorage.removeItem(this.DISCORD_ID_PARAM);
  }

  /**
   * Validation utilities for Discord usernames and IDs
   */

  /**
   * Validates a Discord username according to Discord's rules:
   * - Between 2 and 32 characters long
   * - Can contain alphanumeric characters, underscores, and periods
   * - Cannot start with a number, underscore or period
   * - Cannot have multiple consecutive periods
   * - Cannot have leading or trailing periods or underscores
   */
  public static isValidDiscordUsername(
    username: string
  ): { valid: boolean; message?: string } {
    if (!username) {
      return { valid: false, message: "Username cannot be empty" };
    }

    if (username.length < 2 || username.length > 32) {
      return {
        valid: false,
        message: "Username must be between 2 and 32 characters long",
      };
    }

    // Check for valid characters (letters, numbers, underscores, periods)
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      return {
        valid: false,
        message:
          "Username can only contain letters, numbers, periods and underscores",
      };
    }

    // Cannot start with a number, underscore or period
    // if (/^[0-9._]/.test(username)) {
    // 	return { valid: false, message: "Username cannot start with a number, period, or underscore" };
    // }

    // Cannot have consecutive periods
    if (username.includes("..")) {
      return {
        valid: false,
        message: "Username cannot contain consecutive periods",
      };
    }

    // Cannot have leading/trailing periods or underscores
    // if (/^[._]|[._]$/.test(username)) {
    // 	return { valid: false, message: "Username cannot start or end with a period or underscore" };
    // }

    return { valid: true };
  }

  /**
   * Validates a Discord discriminator (the 4-digit number after #)
   * Note: Discord is phasing these out with their new username system,
   * Use the isValidDiscordUser function to handle legacy and modern usernames
   */
  public static isValidDiscordDiscriminator(
    discriminator: string
  ): { valid: boolean; message?: string } {
    if (!discriminator) {
      return { valid: false, message: "Discriminator cannot be empty" };
    }

    // Must be exactly 4 digits
    if (!/^\d{4}$/.test(discriminator)) {
      return {
        valid: false,
        message: "Discriminator must be exactly 4 digits",
      };
    }

    return { valid: true };
  }

  /**
   * Validates a Discord ID (Snowflake)
   * Discord IDs are unique identifiers known as Snowflakes
   * They are 64-bit integers, typically represented as strings
   */
  public static isValidDiscordId(
    id: string
  ): { valid: boolean; message?: string } {
    if (!id) {
      return { valid: false, message: "Discord ID cannot be empty" };
    }

    // Must be numeric only
    if (!/^\d+$/.test(id)) {
      return { valid: false, message: "Discord ID must contain only numbers" };
    }

    console.log(id, id.length);
    // Typically 17-19 digits long
    if (id.length < 17 || id.length > 19) {
      return {
        valid: false,
        message: "Discord ID should be 17-19 digits long",
      };
    }

    // Additional validation - check if it's within a valid timestamp range
    // Discord snowflakes start from a specific epoch (January 1, 2015)
    // This is a very basic check and might need adjustments
    const snowflake = BigInt(id);
    const shiftedSnowflake = snowflake >> BigInt(22);
    const discordEpoch = BigInt(1420070400000);
    const timestamp = Number(shiftedSnowflake + discordEpoch); // Convert to timestamp
    const date = new Date(timestamp);

    // Check if date is after Discord's epoch (2015) and not in the future
    if (date < new Date("2015-01-01") || date > new Date()) {
      return {
        valid: false,
        message: "Discord ID represents an invalid timestamp",
      };
    }

    return { valid: true };
  }

  /**
   * Validates a modern Discord username (with or without discriminator)
   * Handles both legacy username#discriminator format and new username format
   */
  public static isValidDiscordUser(
    userIdentifier: string
  ): { valid: boolean; message?: string } {
    if (!userIdentifier) {
      return { valid: false, message: "User identifier cannot be empty" };
    }

    // Check for legacy username#discriminator format
    if (userIdentifier.includes("#")) {
      const [username, discriminator] = userIdentifier.split("#");

      const usernameValidation = DiscordDataHelper.isValidDiscordUsername(
        username
      );
      if (!usernameValidation.valid) {
        return usernameValidation;
      }

      return DiscordDataHelper.isValidDiscordDiscriminator(discriminator);
    }

    // Modern username format
    return DiscordDataHelper.isValidDiscordUsername(userIdentifier);
  }
}
