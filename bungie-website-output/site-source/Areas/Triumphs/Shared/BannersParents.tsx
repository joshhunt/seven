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

  const medalsHash =
    globalState.coreSettings?.destiny2CoreSettings?.medalsRootNodeHash;
  const medalsCatHash = getCategoryForBanner(medalsHash);
  const medalsUrl = RouteHelper.NewTriumphs({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: medalsHash.toString(),
    parent: medalsCatHash.toString(),
  });

  const exoticsHash =
    globalState.coreSettings?.destiny2CoreSettings?.exoticCatalystsRootNodeHash;
  const exoticsCatHash = getCategoryForBanner(exoticsHash);
  const exoticsUrl = RouteHelper.NewTriumphs({
    mid: destinyMembership.selectedMembership?.membershipId,
    mtype: EnumUtils.getNumberValue(
      destinyMembership.selectedMembership?.membershipType,
      BungieMembershipType
    ).toString(),
    cid: destinyMembership.selectedCharacter?.characterId,
    root: exoticsHash.toString(),
    parent: exoticsCatHash.toString(),
  });

  return (
    <GridCol cols={4} mobile={12} className={styles.triumphBanners}>
      <Anchor
        url={medalsUrl}
        className={classNames(
          styles.bannersMedals,
          styles.presentationNodeSectionTitle
        )}
      >
        {triumphsLoc.Medals}
      </Anchor>
      <Anchor
        url={exoticsUrl}
        className={classNames(
          styles.bannersCatalysts,
          styles.presentationNodeSectionTitle
        )}
      >
        {triumphsLoc.ExoticCatalysts}
      </Anchor>
    </GridCol>
  );
};

export default withDestinyDefinitions(BannersParents, {
  types: ["DestinyPresentationNodeDefinition"],
});
