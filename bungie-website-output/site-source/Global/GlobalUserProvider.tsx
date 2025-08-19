import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useState } from "react";
import { PropsWithChildren, useEffect } from "react";
import { GlobalStateDataStore } from "./DataStore/GlobalStateDataStore";
import { Spinner } from "@UI/UIKit/Controls/Spinner";
import { useAppDispatch } from "./Redux/store";
import {
  loadUserData,
  resetMembership,
} from "./Redux/slices/destinyAccountSlice";

export function GlobalUserProvider({ children }: PropsWithChildren<unknown>) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    if (!UserUtils.isAuthenticated(globalState)) {
      dispatch(resetMembership());
    } else {
      const membershipPair = {
        membershipId: globalState?.loggedInUser?.user?.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      };
      setIsLoading(true);
      dispatch(loadUserData({ membershipPair })).finally(() => {
        // The reason for not using the loading state property of the redux slice is that child components call `loadUserData` throughout the app.
        // If the loading state property was used then this component would unmount everything every time `loadUserData` was called.
        // TODO: Go through the app and remove calls to `loadUserData` since this provider component will take care of it for all of its children.
        setIsLoading(false);
      });
    }
  }, [globalState?.loggedInUser?.user?.membershipId]);
  if (isLoading) {
    return <Spinner />;
  }
  return <>{children}</>;
}
