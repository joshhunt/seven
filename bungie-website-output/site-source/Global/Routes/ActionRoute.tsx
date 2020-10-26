import { ILocaleParams } from "./RouteDefs";
import { UrlUtils } from "@Utilities/UrlUtils";
import { IMultiSiteLink } from "./RouteHelper";

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
  public readonly areaName: string;
  public get areaPath() {
    return `/${this.areaName}`;
  }
  public readonly action: string;

  /**
   * Creates a new ActionRoute
   * @param areaName The area for which this route is defined
   * @param action The action inside the area
   * @param path Additional path parameters
   * @param pathIsOverride If you want to override the entire path using the path parameter, set this to true
   */
  constructor(areaName: string, action = "Index", params?: IActionRouteParams) {
    this.areaName = areaName;
    this.action = action;
    this.path = `/:locale/${areaName}`;
    if (action && action !== "Index") {
      this.path = `/:locale/${areaName}/${action}`;
    }

    if (params && params.path) {
      this.path += `/${params.path}`;
    }

    if (params && params.isOverride) {
      this.path = `/:locale/${areaName}/${params.path}`;
    }
  }

  public resolve<T>(params?: T, extra?: any): IMultiSiteLink {
    return UrlUtils.RouterPathToMultiLink(this.path, params, extra);
  }
}
