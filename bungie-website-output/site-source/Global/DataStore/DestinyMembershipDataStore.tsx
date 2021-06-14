// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { DataStore } from "@Global/DataStore";
import { Characters, GroupsV2, Platform, User } from "@Platform";
import React from "react";
import { EnumUtils } from "@Utilities/EnumUtils";

interface DestinyMembershipDataStorePayload {
  membershipData: User.UserMembershipData;
  memberships: GroupsV2.GroupUserInfoCard[];
  selectedMembership: GroupsV2.GroupUserInfoCard;
  characters: { [key: string]: Characters.DestinyCharacterComponent };
  selectedCharacter: Characters.DestinyCharacterComponent;
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
  });

  public actions = this.createActions({
    /**
     * Get all memberships for user and update data store fields
     */
    getMemberships: (membershipId: string) => {
      return Platform.UserService.GetMembershipDataById(
        membershipId,
        BungieMembershipType.BungieNext
      ).then((data) => {
        const isCrossSaved = typeof data.primaryMembershipId !== "undefined";

        const memberships = isCrossSaved
          ? [
              data.destinyMemberships.find(
                (dm) => dm.membershipId === data.primaryMembershipId
              ),
            ]
          : data.destinyMemberships;

        /* If memberships is empty, it will update the value to be [], so if [] is empty, they are either logged out or have no destiny account */
        return {
          membershipData: data,
          memberships: memberships.length > 0 ? memberships : [],
          selectedMembership: memberships[0],
        };
      });
    },
    updatePlatform: (value: string) => {
      const membershipToUse = this.state.memberships.find((m) =>
        EnumUtils.looseEquals(m.membershipType, value, BungieMembershipType)
      );

      return Platform.Destiny2Service.GetProfile(
        membershipToUse.membershipType,
        membershipToUse.membershipId,
        [
          DestinyComponentType.Profiles,
          DestinyComponentType.CharacterProgressions,
          DestinyComponentType.Characters,
        ]
      ).then((profileResponse) => {
        return {
          selectedMembership: membershipToUse,
          characters: profileResponse?.characters?.data,
          selectedCharacter: this._getMostRecentlyPlayedCharacter(
            profileResponse?.characters?.data
          ),
          initialDataLoaded: true,
        };
      });
    },
    updateCharacter: (value: string) => ({
      selectedCharacter: this.state.characters[value],
    }),
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

export const DestinyMembershipDataStore =
  DestinyMembershipDataStoreGeneral.Instance;
