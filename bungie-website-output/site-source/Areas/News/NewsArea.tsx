import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { createAsyncComponent } from "../../Global/Routes/AsyncRoute";
import { Error404 } from "../../UI/Errors/Error404";

class NewsArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.News.getAction().path;
    const destinyPath = RouteDefs.Areas.News.getAction("destiny").path;
    const communityPath = RouteDefs.Areas.News.getAction("community").path;
    const updatesPath = RouteDefs.Areas.News.getAction("updates").path;

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <Route component={Error404} />
          <Route
            path={indexPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/News/News" /* webpackChunkName: "News-Category-All" */
                )
            )}
          />
          <Route
            path={destinyPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/News/News" /* webpackChunkName: "News-Category-Destiny" */
                )
            )}
          />
          <Route
            path={communityPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/News/News" /* webpackChunkName: "News-Category-Community" */
                )
            )}
          />
          <Route
            path={updatesPath}
            exact={true}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/News/News" /* webpackChunkName: "News-Category-Updates" */
                )
            )}
          />
          <Route
            path={`${indexPath}/:articleUrl`}
            component={createAsyncComponent(
              () =>
                import(
                  "@Areas/News/NewsArticle" /* webpackChunkName: "News-NewsArticle" */
                )
            )}
          />
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(NewsArea);
