// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import {
  Characters,
  Components,
  GroupsV2,
  Inventory,
  Platform,
  Responses,
  User,
} from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";

export interface DestinyMembershipDataStorePayload {
  membershipData: User.UserMembershipData;
  memberships: GroupsV2.GroupUserInfoCard[];
  selectedMembership: GroupsV2.GroupUserInfoCard;
  characters: { [key: string]: Characters.DestinyCharacterComponent };
  selectedCharacter: Characters.DestinyCharacterComponent;
  equipment: { [key: string]: Inventory.DestinyInventoryComponent };
  loaded: boolean;
  isCrossSaved: boolean;
}

export interface MembershipPair {
  membershipId: string;
  membershipType: BungieMembershipType;
}

export abstract class DestinyMembershipDataStore extends DataStore<
  DestinyMembershipDataStorePayload
> {
  private isInitialized = false;
  public actions = this.createActions({
    /**
     * Refresh state with all valid destiny memberships for user, accounting for cross save.
     * Loads current user by default, unless membership info is provided
     * showAllMembershipsWhenCrossaved makes it so that you can access every membership, not just the primary one
     */
    loadUserData: async (
      state,
      user?: MembershipPair,
      force = false,
      showAllMembershipsWhenCrossaved = false
    ) => {
      if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
        return {
          membershipData: null,
          memberships: [],
          characters: {},
          selectedCharacter: null,
          selectedMembership: null,
          equipment: null,
          isCrossSaved: false,
          loaded: true,
        };
      }

      const isSameMembershipType =
        user &&
        user?.membershipType === this.state.selectedMembership?.membershipType;
      const isSameBungieMembershipId =
        user &&
        user?.membershipId ===
          this.state.membershipData?.bungieNetUser?.membershipId;
      const isNewMembershipIdIncludedInCurrentDestinyMemberships = this.state.membershipData?.destinyMemberships?.some(
        (u) => u?.membershipId === user?.membershipId
      );

      const isSameUser =
        user?.membershipId &&
        isSameMembershipType && //Check for same platform/membershipType
        (isSameBungieMembershipId || // Check for same Bungie.net ID
          isNewMembershipIdIncludedInCurrentDestinyMemberships); // Check for same Destiny ID

      if (!force) {
        if (isSameUser && this.isInitialized) {
          return;
        }
      }

      const loggedInUserIsDefined = user?.membershipId !== undefined;

      if (
        !loggedInUserIsDefined &&
        !UserUtils.isAuthenticated(GlobalStateDataStore.state)
      ) {
        console.warn(
          "Cannot load membership data unless user is logged in, or specific user info is provided."
        );

        return;
      }

      this.isInitialized = true;

      // if we were given a new user, or logged out or in then we don't have up-to-date membershipdata, otherwise we don't need to fetch it again
      let membershipData =
        !isSameUser || !loggedInUserIsDefined
          ? null
          : this.state.membershipData;

      if (!membershipData) {
        if (loggedInUserIsDefined) {
          try {
            membershipData = await this.callFunctionWithDeduplication(() =>
              Platform.UserService.GetMembershipDataById(
                user?.membershipId,
                user?.membershipType
              )
            );
          } catch {
            console.error(
              `Cannot load user data for ${user?.membershipType}/${user?.membershipId}`
            );

            // rare instance of bnet users without destiny membership, show the anonymous view
            return {
              membershipData: null,
              memberships: [],
              characters: {},
              selectedCharacter: null,
              selectedMembership: null,
              isCrossSaved: false,
              loaded: true,
            };
          }
        } else {
          try {
            membershipData = await this.callFunctionWithDeduplication(
              Platform.UserService.GetMembershipDataForCurrentUser
            );
          } catch {
            console.error(`Cannot load user data for Current User`);

            // rare instance of bnet users without destiny membership, show the anonymous view
            return {
              membershipData: null,
              memberships: [],
              characters: {},
              selectedCharacter: null,
              selectedMembership: null,
              isCrossSaved: false,
              loaded: true,
            };
          }
        }
      }

      const isCrossSaved =
        typeof membershipData?.primaryMembershipId !== "undefined";

      let memberships = membershipData?.destinyMemberships;

      if (isCrossSaved && !showAllMembershipsWhenCrossaved) {
        memberships = [
          membershipData?.destinyMemberships?.find(
            (a) => a?.membershipId === membershipData?.primaryMembershipId
          ),
        ];
      }

      if (!memberships || memberships?.length === 0) {
        // rare instance of bnet users without destiny membership, show the anonymous view
        return {
          membershipData,
          memberships,
          characters: {},
          selectedCharacter: null,
          selectedMembership: null,
          isCrossSaved: false,
          loaded: true,
        };
      }

      let profileResponse: Responses.DestinyProfileResponse = null;

      //use the first membership by default;
      let membershipToUse = memberships[0];

      if (isSameUser) {
        // if we have a membership type saved, use it
        this.state.selectedMembership &&
          (membershipToUse = this.state.selectedMembership);
      }
      // if we were given a user and the membership is not the type of the one provided
      else if (loggedInUserIsDefined) {
        if (
          !EnumUtils.looseEquals(
            user?.membershipType,
            membershipToUse?.membershipType,
            BungieMembershipType
          )
        ) {
          //membershipType does not match get a different one
          membershipToUse = this.getRequestedMembership(
            memberships,
            user.membershipType
          );
        }
      }

      let characters: {
        [x: string]: Characters.DestinyCharacterComponent;
      } = {};

      try {
        if (ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
          profileResponse = await this.callFunctionWithDeduplication(() =>
            Platform.Destiny2Service.GetProfile(
              membershipToUse?.membershipType,
              membershipToUse?.membershipId,
              [
                DestinyComponentType.Profiles,
                DestinyComponentType.Characters,
                DestinyComponentType.CharacterEquipment,
              ]
            )
          );

          const hasCharacterData =
            typeof profileResponse.characters !== "undefined" &&
            typeof profileResponse.characters.data !== "undefined";

          if (hasCharacterData) {
            characters = profileResponse.characters.data;
          }
        }
      } catch {
        console.error(
          `There was an error getting Destiny info for ${membershipToUse?.displayName}(${membershipToUse?.membershipId}): ${membershipToUse?.membershipType}`
        );
      }

      const selectedCharacter = characters[Object.keys(characters)[0]] ?? null;

      return {
        membershipData,
        memberships,
        characters,
        selectedCharacter,
        selectedMembership: membershipToUse,
        equipment: profileResponse?.characterEquipment?.data,
        isCrossSaved,
        loaded: true,
      };
    },
    /**
     * Change selected platform in state and update characters in state with characters on selected platform
     */
    updatePlatform: async (state, platformName: string) => {
      if (!ConfigUtils.SystemStatus(SystemNames.Destiny2)) {
        return;
      }

      if (!this.state.loaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      if (StringUtils.isNullOrWhiteSpace(platformName)) {
        console.error("tried to update platform but none was supplied");

        return;
      }

      const membershipToUse = this.state.memberships.find((m) =>
        EnumUtils.looseEquals(
          m.membershipType,
          platformName,
          BungieMembershipType
        )
      );

      if (!membershipToUse) {
        return;
      }

      let profileResponse: Responses.DestinyProfileResponse = null;
      let characters: {
        [x: string]: Characters.DestinyCharacterComponent;
      } = {};
      let characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent = null;

      try {
        profileResponse = await this.callFunctionWithDeduplication(() =>
          Platform.Destiny2Service.GetProfile(
            membershipToUse?.membershipType,
            membershipToUse?.membershipId,
            [
              DestinyComponentType.Profiles,
              DestinyComponentType.CharacterProgressions,
              DestinyComponentType.Characters,
              DestinyComponentType.CharacterEquipment,
            ]
          )
        );

        const hasCharacterData =
          typeof profileResponse.characters !== "undefined" &&
          typeof profileResponse.characters.data !== "undefined";

        if (hasCharacterData) {
          characters = profileResponse.characters.data;

          if (typeof profileResponse.characterProgressions !== "undefined") {
            characterProgressions = profileResponse.characterProgressions;
          }
        }
      } catch {
        console.error(
          `There was an error getting Destiny info for ${membershipToUse?.displayName}(${membershipToUse?.membershipId}): ${membershipToUse?.membershipType}`
        );
      }

      /* Note that on selecting a platform, if there are no characters for that destiny platform, it will return {} for characters and null for selected character */
      return {
        selectedMembership: membershipToUse,
        characters,
        characterProgressions,
        selectedCharacter: characters[Object.keys(characters)[0]] ?? null,
        equipment: profileResponse?.characterEquipment?.data,
      };
    },
    /**
     * Change selected character in state
     */
    updateCharacter: (state, value: string) => {
      if (!this.state.loaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      return { selectedCharacter: this.state.characters[value] };
    },
    resetMembership: () => {
      return {
        membershipData: null,
        memberships: [],
        selectedMembership: null,
        characters: {},
        selectedCharacter: null,
        loaded: false,
        isCrossSaved: false,
      };
    },
  });
  private readonly inProgressOperations: Map<string, Promise<any>> = new Map();

  protected constructor() {
    super({
      membershipData: null,
      memberships: [],
      selectedMembership: null,
      characters: {},
      selectedCharacter: null,
      equipment: null,
      loaded: false,
      isCrossSaved: false,
    });
  }

  public async callFunctionWithDeduplication<T, Args extends any[]>(
    func: (...args: Args) => Promise<T>,
    ...args: Args
  ): Promise<T> {
    const key = this.generateKey(func.name, args);

    if (this.inProgressOperations.has(key)) {
      // Casting is safe here because we know the type matches the original call
      return this.inProgressOperations.get(key) as Promise<T>;
    }

    const operationPromise: Promise<T> = (async () => {
      try {
        return await func(...args);
      } finally {
        this.inProgressOperations.delete(key);
      }
    })();

    this.inProgressOperations.set(key, operationPromise);

    return operationPromise;
  }

  private generateKey(functionName: string, args: any[]): string {
    return `${functionName}:${JSON.stringify(args)}`;
  }

  private getRequestedMembership(
    memberships: GroupsV2.GroupUserInfoCard[],
    membershipType: BungieMembershipType
  ) {
    //get the requested membership if available
    return (
      memberships.find((m) =>
        EnumUtils.looseEquals(
          m.membershipType,
          membershipType,
          BungieMembershipType
        )
      ) ?? memberships[0]
    );
  }
}
