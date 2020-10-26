import { BeyondLightFlickerWrapper } from "@Areas/Destiny/BeyondLight/BeyondLightFlickerWrapper";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { DestinySeasonPass } from "./DestinySeasonPass";
import PcRegister from "./PcRegister";
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
    const newLightUrl = RouteDefs.Areas.Destiny.getAction("NewLight").resolve()
      .url;
    const forsakenPath = RouteDefs.Areas.Destiny.getAction("Forsaken").path;
    const shadowkeepPath = RouteDefs.Areas.Destiny.getAction("Shadowkeep").path;
    const seasonPassPath = RouteDefs.Areas.Destiny.getAction("SeasonPass").path;
    const pcRegister = RouteDefs.Areas.Destiny.getAction("PcRegister").path;
    const stadiaRegister = RouteDefs.Areas.Destiny.getAction("StadiaRegister")
      .path;
    const infoFlowUrl = RouteDefs.Areas.Destiny.getAction("Info").path;
    const revealPath = RouteDefs.Areas.Destiny.getAction("Reveal").path;
    const companionPath = RouteDefs.Areas.Destiny.getAction("Companion").path;
    const beyondLightPath = RouteDefs.Areas.Destiny.getAction("BeyondLight")
      .path;

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
          <Route path={beyondLightPath} component={BeyondLightFlickerWrapper} />
          <Route path={companionPath} component={Companion} />
          <Route path={seasonPassPath} component={DestinySeasonPass} />
          <Route path={pcRegister} component={PcRegister} />
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
