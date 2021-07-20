// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { DataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  Characters,
  GroupsV2,
  Platform,
  Responses,
  User,
  Components,
} from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import { EnumUtils } from "@Utilities/EnumUtils";

export interface DestinyMembershipDataStorePayload {
  membershipData: User.UserMembershipData;
  memberships: GroupsV2.GroupUserInfoCard[];
  selectedMembership: GroupsV2.GroupUserInfoCard;
  characters: { [key: string]: Characters.DestinyCharacterComponent };
  selectedCharacter: Characters.DestinyCharacterComponent;
  loaded: boolean;
  isCrossSaved: boolean;
}

interface MembershipPair {
  membershipId: string;
  membershipType: BungieMembershipType;
}

export abstract class DestinyMembershipDataStore extends DataStore<
  DestinyMembershipDataStorePayload
> {
  private isInitialized = false;

  protected constructor() {
    super({
      membershipData: null,
      memberships: [],
      selectedMembership: null,
      characters: {},
      selectedCharacter: null,
      loaded: false,
      isCrossSaved: false,
    });
  }

  public actions = this.createActions({
    /**
     * Refresh state with all valid destiny memberships for user, accounting for cross save.
     * Loads current user by default, unless membership info is provided
     */
    loadUserData: async (user?: MembershipPair, force = false) => {
      const isSameUser =
        user?.membershipId &&
        (user?.membershipId ===
          this.state.membershipData?.bungieNetUser?.membershipId || // Check for same Bungie.net ID
          this.state.membershipData?.destinyMemberships?.find(
            (u) => u.membershipId === user?.membershipId
          )); // Check for same Destiny ID

      if (!force) {
        if (isSameUser && this.isInitialized) {
          return;
        }
      }

      const loadSpecificUser = !!user;

      if (
        !loadSpecificUser &&
        !UserUtils.isAuthenticated(GlobalStateDataStore.state)
      ) {
        console.warn(
          "Cannot load membership data unless user is logged in, or specific user info is provided."
        );

        return;
      }

      this.isInitialized = true;

      let membershipData = this.state.membershipData;

      if (!membershipData) {
        membershipData = loadSpecificUser
          ? await Platform.UserService.GetMembershipDataById(
              user.membershipId,
              user.membershipType
            )
          : await Platform.UserService.GetMembershipDataForCurrentUser();
      }

      if (!membershipData) {
        const loadedForWho = loadSpecificUser
          ? `${user.membershipType}/${user.membershipId}`
          : "Current User";

        throw Error(`Cannot load user data for ${loadedForWho}`);
      }

      const isCrossSaved =
        typeof membershipData.primaryMembershipId !== "undefined";

      let memberships = membershipData.destinyMemberships;

      if (isCrossSaved) {
        memberships = [
          membershipData.destinyMemberships.find(
            (a) => a.membershipId === membershipData.primaryMembershipId
          ),
        ];
      }

      if (memberships.length === 0) {
        // rare instance of bnet users without destiny membership, show the anonymous view
        return;
      }

      let profileResponse: Responses.DestinyProfileResponse = null;
      const membershipToUse = this.state.selectedMembership || memberships[0];

      let characters: {
        [x: string]: Characters.DestinyCharacterComponent;
      } = {};

      try {
        profileResponse = await Platform.Destiny2Service.GetProfile(
          membershipToUse.membershipType,
          membershipToUse.membershipId,
          [DestinyComponentType.Profiles, DestinyComponentType.Characters]
        );

        const hasCharacterData =
          typeof profileResponse.characters !== "undefined" &&
          typeof profileResponse.characters.data !== "undefined";

        if (hasCharacterData) {
          characters = profileResponse.characters.data;
        }
      } catch {
        console.error(
          `There was an error getting Destiny info for ${membershipToUse.displayName}(${membershipToUse.membershipId}): ${membershipToUse.membershipType}`
        );
      }

      const selectedCharacter = characters[Object.keys(characters)[0]] ?? null;

      return {
        membershipData,
        memberships,
        characters,
        selectedCharacter,
        selectedMembership: membershipToUse,
        isCrossSaved,
        loaded: true,
      };
    },
    /**
     * Change selected platform in state and update characters in state with characters on selected platform
     */
    updatePlatform: async (platformName: string) => {
      if (!this.state.loaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      const membershipToUse = this.state.memberships.find((m) =>
        EnumUtils.looseEquals(
          m.membershipType,
          platformName,
          BungieMembershipType
        )
      );

      let profileResponse: Responses.DestinyProfileResponse = null;
      let characters: {
        [x: string]: Characters.DestinyCharacterComponent;
      } = {};
      let characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent = null;

      try {
        profileResponse = await Platform.Destiny2Service.GetProfile(
          membershipToUse.membershipType,
          membershipToUse.membershipId,
          [
            DestinyComponentType.Profiles,
            DestinyComponentType.CharacterProgressions,
            DestinyComponentType.Characters,
          ]
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
          `There was an error getting Destiny info for ${membershipToUse.displayName}(${membershipToUse.membershipId}): ${membershipToUse.membershipType}`
        );
      }

      /* Note that on selecting a platform, if there are no characters for that destiny platform, it will return {} for characters and null for selected character */
      return {
        selectedMembership: membershipToUse,
        characters,
        characterProgressions,
        selectedCharacter: characters[Object.keys(characters)[0]] ?? null,
      };
    },
    /**
     * Change selected character in state
     */
    updateCharacter: (value: string) => {
      if (!this.state.loaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      return { selectedCharacter: this.state.characters[value] };
    },
  });
}
