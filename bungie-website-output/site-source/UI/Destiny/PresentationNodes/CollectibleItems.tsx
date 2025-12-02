import CollectionSet from "@Areas/Collections/Shared/CollectionSet";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyCollectibleState, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Platform, Responses } from "@Platform";
import DestinyCollectibleDetailModal from "@UI/Destiny/DestinyCollectibleDetailModal";
import styles from "@UI/Destiny/PresentationNodes/DetailContainer.module.scss";
import { IconImagesCoin } from "@UIKit/Companion/Coins/IconImagesCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface CollectibleItemsProps
  extends D2DatabaseComponentProps<
    | "DestinyPresentationNodeDefinition"
    | "DestinyCollectibleDefinition"
    | "DestinyInventoryItemDefinition"
  > {
  rootHash: number;
  parentHash: number;
  categoryHash: number;
  subcategoryHash: number;
  profileResponse: Responses.DestinyProfileResponse;
}

const CollectibleItems: React.FC<CollectibleItemsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const [collectibleNodeDetail, setCollectibleNodeDetail] = useState<
    Responses.DestinyCollectibleNodeDetailResponse
  >();

  const parentDef = props.definitions.DestinyPresentationNodeDefinition.get(
    props.parentHash
  );

  if (!parentDef) {
    return null;
  }

  const categoryHash = !Number.isNaN(props.categoryHash)
    ? props.categoryHash
    : parentDef.children?.presentationNodes[0]?.presentationNodeHash;
  const categoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    categoryHash
  );

  const subCategoryHash = !Number.isNaN(props.subcategoryHash)
    ? props.subcategoryHash
    : categoryDef?.children.presentationNodes[0]?.presentationNodeHash;
  const subCategoryDef = props.definitions.DestinyPresentationNodeDefinition.get(
    subCategoryHash
  );

  const categoryIsContainer =
    categoryDef?.children?.collectibles &&
    categoryDef.children.collectibles.length;

  const collectibles = categoryIsContainer
    ? categoryDef.children.collectibles
    : subCategoryDef?.children?.collectibles;
  const collectibleParentHash = categoryIsContainer
    ? categoryHash
    : subCategoryHash;

  const nodesLoc = Localizer.PresentationNodes;

  const sets = subCategoryDef?.children?.presentationNodes ?? [];

  useEffect(() => {
    if (
      subCategoryHash &&
      destinyMembership.selectedMembership &&
      destinyMembership.selectedCharacter
    ) {
      Platform.Destiny2Service.GetCollectibleNodeDetails(
        destinyMembership.selectedMembership?.membershipType,
        destinyMembership.selectedMembership?.membershipId,
        destinyMembership.selectedCharacter?.characterId,
        subCategoryHash,
        [
          DestinyComponentType.ItemObjectives,
          DestinyComponentType.ItemPerks,
          DestinyComponentType.ItemInstances,
          DestinyComponentType.ItemCommonData,
          DestinyComponentType.ItemRenderData,
          DestinyComponentType.ItemStats,
        ]
      ).then((result) => setCollectibleNodeDetail(result));
    }
  }, [subCategoryHash, destinyMembership]);

  if ((!collectibles || !collectibles.length) && !sets && !sets.length) {
    return null;
  }

  if (
    !props.profileResponse ||
    !destinyMembership?.selectedMembership ||
    !destinyMembership?.selectedCharacter
  ) {
    return null;
  }

  const showDetailModal = (hash: number) => {
    const collectibleDef = props.definitions.DestinyCollectibleDefinition.get(
      hash
    );

    DestinyCollectibleDetailModal.show({
      itemHash: collectibleDef.itemHash,
      membershipId: destinyMembership?.selectedMembership?.membershipId,
      membershipType: destinyMembership?.selectedMembership?.membershipType,
    });
  };

  return (
    <GridCol
      cols={globalState.responsive.medium ? 12 : 9}
      className={styles.nodeDetailData}
    >
      {sets?.map((s) => {
        return (
          <CollectionSet
            key={s.presentationNodeHash}
            profileResponse={props.profileResponse}
            subCategoryHash={subCategoryHash}
            set={s}
            collectibleNodeDetails={collectibleNodeDetail}
          />
        );
      })}

      {collectibles?.map((i) => {
        const collectibleDef = props.definitions.DestinyCollectibleDefinition.get(
          i.collectibleHash
        );

        if (!collectibleDef) {
          return null;
        }

        const data = PresentationNodeUtils.GetCollectibleComponentData(
          i.collectibleHash,
          destinyMembership.selectedCharacter?.characterId,
          props.profileResponse
        );

        const isObscured =
          !data ||
          EnumUtils.hasFlag(data?.state, DestinyCollectibleState.Obscured);
        const redacted = collectibleDef?.redacted;

        const itemDef = props.definitions.DestinyInventoryItemDefinition.get(
          collectibleDef.itemHash
        );

        let watermark = itemDef?.isFeaturedItem
          ? itemDef.iconWatermarkFeatured ?? itemDef.iconWatermark
          : itemDef?.iconWatermark;
        let icon = itemDef?.displayProperties?.icon;
        let name = collectibleDef.displayProperties.name;
        let description = collectibleDef.displayProperties.description;

        if (isObscured) {
          name = nodesLoc.ObscuredItemName;
          description = "";
          icon =
            globalState.coreSettings.destiny2CoreSettings
              .undiscoveredCollectibleImage;

          if (collectibleDef.stateInfo?.obscuredOverrideItemHash) {
            const obscuredCollectibleDef = props.definitions.DestinyCollectibleDefinition.get(
              collectibleDef.stateInfo.obscuredOverrideItemHash
            );
            if (obscuredCollectibleDef) {
              const obscuredInventoryItemDef = props.definitions.DestinyInventoryItemDefinition.get(
                collectibleDef.stateInfo.obscuredOverrideItemHash
              );
              name = obscuredCollectibleDef.displayProperties.name;
              description =
                obscuredCollectibleDef.displayProperties.description;
              icon =
                obscuredInventoryItemDef?.displayProperties?.icon ??
                obscuredCollectibleDef.displayProperties.icon;
              watermark = obscuredInventoryItemDef?.isFeaturedItem
                ? obscuredInventoryItemDef.iconWatermarkFeatured ??
                  obscuredInventoryItemDef.iconWatermark
                : obscuredInventoryItemDef?.iconWatermark;
            }
          }
        }

        const iconCoin = (
          <IconImagesCoin images={[watermark ?? "", icon ?? ""]} />
        );

        if (
          !data ||
          (data &&
            !EnumUtils.hasFlag(data?.state, DestinyCollectibleState.Invisible))
        ) {
          return (
            <TwoLineItem
              key={collectibleDef.hash}
              className={classNames(styles.twoLineItem, {
                [styles.notAcquired]:
                  !data ||
                  (data &&
                    EnumUtils.hasFlag(
                      data.state,
                      DestinyCollectibleState.NotAcquired
                    )),
                [styles.clickable]: !isObscured && !redacted,
              })}
              onClick={() =>
                !isObscured && !redacted
                  ? showDetailModal(collectibleDef.hash)
                  : null
              }
              itemTitle={name}
              itemSubtitle={description}
              normalWhiteSpace={false}
              icon={iconCoin}
            />
          );
        }

        return null;
      })}
    </GridCol>
  );
};

export default withDestinyDefinitions(
  CollectibleItems,
  {
    types: [
      "DestinyPresentationNodeDefinition",
      "DestinyCollectibleDefinition",
      "DestinyInventoryItemDefinition",
    ],
  },
  true
);
