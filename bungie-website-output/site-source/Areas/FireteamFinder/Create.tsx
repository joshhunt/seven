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
import React, { useEffect } from "react";
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
    /* Take date for scheduled item and get the diff between now and then. Must be greater than the past two days */
    const getIsExpired = (scheduledDate: string) => {
      if (!scheduledDate) {
        return false;
      }

      const diff = DateTime.fromISO(scheduledDate).diffNow("days");

      return diff.days > -2;
    };

    if (destinyMembership && !destinyMembership?.selectedCharacter) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyMembership?.selectedMembership?.membershipId]);

  const bgImage =
    "/7/ca/destiny/bgs/fireteamfinder/fireteam_finder_create_bg.jpg";

  const createLink = (activityGraphIdHash: number, activityIdHash: number) =>
    RouteHelper.FireteamFinderCreate({
      graphId: activityGraphIdHash.toString(),
      activityId: activityIdHash.toString(),
    });

  return (
    <>
      <Layout
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
            linkClick={createLink}
            activityType={SelectActivityType.CREATE}
          />
        )}
      </Layout>
    </>
  );
};
