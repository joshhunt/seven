// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { DataStore } from "@bungie/datastore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  Characters,
  GroupsV2,
  Platform,
  Responses,
  User,
  Components,
} from "@Platform";
import { StringUtils } from "@Utilities/StringUtils";
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

export interface MembershipPair {
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
    loadUserData: async (state, user?: MembershipPair, force = false) => {
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
        try {
          membershipData = loggedInUserIsDefined
            ? await Platform.UserService.GetMembershipDataById(
                user.membershipId,
                user.membershipType
              )
            : await Platform.UserService.GetMembershipDataForCurrentUser();
        } catch {
          const loadedForWho = loggedInUserIsDefined
            ? `${user.membershipType}/${user.membershipId}`
            : "Current User";

          console.error(`Cannot load user data for ${loadedForWho}`);

          //this gives subscribers a way to react: stop spinners, load an error page
          return {
            membershipData,
            memberships: [],
            characters: {},
            selectedCharacter: null,
            selectedMembership: null,
            isCrossSaved: false,
            loaded: true,
          };
        }
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
            membershipToUse.membershipType,
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
    updatePlatform: async (state, platformName: string) => {
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
    updateCharacter: (state, value: string) => {
      if (!this.state.loaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      return { selectedCharacter: this.state.characters[value] };
    },
  });

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
