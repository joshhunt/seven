import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { IDestinySkuStore } from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
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
  let unsortedValues = values;
  const sortedValues: T[] = [];

  filters.forEach((filter) => {
    unsortedValues.forEach((value) => {
      if (filter(value)) {
        sortedValues.push(value);
        unsortedValues = unsortedValues.filter((val) => val !== value);
      }
    });
  });

  return sortedValues.concat(unsortedValues);
};

/**
 * Takes in an array of strings that provides the sort order and the values that need to be sorted, returns values that are sorted
 * @param values Array of objects that require sorting
 * @param sortOrder Array of strings that set the sort order
 * @param key the key that should be used for comparison in the values
 */

export const sortUsingArraySort = <T extends Record<string, any>>(
  values: T[],
  sortOrder: string[],
  key: string
): T[] => {
  if (Array.isArray(values) && values?.length > 0) {
    // Sort stores based on the predefined store order
    return values.sort(
      (a, b) =>
        sortOrder.indexOf(a?.key?.toLowerCase()) -
        sortOrder.indexOf(b?.key?.toLowerCase())
    );
  } else {
    return values;
  }
};
