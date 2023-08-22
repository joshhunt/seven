// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { BungieMembershipType } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";
import styles from "./Parents.module.scss";

interface TriumphsParentProps
  extends D2DatabaseComponentProps<
    "DestinyObjectiveDefinition" | "DestinyPresentationNodeDefinition"
  > {
  rootPresentationNodeHash: number;
  presentationNode: DestinyDefinitions.DestinyPresentationNodeChildEntry;
  isLegacy: boolean;
  sort: sortMode;
  profileResponse?: Responses.DestinyProfileResponse;
  displayedParentPresentationNodeHash?: number;
}

const TriumphsParent: React.FC<TriumphsParentProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const presentationNodeDef = props.definitions?.DestinyPresentationNodeDefinition?.get(
    props.presentationNode.presentationNodeHash
  );

  if (!presentationNodeDef) {
    return null;
  }

  const data = PresentationNodeUtils.GetPresentationComponentData(
    props.presentationNode.presentationNodeHash,
    destinyMembership?.selectedCharacter?.characterId,
    props.profileResponse
  );
  const objectiveDef = data?.objective?.objectiveHash
    ? props.definitions.DestinyObjectiveDefinition.get(
        data.objective.objectiveHash
      )
    : undefined;

  const classes = classNames(styles.nodeCategory, {
    [styles.active]:
      props.presentationNode.presentationNodeHash ===
      props.displayedParentPresentationNodeHash,
    [styles.disabled]:
      props.isLegacy &&
      presentationNodeDef.children?.presentationNodes &&
      presentationNodeDef.children?.presentationNodes.length === 0,
  });

  return (
    <Anchor
      url={RouteHelper.NewTriumphs({
        mid: destinyMembership?.selectedMembership?.membershipId,
        mtype: EnumUtils.getNumberValue(
          destinyMembership?.selectedMembership?.membershipType,
          BungieMembershipType
        ).toString(),
        cid: destinyMembership?.selectedCharacter?.characterId,
        root: props.rootPresentationNodeHash.toString(),
        parent: props.presentationNode.presentationNodeHash.toString(),
        sort: props.sort,
      })}
      className={classes}
      title={presentationNodeDef.displayProperties.name}
    >
      <div
        className={styles.rootBackground}
        style={{
          backgroundImage: `url(${presentationNodeDef.rootViewIcon})`,
        }}
      >
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${presentationNodeDef.displayProperties.icon})`,
          }}
        />
      </div>
      <div className={styles.title}>
        {presentationNodeDef.displayProperties.name}
      </div>
      {!props.isLegacy && objectiveDef && (
        <div
          className={styles.progress}
        >{`${data.objective.progress} / ${data.objective.completionValue}`}</div>
      )}
      {props.isLegacy && data && (
        <div className={styles.progress}>{data.recordCategoryScore}</div>
      )}
    </Anchor>
  );
};

export default withDestinyDefinitions(TriumphsParent, {
  types: ["DestinyObjectiveDefinition", "DestinyPresentationNodeDefinition"],
});
