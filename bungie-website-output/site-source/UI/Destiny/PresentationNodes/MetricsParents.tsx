// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/Definitions/RouteParams";
import { filterMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { ISubCategoryItemProps } from "@UI/Destiny/PresentationNodes/SubCategories";
import styles from "@UI/Destiny/PresentationNodes/SubCategories.module.scss";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { DetailItem } from "@UIKit/Companion/DetailItem";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React from "react";
import { useHistory } from "react-router";

interface MetricsParentsProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyMetricDefinition"
    | "DestinyObjectiveDefinition"
    | "DestinyTraitDefinition"
  > {
  rootHash: number;
  parentHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  filter: filterMode;
}

const MetricsParents: React.FC<MetricsParentsProps> = (props) => {
  const history = useHistory();
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const rootDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.rootHash
  );
  const parentDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.parentHash
  );

  const metricParents: ISubCategoryItemProps[] = rootDef.children.presentationNodes.map(
    (p) => {
      const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
        p.presentationNodeHash
      );

      const data = PresentationNodeUtils.GetPresentationComponentData(
        nodeDef.hash,
        destinyMembership.selectedCharacter?.characterId,
        props.profileResponse
      );

      const routeParams: PresentationNodeParams = {
        mid: destinyMembership.selectedMembership?.membershipId,
        mtype: EnumUtils.getNumberValue(
          destinyMembership.selectedMembership?.membershipType,
          BungieMembershipType
        ).toString(),
        cid: destinyMembership.selectedCharacter?.characterId,
        root: props.rootHash.toString(),
        parent: p.presentationNodeHash.toString(),
        filter: props.filter,
      };

      const url = RouteHelper.NewCollections(routeParams);

      const isActive = props.parentHash === p.presentationNodeHash;

      return {
        presentationNodeHash: p.presentationNodeHash,
        url: url,
        name: nodeDef.displayProperties.name,
        subTitle: nodeDef.displayProperties.description,
        iconPath: nodeDef.displayProperties.icon,
        isActive: isActive,
      };
    }
  );

  if (!destinyMembership || !metricParents || !metricParents.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.breadcrumb}>
        {rootDef?.displayProperties?.name ?? ""}
        {parentDef?.displayProperties?.name
          ? ` // ${parentDef?.displayProperties?.name ?? ""}`
          : ""}
      </div>
      <div className={styles.subcategoryList}>
        {metricParents.map((m) => {
          return (
            <Anchor
              key={m.presentationNodeHash}
              url={m.url}
              className={classNames(styles.detailItemCategory, {
                [styles.active]: m.isActive,
              })}
            >
              <DetailItem
                iconCoin={<IconCoin iconImageUrl={m.iconPath} />}
                title={m.name}
                subtitle={m.subTitle}
                normalWhiteSpace={true}
              />
            </Anchor>
          );
        })}
      </div>
      <Dropdown
        className={styles.categoriesDropdown}
        selectedValue={metricParents.find((m) => m.isActive)?.url.url}
        onChange={(newValue) => history.push(newValue)}
        options={metricParents
          .filter((m) => m)
          .map((m) => {
            const dropdownOption: IDropdownOption = {
              value: m.url.url,
              label: m.name,
            };

            return dropdownOption;
          })}
      />
    </div>
  );
};

export default withDestinyDefinitions(MetricsParents, {
  types: [
    "DestinyMetricDefinition",
    "DestinyPresentationNodeDefinition",
    "DestinyObjectiveDefinition",
    "DestinyTraitDefinition",
  ],
});
