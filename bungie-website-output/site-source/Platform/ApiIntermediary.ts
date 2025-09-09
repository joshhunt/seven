import { ILogger } from "@Global/BaseLogger";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { PromiseUtils } from "@Utilities/PromiseUtils";
import * as Globals from "@Enum";
import { DetailedError, PlatformError } from "@CustomErrors";
import { Logger } from "@Global/Logger";
import { Localizer } from "@bungie/localization";
import {
  FirehoseDebuggerDataStore,
  IFirehoseDebuggerItemData,
} from "./FirehoseDebuggerDataStore";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UrlUtils } from "@Utilities/UrlUtils";

const ServerVars = {
  LocalizerCurrentCultureName: "en",
  SessionContextCookieName: "bungled",
  WebMembershipCookieName: "bungleme",
  PlatformSettings: {
    platformUrl: "/Platform",
    baseUrl: "/",
    locInherit: true,
    internalLinkRegex: /https?\:\/\/(((www)|(stage)|(alpha)|(nike)|(bnetdev)|(bnetint)|(static-internal)|(local-static)|(static01))\.bungie(store)?\.(net|com))/gi,
  },
};

export interface IRequestParams {
  url: {
    path: string;
    requiredParameters?: string;
    optionalQueryAppend?: string;
  };
  analytics: { subsystem: string; action: string };
  method: "POST" | "GET";
  clientState?: any;
  input?: any;
}

export interface PlatformSettings {
  platformUrl: string;
  locInherit: boolean;
}

interface IPlatformSuccessErrorData {
  hasError: boolean;
  platformResponse: PlatformResponse;
}

export interface PlatformResponse {
  Response: any;
  ErrorCode: Globals.PlatformErrorCodes | -1; // -1 is for when the frontend parses an error that doesn't fit with the other codes;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: any;
}

export enum HttpStatusCodes {
  OK = 200,
  Accepted = 202,
  NoContent = 204,
  MovedPermanently = 301,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
}

export class ApiIntermediary {
  private static readonly PlatformSettings: PlatformSettings =
    ServerVars.PlatformSettings;

  private static _logger: ILogger;
  private static get Logger() {
    return this._logger || Logger.create("API");
  }

  /**
   * Creates a request and executes it
   * @param urlPath The base path to hit
   * @param urlRequiredParameters Any parameters that are required
   * @param urlOptionalQueryAppend Optional url query string
   * @param systemName The name of the system in the platform (used for analytics tracking)
   * @param actionName The name of the action in the system (used for analytics tracking)
   * @param input Any input required by the endpoint
   * @param clientState State data that will be sent to the server and returned for client use
   */
  public static doGetRequest(
    urlPath: string,
    urlRequiredParameters: [string, any][],
    urlOptionalQueryAppend: string,
    systemName: string,
    actionName: string,
    input: any,
    clientState: any
  ) {
    return this.doRequest(
      "GET",
      urlPath,
      urlRequiredParameters,
      urlOptionalQueryAppend,
      systemName,
      actionName,
      input,
      clientState
    );
  }

  /**
   * Creates a request and executes it
   * @param urlPath The base path to hit
   * @param urlRequiredParameters Any parameters that are required
   * @param urlOptionalQueryAppend Optional url query string
   * @param systemName The name of the system in the platform (used for analytics tracking)
   * @param actionName The name of the action in the system (used for analytics tracking)
   * @param input Any input required by the endpoint
   * @param clientState State data that will be sent to the server and returned for client use
   */
  public static doPostRequest(
    urlPath: string,
    urlRequiredParameters: [string, any][],
    urlOptionalQueryAppend: string,
    systemName: string,
    actionName: string,
    input: any,
    clientState: any
  ) {
    return this.doRequest(
      "POST",
      urlPath,
      urlRequiredParameters,
      urlOptionalQueryAppend,
      systemName,
      actionName,
      input,
      clientState
    );
  }

  private static doRequest(
    method: "GET" | "POST",
    urlPath: string,
    urlRequiredParameters: [string, any][],
    urlOptionalQueryAppend: string,
    systemName: string,
    actionName: string,
    input: any,
    clientState: any
  ) {
    const requiredParams = ApiIntermediary.getParamString(
      urlRequiredParameters
    );
    const url = ApiIntermediary.buildUrl(
      urlPath,
      requiredParams,
      urlOptionalQueryAppend
    );

    ApiIntermediary.pushGa(systemName, actionName, url);

    const request = ApiIntermediary.buildRequest(
      url,
      method,
      input,
      clientState
    );

    return ApiIntermediary.makeRequest(request);
  }

  private static buildUrl(
    path: string,
    requiredParameters?: string,
    optionalQueryAppend?: string
  ) {
    const settings = ApiIntermediary.PlatformSettings;

    function parseQuery(queryString: string) {
      let query: Record<string, string> = {};
      let pairs = (queryString[0] === "?"
        ? queryString.slice(1)
        : queryString
      ).split("&");
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split(/=(.*)/s);
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
      return query;
    }

    const url = settings.platformUrl + path;
    let queryString = `?lc=${Localizer.CurrentCultureName}&fmt=true&lcin=${Localizer.locInherit}`;

    // if optionalQueryAppend passes in an overlapping parameter with queryString, optionalQueryAppend's value should win

    if (requiredParameters) {
      queryString += "&" + requiredParameters;
    }

    if (optionalQueryAppend) {
      const paramObject = parseQuery(optionalQueryAppend);
      const queryStringParamObject = parseQuery(queryString);
      const setOfParams = [
        ...new Set([
          ...Object.keys(paramObject),
          ...Object.keys(queryStringParamObject),
        ]),
      ];

      for (let i = 0; i < setOfParams.length; i++) {
        if (i === 0) {
          queryString = `?${setOfParams[i]}=`;
        } else {
          queryString += `&${setOfParams[i]}=`;
        }
        queryString +=
          paramObject[setOfParams[i]] ?? queryStringParamObject[setOfParams[i]];
      }
    }

    return url + queryString;
  }

  private static buildRequest(
    url: string,
    method: "GET" | "POST",
    input: any = null,
    clientState: any = null
  ): Request {
    const requestInit: RequestInit = {
      method,
      cache: "default",
      headers: {
        "X-API-KEY": "10E792629C2A47E19356B8A79EEFA640",
        "x-csrf": this.getCookieByName(ServerVars.SessionContextCookieName),
      },
    };

    if (input) {
      requestInit.body = JSON.stringify(input);
    }

    const request = new Request(url, requestInit);

    this.Logger.logVerbose(`Fetching ${url}`);

    return request;
  }

  public static makeRequest(
    request: RequestInfo,
    isPlatformRequest = true,
    providedOptions?: RequestInit
  ) {
    // Bug 774817 - Edge does not send cookies in fetch requests unless you specifically tell it to
    const fetchOptions: RequestInit = Object.assign({}, providedOptions, {
      credentials: "same-origin",
    } as RequestInit);

    const response = fetch(request, fetchOptions).then((initialResponse) => {
      if (initialResponse.status === HttpStatusCodes.NoContent) {
        return Promise.resolve();
      }

      let jsonResponse = null;
      try {
        jsonResponse = initialResponse.json().catch((e) => console.error(e));
      } catch (e) {
        throw initialResponse;
      }

      return jsonResponse;
    });

    let finalResponse = response;

    if (ApiIntermediary && ApiIntermediary.handleRequest) {
      finalResponse = response.then((jsonResponse) => {
        return ApiIntermediary.handleRequest(
          request,
          jsonResponse,
          isPlatformRequest
        );
      });
    }

    return finalResponse.catch((e) => ApiIntermediary.handleError(request, e));
  }

  /**
   * Called from api.ts, this will run on every API request
   * @param {RequestInfo} request The request
   * @param {any} jsonResponse The response
   */
  public static handleRequest(
    request: RequestInfo,
    jsonResponse: PlatformResponse,
    isPlatformRequest = true
  ): Promise<any> {
    const url = typeof request === "string" ? request : request.url;
    const isGetContentCall =
      url.toLowerCase().indexOf("/platform/content/") !== -1;
    const isContentRenderableCall =
      url.toLowerCase().indexOf("/contentitemrenderablebytagandtype") !== -1 ||
      url.toLowerCase().indexOf("/contentitemrenderablebyid") !== -1;
    const isNotProd = ConfigUtils.Environment !== "live";

    /* The loc team and others who use the firehose want to see which items are on a page from the page itself, 
		we intercept the response when a platfrom call is made to get a content item and then show it in a box on the page
		if the query string "?_firehoseDebug=1" is added to the url (See TFS User Story 857269) */

    if (
      (isGetContentCall || isContentRenderableCall) &&
      isNotProd &&
      UrlUtils.QueryToObject()._firehoseDebug
    ) {
      const response = isGetContentCall
        ? jsonResponse.Response
        : jsonResponse.Response?.Content;

      FirehoseDebuggerDataStore.actions.add(response);
    }

    // Log API responses for easy reading
    this.logAsGroup(`Response for ${url}`, jsonResponse);

    return new Promise((resolve, reject) => {
      const successErrorInfo: IPlatformSuccessErrorData = this.reactToResponse(
        jsonResponse
      );

      if (successErrorInfo) {
        if (successErrorInfo.hasError) {
          reject(successErrorInfo.platformResponse);
        } else {
          const toReturn = isPlatformRequest
            ? successErrorInfo.platformResponse.Response
            : successErrorInfo.platformResponse;

          resolve(toReturn);
        }
      } else {
        throw new DetailedError(
          Localizer.Errors.ResponseErrorTitle,
          Localizer.Errors.ResponseError,
          undefined,
          request,
          isPlatformRequest
        );
      }
    });
  }

  /**
   * Called from api.ts, this will run if there is any error on an API request
   * @param {RequestInfo} request The request
   * @param {any} error Any error
   */
  public static async handleError(request: RequestInfo, error: Error) {
    this.Logger.error(error, false, request);

    return PromiseUtils.Rethrow(error);
  }

  public static pushGa(subsystem: string, action: string, url: string) {
    let signedIn = "-";
    const meCookie = this.getCookieByName(ServerVars.WebMembershipCookieName);
    if (meCookie) {
      signedIn = "SignedIn";
    }

    const ga = window["ga"];
    if (ga) {
      ga("send", "event", {
        hitType: "event",
        eventCategory: "Platform",
        eventAction: `${subsystem}_${action}`,
        eventLabel: signedIn,
      });
    }
  }

  private static reactToResponse(
    platformResponse: PlatformResponse
  ): IPlatformSuccessErrorData {
    let data = null;
    try {
      data = {
        hasError:
          platformResponse.ErrorCode !== undefined &&
          platformResponse.ErrorCode > 1,
        platformResponse: platformResponse,
      };
    } catch (e) {
      // ignore
    }

    return data;
  }

  private static logAsGroup(title: string, logThis: any) {
    if (location.hostname.match("local")) {
      this.Logger.logVerbose(title, logThis);
    }
  }

  private static getCookieByName(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  private static getParamString(params: [string, any][]): string {
    const paramString = params.map((kvp) => kvp.join("=")).join("&");

    return `&${paramString}`;
  }
}

export const ConvertToPlatformError: (
  error: Error
) => Promise<PlatformError> = (error: Error) => {
  return new Promise<PlatformError>((resolve, reject) => {
    const isError = error instanceof Error;
    const isPlatform = error instanceof PlatformError;

    if (isPlatform) {
      resolve(error as PlatformError);
    } else {
      try {
        let platformError: PlatformResponse = {
          ErrorCode: -1,
          ErrorStatus: "None",
          Message: isError ? error.message : "",
          MessageData: null,
          Response: null,
          ThrottleSeconds: 0,
        };

        if ("ErrorCode" in error) {
          platformError = (error as unknown) as PlatformResponse;
          reject(new PlatformError(platformError));
        } else {
          reject(error);
        }
      } catch (e) {
        reject(e);
      }
    }
  });
};
