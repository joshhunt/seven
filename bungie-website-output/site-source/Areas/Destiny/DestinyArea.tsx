import { BeyondLightFlickerWrapper } from "@Areas/Destiny/BeyondLight/BeyondLightFlickerWrapper";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import StadiaRegister from "./StadiaRegister";
import EventsRouter from "@Areas/Seasons/Events/EventsRouter";
import { AsyncRoute } from "@Routes/AsyncRoute";
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

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <AsyncRoute
            path={newLightPath}
            component={() =>
              import(
                "@Areas/Destiny/DestinyNewLight" /* webpackChunkName: "Destiny-NewLight" */
              )
            }
          />
          <AsyncRoute
            path={freeToPlayPath}
            component={() =>
              import(
                "@Areas/Destiny/FreeToPlay/FreeToPlay" /* webpackChunkName: "Destiny-FreeToPlay" */
              )
            }
          />
          <AsyncRoute
            path={forsakenPath}
            component={() =>
              import(
                "@Areas/Destiny/Forsaken" /* webpackChunkName: "Destiny-Forsaken" */
              )
            }
          />
          <AsyncRoute
            path={shadowkeepPath}
            component={() =>
              import(
                "@Areas/Destiny/Destiny_Shadowkeep" /* webpackChunkName: "Destiny-Shadowkeep" */
              )
            }
          />
          <AsyncRoute
            exact={true}
            path={buyFlowPath}
            component={() =>
              import(
                "@Areas/Destiny/Buy/DestinyBuyIndex" /* webpackChunkName: "Destiny-Buy" */
              )
            }
          />
          <AsyncRoute
            path={buyDetailPath}
            component={() =>
              import(
                "@Areas/Destiny/Buy/DestinyBuyProductDetail" /* webpackChunkName: "Destiny-BuyDetail" */
              )
            }
          />
          <AsyncRoute
            path={witchQueenSkuTestPath}
            component={() =>
              import(
                "@Areas/Destiny/WitchQueen/WitchQueenSkuComparisonTest" /* webpackChunkName: "Destiny-WitchQueen-SkuTest" */
              )
            }
          />
          <AsyncRoute
            path={witchQueenPath}
            component={() =>
              import(
                "@Areas/Destiny/WitchQueen/WitchQueen" /* webpackChunkName: "Destiny-WitchQueen" */
              )
            }
          />
          <Route path={beyondLightPath} component={BeyondLightFlickerWrapper} />
          <Route path={companionPath} component={Companion} />
          <Route path={stadiaRegister} component={StadiaRegister} />
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
