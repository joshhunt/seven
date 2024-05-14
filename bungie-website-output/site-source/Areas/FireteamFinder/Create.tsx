// Created by atseng, 2023
// Copyright Bungie, Inc.

import CreateFireteam from "@Areas/FireteamFinder/Components/Create/CreateFireteam";
import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import SelectActivity, {
  SelectActivityType,
} from "@Areas/FireteamFinder/Components/Shared/SelectActivity";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/RouteParams";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface CreateProps {
  activityHashId?: number;
}

export const Create: React.FC<CreateProps> = (props) => {
  const { graphId, activityId } = useParams<IFireteamFinderParams>();
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const [createStep, setCreateStep] = React.useState(
    graphId && activityId ? 1 : 0
  );
  const [activityFilterCreate, setActivityFilterCreate] = useState("");
  //subtitle is dependent on the creation step
  const subtitle = (step: number) => {
    switch (step) {
      case 0:
        return Localizer.Fireteams.FirstSelectTheActivity;
      case 1:
        return Localizer.Fireteams.FinalizedOptions;
    }
  };

  //title is dependent on the creation step
  const title = (step: number) => {
    switch (step) {
      case 0:
        return Localizer.Fireteams.CreateFireteam;
      case 1:
        return Localizer.Fireteams.CreateListing;
    }
  };

  /* Get user's active listings. Setting current and inactive player lobbies */
  useEffect(() => {
    if (destinyMembership && !destinyMembership?.selectedCharacter) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyMembership?.selectedMembership?.membershipId]);

  const bgImage =
    "/7/ca/destiny/bgs/fireteamfinder/fireteam_finder_create_bg.jpg";

  const createLink = (activityGraphIdHash: number, activityIdHash: number) =>
    RouteHelper.FireteamFinderCreate({
      graphId: activityGraphIdHash?.toString(),
      activityId: activityIdHash?.toString(),
    });

  return (
    <>
      <Layout
        activityFilterString={activityFilterCreate}
        setActivityFilterString={setActivityFilterCreate}
        breadcrumbConfig={graphId && activityId ? "create" : "create-select"}
        buttonConfig={"none"}
        title={title(createStep)}
        subtitle={subtitle(createStep)}
        backgroundImage={bgImage}
      >
        {graphId && activityId ? (
          <CreateFireteam
            activityGraphId={graphId}
            activityId={activityId}
            updateStep={setCreateStep}
          />
        ) : (
          <SelectActivity
            activityFilterString={activityFilterCreate}
            setActivityFilterString={setActivityFilterCreate}
            linkClick={createLink}
            activityType={SelectActivityType.CREATE}
          />
        )}
      </Layout>
    </>
  );
};
