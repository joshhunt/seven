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
import { Platform } from "@Platform";
import { DestinyComponentType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";

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

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!loggedIn) {
      FireteamsDestinyMembershipDataStore.actions.resetMembership();
      // Nothing to load. The user is not logged in.
      setIsLoading(false);
    } else if (!destinyData.loaded) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyData.loaded, loggedIn]);
  useEffect(() => {
    if (!destinyData.loaded) {
      return;
    }
    const checkDestinyMemberships = async () => {
      for (const membership of destinyData.memberships) {
        const profileResponse = await Platform.Destiny2Service.GetProfile(
          membership.membershipType,
          membership.membershipId,
          [DestinyComponentType.Profiles]
        );
        if (
          profileResponse?.profile?.data?.lifetimeHighestGuardianRank >=
          minimumLifetimeGuardianRank
        ) {
          FireteamsDestinyMembershipDataStore.actions.updatePlatform(
            membership.membershipType.toString()
          );
        }
      }
    };
    checkDestinyMemberships()
      .catch((e) => {
        // If it's an unknown error then let the error boundary take care of it.
        setIsLoading(() => {
          throw e;
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [destinyData.memberships]);

  return (
    <SpinnerContainer loading={isLoading} delayRenderUntilLoaded>
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
