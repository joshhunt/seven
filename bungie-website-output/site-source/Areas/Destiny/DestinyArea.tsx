import BeyondLight from "@Areas/Destiny/BeyondLight/BeyondLight";
import Home from "@Areas/Destiny/Home";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { createAsyncComponent } from "../../Global/Routes/AsyncRoute";
import Reveal from "./Reveal";
import { Companion } from "./Companion/Companion";

class DestinyArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.Destiny.getAction().path;
    const buyFlowPath = RouteDefs.Areas.Destiny.getAction("Buy").path;
    const buyDetailPath = RouteDefs.Areas.Destiny.getAction("BuyDetail").path;
    const newLightPath = RouteDefs.Areas.Destiny.getAction("NewLight").path;
    const freeToPlayPath = RouteDefs.Areas.Destiny.getAction("FreeToPlay").path;
    const forsakenPath = RouteDefs.Areas.Destiny.getAction("Forsaken").path;
    const shadowkeepPath = RouteDefs.Areas.Destiny.getAction("Shadowkeep").path;
    const revealPath = RouteDefs.Areas.Destiny.getAction("Reveal").path;
    const companionPath = RouteDefs.Areas.Destiny.getAction("Companion").path;
    const beyondLightPath = RouteDefs.Areas.Destiny.getAction("BeyondLight")
      .path;
    const witchQueenPath = RouteDefs.Areas.Destiny.getAction("WitchQueen").path;
    const witchQueenSkuTestPath = RouteDefs.Areas.Destiny.getAction(
      "WitchQueenComparison"
    ).path;
    const lightfallPath = RouteDefs.Areas.Destiny.getAction("Lightfall").path;
    const finalShapePath = RouteDefs.Areas.Destiny.getAction("TheFinalShape")
      .path;

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <Route
            path={newLightPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/DestinyNewLight" /* webpackChunkName: "Destiny-NewLight" */
                )
            )}
          />
          <Route
            path={freeToPlayPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/FreeToPlay/FreeToPlay" /* webpackChunkName: "Destiny-FreeToPlay" */
                )
            )}
          />
          <Route
            path={forsakenPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/Forsaken" /* webpackChunkName: "Destiny-Forsaken" */
                )
            )}
          />
          <Route
            path={shadowkeepPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/Destiny_Shadowkeep" /* webpackChunkName: "Destiny-Shadowkeep" */
                )
            )}
          />
          <Route
            exact={true}
            path={buyFlowPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/Buy/DestinyBuyIndex" /* webpackChunkName: "Destiny-Buy" */
                )
            )}
          />
          <Route
            path={buyDetailPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/Buy/DestinyBuyProductDetail" /* webpackChunkName: "Destiny-BuyDetail" */
                )
            )}
          />
          <Route
            path={witchQueenSkuTestPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/WitchQueen/WitchQueenSkuComparisonTest" /* webpackChunkName: "Destiny-WitchQueen-SkuTest" */
                )
            )}
          />
          <Route
            path={witchQueenPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/WitchQueen/WitchQueen" /* webpackChunkName: "Destiny-WitchQueen" */
                )
            )}
          />
          <Route
            path={lightfallPath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/Lightfall/Lightfall" /* webpackChunkName: "Destiny-Lightfall" */
                )
            )}
          />
          <Route
            path={finalShapePath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Destiny/FinalShape/FinalShape" /* webpackChunkName: "Destiny-FinalShape" */
                )
            )}
          />
          <Route path={beyondLightPath} component={BeyondLight} />
          <Route path={companionPath} component={Companion} />
          <Route path={revealPath} component={Reveal} />
          <Route path={indexPath} component={Home} />
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(DestinyArea);
