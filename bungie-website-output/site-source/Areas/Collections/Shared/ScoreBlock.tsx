// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./ScoreBlock.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Responses } from "@Platform";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useEffect, useState } from "react";

interface ScoreBlockProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  characterId: string;
  profileResponse: Responses.DestinyProfileResponse;
}

interface ITotalScore {
  totalGathered: Number;
  totalPossible: Number;
}

const ScoreBlock: React.FC<ScoreBlockProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [totalScore, setTotalScore] = useState<ITotalScore>({
    totalPossible: 0,
    totalGathered: 0,
  });

  const getTotalScore = () => {
    const rootDef = props.definitions.DestinyPresentationNodeDefinition.get(
      globalState.coreSettings.destiny2CoreSettings.collectionRootNode
    );
    const characterPresentationNodesForCharacter =
      props.profileResponse.characterPresentationNodes.data[props.characterId];

    let totalGathered = 0;
    let totalPossible = 0;

    if (rootDef?.children?.presentationNodes !== null) {
      for (const childNode of rootDef.children.presentationNodes) {
        const childDef = props.definitions.DestinyPresentationNodeDefinition.get(
          childNode.presentationNodeHash
        );

        for (const childOfChildNode of childDef.children.presentationNodes) {
          let nodeData =
            characterPresentationNodesForCharacter?.nodes[
              childOfChildNode.presentationNodeHash
            ];

          if (typeof nodeData === "undefined") {
            // there is no character specific data use the profile data
            nodeData =
              props.profileResponse.profilePresentationNodes.data.nodes[
                childOfChildNode.presentationNodeHash
              ];
          }

          if (typeof nodeData?.objective !== "undefined") {
            totalGathered += nodeData.objective.progress ?? 0;
            totalPossible += nodeData.objective.completionValue;
          }
        }
      }
    }

    setTotalScore({
      totalGathered: totalGathered,
      totalPossible: totalPossible,
    });
  };

  useEffect(() => {
    if (props.characterId && props.profileResponse) {
      getTotalScore();
    }
  }, [props.characterId, props.profileResponse]);

  return (
    <GridCol cols={4} className={styles.totalScore}>
      <div className={styles.presentationNodeSectionTitle}>
        {Localizer.PresentationNodes.CollectionsItemsCollected}
      </div>
      <div className={styles.scoreNumber}>
        <span>
          {totalScore.totalGathered.toLocaleString(
            Localizer.CurrentCultureName
          )}
        </span>{" "}
        /{" "}
        <span>
          {totalScore.totalPossible.toLocaleString(
            Localizer.CurrentCultureName
          )}
        </span>
      </div>
    </GridCol>
  );
};

export default withDestinyDefinitions(ScoreBlock, {
  types: ["DestinyPresentationNodeDefinition"],
});
