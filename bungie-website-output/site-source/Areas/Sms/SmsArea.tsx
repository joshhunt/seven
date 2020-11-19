import { SmsPage } from "@Areas/Sms/SmsPage";
import { RouteComponentProps, Route } from "react-router-dom";
import React from "react";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { RouteDefs } from "@Routes/RouteDefs";

class SmsArea extends React.Component<RouteComponentProps> {
  public render() {
    const indexUrl = RouteDefs.Areas.Sms.getAction("Index").path;

    return <Route path={indexUrl} component={SmsPage} />;
  }
}

export default WithRouteData(SmsArea);
