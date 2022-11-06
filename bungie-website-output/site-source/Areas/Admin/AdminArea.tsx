// Created by atseng, 2020
// Copyright Bungie, Inc.

import { NewsMigrator } from "@Areas/Admin/NewsMigrator";
import { Report } from "@Areas/Admin/Report";
import Reports from "@Areas/Admin/Reports";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";

interface AdminAreaProps {}

interface AdminAreaState {}

export default class AdminArea extends React.Component<
  AdminAreaProps,
  AdminAreaState
> {
  constructor(props: AdminAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const reportsPath = RouteDefs.Areas.Admin.getAction("Reports").path;
    const reportPath = RouteDefs.Areas.Admin.getAction("Report").path;
    const newsMigrationPath = RouteDefs.Areas.Admin.getAction("MigrateNews")
      .path;

    return (
      <SwitchWithErrors>
        <Route path={reportsPath} component={Reports} />
        <Route path={reportPath} component={Report} />
        <Route path={newsMigrationPath} component={NewsMigrator} />
      </SwitchWithErrors>
    );
  }
}
