// Created by atseng, 2022
// Copyright Bungie, Inc.

import React from "react";
import { Route } from "react-router-dom";
import Index from "@Areas/FireteamFinder/Index";
import { BrowseActivities } from "./BrowseActivities";
import { Create } from "@Areas/FireteamFinder/Create";
import { Detail } from "@Areas/FireteamFinder/Detail";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";

const FireteamFinderArea: React.FC = () => {
  const browsePath = RouteDefs.Areas.FireteamFinder.getAction("Browse").path;
  const detailPath = RouteDefs.Areas.FireteamFinder.getAction("Detail").path;
  const createPath = RouteDefs.Areas.FireteamFinder.getAction("Create").path;
  const indexPath = RouteDefs.Areas.FireteamFinder.getAction("Index").path;
  return (
    <SwitchWithErrors>
      <Route path={indexPath} exact={true} component={Index} />
      <Route path={browsePath} exact={true} component={BrowseActivities} />
      <Route path={detailPath} component={Detail} />
      <Route path={createPath} component={Create} />
    </SwitchWithErrors>
  );
};

export default FireteamFinderArea;
