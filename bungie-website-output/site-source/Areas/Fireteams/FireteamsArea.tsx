// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamPage } from "@Areas/Fireteams/FireteamPage";
import { Fireteams } from "@Areas/Fireteams/Fireteams";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router-dom";

const FireteamsArea: React.FC = () => {
  const fireteamsPath = RouteDefs.Areas.Fireteams.getAction("Search").path;
  const fireteamPath = RouteDefs.Areas.Fireteams.getAction("Fireteam").path;

  return (
    <SwitchWithErrors>
      <Route path={fireteamsPath} component={Fireteams} />
      <Route path={fireteamPath} component={FireteamPage} />
    </SwitchWithErrors>
  );
};

export default FireteamsArea;
