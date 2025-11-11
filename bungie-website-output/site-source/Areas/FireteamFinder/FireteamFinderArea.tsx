// Created by atseng, 2022
// Copyright Bungie, Inc.

import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Route } from "react-router-dom";
import Index from "@Areas/FireteamFinder/Index";
import { BrowseActivities } from "./BrowseActivities";
import { Create } from "@Areas/FireteamFinder/Create";
import { Detail } from "@Areas/FireteamFinder/Detail";
import { RouteDefs } from "@Routes/RouteDefs";
import { SwitchWithErrors } from "@UI/Navigation/SwitchWithErrors";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { DestinyComponentType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import { useMultipleProfileData } from "@Global/Context/hooks/profileDataHooks";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { LoggedOutView } from "./Components/Layout/LoggedOutView";

const minimumLifetimeGuardianRank = ConfigUtils.GetParameter(
  "FireteamFinderCreationGuardianRankRequirement",
  "MinimumLifetimeGuardianRank",
  3
);
/**
 * This component is in charge of loading the datastore with user data so all the components beneath it have that data when they mount.
 * It is also in charge of selecting the correct platform that has the required guardian rank.
 */
const FireteamEligibleCharacterProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const {
    destinyData,
    selectMembership,
    selectCharacter,
    isLoading,
  } = useGameData();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const loggedIn = UserUtils.isAuthenticated(globalState);
  const profiles = useMultipleProfileData(
    destinyData.membershipData?.destinyMemberships?.map((m) => ({
      membershipType: m.membershipType,
      membershipId: m.membershipId,
      components: [
        DestinyComponentType.Profiles,
        DestinyComponentType.Characters,
      ],
    })) ?? []
  );

  useEffect(() => {
    const membership = profiles.find(
      (p) =>
        p.profile?.profile?.data?.lifetimeHighestGuardianRank >=
        minimumLifetimeGuardianRank
    );
    if (!membership) {
      return;
    }
    selectMembership(membership.membershipId);
    const charactersIds = Object.keys(
      profiles.find((p) => p.membershipId === membership?.membershipId)?.profile
        ?.characters?.data ?? {}
    );
    const characterId = charactersIds.find(
      (c) => c === destinyData.selectedCharacterId
    );
    if (characterId || charactersIds[0]) {
      selectCharacter(characterId ?? charactersIds[0]);
    }
  }, [profiles]);

  const lifetimeHighestGuardianRank = useMemo(() => {
    return profiles.find(
      (p) => p.membershipId === destinyData.selectedMembership?.membershipId
    )?.profile?.profile?.data?.lifetimeHighestGuardianRank;
  }, [profiles]);

  return (
    <SpinnerContainer
      loading={isLoading || profiles.some((p) => p.isLoading)}
      delayRenderUntilLoaded
    >
      {!loggedIn ? (
        <LoggedOutView errorType={"SignedOut"} />
      ) : !destinyData.selectedMembership ||
        !destinyData.selectedCharacterId ? (
        <LoggedOutView errorType={"NoCharacter"} />
      ) : lifetimeHighestGuardianRank < minimumLifetimeGuardianRank ? (
        <LoggedOutView errorType={"NotHighEnoughRank"} />
      ) : (
        children
      )}
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
