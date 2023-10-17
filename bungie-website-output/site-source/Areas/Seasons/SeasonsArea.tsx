import { SeasonsIndex } from "@Areas/Seasons/SeasonsIndex";
import { RouteHelper } from "@Routes/RouteHelper";
import { RouteComponentProps, Route, Redirect } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { NotFoundError } from "@CustomErrors";
import { createAsyncComponent } from "@Routes/AsyncRoute";
import SeasonsProgress from "./SeasonsProgress";
import PreviousSeason from "./PreviousSeason";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonsDefinitions } from "./SeasonsDefinitions";

class SeasonsArea extends React.Component<RouteComponentProps> {
  public render() {
    const systemEnabled = ConfigUtils.SystemStatus("CoreAreaSeasons");

    if (!systemEnabled) {
      throw new NotFoundError();
    }

    const currentSeasonAction = RouteDefs.Areas.Seasons.getAction(
      SeasonsDefinitions.currentSeason.actionRouteString
    );

    return (
      <SwitchWithErrors>
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheUndying").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season8/SeasonOfTheUndying" /* webpackChunkName: "SeasonOfTheUndying" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfDawn").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season9/SeasonOfDawn" /* webpackChunkName: "SeasonOfDawn" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheWorthy").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season10/SeasonOfTheWorthy" /* webpackChunkName: "SeasonOfTheWorthy" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfArrivals").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season11/Season11" /* webpackChunkName: "Season11" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheHunt").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season12/SeasonOfTheHunt" /* webpackChunkName: "Season12" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheChosen").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season13/SeasonOfTheChosen" /* webpackChunkName: "Season13" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheSplicer").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season14/SeasonOfTheSplicer" /* webpackChunkName: "Season14" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheLost").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season15/SeasonOfTheLost" /* webpackChunkName: "Season15" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheRisen").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season16/SeasonOfTheRisen" /* webpackChunkName: "Season16" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheHaunted").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season17/SeasonOfTheHaunted" /* webpackChunkName: "Season17" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfPlunder").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season18/SeasonOfPlunder" /* webpackChunkName: "Season18" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheSeraph").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season19/SeasonOfTheSeraph" /* webpackChunkName: "Season19" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfDefiance").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season20/SeasonOfDefiance" /* webpackChunkName: "Season20" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheDeep").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season21/SeasonOfTheDeep" /* webpackChunkName: "Season21" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheWitch").path}
          component={createAsyncComponent(
            () =>
              import(
                "./ProductPages/Season22/SeasonOfTheWitch" /* webpackChunkName: "Season22" */
              )
          )}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("PreviousSeason").path}
          component={PreviousSeason}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("Progress").path}
          component={SeasonsProgress}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("Events").path}
          component={() => <Redirect to={RouteHelper.Seasons().url} />}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("Index").path}
          component={SeasonsIndex}
        />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(SeasonsArea);
