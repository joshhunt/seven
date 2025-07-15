import CurrentSeason from "@Areas/Seasons/SeasonProgress/pages/CurrentSeason/CurrentSeason";
import { PreviousSeason } from "@Areas/Seasons/SeasonProgress/pages/PreviousSeason";
import { RouteComponentProps, Route } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";
import { NotFoundError } from "@CustomErrors";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";

class SeasonsArea extends React.Component<RouteComponentProps> {
  public render() {
    const systemEnabled = ConfigUtils.SystemStatus("CoreAreaSeasons");

    if (!systemEnabled) {
      throw new NotFoundError();
    }

    return (
      <SwitchWithErrors>
        <Route
          path={RouteDefs.Areas.Seasons.getAction("PreviousSeason").path}
          component={PreviousSeason}
        />
        <Route
          path={RouteDefs.Areas.Seasons.getAction("Progress").path}
          component={CurrentSeason}
        />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(SeasonsArea);
