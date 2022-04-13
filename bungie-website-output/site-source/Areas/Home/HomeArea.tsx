// Created by atseng, 2022
// Copyright Bungie, Inc.

import { RouteDefs } from "@Routes/RouteDefs";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import React from "react";
import { Route } from "react-router";
import { Home } from "./Home";

interface HomeAreaProps {}

interface HomeAreaState {}

class HomeArea extends React.Component<HomeAreaProps, HomeAreaState> {
  constructor(props: HomeAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <AnimatedRouter>
        <Route
          path={RouteDefs.Areas.Home.getAction("index").path}
          component={Home}
        />
      </AnimatedRouter>
    );
  }
}

export default HomeArea;
