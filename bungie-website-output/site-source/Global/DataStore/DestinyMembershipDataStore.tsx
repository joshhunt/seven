// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { DataStore } from "@Global/DataStore";
import { Characters, GroupsV2, Platform, Responses, User } from "@Platform";
import React from "react";
import { EnumUtils } from "@Utilities/EnumUtils";

interface DestinyMembershipDataStorePayload {
  membershipData: User.UserMembershipData;
  memberships: GroupsV2.GroupUserInfoCard[];
  selectedMembership: GroupsV2.GroupUserInfoCard;
  characters: { [key: string]: Characters.DestinyCharacterComponent };
  selectedCharacter: Characters.DestinyCharacterComponent;
  initialDataLoaded: boolean;
}

class DestinyMembershipDataStoreGeneral extends DataStore<
  DestinyMembershipDataStorePayload
> {
  public static Instance = new DestinyMembershipDataStoreGeneral({
    membershipData: null,
    memberships: [],
    selectedMembership: null,
    characters: {},
    selectedCharacter: null,
    initialDataLoaded: false,
  });

  public actions = this.createActions({
    /**
     * Refresh state with all valid destiny memberships for user, accounting for cross save
     */
    loadUserData: async () => {
      let membershipData = this.state.membershipData;

      if (!membershipData) {
        membershipData = await Platform.UserService.GetMembershipDataForCurrentUser();
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

      let profileResponse: Responses.DestinyProfileResponse = null;
      let membershipToUse;

      if (memberships.length === 0) {
        // rare instance of bnet users without destiny membership, show the anonymous view
        return;
      } else {
        membershipToUse = this.state.selectedMembership || memberships[0];
      }

      let characters: {
        [x: string]: Characters.DestinyCharacterComponent;
      } = {};

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
        initialDataLoaded: true,
      };
    },
    /**
     * Change selected platform in state and update characters in state with characters on selected platform
     */
    updatePlatform: async (platformName: string) => {
      if (!this.state.initialDataLoaded) {
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
        }
      } catch {
        console.error(
          `There was an error getting Destiny info for ${membershipToUse.displayName}(${membershipToUse.membershipId}): ${membershipToUse.membershipType}`
        );
      }

      /* Note that on selecting a platform, if there are no characters for that destiny platform, it will return {} for characters and null for selected character */
      return {
        selectedMembership: membershipToUse,
        characters: characters,
        selectedCharacter: characters[Object.keys(characters)[0]] ?? null,
      };
    },
    /**
     * Change selected character in state
     */
    updateCharacter: (value: string) => {
      if (!this.state.initialDataLoaded) {
        throw new Error(
          "actions.loadUserData must be called to initialize the data before any other action can be accessed"
        );
      }

      return { selectedCharacter: this.state.characters[value] };
    },
  });
}

export const DestinyMembershipDataStore =
  DestinyMembershipDataStoreGeneral.Instance;
