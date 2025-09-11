// Created by atseng, 2022
// Copyright Bungie, Inc.

import React, { PropsWithChildren, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Index from "@Areas/FireteamFinder/Index";
import { BrowseActivities } from "./BrowseActivities";
import { Create } from "@Areas/FireteamFinder/Create";
import { Detail } from "@Areas/FireteamFinder/Detail";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { FireteamsDestinyMembershipDataStore } from "./DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { DestinyComponentType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import { useMultipleProfileData } from "@Global/Context/hooks/profileDataHooks";

/**
 * This component is in charge of loading the datastore with user data so all the components beneath it have that data when they mount.
 * It is also in charge of selecting the correct platform that has the required guardian rank.
 */
const FireteamEligibleCharacterProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const destinyData = useDataStore(FireteamsDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const loggedIn = UserUtils.isAuthenticated(globalState);
  const minimumLifetimeGuardianRank = ConfigUtils.GetParameter(
    "FireteamFinderCreationGuardianRankRequirement",
    "MinimumLifetimeGuardianRank",
    3
  );
  const profiles = useMultipleProfileData(
    destinyData.memberships?.map((m) => ({
      membershipType: m.membershipType,
      membershipId: m.membershipId,
      components: [DestinyComponentType.Profiles],
    })) ?? []
  );
  useEffect(() => {
    if (!loggedIn) {
      FireteamsDestinyMembershipDataStore.actions.resetMembership();
    } else if (!destinyData.loaded) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyData.loaded, loggedIn]);

  useEffect(() => {
    if (!destinyData.loaded) {
      return;
    }
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const membership = destinyData.memberships[i];
      if (
        profile.profile?.profile?.data?.lifetimeHighestGuardianRank >=
        minimumLifetimeGuardianRank
      ) {
        FireteamsDestinyMembershipDataStore.actions.updatePlatform(
          membership.membershipType.toString()
        );
        break;
      }
    }
  }, [destinyData.loaded, destinyData.memberships, profiles]);

  return (
    <SpinnerContainer
      loading={
        (loggedIn && !destinyData.loaded) || profiles.some((p) => p.isLoading)
      }
      delayRenderUntilLoaded
    >
      {children}
    </SpinnerContainer>
  );
};

const FireteamFinderArea: React.FC = () => {
  const browsePath = RouteDefs.Areas.FireteamFinder.getAction("Browse").path;
  const detailPath = RouteDefs.Areas.FireteamFinder.getAction("Detail").path;
  const createPath = RouteDefs.Areas.FireteamFinder.getAction("Create").path;
  const indexPath = RouteDefs.Areas.FireteamFinder.getAction("Index").path;
  return (
    <FireteamEligibleCharacterProvider>
      <SwitchWithErrors>
        <Route path={indexPath} exact={true} component={Index} />
        <Route path={browsePath} exact={true} component={BrowseActivities} />
        <Route path={detailPath} component={Detail} />
        <Route path={createPath} component={Create} />
      </SwitchWithErrors>
    </FireteamEligibleCharacterProvider>
  );
};

export default FireteamFinderArea;
