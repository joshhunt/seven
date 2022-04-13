// Created by atseng, 2022
// Copyright Bungie, Inc.

import Search from "@Areas/Search/Search";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import React from "react";
import { Route } from "react-router";

interface SearchAreaProps {}

interface SearchAreaState {}

class SearchArea extends React.Component<SearchAreaProps, SearchAreaState> {
  constructor(props: SearchAreaProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const searchPath = RouteDefs.Areas.Search.getAction("index").path;

    return (
      <SwitchWithErrors>
        <Route path={searchPath} component={Search} />
      </SwitchWithErrors>
    );
  }
}

export default SearchArea;
