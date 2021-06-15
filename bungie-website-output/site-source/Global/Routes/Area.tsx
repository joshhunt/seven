import { AreaUtils } from "@Routes/AreaUtils";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { ActionRoute, IActionRouteParams } from "./ActionRoute";
import { Route } from "react-router-dom";
import React from "react";
import { DetailedError } from "@UI/Errors/CustomErrors";
import { StringUtils, StringCompareOptions } from "@Utilities/StringUtils";
import { ValidSystemNames } from "@Global/SystemNames";

export interface IAreaParams {
  /** The name of the area. This defines the path as well. */
  name: string;
  /** The dynamic import of the Area's entry component */
  lazyComponent: (props: any) => JSX.Element;
  /** The valid routes within the area */
  routes: ((area: string) => ActionRoute)[];
  /** If defined, we will check whether this system is enabled before rendering the area. */
  webmasterSystem?: ValidSystemNames;
  /** If the index path has params, add them here */
  indexParams?: IActionRouteParams;
}

export interface IArea {
  readonly render: () => JSX.Element;
  readonly routes: ActionRoute[];
  webmasterSystem?: ValidSystemNames;

  getAction(actionName?: string): ActionRoute;

  resolve<T extends any>(
    actionName?: string,
    params?: Pick<T, any>
  ): IMultiSiteLink;
}

export class Area implements IArea {
  public readonly routes: ActionRoute[] = [];
  public readonly webmasterSystem?: ValidSystemNames;

  constructor(public readonly params: IAreaParams) {
    // Add the Index route by default
    this.routes.push(
      new ActionRoute(params.name, undefined, params.indexParams)
    );

    params.routes.forEach((route) => {
      this.routes.push(route(params.name));
    });

    this.webmasterSystem = params.webmasterSystem;
  }

  /**
   * Gets the <Route> component predefined for this area
   */
  public render() {
    const path = this.getAction().path;

    return (
      <Route key={path} path={path} component={this.params.lazyComponent} />
    );
  }

  public getAction(actionName = "Index"): ActionRoute {
    return AreaUtils.getAction(this.params.name, this.routes, actionName);
  }

  public resolve<T = any>(actionName = "Index", params?: Pick<T, any>) {
    return AreaUtils.resolveAction(
      this.params.name,
      this.routes,
      actionName,
      params
    );
  }
}
