import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { PlaytestsArea } from "./Playtests/PlaytestsArea";
import { Credits } from "./Credits";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";

class MarathonArea extends React.Component<RouteComponentProps> {
  public render() {
    const playtestsPath = RouteDefs.Areas.Marathon.getAction("Playtests").path;
    const creditsPath = RouteDefs.Areas.Marathon.getAction("Credits").path;

    const techTestEnabled = ConfigUtils.SystemStatus(
      SystemNames.MarathonTechTest
    );
    const marathonLaunch = ConfigUtils.SystemStatus(SystemNames.MarathonLaunch);
    return (
      <SwitchWithErrors>
        {techTestEnabled && (
          <Route path={playtestsPath} component={PlaytestsArea} />
        )}
        {marathonLaunch && <Route path={creditsPath} component={Credits} />}
      </SwitchWithErrors>
    );
  }
}

export default MarathonArea;
