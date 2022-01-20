import { AsyncRoute } from "@Routes/AsyncRoute";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Route } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import News from "./News";

class NewsArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexPath = RouteDefs.Areas.News.getAction().path;
    const destinyPath = RouteDefs.Areas.News.getAction("destiny").path;
    const communityPath = RouteDefs.Areas.News.getAction("community").path;
    const updatesPath = RouteDefs.Areas.News.getAction("updates").path;

    return (
      <React.Fragment>
        <SwitchWithErrors>
          <AsyncRoute
            path={indexPath}
            exact={true}
            component={() =>
              import("@Areas/News/News" /* webpackChunkName: "News-News" */)
            }
          />
          <Route path={destinyPath} exact={true} component={News} />
          <Route path={communityPath} exact={true} component={News} />
          <Route path={updatesPath} exact={true} component={News} />
          <AsyncRoute
            path={`${indexPath}/:articleUrl`}
            component={() =>
              import(
                "@Areas/News/NewsArticle" /* webpackChunkName: "News-NewsArticle" */
              )
            }
          />
        </SwitchWithErrors>
      </React.Fragment>
    );
  }
}

export default WithRouteData(NewsArea);
