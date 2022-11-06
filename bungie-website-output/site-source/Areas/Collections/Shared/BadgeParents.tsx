// Created by atseng, 2022
// Copyright Bungie, Inc.

import BadgeParent from "@Areas/Collections/Shared/BadgeParent";
import styles from "@Areas/Collections/Shared/Categories.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Responses } from "@Platform";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import classNames from "classnames";
import React from "react";

interface BadgeParentsProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  collectionBadgesRootHash: number;
  activeParentPresentationNodeHash: number;
  profileResponse: Responses.DestinyProfileResponse;
  isMini: boolean;
  sort: sortMode;
}

const BadgeParents: React.FC<BadgeParentsProps> = (props) => {
  const rootCollectionDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.collectionBadgesRootHash
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
        className={classNames(styles.nodeCategories, styles.badgeCategories, {
          [styles.mini]: props.isMini,
        })}
      >
        {rootCollectionDef.children.presentationNodes.map((pn) => {
          return (
            <BadgeParent
              key={pn.presentationNodeHash}
              isMini={props.isMini}
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

export default withDestinyDefinitions(BadgeParents, {
  types: ["DestinyPresentationNodeDefinition"],
});
