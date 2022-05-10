// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Rewards } from "@Areas/Rewards/Rewards";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router-dom";

interface RewardsAreaProps {}

interface RewardsAreaState {}

class RewardsArea extends React.Component<RewardsAreaProps, RewardsAreaState> {
  constructor(props: RewardsAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const indexPath = RouteDefs.Areas.Rewards.getAction().path;

    return (
      <SwitchWithErrors>
        <Route path={indexPath} component={Rewards} />
      </SwitchWithErrors>
    );
  }
}

export default RewardsArea;
