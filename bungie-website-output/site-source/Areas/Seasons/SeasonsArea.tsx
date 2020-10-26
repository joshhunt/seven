import { RouteComponentProps, Route, Redirect } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { NotFoundError } from "@CustomErrors";
import EventsRouter from "./Events/EventsRouter";
import SeasonsProgress from "./SeasonsProgress";
import PreviousSeason from "./PreviousSeason";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SeasonsDefinitions } from "./SeasonsDefinitions";
import { AsyncRoute } from "@Routes/AsyncRoute";
import { ContentfulEventPage } from "@UI/Content/ContentfulEventPage";

class SeasonsArea extends React.Component<RouteComponentProps> {
  public render() {
    const systemEnabled = ConfigUtils.SystemStatus("CoreAreaSeasons");
    const contentfulEnabled = ConfigUtils.SystemStatus("ContentfulEventPage");

    if (!systemEnabled) {
      throw new NotFoundError();
    }

    const currentSeasonAction = RouteDefs.Areas.Seasons.getAction(
      SeasonsDefinitions.currentSeason.actionRouteString
    );

    return (
      <SwitchWithErrors>
        <AsyncRoute
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheUndying").path}
          component={() =>
            import(
              "./ProductPages/Season8/SeasonOfTheUndying" /* webpackChunkName: "SeasonOfTheUndying" */
            )
          }
        />
        <AsyncRoute
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfDawn").path}
          component={() =>
            import(
              "./ProductPages/Season9/SeasonOfDawn" /* webpackChunkName: "SeasonOfDawn" */
            )
          }
        />
        <AsyncRoute
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfTheWorthy").path}
          component={() =>
            import(
              "./ProductPages/Season10/SeasonOfTheWorthy" /* webpackChunkName: "SeasonOfTheWorthy" */
            )
          }
        />
        <AsyncRoute
          path={RouteDefs.Areas.Seasons.getAction("SeasonOfArrivals").path}
          component={() =>
            import(
              "./ProductPages/Season11/Season11" /* webpackChunkName: "Season11" */
            )
          }
        />

        <Route
          path={RouteDefs.Areas.Seasons.getAction("Events").path}
          component={EventsRouter}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("PreviousSeason").path}
          component={PreviousSeason}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("Progress").path}
          component={SeasonsProgress}
        />
        {contentfulEnabled && (
          <Route
            path={RouteDefs.Areas.Seasons.getAction("Event").path}
            component={ContentfulEventPage}
          />
        )}
        <Route
          exact={true}
          path={RouteDefs.Areas.Seasons.getAction("Index").path}
        >
          <Redirect push={false} to={currentSeasonAction.resolve().url} />
        </Route>
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(SeasonsArea);
