import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  DestinyDataContext,
  DestinyDataContextType,
  DestinyDataDispatchContext,
} from "../GameDataProvider";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import { Platform } from "@Platform";
import { useProfileData } from "./profileDataHooks";

type MemberShipPair = {
  membershipId: string;
  membershipType: BungieMembershipType;
};

export type UseGameDataResponse = {
  destinyData: DestinyDataContextType;
  /** Loads the membership data of the current user or of the membership passed into the function. */
  loadMembershipData: (pair?: MemberShipPair) => Promise<void>;
  /** Sets the users selected membership. This will un-set the selected character because the new membership will have different characters. */
  selectMembership: (membershipId: string) => Promise<void>;
  /** Sets the user's selected character. This will update destinyData.selectedCharacterId */
  selectCharacter: (characterId: string) => void;
  /** Un-sets all membership, like if the user logs out  */
  resetMembershipData: () => void;
  isLoading: boolean;
  error?: string;
};

/**
 * Use this hook to get a Bungie user's membership data.
 * This hook pulls from a global data store so the membership data doesn't have to be fetched on every use.
 * @returns
 */
export function useGameData(): UseGameDataResponse {
  const destinyData = useContext(DestinyDataContext);
  const destinyDataDispatch = useContext(DestinyDataDispatchContext);

  // This will be used to select a character when the selected membership changes.
  const { profile } = useProfileData({
    membershipType: destinyData.selectedMembership?.membershipType,
    membershipId: destinyData.selectedMembership?.membershipId,
    components: [DestinyComponentType.Characters],
  });

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadMembershipData = useCallback(
    async (membershipPair?: MemberShipPair) => {
      if (!UserUtils.isAuthenticated(globalState) && !membershipPair) {
        throw new Error(
          "Cannot load membership data unless user is logged in, or specific user info is provided."
        );
      }
      setIsLoading(true);
      try {
        const membershipData =
          membershipPair?.membershipId && membershipPair.membershipType
            ? await Platform.UserService.GetMembershipDataById(
                membershipPair.membershipId,
                membershipPair.membershipType
              )
            : await Platform.UserService.GetMembershipDataForCurrentUser();
        destinyDataDispatch((curr) => {
          // Select the member that the hook consumer specified
          // If that is null then select the primary membership id if this account has one
          // If that is null then select the first one in the list.
          // If that is null then the user has no memberships and selectedMembership will not be set.
          const currentSelectedMembership =
            membershipData.destinyMemberships.find(
              (m) => m.membershipId === membershipPair?.membershipId
            ) ??
            membershipData.destinyMemberships.find(
              (m) => m.membershipId === membershipData.primaryMembershipId
            ) ??
            membershipData.destinyMemberships[0];
          return {
            ...curr,
            membershipData,
            selectedMembership: currentSelectedMembership,
          };
        });
        setError(undefined);
      } catch (e) {
        setError(parserError(e));
      } finally {
        setIsLoading(false);
      }
    },
    [UserUtils.isAuthenticated(globalState)]
  );

  const selectMembership = useCallback(
    async (membershipId: string) => {
      if (
        !destinyData.membershipData?.destinyMemberships ||
        destinyData.membershipData.destinyMemberships.length === 0
      ) {
        throw new Error("No memberships available");
      }

      const membershipToUse = destinyData.membershipData.destinyMemberships.find(
        (m) => m.membershipId === membershipId
      );
      if (!membershipToUse) {
        throw new Error("Membership not found in available memberships");
      }
      destinyDataDispatch((curr) => ({
        ...curr,
        selectedMembership: membershipToUse,
        selectedCharacterId: undefined,
      }));
    },
    [destinyData.membershipData?.destinyMemberships]
  );

  const selectCharacter = useCallback(async (characterId: string) => {
    destinyDataDispatch((curr) => ({
      ...curr,
      selectedCharacterId: characterId,
    }));
  }, []);

  const resetMembershipData = useCallback(() => {
    destinyDataDispatch(() => ({}));
  }, []);

  useEffect(() => {
    const ids = Object.keys(profile?.characters?.data ?? {});
    if (ids.length === 0) {
      return;
    }
    selectCharacter(ids[0]);
  }, [profile?.characters?.data]);

  return {
    destinyData,
    loadMembershipData,
    resetMembershipData,
    selectMembership,
    selectCharacter,
    isLoading,
    error,
  };
}

function parserError(e: unknown) {
  let err = JSON.stringify(e);
  if (e instanceof Error) {
    err = e.message;
  }
  return err;
}
