// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import Categories from "@UI/Destiny/PresentationNodes/Categories";
import CollectibleItems from "@UI/Destiny/PresentationNodes/CollectibleItems";
import styles from "@UI/Destiny/PresentationNodes/DetailContainer.module.scss";
import { Responses } from "@Platform";
import MetricsItems from "@UI/Destiny/PresentationNodes/MetricsItems";
import MetricsParents from "@UI/Destiny/PresentationNodes/MetricsParents";
import {
  CollectionType,
  filterMode,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import RecordItems from "@UI/Destiny/PresentationNodes/RecordItems";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import React from "react";

interface DetailContainerProps {
  collectionRootHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  parentHash: number;
  categoryHash: number;
  subCategoryHash: number;
  collectionType: CollectionType;
  filter: filterMode;
  sort: sortMode;
}

export const DetailContainer: React.FC<DetailContainerProps> = (props) => {
  const responsive = useDataStore(Responsive);

  return (
    <GridCol cols={12} className={styles.nodeDetailContainer}>
      <GridCol
        cols={responsive.medium ? 12 : 3}
        className={styles.nodeDetailNavigation}
      >
        <Categories
          pageType={"collections"}
          rootHash={props.collectionRootHash}
          subcategoryHash={props.subCategoryHash}
          profileResponse={props.profileResponse}
          categoryHash={props.categoryHash}
          parentHash={props.parentHash}
          sort={props.sort}
        />
        {props.collectionType === "stats" && (
          <MetricsParents
            rootHash={props.collectionRootHash}
            profileResponse={props.profileResponse}
            parentHash={props.parentHash}
            filter={props.filter}
          />
        )}
      </GridCol>
      <CollectibleItems
        rootHash={props.collectionRootHash}
        subcategoryHash={props.subCategoryHash}
        profileResponse={props.profileResponse}
        categoryHash={props.categoryHash}
        parentHash={props.parentHash}
      />
      <RecordItems
        rootHash={props.collectionRootHash}
        subcategoryHash={props.subCategoryHash}
        profileResponse={props.profileResponse}
        categoryHash={props.categoryHash}
        parentHash={props.parentHash}
        pageType={"collections"}
      />
      <MetricsItems
        rootHash={props.collectionRootHash}
        subcategoryHash={props.subCategoryHash}
        profileResponse={props.profileResponse}
        categoryHash={props.categoryHash}
        parentHash={props.parentHash}
      />
    </GridCol>
  );
};
