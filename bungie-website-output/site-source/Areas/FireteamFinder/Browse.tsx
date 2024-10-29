// Created by atseng, 2023
// Copyright Bungie, Inc.

import BrowseFireteams from "@Areas/FireteamFinder/Components/Browse/BrowseFireteams";
import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import SelectActivity, {
  SelectActivityType,
} from "@Areas/FireteamFinder/Components/Shared/SelectActivity";
import { Localizer } from "@bungie/localization/Localizer";
import { DestinyDefinitionType } from "@Database/DestinyDefinitions/DestinyDefinitions";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/Definitions/RouteParams";
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

interface BrowseProps
  extends D2DatabaseComponentProps<
    "DestinyFireteamFinderActivityGraphDefinition"
  > {}
const Browse: React.FC<BrowseProps> = (props) => {
  const { graphId } = useParams<IFireteamFinderParams>();
  const bgImage =
    "/7/ca/destiny/bgs/fireteamfinder/fireteam_finder_search_bg.jpg";
  const [title, setTitle] = useState<string>();
  const [subtitle, setSubtitle] = useState<string>();
  const location = useLocation();
  const selectLink = (activityGraphIdHash: number) =>
    RouteHelper.FireteamFinderBrowse({
      graphId: activityGraphIdHash.toString(),
    });

  const currentRouteAction = UrlUtils.GetUrlAction(location);
  const showBrowseActivitySelection =
    currentRouteAction.toLowerCase() === "browse" && !graphId;
  const [activityFilterBrowse, setActivityFilterBrowse] = useState("");
  //for search results
  useEffect(() => {
    let activityGraphDefinition = props.definitions?.DestinyFireteamFinderActivityGraphDefinition?.get(
      graphId
    );
    let playerElectedDifficulty = "";
    if (activityGraphDefinition?.isPlayerElectedDifficultyNode) {
      playerElectedDifficulty =
        activityGraphDefinition?.displayProperties?.name;
      activityGraphDefinition = props.definitions.DestinyFireteamFinderActivityGraphDefinition?.get(
        activityGraphDefinition?.parentHash
      );
    }
    setTitle(activityGraphDefinition?.displayProperties?.name);
    setSubtitle(playerElectedDifficulty);
  }, [graphId]);

  return showBrowseActivitySelection ? (
    <Layout
      activityFilterString={activityFilterBrowse}
      setActivityFilterString={setActivityFilterBrowse}
      breadcrumbConfig={"browse-select"}
      buttonConfig={"none"}
      title={Localizer.Fireteams.BrowseTitle}
      subtitle={Localizer.Fireteams.FirstSelectTheActivity}
      backgroundImage={bgImage}
    >
      <SelectActivity
        linkClick={selectLink}
        activityType={SelectActivityType.BROWSE}
        activityFilterString={activityFilterBrowse}
        setActivityFilterString={setActivityFilterBrowse}
      />
    </Layout>
  ) : (
    <Layout
      breadcrumbConfig={"browse"}
      buttonConfig={"browse"}
      title={title}
      subtitle={subtitle}
      backgroundImage={bgImage}
    >
      <BrowseFireteams />
    </Layout>
  );
};

export default withDestinyDefinitions(Browse, {
  types: [
    "DestinyFireteamFinderActivityGraphDefinition" as DestinyDefinitionType,
  ],
});
