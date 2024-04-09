// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamPage } from "@Areas/Fireteams/FireteamPage";
import { Fireteams } from "@Areas/Fireteams/Fireteams";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router-dom";

const FireteamsArea: React.FC = () => {
  const multipleFireteamsPath = RouteDefs.Areas.Fireteams.getAction("Search")
    .path;
  const individualFireteamPath = RouteDefs.Areas.Fireteams.getAction("Fireteam")
    .path;

  return (
    <SwitchWithErrors>
      <Route path={multipleFireteamsPath} component={Fireteams} />
      <Route path={individualFireteamPath} component={FireteamPage} />
    </SwitchWithErrors>
  );
};

export default FireteamsArea;
