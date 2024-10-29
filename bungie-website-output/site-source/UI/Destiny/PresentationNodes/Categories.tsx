// Created by atseng, 2022
// Copyright Bungie, Inc.

import { PresentationNodeParams } from "@Routes/Definitions/RouteParams";
import {
  PageType,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import SubCategories from "@UI/Destiny/PresentationNodes/SubCategories";
import styles from "./SubCategories.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Quests, Responses } from "@Platform";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { DetailItem } from "@UIKit/Companion/DetailItem";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React, { ReactNode } from "react";

export interface ICategoryItemProps {
  presentationNodeHash: number;
  url: IMultiSiteLink;
  name: string;
  iconPath: string;
  isActive: boolean;

  detailCoin?: ReactNode;
  flairCoin?: ReactNode;
}

interface CategoriesProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyObjectiveDefinition"
  > {
  rootHash: number;
  parentHash: number;
  categoryHash: number;
  subcategoryHash: number;
  sort?: sortMode;
  profileResponse: Responses.DestinyProfileResponse;

  pageType: PageType;
}

const Categories: React.FC<CategoriesProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const parentNodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.parentHash
  );

  if (parentNodeDef.children?.presentationNodes?.length < 2) {
    return null;
  }

  const categoryHash = !Number.isNaN(props.categoryHash)
    ? props.categoryHash
    : parentNodeDef?.children?.presentationNodes[0]?.presentationNodeHash;

  const categoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    categoryHash
  );

  const subCategoryHash = !Number.isNaN(props.subcategoryHash)
    ? props.subcategoryHash
    : categoryDef.children.presentationNodes[0]?.presentationNodeHash;
  const subCategoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    subCategoryHash
  );

  const subList = categoryDef?.children?.presentationNodes;

  const progressString = (
    progress: Quests.DestinyObjectiveProgress
  ): ReactNode => {
    return PresentationNodeUtils.ProgressString(
      props.definitions.DestinyObjectiveDefinition.get(progress.objectiveHash),
      progress
    );
  };

  const categories: ICategoryItemProps[] = parentNodeDef.children.presentationNodes.map(
    (pn) => {
      const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
        pn.presentationNodeHash
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
        parent: props.parentHash.toString(),
        category: pn.presentationNodeHash.toString(),
        sort: props.sort,
      };

      const url =
        props.pageType === "triumphs"
          ? RouteHelper.NewTriumphs(routeParams)
          : RouteHelper.NewCollections(routeParams);

      const isActive = categoryHash === pn.presentationNodeHash;

      if (data?.objective && (!subList || subList?.length === 0)) {
        return {
          presentationNodeHash: pn.presentationNodeHash,
          url: url,
          name: nodeDef.displayProperties.name,
          iconPath: nodeDef.displayProperties.icon,
          isActive: isActive,
          detailCoin: (
            <ProgressBar
              progressToTotal={data.progressValue}
              total={data.completionValue}
              isCompact={true}
              showBarWhenComplete={false}
              progressPercent={
                (data.progressValue / data.completionValue) * 100
              }
              showText={false}
              description={""}
              customText={""}
            />
          ),
          flairCoin: progressString(data.objective),
        };
      }

      return {
        presentationNodeHash: pn.presentationNodeHash,
        url: url,
        name: nodeDef.displayProperties.name,
        iconPath: nodeDef.displayProperties.icon,
        isActive: isActive,
      };
    }
  );

  return (
    <div>
      <div className={styles.nodeSubcategories}>
        {categories
          .filter((c) => c)
          .map((cat) => {
            if (cat.detailCoin && cat.flairCoin) {
              return (
                <Anchor
                  key={cat.presentationNodeHash}
                  className={classNames(
                    styles.nodeSubcategoryTrigger,
                    styles.badgeSubcategory,
                    { [styles.active]: cat?.isActive }
                  )}
                  url={cat.url}
                >
                  <DetailItem
                    title={cat.name}
                    size={BasicSize.Small}
                    detailCoin={cat.detailCoin}
                    iconCoin={<IconCoin iconImageUrl={cat.iconPath} />}
                    flairCoin={cat.flairCoin}
                  />
                </Anchor>
              );
            }

            return (
              <Anchor
                key={cat.presentationNodeHash}
                className={classNames(styles.nodeSubcategoryTrigger, {
                  [styles.active]: cat?.isActive,
                })}
                url={cat.url}
                title={cat.name}
              >
                <div
                  className={styles.icon}
                  style={{ backgroundImage: `url(${cat.iconPath})` }}
                />
              </Anchor>
            );
          })}
      </div>
      <SubCategories
        profileResponse={props.profileResponse}
        categoryHash={props.categoryHash}
        subcategoryHash={subCategoryHash}
        rootHash={props.rootHash}
        parentHash={props.parentHash}
        subList={subList}
        pageType={props.pageType}
        sort={props.sort}
      />
    </div>
  );
};

export default withDestinyDefinitions(Categories, {
  types: ["DestinyPresentationNodeDefinition", "DestinyObjectiveDefinition"],
});
