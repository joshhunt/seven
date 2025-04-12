import { BungieMembershipType } from "@Enum";

export class EnumUtils {
  /**
   * Checks for a flag in a flag's value
   * @param flag The flag to check for
   * @param flagsEnum The value to check the flag for
   */
  public static hasFlag(flag: number, flagsEnum: any): boolean {
    return !!(flagsEnum & flag);
  }

  /**
   * Get the string keys of an enum as an array (excludes the numeric keys)
   * @param enumType The enum type in question (e.g. Globals.BungieMembershipType)
   */
  public static getStringKeys<T>(enumType: any) {
    return Object.keys(enumType).filter((a: string) =>
      isNaN(parseInt(a))
    ) as (keyof typeof enumType)[];
  }

  /**
   * Returns the string value from an enum, whether or not that value is already a string value
   * @param enumValue The value from the enum (e.g. BungieMembershipType.TigerXbox)
   * @param enumType The enum itself (e.g. BungieMembershipType)
   * @returns The string value of the enum in question (e.g. BungieMembershipType.TigerXbox => "TigerXbox");
   */
  public static getStringValue<T extends object>(
    enumValue: string | number,
    enumType: T
  ): EnumStrings<T> {
    if (!(enumValue in enumType)) {
      throw new Error(
        `${enumValue} is not a valid value of the given enum type ${JSON.stringify(
          enumType
        )}`
      );
    }

    return isNaN(parseInt(enumValue as string))
      ? (enumValue as EnumStrings<T>)
      : ((enumType as any)[enumValue] as EnumStrings<T>);
  }

  /**
   * Returns the number value from an enum, whether or not that value is already a number value
   * @param enumValue The value from the enum (e.g. BungieMembershipType.TigerXbox)
   * @param enumType The enum itself (e.g. BungieMembershipType)
   * @returns The number value of the enum in question (e.g. BungieMembershipType.TigerXbox => 1);
   */
  public static getNumberValue<T extends object>(
    enumValue: string | number,
    enumType: T
  ): number {
    if (!(enumValue in enumType)) {
      throw new Error(
        `${enumValue} is not a valid value of the given enum type ${JSON.stringify(
          enumType
        )}`
      );
    }

    return isNaN(parseInt(enumValue as string))
      ? ((enumType as any)[enumValue] as number)
      : (enumValue as number);
  }

  /**
   * Returns true if both enum values equate to the same value in the given enum
   * @param enumValue1
   * @param enumValue2
   * @param enumType True if the given enums are equivalent values within the given enum (e.g. "2" / 2 / BungieMembershipType.TigerPSN)
   */
  public static looseEquals<T extends object>(
    enumValue1: string | number,
    enumValue2: string | number,
    enumType: T
  ): boolean {
    if (!enumValue1 || !enumValue2) {
      return false;
    }

    const val1AsString = EnumUtils.getStringValue(enumValue1, enumType);
    const val2AsString = EnumUtils.getStringValue(enumValue2, enumType);

    return val1AsString === val2AsString;
  }

  /**
   * Returns the enum value given a string or number and the enum type
   * @param value The string or number to get the enum for (e.g. "TigerXbox", "1", or 1)
   * @param enumType The enum itself (e.g. BungieMembershipType)
   * @returns The enum value (e.g. BungieMembershipType.TigerXbox)
   */
  public static getEnumValue<T extends object>(
    value: string | number,
    enumType: T
  ): T[keyof T] {
    // If it's a number or numeric string, try to get the enum by its numeric value
    if (!isNaN(Number(value))) {
      const numValue = Number(value);
      // Check if this numeric value exists in the enum
      const stringKey = Object.keys(enumType).find(
        (key) => (enumType as any)[key] === numValue
      );

      if (stringKey && isNaN(parseInt(stringKey))) {
        return (enumType as any)[stringKey];
      }
    }

    // If it's a string that directly matches an enum key
    if (
      typeof value === "string" &&
      Object.keys(enumType).includes(value) &&
      isNaN(parseInt(value))
    ) {
      return (enumType as any)[value];
    }

    // Handle case-insensitive string matching
    if (typeof value === "string") {
      const stringKeys = EnumUtils.getStringKeys(enumType);
      const matchingKey = stringKeys.find(
        (key) => key.toString().toLowerCase() === value.toLowerCase()
      );

      if (matchingKey) {
        return (enumType as any)[matchingKey];
      }
    }

    throw new Error(
      `${value} could not be mapped to a valid value in the given enum type`
    );
  }
}
