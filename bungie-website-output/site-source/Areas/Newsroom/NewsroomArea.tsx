import { WithRouteData } from "@UI/Navigation/WithRouteData";
import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Localizer } from "@bungie/localization/Localizer";

class NewsroomArea extends React.Component<RouteComponentProps> {
  public render() {
    return <Redirect to={`/${Localizer.CurrentCultureName}/News`} />;
  }
}

export default WithRouteData(NewsroomArea);
