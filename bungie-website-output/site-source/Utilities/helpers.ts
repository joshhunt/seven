import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UrlUtils } from ".//UrlUtils";

declare var __BUILDHASH__: string;

export const BuildVersion = __BUILDHASH__;
export type Environment =
  | "local"
  | "internal"
  | "near"
  | "dev"
  | "next"
  | "bvt"
  | "alpha"
  | "beta"
  | "six"
  | "seven"
  | "live";

export const EnumKey = <TEnum>(enumVal: any, enumObj: TEnum) => {
  return ((enumObj as any)[enumVal] as unknown) as keyof typeof enumObj;
};

/**
 * Normalizes an image path
 * @param path The path to the image (not including the /7/ca part)
 */
export const Img = (path: string) => {
  return `${UrlUtils.AppBaseUrl}/ca/${path}`;
};

/**
 * Takes in an ordered array of filters and returns values array sorted in order of matching those filter
 * @param filters Array of callback functions that should filter the values array in order
 *  * @param values Array of values to be sorted of the same type as can be passed into each filter
 */
export const sortUsingFilterArray = <T>(
  values: T[],
  filters: ((x: T) => boolean)[]
): T[] => {
  return values.sort((a: any, b: any) => {
    let aFirstMatch = filters.findIndex((filter) => filter(a));
    let bFirstMatch = filters.findIndex((filter) => filter(b));

    aFirstMatch = aFirstMatch !== -1 ? aFirstMatch : filters.length;
    bFirstMatch = bFirstMatch !== -1 ? bFirstMatch : filters.length;

    return aFirstMatch - bFirstMatch;
  });
};
