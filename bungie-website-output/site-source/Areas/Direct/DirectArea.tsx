import { RouteDefs } from "@Routes/RouteDefs";
import { AnimatedRouter } from "@UI/Routing/AnimatedRouter";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import { Route } from "react-router-dom";
import { createAsyncComponent } from "../../Global/Routes/AsyncRoute";

interface IDirectRouterProps {}

class DirectArea extends React.Component<IDirectRouterProps> {
  public render() {
    const directVideoComponent = ConfigUtils.SystemStatus("DirectVideoCS")
      ? () =>
          import("./DirectVideoCS" /* webpackChunkName: "Direct-Video-CS" */)
      : () => import("./DirectVideo" /* webpackChunkName: "Direct-Video" */);

    return (
      <React.Fragment>
        <AnimatedRouter>
          <Route
            path={RouteDefs.Areas.Direct.getAction("Video").path}
            component={createAsyncComponent(directVideoComponent)}
          />

          <Route
            path={RouteDefs.Areas.Direct.getAction("Circles").path}
            component={createAsyncComponent(() => import("./WQArg/WQArg"))}
          />

          <Route
            path={RouteDefs.Areas.Direct.getAction("RaidRace").path}
            component={createAsyncComponent(
              () =>
                import(
                  "./WorldsFirst/RaidRace" /* webpackChunkName: "Direct-RaidRace" */
                )
            )}
          />

          <Route
            path={RouteDefs.Areas.Direct.getAction("Rewards").path}
            component={createAsyncComponent(
              () =>
                import(
                  "./BungieRewards/BungieRewards" /* webpackChunkName: "Direct-BungieRewards" */
                )
            )}
          />

          <Route
            path={RouteDefs.Areas.Direct.getAction("DestinyShowcase").path}
            component={createAsyncComponent(
              () =>
                import(
                  "./DestinyShowcase/DestinyShowcase" /* webpackChunkName: "Direct-DestinyShowcase" */
                )
            )}
          />

          <Route
            path={RouteDefs.Areas.Direct.getAction("Anniversary").path}
            component={createAsyncComponent(
              () =>
                import(
                  "./BungieAnniversary/BungieAnniversary" /* webpackChunkName: "Direct-BungieAnniversary" */
                )
            )}
          />
        </AnimatedRouter>
      </React.Fragment>
    );
  }
}

export default DirectArea;
