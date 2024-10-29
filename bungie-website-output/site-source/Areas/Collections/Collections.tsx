// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import BadgeParents from "@Areas/Collections/Shared/BadgeParents";
import BannersParents from "@Areas/Collections/Shared/BannersParents";
import { DetailContainer } from "@Areas/Collections/Shared/DetailContainer";
import ItemParents from "@Areas/Collections/Shared/ItemParents";
import ScoreBlock from "@Areas/Collections/Shared/ScoreBlock";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  BungieMembershipType,
  DestinyComponentType,
  PlatformErrorCodes,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { PresentationNodeParams } from "@Routes/Definitions/RouteParams";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import Breadcrumb from "@UI/Destiny/PresentationNodes/Breadcrumb";
import { ContainerBackground } from "@UI/Destiny/PresentationNodes/ContainerBackground";
import {
  CollectionType,
  filterMode,
  sortMode,
} from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Collections.module.scss";
import presentationNodesStyles from "@UI/Destiny/PresentationNodes/PresentationNodes.module.scss";

interface CollectionsProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {}

const Collections: React.FC<CollectionsProps> = (props) => {
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const params = useParams<PresentationNodeParams>();

  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();
  const [isUserViewingSelf, setIsUserViewingSelf] = useState(false);
  const [hasDestinyAccount, setHasDestinyAccount] = useState(true);

  const membershipType =
    (params?.mtype
      ? BungieMembershipType[params.mtype as keyof typeof BungieMembershipType]
      : null) ?? destinyMembership?.selectedMembership?.membershipType;
  const membershipId =
    params?.mid ?? destinyMembership?.selectedMembership?.membershipId;
  const characterId =
    params?.cid ?? destinyMembership?.selectedCharacter?.characterId;

  const collectionItemsRootHash =
    globalState.coreSettings.destiny2CoreSettings.collectionRootNode;
  const collectionBadgesRootHash =
    globalState.coreSettings.destiny2CoreSettings.badgesRootNode;
  const loreRootHash =
    globalState.coreSettings.destiny2CoreSettings.loreRootNodeHash;
  const statRootHash =
    globalState.coreSettings.destiny2CoreSettings.metricsRootNode;

  const rootHash = parseInt(params?.root, 10);
  const parentNodeHash = parseInt(params?.parent, 10);
  const catNodeHash = parseInt(params?.category, 10);
  const subCatNodeHash = parseInt(params?.subcategory, 10);

  const urlParams = new URLSearchParams(window.location.search);
  const sort = (urlParams?.get("sort") as sortMode) ?? "Default";
  const filter = (urlParams?.get("filter") as filterMode) ?? "All";

  const getCollectionType = (): CollectionType => {
    if (!rootHash) {
      return "none";
    }

    switch (rootHash) {
      case collectionItemsRootHash:
        return "item";
      case collectionBadgesRootHash:
        return "badge";
      case loreRootHash:
        return "lore";
      case statRootHash:
        return "stats";
      default:
        return "none";
    }
  };

  const getRootHashFromCollectionType = (cType: CollectionType): number => {
    switch (cType) {
      case "item":
        return collectionItemsRootHash;
      case "badge":
        return collectionBadgesRootHash;
      case "lore":
        return loreRootHash;
      case "stats":
        return statRootHash;
      default:
        return collectionItemsRootHash;
    }
  };

  const collectionType = getCollectionType();

  const getProfileResponse = () => {
    if (!destinyMembership.selectedMembership) {
      return;
    }

    Platform.Destiny2Service.GetProfile(
      destinyMembership.selectedMembership.membershipType,
      destinyMembership.selectedMembership.membershipId,
      [
        DestinyComponentType.Collectibles,
        DestinyComponentType.PresentationNodes,
        DestinyComponentType.Records,
        DestinyComponentType.Metrics,
      ]
    )
      .then((response) => {
        setProfileResponse(response);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (e.errorCode === PlatformErrorCodes.DestinyAccountNotFound) {
          setHasDestinyAccount(false);
        } else {
          Modal.error(e);
        }
      });
  };

  const loadDestinyMembership = () => {
    const membershipPair = {
      membershipId: isUserViewingSelf
        ? globalState.loggedInUser.user.membershipId
        : membershipId,
      membershipType: isUserViewingSelf
        ? BungieMembershipType.BungieNext
        : membershipType,
    };

    PresentationNodeDestinyMembershipDataStore.actions.loadUserData(
      membershipPair,
      true
    );
  };

  if (!ConfigUtils.SystemStatus(SystemNames.CoreAreaCollections)) {
    return null;
  }

  useEffect(() => {
    if (!membershipId || !membershipType) {
      if (UserUtils.isAuthenticated(globalState)) {
        setIsUserViewingSelf(true);
      } else {
        const signInModal = Modal.signIn(() => {
          loadDestinyMembership();
          signInModal.current.close();
        });
      }
    }

    loadDestinyMembership();
  }, []);

  useEffect(() => {
    if (destinyMembership.selectedMembership) {
      setIsUserViewingSelf(
        UserUtils.isAuthenticated(globalState) &&
          destinyMembership.membershipData?.bungieNetUser?.membershipId ===
            globalState.loggedInUser.user.membershipId
      );

      const collectionsParams: PresentationNodeParams = {
        mid: destinyMembership.selectedMembership?.membershipId,
        mtype: EnumUtils.getNumberValue(
          destinyMembership.selectedMembership?.membershipType,
          BungieMembershipType
        ).toString(),
        cid: destinyMembership.selectedCharacter?.characterId,
        root:
          !Number.isNaN(rootHash) && rootHash !== 0
            ? rootHash?.toString()
            : null,
      };

      if (parentNodeHash) {
        collectionsParams.parent = parentNodeHash.toString();
      }

      if (catNodeHash) {
        collectionsParams.category = catNodeHash.toString();
      }

      if (subCatNodeHash) {
        collectionsParams.subcategory = subCatNodeHash.toString();
      }

      history.push(RouteHelper.NewCollections(collectionsParams).url);

      getProfileResponse();
    }
  }, [destinyMembership]);

  return (
    <SystemDisabledHandler
      systems={[SystemNames.Destiny2, SystemNames.CoreAreaCollections]}
    >
      <BungieHelmet
        title={Localizer.PresentationNodes.CollectionsPageName}
        description={Localizer.PresentationNodes.CollectionsPageName}
      />
      <ContainerBackground />
      <Grid className={styles.presentationNodesContent}>
        {!membershipType ||
        !membershipId ||
        !destinyMembership ||
        (!profileResponse && hasDestinyAccount) ? null : (
          <>
            {!hasDestinyAccount && (
              <GridCol cols={12}>
                {Localizer.PresentationNodes.ADestinyAccountIsRequired}
              </GridCol>
            )}
            {hasDestinyAccount && (
              <div>
                <GridCol cols={12} className={styles.nodesHeader}>
                  <Breadcrumb
                    pageType={"collections"}
                    rootHash={rootHash}
                    parentNodeHash={parentNodeHash}
                    categoryNodeHash={catNodeHash}
                    subCategoryHash={subCatNodeHash}
                    filter={filter}
                    sort={sort}
                  />
                  <GridCol cols={8}>
                    {characterId && (
                      <DestinyAccountWrapper
                        membershipDataStore={
                          PresentationNodeDestinyMembershipDataStore
                        }
                        showCrossSaveBanner={true}
                      >
                        {({
                          bnetProfile,
                          platformSelector,
                          characterSelector,
                        }: IAccountFeatures) => (
                          <div>
                            {bnetProfile}
                            <div
                              className={
                                presentationNodesStyles.dropdownFlexWrapper
                              }
                            >
                              {platformSelector}
                              {characterSelector}
                            </div>
                          </div>
                        )}
                      </DestinyAccountWrapper>
                    )}
                  </GridCol>
                  <ScoreBlock
                    characterId={characterId}
                    profileResponse={profileResponse}
                  />
                </GridCol>
                {collectionType !== "stats" && collectionType !== "lore" && (
                  <GridCol cols={8} mobile={12}>
                    <GridCol
                      cols={12}
                      className={classNames(styles.categories, {
                        [styles.mini]: !!parentNodeHash,
                      })}
                    >
                      {(collectionType === "none" ||
                        (collectionType === "item" && !!parentNodeHash)) && (
                        <ItemParents
                          profileResponse={profileResponse}
                          collectionItemsRootHash={collectionItemsRootHash}
                          activeParentPresentationNodeHash={parentNodeHash}
                          isMini={!!parentNodeHash}
                          sort={sort}
                        />
                      )}
                      {(collectionType === "none" ||
                        (collectionType === "badge" && !!parentNodeHash)) && (
                        <BadgeParents
                          collectionBadgesRootHash={collectionBadgesRootHash}
                          activeParentPresentationNodeHash={parentNodeHash}
                          profileResponse={profileResponse}
                          isMini={!!parentNodeHash}
                          sort={sort}
                        />
                      )}
                      {globalState.responsive.mobile &&
                        collectionType !== "badge" &&
                        collectionType !== "item" && <BannersParents />}
                    </GridCol>
                  </GridCol>
                )}
                {!globalState.responsive.mobile &&
                  !parentNodeHash &&
                  collectionType !== "badge" &&
                  collectionType !== "item" && <BannersParents />}
                {!!parentNodeHash && (
                  <DetailContainer
                    collectionType={collectionType}
                    parentHash={parentNodeHash}
                    categoryHash={catNodeHash}
                    profileResponse={profileResponse}
                    collectionRootHash={getRootHashFromCollectionType(
                      collectionType
                    )}
                    subCategoryHash={subCatNodeHash}
                    filter={filter}
                    sort={sort}
                  />
                )}
              </div>
            )}
          </>
        )}
      </Grid>
    </SystemDisabledHandler>
  );
};

export default withDestinyDefinitions(Collections, {
  types: ["DestinyPresentationNodeDefinition"],
});
