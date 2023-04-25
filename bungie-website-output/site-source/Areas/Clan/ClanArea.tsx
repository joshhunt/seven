// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Profile } from "@Areas/Clan/Profile";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";

class ClanArea extends React.Component<RouteComponentProps> {
  public render() {
    const profilePath = RouteDefs.Areas.Clan.getAction().path;

    return (
      <SwitchWithErrors>
        <Route path={profilePath} component={Profile} />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(ClanArea);
