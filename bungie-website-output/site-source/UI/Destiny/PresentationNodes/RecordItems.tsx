// Created by atseng, 2022
// Copyright Bungie, Inc.

import {
  PageType,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import styles from "./DetailContainer.module.scss";
import stylesModal from "./RecordDetailModal.module.scss";
import RecordDetailModal from "./RecordDetailModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { BungieMembershipType, DestinyRecordState } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/RouteParams";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { FlairCoin } from "@UIKit/Companion/Coins/FlairCoin";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { DetailItem } from "@UIKit/Companion/DetailItem";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";
import { useHistory, useParams } from "react-router";

interface RecordItemsProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyRecordDefinition"
    | "DestinyObjectiveDefinition"
  > {
  rootHash: number;
  parentHash: number;
  categoryHash: number;
  subcategoryHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  pageType: PageType;
}

const RecordItems: React.FC<RecordItemsProps> = (props) => {
  const params = useParams<PresentationNodeParams>();
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const urlParams = new URLSearchParams(window.location.search);

  const sort = (urlParams?.get("sort") as sortMode) ?? "Default";

  const parentDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.parentHash
  );

  if (!parentDef) {
    return null;
  }

  const parentNodeData = PresentationNodeUtils.GetPresentationComponentData(
    props.parentHash,
    destinyMembership?.selectedCharacter?.characterId,
    props.profileResponse
  );
  const parentNodeIsObscured =
    !parentNodeData ||
    EnumUtils.hasFlag(parentNodeData?.state, DestinyRecordState.Obscured);

  const categoryHash = !Number.isNaN(props.categoryHash)
    ? props.categoryHash
    : parentDef.children?.presentationNodes[0]?.presentationNodeHash;
  const categoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    categoryHash
  );

  const subCategoryHash = !Number.isNaN(props.subcategoryHash)
    ? props.subcategoryHash
    : categoryDef?.children.presentationNodes[0]?.presentationNodeHash;
  const subCategoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    subCategoryHash
  );

  const parentIsContainer =
    !categoryDef &&
    parentDef?.children?.records &&
    parentDef.children.records.length;
  const categoryIsContainer =
    !subCategoryDef &&
    categoryDef?.children?.records &&
    categoryDef.children.records.length;

  const records = parentIsContainer
    ? parentDef.children.records
    : categoryIsContainer
    ? categoryDef.children.records
    : subCategoryDef?.children?.records;

  const nodesLoc = Localizer.PresentationNodes;

  if (!records || !records.length) {
    return null;
  }

  if (
    !props.profileResponse ||
    !destinyMembership?.selectedMembership ||
    !destinyMembership?.selectedCharacter
  ) {
    return null;
  }

  const showDetailModal = (hash: number) => {
    Modal.open(
      <RecordDetailModal
        profileResponse={props.profileResponse}
        recordHash={hash}
      />,
      { contentClassName: stylesModal.detailModal }
    );
  };

  const sortByClosest = (
    record: DestinyDefinitions.DestinyPresentationNodeRecordChildEntry,
    completedAtEnd = true
  ): number => {
    let s = 0;
    const data = PresentationNodeUtils.GetRecordComponentData(
      record.recordHash,
      destinyMembership?.selectedCharacter?.characterId,
      props.profileResponse
    );

    if (!data?.objectives) {
      return s;
    }

    const totalProgress = data.objectives
      .map((o) => o.completionValue)
      .reduce((a, b) => a + b, 0);
    const completed = data.objectives
      .map((o) => Math.min(o.progress ?? 0, o.completionValue))
      .reduce((a, b) => a + b, 0);

    s =
      completed >= totalProgress
        ? completedAtEnd
          ? -1
          : 1
        : completed / totalProgress;

    return s;
  };

  const sortByCompletion = (
    record: DestinyDefinitions.DestinyPresentationNodeRecordChildEntry
  ) => {
    let s = 0;
    const data = PresentationNodeUtils.GetRecordComponentData(
      record.recordHash,
      destinyMembership?.selectedCharacter?.characterId,
      props.profileResponse
    );

    if (data?.objectives) {
      const totalProgress = data.objectives
        .map((o) => o.completionValue)
        .reduce((a, b) => a + b, 0);
      const completed = data.objectives
        .map((o) => Math.min(o.progress ?? 0, o.completionValue))
        .reduce((a, b) => a + b, 0);
      s = completed / totalProgress;
    }

    return s;
  };

  const sortItems = (
    rs: DestinyDefinitions.DestinyPresentationNodeRecordChildEntry[]
  ): DestinyDefinitions.DestinyPresentationNodeRecordChildEntry[] => {
    switch (sort) {
      case "Completion":
        return rs.sort((a, b) => sortByCompletion(b) - sortByCompletion(a));
      case "Closest":
        return rs.sort((a, b) => sortByClosest(b) - sortByClosest(a));
      case "Farthest":
        return rs.sort(
          (a, b) => sortByClosest(a, false) - sortByClosest(b, false)
        );
      case "Default":
        return records;
    }
  };

  const sortedRecords = sortItems(records);

  return (
    <GridCol
      cols={globalState.responsive.medium ? 12 : 9}
      className={styles.nodeDetailData}
    >
      <div className={styles.sortDropDown}>
        <Dropdown
          onChange={(value) => {
            const routeParams: PresentationNodeParams = {
              mid: destinyMembership.selectedMembership?.membershipId,
              mtype: EnumUtils.getNumberValue(
                destinyMembership.selectedMembership?.membershipType,
                BungieMembershipType
              ).toString(),
              cid: destinyMembership.selectedCharacter?.characterId,
              root: props.rootHash.toString(),
              parent: props.parentHash.toString(),
              category: categoryDef ? categoryHash.toString() : null,
              subcategory: subCategoryDef ? subCategoryHash.toString() : null,
              sort: value,
            };

            history.push(
              props.pageType === "collections"
                ? RouteHelper.NewCollections(routeParams).url
                : RouteHelper.NewTriumphs(routeParams).url
            );
          }}
          selectedValue={sort.toString()}
          options={[
            {
              label: nodesLoc.RecordsSortOptionDefault,
              value: "Default",
            },
            {
              label: nodesLoc.RecordsSortOptionCompletion,
              value: "Completion",
            },
            {
              label: nodesLoc.RecordsSortOptionClosest,
              value: "Closest",
            },
            {
              label: nodesLoc.RecordsSortOptionFarthest,
              value: "Farthest",
            },
          ]}
        />
      </div>

      {sortedRecords &&
        sortedRecords.map((r) => {
          const recordDef = props.definitions.DestinyRecordDefinition.get(
            r.recordHash
          );

          if (!recordDef) {
            return null;
          }

          const recordData = PresentationNodeUtils.GetRecordComponentData(
            r.recordHash,
            destinyMembership?.selectedCharacter?.characterId,
            props.profileResponse
          );
          const isObscured =
            !recordData ||
            EnumUtils.hasFlag(recordData?.state, DestinyRecordState.Obscured) ||
            parentNodeIsObscured;
          const isInvisible =
            !recordData ||
            EnumUtils.hasFlag(
              recordData?.state,
              DestinyRecordState.Invisible
            ) ||
            parentNodeIsObscured;

          if (isInvisible) {
            return null;
          }

          let name = recordDef.displayProperties?.name;
          const icon = (
            <IconCoin iconImageUrl={recordDef.displayProperties?.icon} />
          );
          const firstObjectiveDef = props.definitions.DestinyObjectiveDefinition.get(
            recordData?.objectives?.[0]?.objectiveHash
          );
          const firstIntervalObjectDef = props.definitions.DestinyObjectiveDefinition.get(
            recordData?.intervalObjectives?.[0]?.objectiveHash
          );
          const description = recordDef?.loreHash
            ? null
            : recordDef?.displayProperties?.description;
          const incompleteObjectives = recordData?.objectives?.filter(
            (o) => !o.complete
          );
          const progress = incompleteObjectives?.[0]?.progress;
          const total = incompleteObjectives?.[0]?.completionValue;

          const detailCoin =
            recordData?.objectives &&
            recordData?.objectives.length > 0 &&
            PresentationNodeUtils.ShowProgressBarForSingleObjective(
              recordData.objectives[0],
              firstObjectiveDef
            ) ? (
              <ProgressBar
                progressToTotal={progress}
                progressPercent={(progress / total) * 100}
                total={total}
                isCompact={true}
                showBarWhenComplete={false}
                showText={false}
                customText={""}
                description={""}
              />
            ) : null;

          let flairCoin =
            recordData?.objectives &&
            recordData?.objectives.length &&
            PresentationNodeUtils.ShowProgressBarForSingleObjective(
              recordData.objectives[0],
              firstObjectiveDef
            ) ? (
              <FlairCoin
                children={
                  <span className={styles.flairSlot}>{`${
                    recordData?.objectives?.filter((o) => o.complete)?.length
                  } / ${recordData?.objectives?.length}`}</span>
                }
              />
            ) : null;

          flairCoin =
            recordData?.intervalObjectives &&
            recordData?.intervalObjectives.length &&
            PresentationNodeUtils.ShowProgressBarForSingleObjective(
              recordData.intervalObjectives[0],
              firstIntervalObjectDef
            ) ? (
              <FlairCoin
                children={
                  <span className={styles.flairSlot}>{`${
                    recordData?.intervalObjectives?.filter((o) => o.complete)
                      ?.length
                  } / ${recordData?.intervalObjectives?.length}`}</span>
                }
              />
            ) : null;

          if (isObscured) {
            name =
              recordDef?.stateInfo?.obscuredString !== ""
                ? recordDef?.stateInfo?.obscuredString
                : nodesLoc.ObscuredTriumphTitle;
          }

          const completed = recordData?.state === DestinyRecordState.None;
          const redeemed =
            EnumUtils.hasFlag(
              recordData?.state,
              DestinyRecordState.RecordRedeemed
            ) ?? false;

          return (
            <div
              key={r.recordHash}
              className={classNames(
                styles.detailItem,
                { [styles.completed]: completed },
                { [styles.redeemed]: redeemed },
                { [styles.clickable]: !isObscured }
              )}
              onClick={() => {
                !isObscured ? showDetailModal(recordDef.hash) : null;
              }}
            >
              <DetailItem
                detailCoin={isObscured ? null : detailCoin}
                iconCoin={isObscured ? null : icon}
                flairCoin={isObscured ? null : flairCoin}
                title={name}
                size={BasicSize.Large}
                normalWhiteSpace={globalState.responsive.medium}
                subtitle={
                  isObscured ? nodesLoc.ObscuredTriumphDescription : description
                }
              />
            </div>
          );
        })}
    </GridCol>
  );
};

export default withDestinyDefinitions(RecordItems, {
  types: [
    "DestinyPresentationNodeDefinition",
    "DestinyRecordDefinition",
    "DestinyObjectiveDefinition",
  ],
});
