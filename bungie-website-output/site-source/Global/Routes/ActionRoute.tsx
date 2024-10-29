import { UrlUtils } from "@Utilities/UrlUtils";
import { IMultiSiteLink } from "./RouteHelper";
import { RouteActions } from "./Definitions/RouteActions";
export interface IActionRouteParams {
  // The React Router path
  path?: string;
  // If true, this path overrides the Area prefix
  isOverride?: boolean;
}

/**
 * Creates a new ActionRoute
 * */
export class ActionRoute {
  public readonly path: string;
  public readonly urlPrefix: string;
  public get areaPath() {
    return `/${this.urlPrefix}`;
  }
  public readonly action: RouteActions;

  /**
   * Creates a new ActionRoute
   * @param urlPrefix The start of the URL for which this route is defined
   * @param action The action inside the area
   * @param params
   */
  constructor(
    urlPrefix: string,
    action: RouteActions = RouteActions.Index,
    params?: IActionRouteParams
  ) {
    this.urlPrefix = urlPrefix;
    this.action = action;
    this.path = `/:locale/${urlPrefix}`;
    if (action && action.toLowerCase() !== "index") {
      this.path = `/:locale/${urlPrefix}/${action}`;
    }

    if (params && params.path) {
      this.path += `/${params.path}`;
    }

    if (params && params.isOverride) {
      this.path = `/:locale/${urlPrefix}/${params.path}`;
    }
  }

  public resolve<T>(params?: T, extra?: any): IMultiSiteLink {
    return UrlUtils.RouterPathToMultiLink(this.path, params, extra);
  }
}
