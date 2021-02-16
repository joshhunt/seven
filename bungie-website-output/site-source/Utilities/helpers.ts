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
