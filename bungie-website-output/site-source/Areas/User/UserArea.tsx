import React from "react";
import { RouteComponentProps, Route } from "react-router-dom";
import { RouteDefs } from "@Routes/RouteDefs";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import SignIn from "./SignIn";

class UserArea extends React.Component<RouteComponentProps> {
  public render() {
    const signInPath = RouteDefs.Areas.User.getAction("SignIn").path;

    return (
      <SwitchWithErrors>
        <Route path={signInPath} component={SignIn} />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(UserArea);
