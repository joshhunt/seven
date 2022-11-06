// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import Categories from "@UI/Destiny/PresentationNodes/Categories";
import styles from "@UI/Destiny/PresentationNodes/DetailContainer.module.scss";
import { Responses } from "@Platform";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import RecordItems from "@UI/Destiny/PresentationNodes/RecordItems";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import React from "react";

interface DetailContainerProps {
  rootHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  parentHash: number;
  categoryHash: number;
  subCategoryHash: number;
  sort: sortMode;
}

export const DetailContainer: React.FC<DetailContainerProps> = (props) => {
  const responsive = useDataStore(Responsive);

  return (
    <div className={styles.nodeDetailContainer}>
      <GridCol cols={3} medium={12} className={styles.nodeDetailNavigation}>
        <Categories
          pageType={"triumphs"}
          rootHash={props.rootHash}
          subcategoryHash={props.subCategoryHash}
          profileResponse={props.profileResponse}
          categoryHash={props.categoryHash}
          parentHash={props.parentHash}
          sort={props.sort}
        />
      </GridCol>
      <RecordItems
        rootHash={props.rootHash}
        subcategoryHash={props.subCategoryHash}
        profileResponse={props.profileResponse}
        categoryHash={props.categoryHash}
        parentHash={props.parentHash}
        pageType={"triumphs"}
      />
    </div>
  );
};
