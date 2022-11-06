// Created by atseng, 2022
// Copyright Bungie, Inc.

import DestinyCollectibleDetailModal from "@UI/Destiny/DestinyCollectibleDetailModal";
import styles from "@UI/Destiny/PresentationNodes/DetailContainer.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { DestinyCollectibleState } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";

interface CollectionSetProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyCollectibleDefinition"
  > {
  profileResponse: Responses.DestinyProfileResponse;
  subCategoryHash: number;
  set: DestinyDefinitions.DestinyPresentationNodeChildEntry;
  collectibleNodeDetails: Responses.DestinyCollectibleNodeDetailResponse;
}

const CollectionSet: React.FC<CollectionSetProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const setDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.set.presentationNodeHash
  );

  const isVisible = !setDef?.children?.collectibles?.find((c) =>
    EnumUtils.hasFlag(
      PresentationNodeUtils.GetCollectibleComponentData(
        c.collectibleHash,
        destinyMembership.selectedCharacter?.characterId,
        props.profileResponse
      )?.state,
      DestinyCollectibleState.Invisible
    )
  );

  if (!isVisible) {
    return null;
  }

  const showDetailModal = (hash: number) => {
    const collectibleDef = props.definitions.DestinyCollectibleDefinition.get(
      hash
    );

    DestinyCollectibleDetailModal.show({
      itemHash: collectibleDef.itemHash,
      membershipId: destinyMembership?.selectedMembership?.membershipId,
      membershipType: destinyMembership?.selectedMembership?.membershipType,
    });
  };

  return (
    <div className={styles.itemSet}>
      <div className={styles.setName}>{setDef.displayProperties.name}</div>
      <div className={styles.icons}>
        {setDef.children?.collectibles.map((c) => {
          const def = props.definitions.DestinyCollectibleDefinition.get(
            c.collectibleHash
          );

          if (!def) {
            return null;
          }

          const data = PresentationNodeUtils.GetCollectibleComponentData(
            c.collectibleHash,
            destinyMembership.selectedCharacter?.characterId,
            props.profileResponse
          );

          if (
            !data ||
            EnumUtils.hasFlag(DestinyCollectibleState.Invisible, data.state)
          ) {
            return null;
          }

          const collectibleComponents =
            props.collectibleNodeDetails?.collectibleItemComponents?.objectives
              ?.data?.[def.itemHash];

          return (
            <div
              key={def.hash}
              title={def.displayProperties.name}
              onClick={() => {
                showDetailModal(def.hash);
              }}
              className={classNames(styles.icon, {
                [styles.complete]: !EnumUtils.hasFlag(
                  data.state,
                  DestinyCollectibleState.NotAcquired
                ),
              })}
            >
              <div
                className={styles.background}
                style={{
                  backgroundImage: `url(${def.displayProperties.icon})`,
                }}
              />
              {collectibleComponents?.objectives &&
                collectibleComponents?.flavorObjective && (
                  <ProgressBar
                    progressToTotal={
                      collectibleComponents.flavorObjective.progress
                    }
                    total={
                      collectibleComponents.flavorObjective.completionValue
                    }
                    isCompact={true}
                    showBarWhenComplete={true}
                    progressPercent={
                      (collectibleComponents.flavorObjective.progress /
                        collectibleComponents.flavorObjective.completionValue) *
                      100
                    }
                    showText={false}
                    description={""}
                    customText={""}
                  />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(CollectionSet, {
  types: ["DestinyPresentationNodeDefinition", "DestinyCollectibleDefinition"],
});
