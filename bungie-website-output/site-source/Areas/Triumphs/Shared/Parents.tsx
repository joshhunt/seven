// Created by atseng, 2022
// Copyright Bungie, Inc.

import SealsParent from "@Areas/Triumphs/Shared/SealsParent";
import TriumphsParent from "@Areas/Triumphs/Shared/TriumphsParent";
import { TriumphType } from "@Areas/Triumphs/Triumphs";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Responses } from "@Platform";
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import classNames from "classnames";
import React from "react";
import styles from "./Parents.module.scss";

interface ParentsProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  isLegacy: boolean;
  isRootPage: boolean;
  triumphType: TriumphType;
  profileResponse: Responses.DestinyProfileResponse;
  parentNodeHash: number;
  sort: sortMode;
}

const Parents: React.FC<ParentsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const activeTriumphsRootNodeHash =
    globalState?.coreSettings?.destiny2CoreSettings?.activeTriumphsRootNodeHash;
  const activeSealsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.activeSealsRootNodeHash;
  const legacyTriumphsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.legacyTriumphsRootNodeHash;
  const legacySealsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.legacySealsRootNodeHash;

  const activeTriumphsRootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    activeTriumphsRootNodeHash
  );
  const legacyTriumphsRootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    legacyTriumphsRootHash
  );
  const activeSealsRootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    activeSealsRootHash
  );
  const legacySealsRootNode = props.definitions.DestinyPresentationNodeDefinition.get(
    legacySealsRootHash
  );

  return (
    <GridCol cols={props.isRootPage || globalState.responsive.mobile ? 12 : 8}>
      {!props.isLegacy && (
        <div>
          {(props.isRootPage ||
            (!props.isRootPage && props.triumphType === "activeTriumph")) && (
            <div
              className={classNames(styles.nodeCategories, styles.triumphs, {
                [styles.mini]: !props.isRootPage,
              })}
            >
              {activeTriumphsRootNode &&
                activeTriumphsRootNode.children.presentationNodes.map(
                  (child) => {
                    const def = props.definitions.DestinyPresentationNodeDefinition.get(
                      child.presentationNodeHash
                    );

                    return (
                      <TriumphsParent
                        key={child.presentationNodeHash}
                        isLegacy={false}
                        presentationNode={child}
                        displayedParentPresentationNodeHash={
                          props.parentNodeHash
                        }
                        rootPresentationNodeHash={activeTriumphsRootNodeHash}
                        profileResponse={props.profileResponse}
                        sort={props.sort}
                      />
                    );
                  }
                )}
            </div>
          )}
          {(props.isRootPage ||
            (!props.isRootPage && props.triumphType === "activeSeal")) && (
            <div>
              {props.isRootPage && (
                <div className={styles.presentationNodeSectionTitle}>
                  {activeSealsRootNode.displayProperties.name}
                </div>
              )}
              <div
                className={classNames(styles.nodeCategories, styles.medals, {
                  [styles.mini]: !props.isRootPage,
                })}
              >
                {activeSealsRootNode &&
                  activeSealsRootNode.children.presentationNodes.map(
                    (child) => {
                      const def = props.definitions.DestinyPresentationNodeDefinition.get(
                        child.presentationNodeHash
                      );

                      return (
                        <SealsParent
                          key={def.hash}
                          isMini={!props.isRootPage}
                          isLegacy={false}
                          profileResponse={props.profileResponse}
                          rootPresentationNodeHash={activeSealsRootHash}
                          presentationNode={child}
                          displayedParentPresentationNodeHash={
                            props.parentNodeHash
                          }
                          sort={props.sort}
                        />
                      );
                    }
                  )}
              </div>
            </div>
          )}
        </div>
      )}
      {props.isLegacy && (
        <div>
          {(props.isRootPage ||
            (!props.isRootPage && props.triumphType === "legacyTriumph")) && (
            <div
              className={classNames(styles.nodeCategories, styles.triumphs, {
                [styles.mini]: !props.isRootPage,
              })}
            >
              {legacyTriumphsRootNode &&
                legacyTriumphsRootNode.children.presentationNodes.map(
                  (child) => {
                    const def = props.definitions.DestinyPresentationNodeDefinition.get(
                      child.presentationNodeHash
                    );

                    return (
                      <TriumphsParent
                        key={child.presentationNodeHash}
                        isLegacy={true}
                        presentationNode={child}
                        displayedParentPresentationNodeHash={
                          props.parentNodeHash
                        }
                        rootPresentationNodeHash={legacyTriumphsRootHash}
                        profileResponse={props.profileResponse}
                        sort={props.sort}
                      />
                    );
                  }
                )}
            </div>
          )}
          {(props.isRootPage ||
            (!props.isRootPage && props.triumphType === "legacySeal")) && (
            <div>
              {props.isRootPage && (
                <div className={styles.presentationNodeSectionTitle}>
                  {legacySealsRootNode.displayProperties.name}
                </div>
              )}
              <div
                className={classNames(styles.nodeCategories, styles.medals, {
                  [styles.mini]: !props.isRootPage,
                })}
              >
                {legacySealsRootNode &&
                  legacySealsRootNode.children.presentationNodes.map(
                    (child) => {
                      const def = props.definitions.DestinyPresentationNodeDefinition.get(
                        child.presentationNodeHash
                      );

                      return (
                        <SealsParent
                          key={def.hash}
                          isMini={!props.isRootPage}
                          isLegacy={true}
                          profileResponse={props.profileResponse}
                          rootPresentationNodeHash={legacySealsRootHash}
                          presentationNode={child}
                          displayedParentPresentationNodeHash={
                            props.parentNodeHash
                          }
                          sort={props.sort}
                        />
                      );
                    }
                  )}
              </div>
            </div>
          )}
        </div>
      )}
    </GridCol>
  );
};

export default withDestinyDefinitions(Parents, {
  types: ["DestinyPresentationNodeDefinition"],
});
