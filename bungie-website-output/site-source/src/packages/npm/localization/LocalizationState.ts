import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { StringFetcher } from ".";

type LocCookie = { lc: string; lcin: string };

class LocalizationState {
  public static Instance = new LocalizationState();

  public urlLocaleRegex = /.*\/7\/([a-zA-Z-]{2,6}).*/gi;

  private cachedCurrentCultureName: string | null = null;

  /** Get the current culture name */
  public get currentCultureName() {
    this.tryUpdateCachedCultureName();

    return this.cachedCurrentCultureName;
  }

  private tryUpdateCachedCultureName() {
    if (
      !this.cachedCurrentCultureName ||
      this.cachedCurrentCultureName !== this.locCookie?.lc
    ) {
      const defaultLocale = "en";
      const locale = this.cookieLocale || this.urlLocale || defaultLocale;
      this.cachedCurrentCultureName = locale;
    }
  }

  /** Clear the in-memory cache of the current cookie locale value */
  private invalidateCookieCache() {
    this.cachedCurrentCultureName = null;
  }

  /** Get the value of the loc cookie */
  private get locCookie(): LocCookie | null {
    let locCookie: LocCookie | null = null;
    const cookie = Cookies.get("bungleloc");
    if (cookie) {
      const pairs = new URLSearchParams(cookie);
      const pairEntries = (pairs as any).entries();
      locCookie = Object.fromEntries(pairEntries) as LocCookie;
    }

    return locCookie;
  }

  private redirectToNewLocale(locale: string) {
    const { pathname, search, hash } = window.location;
    const oldPath = pathname;
    const newPath = oldPath.replace(`/${this.urlLocale}/`, `/${locale}/`);

    if (newPath !== oldPath) {
      window.history.replaceState(null, oldPath, newPath + search + hash);
      StringFetcher.fetch(true);
    }
  }

  /** Get the current locale directly from the cookie */
  public get cookieLocale() {
    const cookie = this.locCookie;

    return cookie ? cookie.lc : null;
  }

  /** Get the locale from the currently location */
  public get urlLocale() {
    const matches = new RegExp(this.urlLocaleRegex).exec(location.href);

    return matches && matches.length > 1 ? matches[1] : "";
  }

  public get locInherit() {
    return true;
  }

  /**
   * Set the cookie locale
   * @param locale The locale to use
   */
  public setLocale(locale: string) {
    const cookieValue = new URLSearchParams({
      lc: locale,
      lcin: String(this.locInherit),
    });

    const futureDate = DateTime.now()
      .plus({
        years: 7,
      })
      .toJSDate();

    Cookies.set("bungleloc", cookieValue.toString(), {
      expires: futureDate,
    });

    this.redirectToNewLocale(locale);

    this.invalidateCookieCache();
  }
}

export default LocalizationState.Instance;
