import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { createAsyncComponent } from "@Routes/AsyncRoute";

class NewsroomArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.Newsroom.getAction().path;
    const articlePath = RouteDefs.Areas.Newsroom.getAction("article").path;

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <Route
            path={indexPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Newsroom/ArticleList" /* webpackChunkName: "Newsroom-ArticleList" */
                )
            )}
          />
          <Route
            path={articlePath}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/Newsroom/Article" /* webpackChunkName: "Newsroom-Article" */
                )
            )}
          />
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(NewsroomArea);
