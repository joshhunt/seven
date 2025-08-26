import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Characters, GroupsV2, Platform, User } from "@Platform";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";

export interface MembershipPair {
  membershipId: string;
  membershipType: BungieMembershipType;
}

export interface MembershipCharacter {
  id: string;
  emblem: string;
  membershipType: BungieMembershipType;
  characterData: Characters.DestinyCharacterComponent;
  characterProgressions: Characters.DestinyCharacterProgressionComponent | null;
  isOverridden?: boolean;
}

export interface MembershipAndCharacters {
  membershipId: string;
  characterList: MembershipCharacter[];
}

export interface DestinyMembershipState {
  membershipData: User.UserMembershipData | null;
  selectedMembership: GroupsV2.GroupUserInfoCard | null;
  membershipCharacters: MembershipAndCharacters;
  allPlatformCharacters: MembershipCharacter[];
  selectedPlatformId: string | undefined;
  selectedCharacterId: string | undefined;
  isCrossSaved: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initializeProfileData = async (
  membershipType: BungieMembershipType,
  membershipId: string
): Promise<MembershipAndCharacters | null> => {
  if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
    return null;
  }

  if (!membershipType || !membershipId) {
    console.error("Invalid membershipType or membershipId provided");
    return null;
  }

  try {
    const profileResponse = await Platform.Destiny2Service.GetProfile(
      membershipType,
      membershipId,
      [
        DestinyComponentType.Characters,
        DestinyComponentType.CharacterProgressions,
        DestinyComponentType.PresentationNodes,
        DestinyComponentType.Records,
        DestinyComponentType.Collectibles,
        DestinyComponentType.Metrics,
        DestinyComponentType.StringVariables,
      ]
    );

    if (!profileResponse) {
      console.error("No profile response received");
      return {
        membershipId,
        characterList: [],
      };
    }

    const characterIdArray: string[] = Object.keys(
      profileResponse?.characters?.data || {}
    );

    if (!characterIdArray || characterIdArray.length === 0) {
      return {
        membershipId,
        characterList: [],
      };
    }

    const membershipCharacterList: MembershipCharacter[] = [];

    characterIdArray.forEach((characterId: string) => {
      const characterDataForId =
        profileResponse?.characters?.data?.[characterId];
      const characterProgressionsForId =
        profileResponse?.characterProgressions?.data?.[characterId];

      if (characterDataForId) {
        membershipCharacterList.push({
          id: characterDataForId.characterId || characterId,
          emblem: characterDataForId.emblemPath || "",
          membershipType: characterDataForId.membershipType,
          characterData: characterDataForId,
          characterProgressions: characterProgressionsForId || null,
        });
      }
    });

    const membershipCharacters: MembershipAndCharacters = {
      membershipId,
      characterList: membershipCharacterList,
    };

    return membershipCharacters;
  } catch (error) {
    console.error(
      `Error fetching profile data for membership ${membershipId} (${membershipType}):`,
      error
    );
    return null;
  }
};

export const loadUserData = createAsyncThunk<
  Partial<DestinyMembershipState>,
  | {
      membershipPair?: MembershipPair;
      showAllMembershipsWhenCrossaved?: boolean;
    }
  | undefined,
  { state: { destinyAccount: DestinyMembershipState } }
>(
  "destinyAccount/loadUserData",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const {
        membershipPair,
        showAllMembershipsWhenCrossaved = false,
      } = params;

      const state = getState() as { destinyAccount: DestinyMembershipState };
      const currentState = state?.destinyAccount;

      if (!currentState) {
        console.error("No current state available");
        return rejectWithValue("No current state available");
      }

      let membershipData = currentState?.membershipData;

      // Early return if already succeeded and no specific membership requested
      // (Removed to always re-fetch on new session or user)
      // if (currentState.status === 'succeeded' && !membershipPair) {
      //     return currentState;
      // }

      if (!membershipPair) {
        try {
          membershipData = await Platform.UserService.GetMembershipDataForCurrentUser();
        } catch (error) {
          console.error("Cannot load current user data:", error);
          return rejectWithValue(
            error?.toString() || "Unknown error loading current user"
          );
        }
      } else {
        try {
          membershipData = await Platform.UserService.GetMembershipDataById(
            membershipPair.membershipId,
            membershipPair.membershipType
          );
        } catch (error) {
          console.error(
            `Cannot load user data for ${membershipPair.membershipType}/${membershipPair.membershipId}`
          );
          return rejectWithValue(
            error?.toString() || "Unknown error loading user data"
          );
        }
      }

      if (!membershipData) {
        return rejectWithValue("No membership data received");
      }

      const isCrossSaved =
        typeof membershipData?.primaryMembershipId !== "undefined";
      let memberships = membershipData?.destinyMemberships;

      if (isCrossSaved && !showAllMembershipsWhenCrossaved) {
        memberships = [
          membershipData?.destinyMemberships?.find(
            (a) => a?.membershipId === membershipData?.primaryMembershipId
          ),
        ].filter(Boolean) as GroupsV2.GroupUserInfoCard[];
      }

      if (!memberships || memberships.length === 0) {
        return {
          membershipData,
          selectedMembership: null,
          membershipCharacters: { membershipId: "", characterList: [] },
          selectedPlatformId: undefined,
          selectedCharacterId: undefined,
          isCrossSaved: false,
        };
      }

      let membershipToUse: GroupsV2.GroupUserInfoCard;

      if (membershipPair) {
        const found = memberships.find(
          (m) => m?.membershipId === membershipPair.membershipId
        );
        membershipToUse = found || memberships[0];
      } else if (currentState?.selectedMembership) {
        const found = memberships.find(
          (m) =>
            m?.membershipId === currentState.selectedMembership?.membershipId
        );
        membershipToUse = found || memberships[0];
      } else {
        membershipToUse = memberships[0];
      }

      if (!membershipToUse) {
        return rejectWithValue("No valid membership found");
      }

      let membershipAndCharacters: MembershipAndCharacters | null = null;

      try {
        membershipAndCharacters = await initializeProfileData(
          membershipToUse.membershipType,
          membershipToUse.membershipId
        );
      } catch (error) {
        console.error("Error initializing profile data:", error);
        return rejectWithValue(
          error?.toString() || "Unknown error initializing profile data"
        );
      }

      if (!membershipAndCharacters) {
        membershipAndCharacters = {
          membershipId: membershipToUse.membershipId || "",
          characterList: [],
        };
      }

      const selectedPlatformId = membershipToUse.membershipId;
      const selectedCharacterId =
        membershipAndCharacters.characterList?.length > 0
          ? membershipAndCharacters.characterList[0]?.id
          : undefined;

      return {
        membershipData,
        selectedMembership: membershipToUse,
        membershipCharacters: membershipAndCharacters,
        selectedPlatformId,
        selectedCharacterId,
        isCrossSaved,
      };
    } catch (error) {
      console.error("Error in loadUserData:", error);
      return rejectWithValue(
        error?.toString() || "Unknown error in loadUserData"
      );
    }
  }
);

export const updatePlatform = createAsyncThunk<
  Partial<DestinyMembershipState>,
  string,
  { state: { destinyAccount: DestinyMembershipState } }
>(
  "destinyAccount/updatePlatform",
  async (membershipType: string, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentState = state?.destinyAccount;

      if (
        !currentState?.membershipData?.destinyMemberships ||
        currentState.membershipData.destinyMemberships.length === 0
      ) {
        return rejectWithValue("No memberships available");
      }

      const membershipToUse = currentState.membershipData.destinyMemberships.find(
        (m) =>
          EnumUtils.looseEquals(
            m?.membershipType,
            membershipType,
            BungieMembershipType
          )
      );

      if (!membershipToUse) {
        return rejectWithValue("Platform not found in available memberships");
      }

      let membershipAndCharacters: MembershipAndCharacters | null = null;

      try {
        membershipAndCharacters = await initializeProfileData(
          membershipToUse.membershipType,
          membershipToUse.membershipId
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
        return rejectWithValue(
          error?.toString() || "Unknown error fetching profile data"
        );
      }

      if (!membershipAndCharacters) {
        membershipAndCharacters = {
          membershipId: membershipToUse.membershipId || "",
          characterList: [],
        };
      }

      const selectedPlatformId = membershipToUse.membershipId;
      const selectedCharacterId =
        membershipAndCharacters.characterList?.length > 0
          ? membershipAndCharacters.characterList[0]?.id
          : undefined;

      return {
        selectedMembership: membershipToUse,
        membershipCharacters: membershipAndCharacters,
        selectedPlatformId,
        selectedCharacterId,
      };
    } catch (error) {
      console.error("Error in updatePlatform thunk:", error);
      return rejectWithValue(
        error?.toString() || "Unknown error in updatePlatform"
      );
    }
  }
);

const initialState: DestinyMembershipState = {
  membershipData: null,
  selectedMembership: null,
  membershipCharacters: { membershipId: "", characterList: [] },
  allPlatformCharacters: [],
  selectedPlatformId: undefined,
  selectedCharacterId: undefined,
  isCrossSaved: false,
  status: "idle",
  error: null,
};

const destinyAccountSlice = createSlice({
  name: "destinyAccount",
  initialState,
  reducers: {
    updateCharacter: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return;
      }

      // Look for the character in both single platform characters and all platform characters
      const characterInSinglePlatform = state.membershipCharacters?.characterList?.find(
        (char) => char?.id === action.payload
      );

      const characterInAllPlatforms = state.allPlatformCharacters?.find(
        (char) => char?.id === action.payload
      );

      if (characterInSinglePlatform || characterInAllPlatforms) {
        state.selectedCharacterId = action.payload;
      }
    },
    resetMembership: () => {
      return initialState;
    },
    setAllPlatformCharacters: (
      state,
      action: PayloadAction<MembershipCharacter[]>
    ) => {
      state.allPlatformCharacters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        if (action.payload) {
          if (action.payload.membershipData !== undefined) {
            state.membershipData = action.payload.membershipData;
          }
          if (action.payload.selectedMembership !== undefined) {
            state.selectedMembership = action.payload.selectedMembership;
          }
          if (action.payload.membershipCharacters !== undefined) {
            state.membershipCharacters = action.payload.membershipCharacters;
          }
          if (action.payload.selectedPlatformId !== undefined) {
            state.selectedPlatformId = action.payload.selectedPlatformId;
          }
          if (action.payload.selectedCharacterId !== undefined) {
            state.selectedCharacterId = action.payload.selectedCharacterId;
          }
          if (action.payload.isCrossSaved !== undefined) {
            state.isCrossSaved = action.payload.isCrossSaved;
          }
        }
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(updatePlatform.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePlatform.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        if (action.payload) {
          if (action.payload.selectedMembership !== undefined) {
            state.selectedMembership = action.payload.selectedMembership;
          }
          if (action.payload.membershipCharacters !== undefined) {
            state.membershipCharacters = action.payload.membershipCharacters;
          }
          if (action.payload.selectedPlatformId !== undefined) {
            state.selectedPlatformId = action.payload.selectedPlatformId;
          }
          if (action.payload.selectedCharacterId !== undefined) {
            state.selectedCharacterId = action.payload.selectedCharacterId;
          }
        }
      })
      .addCase(updatePlatform.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(loadAllPlatformCharacters.fulfilled, (state, action) => {
        state.allPlatformCharacters = action.payload;

        // If no character is currently selected and we have characters from all platforms, select the first one
        if (!state.selectedCharacterId && action.payload.length > 0) {
          state.selectedCharacterId = action.payload[0].id;
        }
      })
      .addCase(loadAllPlatformCharacters.rejected, (state, action) => {
        console.error(
          "Failed to load all platform characters:",
          action.payload
        );
      });
  },
});

export const {
  updateCharacter,
  resetMembership,
  setAllPlatformCharacters,
} = destinyAccountSlice.actions;

// --- Selectors ---

/** Shorthand for safe access to the slice. */
const safeDestinyAccount = (state: {
  destinyAccount?: DestinyMembershipState;
}) => state?.destinyAccount ?? initialState;

export const selectDestinyAccount = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state);

export const selectMembershipData = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).membershipData;

/**
 * Selector that returns available destiny memberships from the membership data
 */
export const selectMemberships = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).membershipData?.destinyMemberships || [];

/**
 * Selector that returns the currently selected membership
 */
export const selectSelectedMembership = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).selectedMembership ?? null;

/**
 * Selector that returns the membership and characters data for the current selection
 */
export const selectMembershipCharacters = (state: {
  destinyAccount?: DestinyMembershipState;
}) =>
  safeDestinyAccount(state).membershipCharacters ?? {
    membershipId: "",
    characterList: [],
  };

/**
 * Selector that returns all characters for the currently selected membership as an array
 */
export const selectCharactersForSelectedPlatform = (state: {
  destinyAccount?: DestinyMembershipState;
}): MembershipCharacter[] => {
  return safeDestinyAccount(state).membershipCharacters?.characterList || [];
};

/**
 * Selector that returns all characters from all platforms
 */
export const selectAllPlatformCharacters = (state: {
  destinyAccount?: DestinyMembershipState;
}): MembershipCharacter[] => {
  return safeDestinyAccount(state).allPlatformCharacters || [];
};

/**
 * Selector that returns characters based on showAllPlatformCharacters flag
 * This is the main selector that components should use for character lists
 */
export const selectCharacters = (
  showAllPlatformCharacters: boolean = false
) => (state: {
  destinyAccount?: DestinyMembershipState;
}): MembershipCharacter[] => {
  if (showAllPlatformCharacters) {
    return safeDestinyAccount(state).allPlatformCharacters || [];
  } else {
    return safeDestinyAccount(state).membershipCharacters?.characterList || [];
  }
};

/**
 * Selector that returns the currently selected character object
 */
export const selectSelectedCharacter = (state: {
  destinyAccount?: DestinyMembershipState;
}): MembershipCharacter | null => {
  const selectedId = safeDestinyAccount(state).selectedCharacterId;
  if (!selectedId) return null;

  const account = safeDestinyAccount(state);

  // First try to find in single platform characters
  const characterInSinglePlatform = account.membershipCharacters?.characterList?.find(
    (char) => char?.id === selectedId
  );

  if (characterInSinglePlatform) {
    return characterInSinglePlatform;
  }

  // If not found, try in all platform characters
  const characterInAllPlatforms = account.allPlatformCharacters?.find(
    (char) => char?.id === selectedId
  );

  return characterInAllPlatforms || null;
};

/**
 * Selector that returns just the selected character ID
 */
export const selectSelectedCharacterId = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).selectedCharacterId;

/**
 * Selector that returns the selected platform ID
 */
export const selectSelectedPlatformId = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).selectedPlatformId;

export const selectIsCrossSaved = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).isCrossSaved;

export const selectStatus = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).status;

export const selectError = (state: {
  destinyAccount?: DestinyMembershipState;
}) => safeDestinyAccount(state).error;

// --- Derived Selectors ---

/**
 * Selector that returns whether the user has any characters
 */
export const selectHasCharacters = (state: {
  destinyAccount?: DestinyMembershipState;
}): boolean => {
  return (
    (safeDestinyAccount(state).membershipCharacters?.characterList?.length ||
      0) > 0
  );
};

/**
 * Selector that returns whether the account data is fully loaded
 */
export const selectIsDataLoaded = (state: {
  destinyAccount?: DestinyMembershipState;
}): boolean => {
  const account = safeDestinyAccount(state);
  return account.status === "succeeded" && account.membershipData !== null;
};

/**
 * Selector that returns the current membership type (platform) as a string
 */
export const selectCurrentPlatformType = (state: {
  destinyAccount?: DestinyMembershipState;
}): BungieMembershipType | null => {
  return safeDestinyAccount(state).selectedMembership?.membershipType || null;
};

/**
 * Async action to load characters from all platforms
 */
export const loadAllPlatformCharacters = createAsyncThunk<
  MembershipCharacter[],
  void,
  { state: { destinyAccount: DestinyMembershipState } }
>(
  "destinyAccount/loadAllPlatformCharacters",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentState = state?.destinyAccount;

      if (!currentState?.membershipData?.destinyMemberships) {
        return rejectWithValue("No memberships available");
      }

      const allCharacters: MembershipCharacter[] = [];

      // Load characters from all platforms in parallel
      const characterPromises = currentState.membershipData.destinyMemberships.map(
        async (membership) => {
          try {
            const membershipAndCharacters = await initializeProfileData(
              membership.membershipType,
              membership.membershipId
            );
            return membershipAndCharacters?.characterList || [];
          } catch (error) {
            console.warn(
              `Failed to load characters for platform ${membership.membershipType}:`,
              error
            );
            return [];
          }
        }
      );

      const characterResults = await Promise.all(characterPromises);

      // Flatten all character arrays into a single array
      return characterResults.flat();
    } catch (error) {
      console.error("Error loading all platform characters:", error);
      return rejectWithValue(
        error?.toString() || "Unknown error loading all platform characters"
      );
    }
  }
);

export default destinyAccountSlice.reducer;
