// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Collections/Shared/Categories.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyPresentationNodeState } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { DetailItem } from "@UIKit/Companion/DetailItem";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";

interface BadgeParentProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyObjectiveDefinition"
  > {
  presentationNodeHash: number;
  parentPresentationNodeHash: number;
  activeParentPresentationNodeHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  isMini: boolean;
  sort: sortMode;
}

const BadgeParent: React.FC<BadgeParentProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.presentationNodeHash
  );
  const data = PresentationNodeUtils.GetPresentationComponentData(
    nodeDef.hash,
    destinyMembership.selectedCharacter.characterId,
    props.profileResponse
  );

  if (
    !data ||
    EnumUtils.hasFlag(data.state, DestinyPresentationNodeState.Invisible) ||
    EnumUtils.hasFlag(data.state, DestinyPresentationNodeState.Obscured)
  ) {
    return null;
  }

  const url = RouteHelper.NewCollections({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: props.parentPresentationNodeHash.toString(),
    parent: props.presentationNodeHash.toString(),
  });

  if (
    nodeDef.completionRecordHash &&
    !nodeDef.blacklisted &&
    !nodeDef.redacted
  ) {
    const recordData = PresentationNodeUtils.GetRecordComponentData(
      nodeDef.completionRecordHash,
      destinyMembership.selectedCharacter?.characterId,
      props.profileResponse
    );

    if (!recordData) {
      return null;
    }

    const subChildrenData = nodeDef.children?.presentationNodes?.map((n) => {
      return PresentationNodeUtils.GetPresentationComponentData(
        n.presentationNodeHash,
        destinyMembership.selectedCharacter?.characterId,
        props.profileResponse
      );
    });

    const childrenAggregateProgress = subChildrenData
      .map((c) => c.objective?.progress)
      .reduce((a, b) => {
        return (a ?? 0) + (b ?? 0);
      });

    const childrenAggregateCompletionValue = subChildrenData
      .map(
        (c) =>
          props.definitions.DestinyObjectiveDefinition.get(
            c.objective?.objectiveHash
          )?.completionValue
      )
      .reduce((a, b) => {
        return (a ?? 0) + (b ?? 0);
      });

    if (props.isMini) {
      const bg = nodeDef.displayProperties?.icon;
      const rootBg = nodeDef.rootViewIcon;

      return (
        <Anchor
          url={url}
          className={classNames(styles.nodeCategory, {
            [styles.active]:
              props.activeParentPresentationNodeHash ===
              props.presentationNodeHash,
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
        </Anchor>
      );
    }

    return (
      <Anchor
        className={classNames(
          props.activeParentPresentationNodeHash ===
            props.presentationNodeHash && styles.active
        )}
        url={url}
      >
        <DetailItem
          className={styles.badgeCategory}
          size={BasicSize.Large}
          title={nodeDef.displayProperties.name}
          iconCoin={<IconCoin iconImageUrl={nodeDef.displayProperties.icon} />}
          detailCoin={
            <ProgressBar
              progressToTotal={childrenAggregateProgress}
              total={childrenAggregateCompletionValue}
              isCompact={true}
              showBarWhenComplete={false}
              progressPercent={
                (childrenAggregateProgress / childrenAggregateCompletionValue) *
                100
              }
              showText={false}
              description={""}
              customText={""}
            />
          }
        />
      </Anchor>
    );
  } else {
    return null;
  }
};

export default withDestinyDefinitions(BadgeParent, {
  types: ["DestinyPresentationNodeDefinition", "DestinyObjectiveDefinition"],
});
