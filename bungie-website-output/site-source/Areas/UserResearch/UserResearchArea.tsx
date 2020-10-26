// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { RouteDefs } from "@Routes/RouteDefs";
import { Route, RouteComponentProps, Redirect } from "react-router-dom";
import UserResearch from "./UserResearch";
import UserResearchCanTravel from "./UserResearchCanTravel";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";

interface IUserResearchAreaProps extends RouteComponentProps {}

interface IUserResearchAreaState {}

/**
 * UserResearchArea - UserResearch page for opting into UserResearch emails
 *  *
 * @param {IUserResearchAreaProps} props
 * @returns
 */
export default class UserResearchArea extends React.Component<
  IUserResearchAreaProps,
  IUserResearchAreaState
> {
  constructor(props: IUserResearchAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const indexPath = RouteDefs.Areas.UserResearch.getAction().path;
    const userResearchPath = RouteDefs.Areas.UserResearch.getAction(
      "UserResearch"
    ).path;
    const userResearchUrl = RouteDefs.Areas.UserResearch.getAction(
      "UserResearch"
    ).resolve().url;
    const userResearchCanTravelPath = RouteDefs.Areas.UserResearch.getAction(
      "UserResearchCanTravel"
    ).path;

    return (
      <SwitchWithErrors>
        <Route path={userResearchPath} component={UserResearch} />
        <Route
          path={userResearchCanTravelPath}
          component={UserResearchCanTravel}
        />
        <Route path={indexPath}>
          <Redirect to={userResearchUrl} />
        </Route>
      </SwitchWithErrors>
    );
  }
}
