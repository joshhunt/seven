// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/RouteParams";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import React from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import styles from "./FireteamFinderBreadcrumb.module.scss";

export type BreadcrumbConfiguration =
  | "dashboard"
  | "browse"
  | "browse-select"
  | "create-select"
  | "create"
  | "detail"
  | "admin";

interface FireteamFinderBreadcrumbProps {
  breadcrumbConfig: BreadcrumbConfiguration;
}

export const FireteamFinderBreadcrumb: React.FC<FireteamFinderBreadcrumbProps> = (
  props
) => {
  const location = useLocation<{ from: string }>();
  const previousLocation = location.state?.from;
  const { graphId, activityId, lobbyId } = useParams<IFireteamFinderParams>();
  const browseAnchor = (
    <Anchor url={RouteHelper.FireteamFinderBrowse()}>
      {Localizer.fireteams.browsetitle}
    </Anchor>
  );
  const browseListingsAnchor = (
    <Anchor url={previousLocation}>{Localizer.fireteams.browseTitle}</Anchor>
  );
  const browseSelectAnchor = (
    <Anchor url={RouteHelper.FireteamFinderBrowse()}>
      {Localizer.fireteams.browse}
    </Anchor>
  );
  const createSelectAnchor = (
    <Anchor url={RouteHelper.FireteamFinderCreate()}>
      {Localizer.fireteams.selectactivity}
    </Anchor>
  );
  const dashboardAnchor = (
    <Anchor url={RouteHelper.FireteamFinder()}>
      {Localizer.fireteams.dashboardBreadcrumb}
    </Anchor>
  );
  const createAnchor = (
    <Anchor
      url={RouteHelper.FireteamFinderCreate({
        graphId: graphId,
        activityId: activityId,
      })}
    >
      {Localizer.fireteams.create}
    </Anchor>
  );
  const detailAnchor = (
    <Anchor
      url={RouteHelper.FireteamFinderDetail({
        graphId: graphId,
        activityId: activityId,
      })}
    >
      {Localizer.fireteams.detail}
    </Anchor>
  );

  const browseAction = RouteDefs.Areas.FireteamFinder.getAction("Browse");
  const browseActionPathSubstring = `${browseAction.urlPrefix}/${browseAction.action}`;

  const breadcrumbs = () => {
    switch (props.breadcrumbConfig) {
      case "dashboard":
        return <>{dashboardAnchor}</>;
      case "browse":
        return (
          <>
            {dashboardAnchor}
            {browseSelectAnchor}
            {browseAnchor}
          </>
        );
      case "browse-select":
        return (
          <>
            {dashboardAnchor}
            {browseSelectAnchor}
          </>
        );
      case "create-select":
        return (
          <>
            {dashboardAnchor}
            {createSelectAnchor}
          </>
        );
      case "create":
        return (
          <>
            {dashboardAnchor}
            {createSelectAnchor}
            {createAnchor}
          </>
        );
      case "detail":
        return (
          <>
            {dashboardAnchor}
            {browseSelectAnchor}
            {previousLocation
              .toLowerCase()
              .includes(browseActionPathSubstring.toLowerCase()) &&
              browseListingsAnchor}
            {detailAnchor}
          </>
        );
      case "admin":
        return (
          <>
            {dashboardAnchor}
            {detailAnchor}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={classNames(styles.flat, styles.breadcrumb)}>
      {breadcrumbs()}
    </div>
  );
};
