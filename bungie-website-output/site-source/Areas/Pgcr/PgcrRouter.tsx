// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { PgcrSingle } from "@Areas/Pgcr/PgcrSingle";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";

interface PgcrRouterProps {}

const PgcrRouter: React.FC<PgcrRouterProps> = (props) => {
  const guidePath = RouteDefs.Areas.Pgcr.getAction("index").path;

  return (
    <SwitchWithErrors>
      <Route path={guidePath} component={PgcrSingle} />
    </SwitchWithErrors>
  );
};

export default PgcrRouter;
