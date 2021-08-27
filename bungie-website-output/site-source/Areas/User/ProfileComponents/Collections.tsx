// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/ProfileComponents/Triumphs.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Localizer } from "@bungie/localization";
import { Models, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import React from "react";

interface CollectionsProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyCollectibleDefinition"
  > {
  coreSettings: Models.CoreSettingsConfiguration;
  profileResponse: Responses.DestinyProfileResponse;
  characterId: string;
}

interface ICollectionScore {
  totalGathered: number;
  totalPossible: number;
}

const Collections: React.FC<CollectionsProps> = (props) => {
  const { coreSettings, profileResponse, characterId, definitions } = props;

  if (!profileResponse?.characterPresentationNodes?.data) {
    return null;
  }

  const profileLoc = Localizer.Profile;

  const getTotalScore = (): ICollectionScore => {
    const rootDef = definitions.DestinyPresentationNodeDefinition.get(
      coreSettings.destiny2CoreSettings.collectionRootNode
    );
    const characterPresentationNodesForCharacter =
      profileResponse.characterPresentationNodes.data[characterId];

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
              profileResponse.profilePresentationNodes.data.nodes[
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

    return {
      totalGathered: totalGathered,
      totalPossible: totalPossible,
    };
  };

  const score = getTotalScore();

  const scoreText = `${score.totalGathered} / ${score.totalPossible}`;

  const noRecent = profileLoc.NothingCollectedRecently;

  return (
    <Anchor
      url={RouteHelper.Collections()}
      className={classNames(styles.mainContainer, styles.collectionsContainer)}
    >
      <h4>{profileLoc.Collections}</h4>
      <div className={styles.total}>
        <span>{profileLoc.ItemsCollected}</span>
        <span>{scoreText}</span>
      </div>
      <div className={styles.seals}>
        {profileResponse?.profileCollectibles?.data?.recentCollectibleHashes
          ?.slice(0, 6)
          .map((collectibleHash: number) => {
            try {
              const itemDef = definitions.DestinyCollectibleDefinition.get(
                collectibleHash
              );

              return (
                <div className={styles.seal} key={itemDef.hash}>
                  <img
                    src={itemDef.displayProperties.icon}
                    alt={itemDef.displayProperties.name}
                  />
                </div>
              );
            } catch {
              return null;
            }
          })}
        {typeof profileResponse?.profileCollectibles?.data
          ?.recentCollectibleHashes === "undefined" && <p>{noRecent}</p>}
      </div>
    </Anchor>
  );
};

export default withDestinyDefinitions(Collections, {
  types: ["DestinyPresentationNodeDefinition", "DestinyCollectibleDefinition"],
});
