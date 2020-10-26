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
  lazyComponent: (props) => JSX.Element;
  /** The valid routes within the area */
  routes: ((area: string) => ActionRoute)[];
  /** If defined, we will check whether this system is enabled before rendering the area. */
  webmasterSystem?: ValidSystemNames;
  /** If the index path has params, add them here */
  indexParams?: IActionRouteParams;
}

export class Area {
  public readonly routes: ActionRoute[] = [];

  constructor(public readonly params: IAreaParams) {
    this.routes.push(
      new ActionRoute(params.name, undefined, params.indexParams)
    );

    params.routes.forEach((route) => {
      this.routes.push(route(params.name));
    });
  }

  /**
   * Gets the <Route> component predefined for this area
   */
  public get areaRoute() {
    const path = this.getAction().path;

    return (
      <Route key={path} path={path} component={this.params.lazyComponent} />
    );
  }

  public getAction(actionName = "Index"): ActionRoute {
    const matchingAction = this.routes.find((route) =>
      StringUtils.equals(
        route.action,
        actionName,
        StringCompareOptions.IgnoreCase
      )
    );
    if (matchingAction) {
      return matchingAction;
    }

    throw new DetailedError(
      "Action Not Found",
      `Action "${actionName}" requested for area "${this.params.name}", but none was found.`
    );
  }

  public resolve<T = any>(actionName = "Index", params?: Pick<T, any>) {
    const action = this.getAction(actionName);

    return action.resolve<T>(params);
  }
}
