// Created by atseng, 2020
// Copyright Bungie, Inc.

import { Apps } from "@Areas/Registration/Apps";
import * as React from "react";
import { RouteComponentProps, Route, Redirect } from "react-router-dom";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import Benefits from "./Benefits";
import RegistrationPage from "./RegistrationPage";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface IRegistrationAreaProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps {}

/**
 * RegistrationArea - Replace this description
 *  *
 * @param {IRegistrationAreaProps} props
 * @returns
 */
class RegistrationArea extends React.Component<IRegistrationAreaProps> {
  constructor(props: IRegistrationAreaProps) {
    super(props);
  }

  public componentDidMount() {
    if (!ConfigUtils.SystemStatus("RegistrationUI")) {
      window.location.href = `/`;
    }
  }

  public render() {
    const indexPath = RouteDefs.Areas.Registration.getAction().path;
    const benefitsPath = RouteDefs.Areas.Registration.getAction("Benefits")
      .path;
    const appsPath = RouteDefs.Areas.Registration.getAction("Apps").path;

    return (
      <SwitchWithErrors>
        <Route path={appsPath} component={Apps} />
        <Route path={benefitsPath} component={Benefits} />
        <Route path={indexPath} component={RegistrationPage} />
      </SwitchWithErrors>
    );
  }
}
export default withGlobalState(RegistrationArea, ["loggedInUser"]);
