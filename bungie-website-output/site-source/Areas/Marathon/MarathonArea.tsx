import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { RouteHelper } from "@Routes/RouteHelper";
import { PlaytestsArea } from "./Playtests/PlaytestsArea";

class MarathonArea extends React.Component<RouteComponentProps> {
  public render() {
    const playtestsPath = RouteDefs.Areas.Marathon.getAction("Playtests").path;

    return (
      <SwitchWithErrors>
        <Route path={playtestsPath} component={PlaytestsArea} />
      </SwitchWithErrors>
    );
  }
}

export default MarathonArea;
