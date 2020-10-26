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

  public initialize() {
    this.getMemberships();
  }

  private readonly getMemberships = () => {
    Platform.UserService.GetMembershipDataById(
      this.membershipId,
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

      this.update({
        membershipData: data,
        memberships,
        selectedMembership: memberships[0],
      });

      this.updatePlatform(
        EnumUtils.getStringValue(
          memberships[0].membershipType,
          BungieMembershipType
        )
      );
    });
  };

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

  public updatePlatform(value: string) {
    const membershipToUse = this.state.memberships.find((m) =>
      EnumUtils.looseEquals(m.membershipType, value, BungieMembershipType)
    );

    Platform.Destiny2Service.GetProfile(
      membershipToUse.membershipType,
      membershipToUse.membershipId,
      [
        DestinyComponentType.Profiles,
        DestinyComponentType.CharacterProgressions,
        DestinyComponentType.Characters,
      ]
    ).then((profileResponse) => {
      this.update({
        selectedMembership: membershipToUse,
        characters: profileResponse?.characters?.data,
        selectedCharacter: this._getMostRecentlyPlayedCharacter(
          profileResponse?.characters?.data
        ),
        initialDataLoaded: true,
      });
    });
  }

  public updateCharacter(value: string) {
    this.update({
      selectedCharacter: this.state.characters[value],
    });
  }
}
