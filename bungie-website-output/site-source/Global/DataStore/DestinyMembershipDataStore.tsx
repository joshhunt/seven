// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { DataStore } from "@Global/DataStore";
import { Characters, GroupsV2, Platform, User } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
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

export class DestinyMembershipDataStore extends DataStore<
  DestinyMembershipDataStorePayload
> {
  constructor(private readonly membershipId: string) {
    super({
      membershipData: null,
      memberships: [],
      selectedMembership: null,
      characters: {},
      selectedCharacter: null,
      initialDataLoaded: false,
    });

    this.initialize();
  }

  public async initialize() {
    await this.actions.refreshMembershipData();

    const defaultMembership = this.state.memberships[0];
    await this.actions.updatePlatform(
      EnumUtils.getStringValue(
        defaultMembership.membershipType,
        BungieMembershipType
      )
    );
  }

  public actions = this.createActions({
    /**
     * Update the membership type, and fetch the Destiny profile that matches
     * @param membershipTypeString
     */
    updatePlatform: async (
      membershipTypeString: EnumStrings<typeof BungieMembershipType>
    ) => {
      const membershipToUse = this.state.memberships.find((m) =>
        EnumUtils.looseEquals(
          m.membershipType,
          membershipTypeString,
          BungieMembershipType
        )
      );

      try {
        const profileResponse = await Platform.Destiny2Service.GetProfile(
          membershipToUse.membershipType,
          membershipToUse.membershipId,
          [
            DestinyComponentType.Profiles,
            DestinyComponentType.CharacterProgressions,
            DestinyComponentType.Characters,
          ]
        );

        return {
          selectedMembership: membershipToUse,
          characters: profileResponse?.characters?.data,
          selectedCharacter: this._getMostRecentlyPlayedCharacter(
            profileResponse?.characters?.data
          ),
          initialDataLoaded: true,
        };
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * Update the currently selected character based on its character ID
     * @param characterId
     */
    updateCharacter: (characterId: string) => {
      return {
        selectedCharacter: this.state.characters[characterId],
      };
    },
    /**
     * Fetch membership data
     */
    refreshMembershipData: async () => {
      try {
        const data = await Platform.UserService.GetMembershipDataById(
          this.membershipId,
          BungieMembershipType.BungieNext
        );

        const isCrossSaved = typeof data.primaryMembershipId !== "undefined";

        const memberships = isCrossSaved
          ? [
              data.destinyMemberships.find(
                (dm) => dm.membershipId === data.primaryMembershipId
              ),
            ]
          : data.destinyMemberships;

        return {
          membershipData: data,
          memberships,
          selectedMembership: memberships[0],
        };
      } catch (e) {
        const pe = await ConvertToPlatformError(e);

        Modal.error(pe);
      }
    },
  });

  private readonly _getMostRecentlyPlayedCharacter = (characters: {
    [key: string]: Characters.DestinyCharacterComponent;
  }) => {
    const charIds = Object.keys(characters);
    let mostRecentDate = characters[charIds[0]].dateLastPlayed;
    let mostRecentCharId = charIds[0];

    charIds.splice(1).forEach((id) => {
      if (characters[id].dateLastPlayed > mostRecentDate) {
        mostRecentDate = characters[id].dateLastPlayed;
        mostRecentCharId = id;
      }
    });

    return characters[mostRecentCharId];
  };
}
