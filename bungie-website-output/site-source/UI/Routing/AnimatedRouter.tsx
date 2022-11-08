// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Route, Switch } from "react-router-dom";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";

interface IAnimatedRouterProps {
  children?: React.ReactNode;
}

interface IAnimatedRouterState {}

const RoutesContainer = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: 100,
      delay: 100,
    },
  },
  exit: {
    y: 5,
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 100,
    },
  },
});

/**
 * AnimatedRouter - Supports route children and animates between them when the path changes
 *  *
 * @param {IAnimatedRouterProps} props
 * @returns
 */
export class AnimatedRouter extends React.Component<
  IAnimatedRouterProps,
  IAnimatedRouterState
> {
  constructor(props: IAnimatedRouterProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Route
        render={({ location }) => (
          <RoutesContainer key={location.pathname}>
            <SwitchWithErrors>{this.props.children}</SwitchWithErrors>
          </RoutesContainer>
        )}
      />
    );
  }
}
