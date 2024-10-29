// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/Definitions/RouteParams";
import styles from "@UI/Destiny/PresentationNodes/DetailContainer.module.scss";
import MetricsDetailModal from "@UI/Destiny/PresentationNodes/MetricsDetailModal";
import {
  filterMode,
  TraitSortMap,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import stylesModal from "@UI/Destiny/PresentationNodes/RecordDetailModal.module.scss";
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
import { useHistory } from "react-router";

interface MetricsItemsProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyMetricDefinition"
    | "DestinyObjectiveDefinition"
    | "DestinyTraitDefinition"
  > {
  rootHash: number;
  parentHash: number;
  categoryHash: number;
  subcategoryHash: number;
  profileResponse: Responses.DestinyProfileResponse;
}

const MetricsItems: React.FC<MetricsItemsProps> = (props) => {
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const urlParams = new URLSearchParams(window.location.search);

  const filter = (urlParams?.get("filter") as filterMode) ?? "All";

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
    parentDef?.children?.metrics &&
    parentDef.children.metrics.length;
  const categoryIsContainer =
    !subCategoryDef &&
    categoryDef?.children?.metrics &&
    categoryDef.children.metrics.length;

  const metrics = parentIsContainer
    ? parentDef.children.metrics
    : categoryIsContainer
    ? categoryDef.children.metrics
    : subCategoryDef?.children?.metrics;

  const nodesLoc = Localizer.PresentationNodes;

  if (!metrics || !metrics.length) {
    return null;
  }

  if (
    !props.profileResponse ||
    !destinyMembership?.selectedMembership ||
    !destinyMembership?.selectedCharacter
  ) {
    return null;
  }

  const filteredMetrics = metrics.filter((m) => {
    const def = props.definitions.DestinyMetricDefinition.get(m.metricHash);

    return def?.traitHashes?.includes(TraitSortMap[filter]);
  });

  const showDetailModal = (hash: number) => {
    Modal.open(
      <MetricsDetailModal
        profileResponse={props.profileResponse}
        metricHash={hash}
      />,
      { contentClassName: stylesModal.detailModal }
    );
  };

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
              filter: value,
            };

            history.push(RouteHelper.NewCollections(routeParams).url);
          }}
          selectedValue={filter.toString()}
          options={[
            {
              label: nodesLoc.All,
              value: "All",
            },
            {
              label: nodesLoc.Career,
              value: "Career",
            },
            {
              label: nodesLoc.Seasonal,
              value: "Seasonal",
            },
            {
              label: nodesLoc.Weekly,
              value: "Weekly",
            },
          ]}
        />
      </div>

      {filteredMetrics.map((s) => {
        const def = props.definitions.DestinyMetricDefinition.get(s.metricHash);

        if (!def.traitHashes) {
          return null;
        }

        if (
          def.displayProperties?.description === "" ||
          def.displayProperties?.name === ""
        ) {
          return null;
        }

        const metricsComponentData =
          props.profileResponse?.metrics?.data?.metrics?.[s.metricHash];

        if (!metricsComponentData || metricsComponentData.invisible) {
          return null;
        }

        const completed = metricsComponentData.objectiveProgress?.complete;

        const traitDefs = props.definitions.DestinyTraitDefinition.all();

        const objectiveDef = props.definitions.DestinyObjectiveDefinition.get(
          metricsComponentData.objectiveProgress?.objectiveHash
        );

        const showProgressbar =
          metricsComponentData.objectiveProgress &&
          PresentationNodeUtils.ShowProgressBarForSingleObjective(
            metricsComponentData.objectiveProgress,
            objectiveDef
          );

        const detailCoin = showProgressbar ? (
          <ProgressBar
            progressToTotal={metricsComponentData.objectiveProgress.progress}
            total={metricsComponentData.objectiveProgress.completionValue}
            isCompact={true}
            showBarWhenComplete={false}
            progressPercent={
              (metricsComponentData.objectiveProgress.progress /
                metricsComponentData.objectiveProgress.completionValue) *
              100
            }
            showText={false}
            description={""}
            customText={""}
          />
        ) : null;

        const iconCoin = def.displayProperties?.icon ? (
          <IconCoin iconImageUrl={def.displayProperties.icon} />
        ) : null;
        const flairCoin = showProgressbar ? (
          <FlairCoin
            children={PresentationNodeUtils.ProgressString(
              objectiveDef,
              metricsComponentData.objectiveProgress
            )}
          />
        ) : null;

        return (
          <div
            key={def.hash}
            className={classNames(styles.detailItem, styles.clickable, {
              [styles.completed]: completed,
            })}
            onClick={() => showDetailModal(def.hash)}
          >
            <DetailItem
              detailCoin={detailCoin}
              iconCoin={iconCoin}
              flairCoin={flairCoin}
              title={def.displayProperties.name}
              size={BasicSize.Large}
              subtitle={def.displayProperties.description}
              normalWhiteSpace={globalState.responsive.medium}
            />
          </div>
        );
      })}
    </GridCol>
  );
};

export default withDestinyDefinitions(MetricsItems, {
  types: [
    "DestinyMetricDefinition",
    "DestinyPresentationNodeDefinition",
    "DestinyObjectiveDefinition",
    "DestinyTraitDefinition",
  ],
});
