import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { Responses } from "@Platform";
import { DateTime } from "luxon";
import React, { createContext, Dispatch, useReducer } from "react";
import { PropsWithChildren } from "react";

/** Holds a cache of profile data so pages don't have to fetch the data every time.
 * Prefer using the hook rather than this context directly.
 */
export const ProfileCacheContext = createContext<ProfileDataContextType>(null);
export const ProfileCacheContextDispatch = createContext<
  Dispatch<ProfileDataReducerAction>
>(null);

export function ProfileDataProvider({ children }: PropsWithChildren<unknown>) {
  const [profileData, profileDataDispatch] = useReducer(profileDataReducer, {});
  return (
    <ProfileCacheContext.Provider value={profileData}>
      <ProfileCacheContextDispatch.Provider value={profileDataDispatch}>
        {children}
      </ProfileCacheContextDispatch.Provider>
    </ProfileCacheContext.Provider>
  );
}

export type ProfileData = {
  data: Responses.DestinyProfileResponse;
  membershipId: string;
  membershipType: BungieMembershipType;
  components: DestinyComponentType[];
  loadedTimestamp: DateTime;
};

/**
 * A dictionary where the key is a concatenation of the membershipType and membershipId, separated by a hyphen (-)
 */
export type ProfileDataContextType = Record<string, ProfileData>;

type ProfileDataReducerAction = (
  data: ProfileDataContextType
) => ProfileDataContextType;
function profileDataReducer(
  profileData: ProfileDataContextType,
  action: ProfileDataReducerAction
) {
  return action(profileData);
}

export function generateProfileCacheKey(
  membershipType: BungieMembershipType,
  membershipId: string
) {
  return `${membershipType}-${membershipId}`;
}
