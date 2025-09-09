import { Characters, GroupsV2, User } from "@Platform";
import React, { createContext, Dispatch, useReducer } from "react";
import { PropsWithChildren } from "react";

/** Holds the signed in user's destiny data
 * Prefer using the hook rather than this context directly.
 */
export const DestinyDataContext = createContext<DestinyDataContextType>(null);
export const DestinyDataDispatchContext = createContext<
  Dispatch<DestinyDataReducerAction>
>(null);

export function GameDataProvider({ children }: PropsWithChildren<unknown>) {
  const [destinyData, dispatchDestinyData] = useReducer(
    destinyDataReducer,
    initialDestinyData
  );
  return (
    <DestinyDataContext.Provider value={destinyData}>
      <DestinyDataDispatchContext.Provider value={dispatchDestinyData}>
        {children}
      </DestinyDataDispatchContext.Provider>
    </DestinyDataContext.Provider>
  );
}

export type DestinyCharacter = {
  id: string;
  emblem: string;
  characterData: Characters.DestinyCharacterComponent;
  characterProgressions?: Characters.DestinyCharacterProgressionComponent;
};

export type DestinyDataContextType = {
  membershipData?: User.UserMembershipData;
  selectedMembership?: GroupsV2.GroupUserInfoCard;
  selectedPlatformId?: string;
  selectedCharacterId?: string;
};

type DestinyDataReducerAction = (
  data: DestinyDataContextType
) => DestinyDataContextType;

function destinyDataReducer(
  destinyData: DestinyDataContextType,
  action: DestinyDataReducerAction
) {
  return action(destinyData);
}

const initialDestinyData: DestinyDataContextType = {};
