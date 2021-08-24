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
}
