"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BungieNetLocaleMap = void 0;
const LocaleMap = {
  pl: "pl-pl",
  en: "en-us",
};
/**
 * Convert Bungie locales to ContentStack locales. If the input locale is not found in the map, we will assume it is the same for both.
 * @param {string} bungieLocale The current locale code
 * @returns {string} The equivalent ContentStack locale
 */
const BungieNetLocaleMap = (bungieLocale) => {
  if (!bungieLocale) {
    throw new Error("bungieLocale was not provided");
  }
  const mappedValue = LocaleMap[bungieLocale];
  return mappedValue ?? bungieLocale;
};
exports.BungieNetLocaleMap = BungieNetLocaleMap;
//# sourceMappingURL=BungieNetLocaleMap.js.map
