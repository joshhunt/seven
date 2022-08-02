// Created by atseng, 2022
// Copyright Bungie, Inc.

import Create from "@Areas/Clans/Create";
import Suggested from "@Areas/Clans/Suggested";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";
import MyClans from "./MyClans";

interface ClansAreaProps {}

interface ClansAreaState {}

class ClansArea extends React.Component<ClansAreaProps, ClansAreaState> {
  constructor(props: ClansAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const createPath = RouteDefs.Areas.Clans.getAction("Create").path;
    const suggestedPath = RouteDefs.Areas.Clans.getAction("Suggested").path;
    const myClansPath = RouteDefs.Areas.Clans.getAction("MyClans").path;

    return (
      <SwitchWithErrors>
        <Route path={createPath} component={Create} />
        <Route path={suggestedPath} component={Suggested} />
        <Route path={myClansPath} component={MyClans} />
      </SwitchWithErrors>
    );
  }
}

export default ClansArea;
