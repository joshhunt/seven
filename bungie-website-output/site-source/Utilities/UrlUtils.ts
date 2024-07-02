import { Localizer } from "@bungie/localization/Localizer";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Query } from "contentstack";
// @ts-ignore
import * as H from "history";
import * as pathToRegexp from "ptr620";
import React from "react";
import { LocalizerUtils } from "./LocalizerUtils";
import { useLocation } from "react-router-dom";
import { StringCompareOptions, StringUtils } from "./StringUtils";

export class UrlUtils {
  public static readonly AppBaseUrl = "/7";

  /**
   * Converts an object to a query-string-style string
   * @param o
   */
  public static ObjectToQuery(o: any) {
    const pairs = Object.keys(o).map((a) => `${a}=${o[a]}`);

    return pairs.join("&");
  }

  /**
   * Converts a query string to an object
   * @param q
   */
  public static QueryToObject(
    q: string = location.search
  ): { [key: string]: string } {
    const output: { [key: string]: string } = {};

    const query = q.startsWith("?") ? q.slice(1) : q;

    if (query.indexOf("=") > -1) {
      query
        .split("&")
        .map((kvpString) => kvpString.split("="))
        .forEach((kvArr) => {
          output[kvArr[0]] = kvArr[1];
        });
    }

    return output;
  }

  /** Adds query param to existing query string */
  public static addQueryParam(
    url: string,
    queryParam: string,
    value: string
  ): string {
    if (!url ?? !queryParam ?? !value) {
      return url;
    }

    const parsedUrl = new URL(url);
    parsedUrl.searchParams.append(queryParam, value);

    return parsedUrl.toString();
  }

  /**
   * Given a router path and parameters, return a useable URL
   * @param path
   * @param params
   * @param extra
   * @constructor
   */
  public static RouterPathToUrl<T>(
    path: string,
    params?: T,
    extra?: any
  ): string {
    let query = "";

    const allParams = {
      ...params,
      ...extra,
    };

    if (allParams) {
      // Check whether the requested params match the options available in the route.
      // If there are extras, convert them to query strings

      const tokens = pathToRegexp.parse(path);
      const validKeys = tokens
        .filter((t) => typeof t === "object")
        .map((t: any) => t.name);
      const toQueryStringify = Object.keys(allParams).filter(
        (k) => validKeys.indexOf(k) === -1 && allParams[k] !== undefined
      );
      const queryObj: Record<string, string> = {};
      toQueryStringify.forEach((k) => (queryObj[k] = allParams[k]));

      query =
        toQueryStringify.length > 0
          ? `?${UrlUtils.ObjectToQuery(queryObj)}`
          : "";
    }

    const toPath = pathToRegexp.compile(path, {
      validate: false,
      encode: (value) => value,
    });

    const paramsWithLocale =
      allParams && "locale" in allParams
        ? allParams
        : { ...allParams, locale: Localizer.CurrentCultureName };

    return toPath(paramsWithLocale) + query;
  }

  /**
   * Given a router path and parameters, return a useable MultiSiteLink
   * @param path
   * @param params
   * @param extra
   * @constructor
   */
  public static RouterPathToMultiLink<T>(
    path: string,
    params?: T,
    extra?: any
  ): IMultiSiteLink {
    return {
      legacy: false,
      url: UrlUtils.RouterPathToUrl(path, params, extra),
    } as IMultiSiteLink;
  }

  /**
   * Determine whether the current URL matches a router path
   * @param path The path to test against
   * @param options Regexp options
   * @constructor
   */
  public static UrlMatchesPath(
    path: string,
    options?: pathToRegexp.TokensToRegexpOptions
  ) {
    if (path === null) {
      return false;
    }
    const parsed = pathToRegexp.parse(path);
    const regExp = pathToRegexp.tokensToRegexp(parsed, undefined, options);
    const actualPathname = location.pathname.startsWith(this.AppBaseUrl)
      ? location.pathname.slice(this.AppBaseUrl.length)
      : location.pathname;

    return !!actualPathname.match(regExp);
  }

  /**
   * Given a path, adds the appropriate locale to it
   * @param path
   * @param localeOverride
   */
  public static GetUrlForLocale(path: string, localeOverride: string = null) {
    const locale =
      localeOverride !== null ? localeOverride : Localizer.CurrentCultureName;
    const fixedPath = path.slice(0, 1) === "/" ? path : `/${path}`;

    return `/${locale}${fixedPath}`;
  }

  /**
   * Gets the "action" of the current URL. This assumes URLs follow the pattern of /{locale}/{area}/{action}
   * @param l The location from RouteComponentProps
   */
  public static GetUrlAction(l: H.Location | Location) {
    const matches = l.pathname.match(
      /\/[a-zA-Z\-]{1,6}\/[a-zA-Z0-9]+\/([a-zA-Z0-9]+)\/?/
    );

    return matches && matches.length > 1 ? matches[1] : "";
  }

  /**
   * Redirect to a new URL, and return null so we can render nothing.
   * @param link The string or IMultiSiteLink to redirect to
   * @param p An object containing the History object (usually this.props)
   */
  public static PushRedirect<T extends { history: H.History }>(
    link: IMultiSiteLink | string,
    p: T
  ) {
    let url = "";

    if (typeof link === "object") {
      if (link.legacy) {
        location.href = link.url;

        return;
      } else {
        url = link.url;
      }
    } else {
      url = link;
    }

    p.history.push(url);
  }

  /**
   * Returns the URL as a string regardless of the format it started as
   * @param originalUrl
   */
  public static getUrlAsString(originalUrl: string | IMultiSiteLink) {
    const isMultiLink = typeof originalUrl === "object";

    const finalUrl = isMultiLink ? originalUrl.url : originalUrl;

    return finalUrl;
  }

  /**
   * Returns the URL as a string regardless of the format it started as
   * @param originalUrl
   * @param legacy
   */
  public static getUrlAsMultiLink(
    originalUrl: string | IMultiSiteLink,
    legacy?: boolean
  ) {
    const isString = typeof originalUrl !== "object";

    const finalMultiLink = isString
      ? ({
          legacy: this.isLegacy(originalUrl?.toString() ?? "", legacy),
          url: originalUrl,
        } as IMultiSiteLink)
      : originalUrl;

    return finalMultiLink;
  }

  /**
   * Converts the url provided to an achor tag so we can get stuff like pathname, etc.
   * @param urlAsString
   */
  public static getHrefAsLocation(urlAsString: string) {
    if (!urlAsString) {
      return null;
    }

    const a = document.createElement("a");
    a.href = urlAsString;

    return a;
  }

  /**
   * Returns true if this is a link to the old site
   * @param url
   * @param legacy
   */
  public static isLegacy(url: string, legacy?: boolean) {
    if (!url) {
      return true;
    }

    const anchorUrl = this.getHrefAsLocation(url);
    const nonStatic7Path = !!anchorUrl.pathname.match(/^\/7(?!\/ca\/).*/gi);
    const isReact = nonStatic7Path || (typeof legacy === "boolean" && !legacy);

    return !isReact;
  }

  /**
   * Returns the final URL we want to use in any situation
   * @param anchor
   * @param isLegacy
   * @param isBungieNet
   */
  public static resolveUrl(
    anchor: HTMLAnchorElement,
    isLegacy: boolean,
    isBungieNet: boolean
  ) {
    if (!anchor) {
      return null;
    }

    let resolved = anchor.href;

    if (!isBungieNet) {
      return resolved;
    }

    if (!isLegacy) {
      let path = anchor.pathname;

      if (path.startsWith("/7/")) {
        path = anchor.pathname.slice(2);
      }

      resolved = path + anchor.search + anchor.hash;
    }

    return resolved;
  }

  /**
   * Returns the final URL we want to use in any situation
   * @param link
   */
  public static resolveUrlFromMultiLink(link: IMultiSiteLink) {
    if (!link) {
      return null;
    }

    const anchor = this.getHrefAsLocation(link.url);
    const resolvedUrl = UrlUtils.resolveUrl(anchor, link.legacy, true);

    return resolvedUrl;
  }

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  public static useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  /**
   * Returns true if we want this to open in a new tab
   * @param isBungieNet
   * @param sameTab
   */
  public static shouldOpenNewTab(isBungieNet: boolean, sameTab?: boolean) {
    return !isBungieNet || (typeof sameTab === "boolean" && true);
  }

  /**
   * Returns the parts of a full url with the host and path as the endpoint and the query params as entries in an object
   * @param url
   */
  public static parseUrl(url: string) {
    let parts = url.split("?");
    let result = UrlUtils.QueryToObject(parts[1]);
    result.endpoint = parts[0];
    return result;
  }

  /**
   * Returns true if this link is staying within Bungie.net
   * @param hrefLocation
   */
  public static isBungieNet(hrefLocation: HTMLAnchorElement) {
    if (!hrefLocation) {
      return false;
    }

    return this.isBungieNetUrl(hrefLocation.host);
  }

  //Returns true if this link is staying within Bungie.net
  public static isBungieNetUrl(urlHost: string) {
    const hostSplit = urlHost.split(".");
    const endUrl = hostSplit
      .slice(hostSplit.length - 2, hostSplit.length)
      .join(".");

    return (
      StringUtils.equals(
        endUrl,
        "bungie.net",
        StringCompareOptions.IgnoreCase
      ) ||
      StringUtils.equals(
        endUrl,
        "bng.local",
        StringCompareOptions.IgnoreCase
      ) ||
      StringUtils.equals(urlHost, "firehose")
    );
  }

  /**
   * Redirect to a new path without adding it to the browser history
   * @param pathname
   */
  public static redirectWithoutHistory(pathname: string) {
    history.replaceState(null, null, pathname);
    location.reload();
  }
}
