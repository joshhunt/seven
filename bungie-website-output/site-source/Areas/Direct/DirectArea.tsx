import { AsyncRoute } from "@Routes/AsyncRoute";
import { RouteDefs } from "@Routes/RouteDefs";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import React from "react";

interface IDirectRouterProps {}

class DirectArea extends React.Component<IDirectRouterProps> {
  public render() {
    return (
      <React.Fragment>
        <AnimatedRouter>
          <AsyncRoute
            path={RouteDefs.Areas.Direct.getAction("Video").path}
            component={() => import("./DirectVideo")}
          />

          <AsyncRoute
            path={RouteDefs.Areas.Direct.getAction("Analyze").path}
            component={() => import("./BeyondLightArg/BeyondLightARG")}
          />

          <AsyncRoute
            path={RouteDefs.Areas.Direct.getAction("RaidRace").path}
            component={() => import("./WorldsFirst/RaidRace")}
          />

          <AsyncRoute
            path={RouteDefs.Areas.Direct.getAction("Rewards").path}
            component={() => import("./BungieRewards/BungieRewards")}
          />
        </AnimatedRouter>
      </React.Fragment>
    );
  }
}

export default DirectArea;
