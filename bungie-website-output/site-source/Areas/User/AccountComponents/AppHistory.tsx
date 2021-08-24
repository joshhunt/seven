// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Applications, Platform, Queries } from "@Platform";
import React, { useEffect, useState } from "react";
import accountStyles from "../Account.module.scss";

interface AppHistoryProps {}

export const AppHistory: React.FC<AppHistoryProps> = (props) => {
  const globalStateData = useDataStore(
    GlobalStateDataStore,
    ["loggedinuser"],
    true
  );
  const [applicationList, setApplicationList] = useState<
    Applications.Application[]
  >([]);
  const [applicationHistory, setApplicationHistory] = useState<
    Queries.SearchResultDestinyItemActivityRecord
  >(null);
  /*
	   Data needed: 
	   [x] all apps
	   [] all activities
	   application history with
	   [] date
	   [] action
	   [] item
	   [] application
	   [] status
	 */

  useEffect(() => {
    Platform.ApplicationService.GetBungieApplications().then((data) => {
      setApplicationList(data);
    });
    Platform.ActivityService.GetDestinyItemActivities(
      BungieMembershipType.BungieNext,
      globalStateData.loggedInUser.user.membershipId,
      "", //this has to do with pagination
      2649,
      "", //not sure what this is, something about access/auth
      0,
      -1
    ).then((data) => {
      setApplicationHistory(data);
      // I get a successful call, but it's not getting things back, will probably need to be refactored
    });
  }, []);

  return <div />;
};
