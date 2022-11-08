import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { createAsyncComponent } from "@Routes/AsyncRoute";

class BungieTechArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.BungieTech.getAction().path;
    const articlePath = RouteDefs.Areas.BungieTech.getAction("article").path;

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <Route
            path={indexPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/BungieTech/ArticleList" /* webpackChunkName: "BungieTech-ArticleList" */
                )
            )}
          />
          <Route
            path={articlePath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/BungieTech/Article" /* webpackChunkName: "BungieTech-Article" */
                )
            )}
          />
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(BungieTechArea);
