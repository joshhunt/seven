import { RouteComponentProps, Route } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import PCMigrationPage from "./PCMigrationPage";

interface PCMigrationAreaProperties
  extends RouteComponentProps,
    GlobalStateComponentProps {}

class PCMigrationArea extends React.Component<PCMigrationAreaProperties> {
  constructor(props) {
    super(props);
  }

  public render() {
    const indexUrl = RouteDefs.Areas.PCMigration.getAction("Index").path;

    return <Route path={indexUrl} component={PCMigrationPage} />;
  }
}
export default withGlobalState(PCMigrationArea, ["loggedInUser"]);
