// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { ResponsiveSize } from "@bungie/responsive";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import * as React from "react";

interface IRespondProps {
  /** The size at which we will start rendering the children */
  at: ResponsiveSize;
  /** Allows you to HIDE the children at the specified size instead of showing them */
  hide?: boolean;
  /** Optionally pass responsive. If you pass null, we will subscribe for you.
   * Forcing you to pass null is a performance measure, because having a million subscriptions around will make things slow.
   * But we don't want you to have to set up global state just to use this component. Basically, if you already have IGlobalState,
   * pass globalState.responsive here. Otherwise, it's fine to pass null. */
  responsive: IResponsiveState;
  children?: React.ReactNode;
}

interface IRespondState {
  responsive: IResponsiveState;
}

/**
 * Respond - Conditionally renders UI based on the state of Responsive
 *  *
 * @param {IRespondProps} props
 * @returns
 */
export class Respond extends React.Component<IRespondProps, IRespondState> {
  private destroyer: DestroyCallback;

  constructor(props: IRespondProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  public componentDidMount() {
    this.destroyer = Responsive.observe((responsive) =>
      this.setState({ responsive })
    );
  }

  public componentWillUnmount() {
    this.destroyer();
  }

  public render() {
    const sizeName = ResponsiveSize[
      this.props.at
    ] as keyof typeof ResponsiveSize;
    const test = this.state.responsive[sizeName];

    if (!test && !this.props.hide) {
      return null;
    } else if (test && this.props.hide) {
      return null;
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
