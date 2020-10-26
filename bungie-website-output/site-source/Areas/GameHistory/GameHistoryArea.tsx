// Created by larobinson, 2020
// Copyright Bungie, Inc.
import { RouteDefs } from "@Routes/RouteDefs";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import React from "react";
import { Route } from "react-router-dom";
import GameHistory from "./GameHistory";

interface IGameHistoryRouterProps {}

class GameHistoryArea extends React.Component<IGameHistoryRouterProps> {
  public render() {
    return (
      <React.Fragment>
        <AnimatedRouter>
          <Route
            path={RouteDefs.Areas.GameHistory.getAction("index").path}
            component={GameHistory}
          />
        </AnimatedRouter>
      </React.Fragment>
    );
  }
}

export default GameHistoryArea;
