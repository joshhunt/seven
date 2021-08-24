// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { ValidSystemNames } from "@Global/SystemNames";
import { ActionRoute } from "@Routes/ActionRoute";
import { IArea } from "@Routes/Area";
import { AreaUtils } from "@Routes/AreaUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import React from "react";
import { Route } from "react-router-dom";

export interface IAreaGroupItem {
  /** The dynamic import of the Area's entry component */
  lazyComponent: (props: any) => JSX.Element;
  /** The valid routes within the area */
  routes: readonly ((urlPrefix: string) => ActionRoute)[];
  /** If defined, we will check whether this system is enabled before rendering the area. */
  webmasterSystem?: ValidSystemNames;
}

export interface IAreaGroupParams<TKeys extends {}> {
  /** The name of the area. This defines the path as well. */
  name: string;
  /** The areas in the AreaGroup */
  children: Record<keyof TKeys, IAreaGroupItem>;
  /** The component that renders if you navigate directly to the AreaGroup's root path */
  indexComponent: () => JSX.Element;
}

export class AreaGroup<TKeys extends {}> {
  public readonly areas: Partial<Record<keyof TKeys, IArea>> = {};

  /**
   * Creates a new AreaGroup
   * @param params
   */
  constructor(private readonly params: IAreaGroupParams<TKeys>) {
    this.areas = this.createAreas();
  }

  private createAreas() {
    const { children, name: areaGroupName } = this.params;

    const areaNames = Object.keys(children) as (keyof TKeys)[];

    // Loop through the areas in the parameters and create IAreas for them
    const areas = areaNames.reduce((areasAcc, areaName) => {
      const urlPrefix = `${areaGroupName}/${areaName}`;

      const { lazyComponent, routes, webmasterSystem } = children[areaName];

      // Resolve the routes using the URL prefix
      const areaRoutes = routes.map((r) => r(urlPrefix));

      // Add the Index route by default (if it was not already added in routes)
      if (areaRoutes.every((r) => r.action.toLowerCase() !== "index")) {
        areaRoutes.push(new ActionRoute(urlPrefix));
      }

      const { path } = AreaUtils.getAction(urlPrefix, areaRoutes, "Index");

      areasAcc[areaName] = {
        // Render the area component for the root path
        render: () => (
          <Route
            key={areaName as string}
            path={path}
            component={lazyComponent}
          />
        ),
        routes: areaRoutes,
        getAction: (actionName = "Index") =>
          AreaUtils.getAction(urlPrefix, areaRoutes, actionName),
        resolve: <T extends any>(actionName = "Index", params?: Pick<T, any>) =>
          AreaUtils.resolveAction(
            areaName as string,
            areaRoutes,
            actionName,
            params
          ),
        webmasterSystem,
      };

      return areasAcc;
    }, {} as Partial<Record<keyof TKeys, IArea>>);

    return areas;
  }

  public resolve() {
    return `/:locale/${this.params.name}`;
  }

  public render() {
    return this.params.indexComponent();
  }
}
