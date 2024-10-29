// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { Localizer } from "@bungie/localization/Localizer";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { IMultiSiteLink, RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/Definitions/RouteParams";
import {
  filterMode,
  PageType,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React from "react";
import styles from "./Breadcrumb.module.scss";

type BreadCrumbLevel = "root" | "parent" | "category" | "subcategory";

interface BreadcrumbProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  pageType: PageType;
  rootHash: number;
  parentNodeHash?: number;
  categoryNodeHash?: number;
  subCategoryHash?: number;
  sort?: sortMode;
  filter?: filterMode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const isCollections = props.pageType === "collections";

  const parentNodeDef = Number.isInteger(props.parentNodeHash)
    ? props.definitions.DestinyPresentationNodeDefinition.get(
        props.parentNodeHash
      )
    : undefined;
  let categoryNodeDef = Number.isInteger(props.categoryNodeHash)
    ? props.definitions.DestinyPresentationNodeDefinition.get(
        props.categoryNodeHash
      )
    : undefined;
  let subcategoryNodeDef = Number.isInteger(props.subCategoryHash)
    ? props.definitions.DestinyPresentationNodeDefinition.get(
        props.subCategoryHash
      )
    : undefined;

  const defaultCat = parentNodeDef?.children?.presentationNodes?.[0];
  const defaultCatDef = props.definitions.DestinyPresentationNodeDefinition.get(
    defaultCat?.presentationNodeHash
  );
  categoryNodeDef = categoryNodeDef ?? defaultCatDef;
  const defaultSubCat = categoryNodeDef?.children?.presentationNodes?.[0];
  const defaultSubCatDef = props.definitions.DestinyPresentationNodeDefinition.get(
    defaultSubCat?.presentationNodeHash
  );
  subcategoryNodeDef = subcategoryNodeDef ?? defaultSubCatDef;

  const url = (isCollect: boolean, pms: PresentationNodeParams) => {
    return isCollect
      ? RouteHelper.NewCollections(pms)
      : RouteHelper.NewTriumphs(pms);
  };

  const breadcrumbAnchor = (label: string, link: IMultiSiteLink) => {
    return (
      <Anchor className={styles.breadcrumbAnchor} url={link}>
        {label}
      </Anchor>
    );
  };

  const breadcrumbEnd = (label: string) => {
    return <p className={styles.breadcrumbEnd}>{label}</p>;
  };

  const breadcrumbItem = (hash: number, level: BreadCrumbLevel) => {
    const def = props.definitions.DestinyPresentationNodeDefinition.get(hash);
    const label = def && def?.displayProperties?.name;
    const urlParams: PresentationNodeParams = {
      mid: destinyMembership?.selectedMembership?.membershipId,
      mtype: EnumUtils.getNumberValue(
        destinyMembership?.selectedMembership?.membershipType,
        BungieMembershipType
      ).toString(),
      cid: destinyMembership?.selectedCharacter?.characterId,
    };

    if (props.sort) {
      urlParams.sort = props.sort;
    }

    if (props.filter) {
      urlParams.filter = props.filter;
    }

    const multiSiteLink = url(isCollections, urlParams);

    if (level === "root") {
      const rootLabel =
        props.pageType === "collections"
          ? Localizer.Nav.TopNavCollections
          : Localizer.Nav.TopNavTriumphs;

      if (!parentNodeDef) {
        return breadcrumbEnd(rootLabel);
      }

      return breadcrumbAnchor(rootLabel, multiSiteLink);
    }

    if (!Number.isInteger(hash)) {
      return null;
    }

    switch (level) {
      case "parent":
      case "category":
      case "subcategory":
        return breadcrumbEnd(label);
      default:
        return null;
    }
  };

  return (
    <div className={styles.breadcrumbContainer}>
      <div
        className={classNames(styles.profileBreadcrumb, styles[props.pageType])}
      >
        <Anchor
          className={styles.breadcrumbAnchor}
          url={RouteHelper.NewProfile({
            mid: destinyMembership.selectedMembership?.membershipId,
            mtype: EnumUtils.getNumberValue(
              destinyMembership?.selectedMembership?.membershipType,
              BungieMembershipType
            ).toString(),
          })}
        >
          {Localizer.Nav.TopNavProfile}
        </Anchor>
        {breadcrumbItem(props.rootHash, "root")}
        {breadcrumbItem(parentNodeDef?.hash, "parent")}
        {breadcrumbItem(categoryNodeDef?.hash, "category")}
        {breadcrumbItem(subcategoryNodeDef?.hash, "subcategory")}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(Breadcrumb, {
  types: ["DestinyPresentationNodeDefinition", "DestinyObjectiveDefinition"],
});
