import { AsyncRoute } from "@Routes/AsyncRoute";
import { RouteComponentProps, Route, withRouter } from "react-router-dom";
import React from "react";
import { RouteDefs } from "@Routes/RouteDefs";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";

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
        </AnimatedRouter>
      </React.Fragment>
    );
  }
}

export default DirectArea;
