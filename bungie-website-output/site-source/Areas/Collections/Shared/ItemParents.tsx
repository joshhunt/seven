// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Collections/Shared/Categories.module.scss";
import ItemParent from "@Areas/Collections/Shared/ItemParent";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Responses } from "@Platform";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import classNames from "classnames";
import React from "react";

interface ItemParentsProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  collectionItemsRootHash: number;
  activeParentPresentationNodeHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  isMini: boolean;
  sort: sortMode;
}

const ItemParents: React.FC<ItemParentsProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const rootCollectionDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.collectionItemsRootHash
  );

  if (!rootCollectionDef) {
    return null;
  }

  return (
    <div>
      {!props.isMini && (
        <div className={styles.sectionTitle}>
          {rootCollectionDef.displayProperties?.name ?? ""}
        </div>
      )}
      <div
        className={classNames(styles.nodeCategories, styles.itemCategories, {
          [styles.mini]: props.isMini,
        })}
      >
        {rootCollectionDef.children.presentationNodes.map((pn) => {
          const def = props.definitions.DestinyPresentationNodeDefinition.get(
            pn.presentationNodeHash
          );

          return (
            <ItemParent
              key={pn.presentationNodeHash}
              presentationNodeHash={pn.presentationNodeHash}
              activeParentPresentationNodeHash={
                props.activeParentPresentationNodeHash
              }
              profileResponse={props.profileResponse}
              parentPresentationNodeHash={rootCollectionDef.hash}
              sort={props.sort}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(ItemParents, {
  types: ["DestinyPresentationNodeDefinition"],
});
