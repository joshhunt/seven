import BeyondLight from "@Areas/Destiny/BeyondLight/BeyondLight";
import { BeyondLightFlickerWrapper } from "@Areas/Destiny/BeyondLight/BeyondLightFlickerWrapper";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { createAsyncComponent } from "../../Global/Routes/AsyncRoute";
import EventsRouter from "@Areas/Seasons/Events/EventsRouter";
import Reveal from "./Reveal";
import { Companion } from "./Companion/Companion";

class DestinyArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.Destiny.getAction().path;
    const buyFlowPath = RouteDefs.Areas.Destiny.getAction("Buy").path;
    const buyDetailPath = RouteDefs.Areas.Destiny.getAction("BuyDetail").path;
    const newLightPath = RouteDefs.Areas.Destiny.getAction("NewLight").path;
    const freeToPlayPath = RouteDefs.Areas.Destiny.getAction("FreeToPlay").path;
    const newLightUrl = RouteDefs.Areas.Destiny.getAction("NewLight").resolve()
      .url;
    const forsakenPath = RouteDefs.Areas.Destiny.getAction("Forsaken").path;
    const shadowkeepPath = RouteDefs.Areas.Destiny.getAction("Shadowkeep").path;
    const stadiaRegister = RouteDefs.Areas.Destiny.getAction("StadiaRegister")
      .path;
    const infoFlowUrl = RouteDefs.Areas.Destiny.getAction("Info").path;
    const revealPath = RouteDefs.Areas.Destiny.getAction("Reveal").path;
    const companionPath = RouteDefs.Areas.Destiny.getAction("Companion").path;
    const beyondLightPath = RouteDefs.Areas.Destiny.getAction("BeyondLight")
      .path;
    const witchQueenPath = RouteDefs.Areas.Destiny.getAction("WitchQueen").path;
    const witchQueenSkuTestPath = RouteDefs.Areas.Destiny.getAction(
      "WitchQueenComparison"
    ).path;
    const lightfallPath = RouteDefs.Areas.Destiny.getAction("Lightfall").path;

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
          <Route path={beyondLightPath} component={BeyondLight} />
          <Route path={companionPath} component={Companion} />
          <Route path={infoFlowUrl} component={EventsRouter} />
          <Route path={revealPath} component={Reveal} />
          <Route path={indexPath}>
            <Redirect to={newLightUrl} />
          </Route>
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(DestinyArea);
