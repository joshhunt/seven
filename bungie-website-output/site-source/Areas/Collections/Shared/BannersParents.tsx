// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import styles from "@UI/Destiny/PresentationNodes/Banners.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React from "react";

interface BannersParentsProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {}

const BannersParents: React.FC<BannersParentsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const triumphsLoc = Localizer.Triumphs;

  const getCategoryForBanner = (nodeHash: number): number => {
    const nodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
      nodeHash
    );
    const child = nodeDef?.children?.presentationNodes?.[0];

    return child?.presentationNodeHash;
  };

  const statTrackersHash =
    globalState.coreSettings?.destiny2CoreSettings?.metricsRootNode;
  const statTrackersCatHash = getCategoryForBanner(statTrackersHash);
  const statTrackersUrl = RouteHelper.NewCollections({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: statTrackersHash.toString(),
    parent: statTrackersCatHash.toString(),
  });

  const loreHash =
    globalState.coreSettings?.destiny2CoreSettings?.loreRootNodeHash;
  const loreCatHash = getCategoryForBanner(loreHash);
  const loreUrl = RouteHelper.NewCollections({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: loreHash.toString(),
    parent: loreCatHash.toString(),
  });

  return (
    <GridCol cols={4} mobile={12} className={styles.triumphBanners}>
      <Anchor
        url={loreUrl}
        className={classNames(
          styles.bannersLore,
          styles.presentationNodeSectionTitle
        )}
      >
        {triumphsLoc.LoreLink}
      </Anchor>
      <Anchor
        url={statTrackersUrl}
        className={classNames(
          styles.bannersStatTrackers,
          styles.presentationNodeSectionTitle
        )}
      >
        {triumphsLoc.StatTrackers}
      </Anchor>
    </GridCol>
  );
};

export default withDestinyDefinitions(BannersParents, {
  types: ["DestinyPresentationNodeDefinition"],
});
