// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DestinyMembershipDataStorePayload } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";

export class ProfileUtils {
  public static IsViewingSelf(
    membershipId: string,
    globalState: GlobalState<"loggedInUser">,
    destinyMembership: DestinyMembershipDataStorePayload
  ) {
    const isLoggedIn =
      UserUtils.isAuthenticated(globalState) && globalState?.loggedInUser;
    const loggedInUserMembershipId = UserUtils.loggedInUserMembershipId(
      globalState
    );
    const loggedInMIDIsCurrentMembershipMID =
      loggedInUserMembershipId === membershipId;
    const loggedInMIDIsPlatformMID = destinyMembership?.memberships?.some(
      (m) => m.membershipId === loggedInUserMembershipId
    );
    const loggedInMIDIsBNetMID =
      destinyMembership?.membershipData?.bungieNetUser?.membershipId ===
      loggedInUserMembershipId;

    // check mid against the bungienet account and the platform accounts
    return (
      isLoggedIn &&
      (loggedInMIDIsCurrentMembershipMID ||
        loggedInMIDIsPlatformMID ||
        loggedInMIDIsBNetMID)
    );
  }
}
