import { Content } from "@Platform";
import Cookies from "js-cookie";
import moment from "moment";
import { Localizer } from "@Global/Localizer";
import { DetailedError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { CookieUtils } from "./CookieUtils";
import { ConfigUtils } from "./ConfigUtils";
import { ObjectUtils } from "./ObjectUtils";

export class LocalizerUtils {
  public static urlLocaleRegex = /.*\/7\/([a-zA-Z\-]{2,6}).*/gi;

  private static cachedCurrentCultureName: string = null;

  /** Get the current culture name */
  public static get currentCultureName() {
    if (!this.cachedCurrentCultureName) {
      this.setCurrentCultureName();
    }

    if (
      this.cachedCurrentCultureName === undefined ||
      this.cachedCurrentCultureName !== this.locCookie?.lc
    ) {
      this.setCurrentCultureName();
    }

    return this.cachedCurrentCultureName;
  }

  public static get currentCultureSpecific() {
    return Localizer.validLocales.find(
      (a) => a.name === this.currentCultureName
    ).specific;
  }

  /** Clear the in-memory cache of the current cookie locale value */
  public static invalidateCookieCache() {
    this.cachedCurrentCultureName = null;
  }

  private static setCurrentCultureName() {
    const defaultLocale = "en";
    const locale = this.cookieLocale || this.urlLocale || defaultLocale;
    this.cachedCurrentCultureName = locale;
  }

  /** Get the value of the loc cookie */
  public static get locCookie(): { lc: string; lcin: string } {
    let locCookie = null;
    const cookie = Cookies.get("bungleloc");
    if (cookie) {
      locCookie = CookieUtils.ParseCookiePairs(cookie);
    }

    return locCookie;
  }

  /** Get the current locale directly from the cookie */
  public static get cookieLocale() {
    const cookie = this.locCookie;

    return cookie ? cookie.lc : null;
  }

  /** Get the current value of the loc inherit */
  public static get locInherit() {
    if (ConfigUtils.EnvironmentIsProduction) {
      return true;
    }

    const cookie = this.locCookie;
    let lcin = false;
    if (cookie) {
      lcin = cookie.lcin === "true";
    }

    return lcin;
  }

  /** Get the locale from the currently location */
  public static get urlLocale() {
    const matches = new RegExp(this.urlLocaleRegex).exec(location.href);

    return matches && matches.length > 1 ? matches[1] : "";
  }

  /**
   * Set the cookie locale
   * @param locale The locale to use
   */
  public static updateCookieLocale(locale: string) {
    Cookies.set(
      "bungleloc",
      ObjectUtils.objectToKvpString({
        lc: locale,
        lcin: String(this.locInherit),
      }),
      {
        expires: moment().add(7, "years").toDate(),
      }
    );

    this.invalidateCookieCache();
  }

  /**
   * Returns the string name of a membership type
   * @param membershipType
   */
  public static getPlatformNameFromMembershipType(
    membershipType: BungieMembershipType
  ) {
    switch (membershipType) {
      case BungieMembershipType.TigerPsn:
        return Localizer.Registration.networksigninoptionplaystation;
      case BungieMembershipType.TigerXbox:
        return Localizer.Registration.networksigninoptionxbox;
      case BungieMembershipType.TigerBlizzard:
        return Localizer.Registration.networksigninoptionblizzard;
      case BungieMembershipType.TigerSteam:
        return Localizer.Registration.NetworkSignInOptionSteam;
      case BungieMembershipType.TigerStadia:
        return Localizer.Registration.NetworkSignInOptionStadia;
      case BungieMembershipType.BungieNext:
        return "Bungie.net";
      case BungieMembershipType.TigerDemon:
        return "Demonware";
      default:
        throw new DetailedError(
          "Localizer",
          `The membershipType '${BungieMembershipType[membershipType]}' is not a valid Destiny platform.`
        );
    }
  }

  /**
   * Gets the abbreviated name of a platform
   * @param membershipType
   */
  public static getPlatformAbbrForMembershipType(
    membershipType: BungieMembershipType
  ) {
    return Localizer.Registration[
      `MembershipAbbreviation${BungieMembershipType[membershipType]}`
    ];
  }

  /**
   * Convert a Firehose StringCollection to a Localizer-esque object
   * @param stringCollection
   */
  public static stringCollectionToObject(
    stringCollection: Content.ContentItemPublicContract
  ): { [key: string]: string } | null {
    if (!stringCollection?.properties?.["Entries"]) {
      return null;
    }

    const data = stringCollection.properties["Entries"] as {
      key: string;
      value: string;
    }[];

    return data.reduce((acc, item) => {
      acc[item.key] = item.value;

      return acc;
    }, {} as { [key: string]: string });
  }
}
