// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EventPage } from "@UI/Content/EventPage";

interface IEventsRouterParams {
  eventTag: string;
}

interface IEventsRouterProps extends RouteComponentProps<IEventsRouterParams> {}

interface IEventsRouterState {}

/**
 * EventsRouter - Replace this description
 *  *
 * @param {IEventsRouterProps} props
 * @returns
 */
class EventsRouter extends React.Component<
  IEventsRouterProps,
  IEventsRouterState
> {
  constructor(props: IEventsRouterProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <EventPage eventTag={this.props.match.params.eventTag} />;
  }
}

export default withRouter(EventsRouter);
