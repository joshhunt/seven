// Created by atseng, 2022
// Copyright Bungie, Inc.

import React from "react";
import { Route } from "react-router-dom";
import Browse from "@Areas/FireteamFinder/Browse";
import CoreBrowse from "@Areas/FireteamFinder/CoreBrowse";
import { Create } from "@Areas/FireteamFinder/Create";
import { Dashboard } from "@Areas/FireteamFinder/Dashboard";
import { Detail } from "@Areas/FireteamFinder/Detail";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";

const FireteamFinderArea: React.FC = () => {
  const dashboardPath = RouteDefs.Areas.FireteamFinder.getAction("Dashboard")
    .path;
  const browsePath = RouteDefs.Areas.FireteamFinder.getAction("Browse").path;
  const detailPath = RouteDefs.Areas.FireteamFinder.getAction("Detail").path;
  const createPath = RouteDefs.Areas.FireteamFinder.getAction("Create").path;
  const indexPath = RouteDefs.Areas.FireteamFinder.getAction("Index").path;
  const fireteamOverhaul = ConfigUtils.SystemStatus("FireteamFinderUIOverhaul");

  return !fireteamOverhaul ? (
    <SwitchWithErrors>
      <Route path={indexPath} exact={true} component={Dashboard} />
      <Route path={dashboardPath} component={Dashboard} />
      <Route path={browsePath} component={Browse} />
      <Route path={browsePath} exact={true} component={Dashboard} />
      <Route path={detailPath} component={Detail} />
      <Route path={createPath} component={Create} />
    </SwitchWithErrors>
  ) : (
    <SwitchWithErrors>
      <Route path={indexPath} exact={true} component={CoreBrowse} />
      <Route path={dashboardPath} component={Dashboard} />
      <Route path={browsePath} component={CoreBrowse} />
      <Route path={browsePath} exact={true} component={CoreBrowse} />
      <Route path={detailPath} component={Detail} />
      <Route path={createPath} component={Create} />
    </SwitchWithErrors>
  );
};

export default FireteamFinderArea;
