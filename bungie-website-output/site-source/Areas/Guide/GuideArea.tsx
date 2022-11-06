// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Guide } from "@Areas/Guide/Guide";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";

interface GuideAreaProps {}

const GuideArea: React.FC<GuideAreaProps> = (props) => {
  const guidePath = RouteDefs.Areas.Guide.getAction("index").path;

  return (
    <SwitchWithErrors>
      <Route path={guidePath} component={Guide} />
    </SwitchWithErrors>
  );
};

export default GuideArea;
