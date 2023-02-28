// Created by atseng, 2023
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieMembershipType } from "@Enum";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import { Characters } from "@Platform";
import styles from "@UI/Destiny/DestinyCharacterCardSelector.module.scss";
import DestinyCharacterCardSelectorInternal from "@UI/Destiny/DestinyCharacterCardSelectorInternal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { useState } from "react";

interface DestinyCharacterCardSelectorLoaderProps {
  characters: { [p: string]: Characters.DestinyCharacterComponent };
  selectedCharacterId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  dataStore: DestinyMembershipDataStore;
  showEmptyStates: boolean;
  linkToGear: boolean;
}

export const DestinyCharacterCardSelectorLoader: React.FC<DestinyCharacterCardSelectorLoaderProps> = (
  props
) => {
  const membershipData = useDataStore(props.dataStore);
  const [loaded, setLoaded] = useState(false);

  return (
    <SpinnerContainer loading={!loaded} className={!loaded && styles.loading}>
      <DestinyCharacterCardSelectorInternal
        selectedCharacterId={membershipData?.selectedCharacter?.characterId}
        dataStore={props.dataStore}
        membershipType={membershipData?.selectedMembership?.membershipType}
        membershipId={membershipData?.selectedMembership?.membershipId}
        characters={membershipData?.characters}
        linkToGear={false}
        showEmptyStates={false}
        loaded={() => setLoaded(true)}
      />
    </SpinnerContainer>
  );
};
