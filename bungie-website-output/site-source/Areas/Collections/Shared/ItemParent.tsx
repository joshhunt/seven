// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Collections/Shared/Categories.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Presentation, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";

interface ItemParentProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyObjectiveDefinition"
  > {
  presentationNodeHash: number;
  parentPresentationNodeHash: number;
  activeParentPresentationNodeHash: number;
  sort: sortMode;
  profileResponse: Responses.DestinyProfileResponse;
}

const ItemParent: React.FC<ItemParentProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.presentationNodeHash
  );

  if (!nodeDef) {
    return null;
  }

  const progressBar = (
    componentData: Presentation.DestinyPresentationNodeComponent
  ) => {
    if (!componentData) {
      return null;
    }

    const objectiveDef = props.definitions.DestinyObjectiveDefinition.get(
      componentData.objective.objectiveHash
    );

    return objectiveDef ? (
      <div
        className={styles.progress}
      >{`${componentData.objective.progress} / ${componentData.objective.completionValue}`}</div>
    ) : null;
  };

  const data = PresentationNodeUtils.GetPresentationComponentData(
    nodeDef.hash,
    destinyMembership.selectedCharacter?.characterId,
    props.profileResponse
  );

  const url = RouteHelper.NewCollections({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: props.parentPresentationNodeHash.toString(),
    parent: props.presentationNodeHash.toString(),
    sort: props.sort,
  });

  const bg = nodeDef.displayProperties?.icon;
  const rootBg = nodeDef.rootViewIcon;

  return (
    <Anchor
      url={url}
      className={classNames(styles.nodeCategory, {
        [styles.active]:
          props.activeParentPresentationNodeHash === props.presentationNodeHash,
      })}
      title={nodeDef.displayProperties.name}
    >
      <div
        className={styles.rootBackground}
        style={{ backgroundImage: `url(${rootBg})` }}
      >
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${bg})` }}
        />
      </div>

      <div className={styles.title}>{nodeDef.displayProperties?.name}</div>
      {progressBar(data)}
    </Anchor>
  );
};

export default withDestinyDefinitions(ItemParent, {
  types: ["DestinyPresentationNodeDefinition", "DestinyObjectiveDefinition"],
});
