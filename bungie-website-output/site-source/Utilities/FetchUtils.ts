import { Platform, Renderer } from "@Platform";
import * as Globals from "@Enum";
import { Logger } from "@Global/Logger";

export enum HttpStatusCodes {
  OK = 200,
  Accepted = 202,
  NoContent = 204,
  MovedPermanently = 301,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
}

export class FetchUtils {
  /**
   * Fetches a URL, expecting JSON in return
   * @param request
   */
  public static FetchJson<T>(request: RequestInfo): Promise<T> {
    return fetch(request).then((initialResponse) => {
      if (!initialResponse.ok) {
        throw initialResponse;
      }

      if (initialResponse.status === HttpStatusCodes.NoContent) {
        return Promise.resolve(null);
      }

      let jsonResponse: Promise<T> = null;
      try {
        jsonResponse = initialResponse.json().catch((e) => console.error(e));
      } catch (e) {
        Logger.error(e);
      }

      return jsonResponse;
    });
  }

  /**
   * Log stuff to the RendererService log
   * @param request
   */
  public static ServerLog(request: Renderer.ServerLogRequest) {
    let promise: Promise<boolean>;
    try {
      promise = Platform.RendererService.ServerLog(request)
        .then(() => Logger.log("Error logged to server: ", request))
        .catch((e) => null);
    } catch (e) {
      Logger.error(e);
    }

    return promise;
  }

  /**
   * Gets the properties of a request as an object, for stringification
   * @param request
   */
  public static RequestToObject(request: Request) {
    const {
      cache,
      credentials,
      destination,
      method,
      mode,
      redirect,
      referrer,
      url,
    } = request;

    return {
      cache,
      credentials,
      destination,
      method,
      mode,
      redirect,
      referrer,
      url,
    };
  }
}
