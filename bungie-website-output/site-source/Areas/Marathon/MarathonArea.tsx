import { RouteDefs } from "@Routes/RouteDefs";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { Privacy } from "./Alpha/Pages/Privacy/Privacy";
import { Registration } from "./Alpha/Pages/Registration/Registration";

class MarathonArea extends React.Component<RouteComponentProps> {
  public render() {
    const alphaPath = RouteDefs.Areas.Marathon.getAction("Alpha").path;
    const ndaPath = alphaPath + "/nda/:code";
    const invitePath = alphaPath + "/invite";

    return (
      <SystemDisabledHandler systems={["MarathonAlpha"]} name="Marathon Alpha">
        <SwitchWithErrors>
          <Route path={alphaPath} exact component={Registration} />
          <Route path={ndaPath} component={Privacy} />

          {/* Friend code routes */}
          <Route path={invitePath} exact component={Registration} />
        </SwitchWithErrors>
      </SystemDisabledHandler>
    );
  }
}

export default MarathonArea;
