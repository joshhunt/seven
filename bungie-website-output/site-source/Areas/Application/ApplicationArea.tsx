import { ApplicationCreate } from "@Areas/Application/ApplicationCreate";
import { ApplicationIndex } from "@Areas/Application/ApplicationIndex";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route, RouteComponentProps } from "react-router";
import { ApplicationDetail } from "./ApplicationDetail";

class ApplicationArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.Application.getAction().path;
    const createPath = RouteDefs.Areas.Application.getAction("Create").path;
    const detailPath = RouteDefs.Areas.Application.getAction("Detail").path;

    return (
      <SwitchWithErrors>
        <Route path={createPath} component={ApplicationCreate} />
        <Route path={detailPath} component={ApplicationDetail} />
        <Route path={indexPath} component={ApplicationIndex} />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(ApplicationArea);
