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
import { Quests, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/RouteParams";
import { ICategoryItemProps } from "@UI/Destiny/PresentationNodes/Categories";
import {
  PageType,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { Anchor } from "@UI/Navigation/Anchor";
import { DetailItem } from "@UI/UIKit/Companion/DetailItem";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import styles from "./SubCategories.module.scss";

interface SubCategoriesProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyObjectiveDefinition"
  > {
  rootHash: number;
  parentHash: number;
  categoryHash: number;
  subcategoryHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  pageType: PageType;
  subList: DestinyDefinitions.DestinyPresentationNodeChildEntry[];
  sort?: sortMode;
}

export interface ISubCategoryItemProps extends ICategoryItemProps {
  subTitle?: string;
  isObscured?: boolean;
}

const SubCategories: React.FC<SubCategoriesProps> = (props) => {
  const history = useHistory();
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  if (!props.subList) {
    return null;
  }

  const progressString = (
    progress: Quests.DestinyObjectiveProgress
  ): ReactNode => {
    return PresentationNodeUtils.ProgressString(
      props.definitions.DestinyObjectiveDefinition.get(progress.objectiveHash),
      progress
    );
  };

  const subListItems: ISubCategoryItemProps[] = props.subList.map((sl) => {
    const data = PresentationNodeUtils.GetPresentationComponentData(
      sl.presentationNodeHash,
      destinyMembership.selectedCharacter?.characterId,
      props.profileResponse
    );

    if (!data || data.state === DestinyPresentationNodeState.Invisible) {
      return null;
    }

    const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
      sl.presentationNodeHash
    );

    const categoryHash =
      !Number.isNaN(props.categoryHash) && props.categoryHash
        ? props.categoryHash
        : nodeDef.parentNodeHashes[0];

    if (!nodeDef) {
      return null;
    }

    const routeParams: PresentationNodeParams = {
      mid: destinyMembership.selectedMembership?.membershipId,
      mtype: EnumUtils.getNumberValue(
        destinyMembership.selectedMembership?.membershipType,
        BungieMembershipType
      ).toString(),
      cid: destinyMembership.selectedCharacter?.characterId,
      root: props.rootHash.toString(),
      parent: props.parentHash.toString(),
      category: categoryHash.toString(),
      subcategory: sl.presentationNodeHash.toString(),
      sort: props.sort,
    };

    const url =
      props.pageType === "triumphs"
        ? RouteHelper.NewTriumphs(routeParams)
        : RouteHelper.NewCollections(routeParams);

    const detailCoin = data?.objective ? (
      <ProgressBar
        progressToTotal={data.progressValue}
        total={data.completionValue}
        isCompact={true}
        progressPercent={(data.progressValue / data.completionValue) * 100}
        showText={false}
        description={""}
        customText={""}
        showBarWhenComplete={false}
      />
    ) : null;

    const iconCoin = nodeDef?.displayProperties?.icon ? (
      <IconCoin iconImageUrl={nodeDef.displayProperties.icon} />
    ) : null;

    let flairCoin =
      data?.objective && data.completionValue > 0
        ? progressString(data.objective)
        : null;
    const isActive = nodeDef.hash === props.subcategoryHash;

    if (data.state === DestinyPresentationNodeState.Obscured) {
      flairCoin = "???";

      return {
        presentationNodeHash: nodeDef.hash,
        url: url,
        name: "???????",
        iconPath: "",
        isActive: isActive,
        detailCoin: detailCoin,
        flairCoin: flairCoin,
        isObscured: true,
      };
    } else {
      return {
        presentationNodeHash: nodeDef.hash,
        url: url,
        name: nodeDef.displayProperties.name,
        iconPath: nodeDef.displayProperties.icon,
        isActive: isActive,
        detailCoin: detailCoin,
        flairCoin: flairCoin,
        subTitle: nodeDef.displayProperties.description,
      };
    }
  });

  return (
    <>
      {subListItems && subListItems.length > 0 && (
        <>
          <div className={styles.subcategoryList}>
            {subListItems
              ?.filter((sl) => sl)
              .map((sl) => {
                const iconCoin = sl.iconPath ? (
                  <IconCoin iconImageUrl={sl.iconPath} />
                ) : null;

                if (sl.isObscured) {
                  return (
                    <DetailItem
                      key={sl.presentationNodeHash}
                      className={styles.detailItemCategory}
                      detailCoin={sl.detailCoin}
                      flairCoin={sl.flairCoin}
                      iconCoin={iconCoin}
                      title={sl.name}
                      subtitle={sl.subTitle}
                    />
                  );
                }

                if (sl.subTitle) {
                  return (
                    <Anchor
                      key={sl.presentationNodeHash}
                      url={sl.url}
                      className={classNames(styles.detailItemCategory, {
                        [styles.active]: sl.isActive,
                      })}
                    >
                      <DetailItem
                        detailCoin={sl.detailCoin}
                        flairCoin={sl.flairCoin}
                        iconCoin={iconCoin}
                        title={sl.name}
                        subtitle={sl.subTitle}
                      />
                    </Anchor>
                  );
                } else {
                  return (
                    <Anchor
                      key={sl.presentationNodeHash}
                      url={sl.url}
                      className={classNames(styles.detailItemCategory, {
                        [styles.active]: sl.isActive,
                      })}
                    >
                      <DetailItem
                        detailCoin={sl.detailCoin}
                        flairCoin={sl.flairCoin}
                        iconCoin={iconCoin}
                        title={sl.name}
                      />
                    </Anchor>
                  );
                }
              })}
          </div>
          <Dropdown
            className={styles.categoriesDropdown}
            selectedValue={subListItems.find((sl) => sl.isActive)?.url?.url}
            onChange={(newValue) => history.push(newValue)}
            options={subListItems
              .filter((sl) => sl)
              .map((sl) => {
                const dropdownOption: IDropdownOption = {
                  value: sl.url.url,
                  label: sl.name,
                };

                return dropdownOption;
              })}
          />
        </>
      )}
    </>
  );
};

export default withDestinyDefinitions(SubCategories, {
  types: ["DestinyPresentationNodeDefinition", "DestinyObjectiveDefinition"],
});
