// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
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
import styles from "./Parents.module.scss";

interface SealsParentProps
  extends D2DatabaseComponentProps<
    "DestinyObjectiveDefinition" | "DestinyPresentationNodeDefinition"
  > {
  rootPresentationNodeHash: number;
  presentationNode: DestinyDefinitions.DestinyPresentationNodeChildEntry;
  isLegacy: boolean;
  sort: sortMode;
  profileResponse?: Responses.DestinyProfileResponse;
  displayedParentPresentationNodeHash?: number;
  isMini: boolean;
}

const SealsParent: React.FC<SealsParentProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const presentationNodeDef = props.definitions?.DestinyPresentationNodeDefinition?.get(
    props.presentationNode.presentationNodeHash
  );

  if (
    !presentationNodeDef ||
    !presentationNodeDef?.completionRecordHash ||
    !destinyMembership?.selectedCharacter
  ) {
    return null;
  }

  const recordData = PresentationNodeUtils.GetRecordComponentData(
    presentationNodeDef.completionRecordHash,
    destinyMembership.selectedCharacter?.characterId,
    props.profileResponse
  );
  const presentationData = PresentationNodeUtils.GetPresentationComponentData(
    props.presentationNode.presentationNodeHash,
    destinyMembership.selectedCharacter?.characterId,
    props.profileResponse
  );

  const isActive =
    props.displayedParentPresentationNodeHash === presentationNodeDef.hash;
  const isComplete = !recordData?.objectives?.some((o) => !o.complete);
  const progress = recordData?.objectives?.[0]?.progress;
  const total = recordData?.objectives?.[0].completionValue;

  const detailCoin = recordData?.objectives ? (
    <ProgressBar
      progressToTotal={progress}
      progressPercent={(progress / total) * 100}
      total={total}
      isCompact={true}
      description={""}
      showBarWhenComplete={false}
      showText={false}
      customText={""}
    />
  ) : null;

  const isObscured =
    presentationData?.state &&
    EnumUtils.hasFlag(
      presentationData.state,
      DestinyPresentationNodeState.Obscured
    );

  const url = RouteHelper.NewTriumphs({
    mid: destinyMembership?.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership?.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership?.selectedCharacter?.characterId,
    root: props.rootPresentationNodeHash.toString(),
    parent: presentationNodeDef.hash.toString(),
    sort: props.sort,
  });

  if (props.isMini) {
    const bg = presentationNodeDef.displayProperties?.icon;

    return (
      <Anchor
        url={url}
        className={classNames(styles.nodeCategory, {
          [styles.active]:
            props.displayedParentPresentationNodeHash ===
            props.presentationNode.presentationNodeHash,
        })}
        title={presentationNodeDef.displayProperties.name}
      >
        <div className={styles.rootBackground}>
          <div
            className={styles.background}
            style={{ backgroundImage: `url(${bg})` }}
          />
        </div>
        <div className={styles.title}>
          {presentationNodeDef.displayProperties?.name}
        </div>
      </Anchor>
    );
  }

  return (
    <Anchor
      url={url}
      className={classNames(
        { [styles.active]: isActive },
        { [styles.complete]: isComplete }
      )}
    >
      <DetailItem
        title={
          isObscured ? "???????" : presentationNodeDef.displayProperties?.name
        }
        size={BasicSize.Large}
        flairCoin={!props.isLegacy ? "" : ""}
        iconCoin={
          <IconCoin iconImageUrl={presentationNodeDef.displayProperties.icon} />
        }
        detailCoin={detailCoin}
      />
    </Anchor>
  );
};

export default withDestinyDefinitions(SealsParent, {
  types: ["DestinyObjectiveDefinition", "DestinyPresentationNodeDefinition"],
});
