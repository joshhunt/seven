// Created by atseng, 2023
// Copyright Bungie, Inc.

import { AdminHistory } from "@Areas/Clan/AdminHistory";
import { Banned } from "@Areas/Clan/Banned";
import { CultureFields } from "@Areas/Clan/CultureFields";
import { EditBanner } from "@Areas/Clan/EditBanner";
import { EditHistory } from "@Areas/Clan/EditHistory";
import { GeneralSettings } from "@Areas/Clan/GeneralSettings";
import { Profile } from "@Areas/Clan/Profile";
import { Settings } from "@Areas/Clan/Settings";
import { Invitations } from "@Areas/Clan/Invitations";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/RouteParams";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { WithRouteData } from "@UI/Navigation/WithRouteData";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import { Route, useParams } from "react-router";
import { RouteComponentProps } from "react-router-dom";

class ClanArea extends React.Component<RouteComponentProps> {
  public render() {
    const profilePath = RouteDefs.Areas.Clan.getAction("Profile").path;
    const settingsPath = RouteDefs.Areas.Clan.getAction("Settings").path;
    const editBannerPath = RouteDefs.Areas.Clan.getAction("EditBanner").path;
    const invitationsPath = RouteDefs.Areas.Clan.getAction("Invitations").path;
    const bannedPath = RouteDefs.Areas.Clan.getAction("Banned").path;
    const cultureFieldsPath = RouteDefs.Areas.Clan.getAction("CultureFields")
      .path;
    const generalSettingsPath = RouteDefs.Areas.Clan.getAction(
      "GeneralSettings"
    ).path;
    const adminHistoryPath = RouteDefs.Areas.Clan.getAction("AdminHistory")
      .path;
    const editHistoryPath = RouteDefs.Areas.Clan.getAction("EditHistory").path;

    return (
      <SwitchWithErrors>
        <Route path={profilePath} component={Profile} />
        <Route path={settingsPath} component={Settings} />
        <Route path={cultureFieldsPath} component={CultureFields} />
        <Route path={generalSettingsPath} component={GeneralSettings} />
        <Route path={invitationsPath} component={Invitations} />
        <Route path={bannedPath} component={Banned} />
        <Route path={editBannerPath} component={EditBanner} />
        <Route path={adminHistoryPath} component={AdminHistory} />
        <Route path={editHistoryPath} component={EditHistory} />
      </SwitchWithErrors>
    );
  }
}

export default WithRouteData(ClanArea);
