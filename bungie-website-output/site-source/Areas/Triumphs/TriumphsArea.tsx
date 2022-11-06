// Created by atseng, 2022
// Copyright Bungie, Inc.

import Triumphs from "@Areas/Triumphs/Triumphs";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";

interface TriumphsAreaProps {}

interface TriumphsAreaState {}

class TriumphsArea extends React.Component<
  TriumphsAreaProps,
  TriumphsAreaState
> {
  constructor(props: TriumphsAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const triumphsPath = RouteDefs.Areas.Triumphs.getAction("index").path;

    return (
      <SwitchWithErrors>
        <Route path={triumphsPath} component={Triumphs} />
      </SwitchWithErrors>
    );
  }
}

export default TriumphsArea;
