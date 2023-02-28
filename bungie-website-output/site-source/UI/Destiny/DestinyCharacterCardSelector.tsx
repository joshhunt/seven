// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import { Characters } from "@Platform";
import { DestinyCharacterCardSelectorLoader } from "@UI/Destiny/DestinyCharacterCardSelectorLoader";
import React from "react";

interface DestinyCharacterCardSelectorProps {
  characters: { [p: string]: Characters.DestinyCharacterComponent };
  selectedCharacterId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  dataStore: DestinyMembershipDataStore;
  showEmptyStates: boolean;
  linkToGear: boolean;
}

export const DestinyCharacterCardSelector: React.FC<DestinyCharacterCardSelectorProps> = (
  props
) => {
  const membershipData = useDataStore(props.dataStore);

  return (
    <DestinyCharacterCardSelectorLoader
      selectedCharacterId={membershipData?.selectedCharacter?.characterId}
      dataStore={props.dataStore}
      membershipType={membershipData?.selectedMembership?.membershipType}
      membershipId={membershipData?.selectedMembership?.membershipId}
      characters={membershipData?.characters}
      linkToGear={props.linkToGear}
      showEmptyStates={props.showEmptyStates}
    />
  );
};
