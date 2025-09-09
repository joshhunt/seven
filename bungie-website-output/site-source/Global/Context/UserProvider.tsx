import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Spinner } from "@UI/UIKit/Controls/Spinner";
import { UserUtils } from "@Utilities/UserUtils";
import React, { PropsWithChildren, useState, useEffect } from "react";
import { useGameData } from "./hooks/gameDataHooks";

export function UserProvider({ children }: PropsWithChildren<unknown>) {
  const { loadMembershipData, resetMembershipData, isLoading } = useGameData();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    if (!UserUtils.isAuthenticated(globalState)) {
      resetMembershipData();
    } else {
      const membershipPair = {
        membershipId: globalState?.loggedInUser?.user?.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      };
      loadMembershipData(membershipPair);
    }
  }, [globalState?.loggedInUser?.user?.membershipId]);
  if (isLoading) {
    return <Spinner />;
  }
  return <>{children}</>;
}
