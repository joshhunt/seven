// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import BannersParents from "@Areas/Triumphs/Shared/BannersParents";
import { DetailContainer } from "@Areas/Triumphs/Shared/DetailContainer";
import Parents from "@Areas/Triumphs/Shared/Parents";
import ScoreHeader from "@Areas/Triumphs/Shared/ScoreHeader";
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
import { sortMode } from "@UI/Destiny/PresentationNodes/PresentationNodeHelpers";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./Shared/Triumphs.module.scss";
import presentationNodesStyles from "@UI/Destiny/PresentationNodes/PresentationNodes.module.scss";

export type TriumphType =
  | "activeTriumph"
  | "activeSeal"
  | "legacyTriumph"
  | "legacySeal"
  | "medals"
  | "exoticCats";

interface TriumphsProps
  extends D2DatabaseComponentProps<
    "DestinyPresentationNodeDefinition" | "DestinyInventoryItemLiteDefinition"
  > {}

const Triumphs: React.FC<TriumphsProps> = (props) => {
  const history = useHistory();
  const params = useParams<PresentationNodeParams>();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );
  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  const membershipType =
    (params?.mtype
      ? BungieMembershipType[params.mtype as keyof typeof BungieMembershipType]
      : null) ?? destinyMembership?.selectedMembership?.membershipType;
  const membershipId =
    params?.mid ?? destinyMembership?.selectedMembership?.membershipId;
  const characterId =
    params?.cid ?? destinyMembership?.selectedCharacter?.characterId;

  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();
  const [isUserViewingSelf, setIsUserViewingSelf] = useState(false);
  const [hasDestinyAccount, setHasDestinyAccount] = useState(true);

  const activeTriumphsRootNodeHash =
    globalState?.coreSettings?.destiny2CoreSettings?.activeTriumphsRootNodeHash;
  const activeSealsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.activeSealsRootNodeHash;
  const legacyTriumphsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.legacyTriumphsRootNodeHash;
  const legacySealsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.legacySealsRootNodeHash;
  const medalsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings?.medalsRootNodeHash;
  const exoticCatsRootHash =
    globalState?.coreSettings?.destiny2CoreSettings
      ?.exoticCatalystsRootNodeHash;

  const rootHash = parseInt(params?.root, 10);
  const parentNodeHash = parseInt(params?.parent, 10);
  const catNodeHash = parseInt(params?.category, 10);
  const subCatNodeHash = parseInt(params?.subcategory, 10);
  const urlParams = new URLSearchParams(window.location.search);
  const sort = (urlParams?.get("sort") as sortMode) ?? "Default";

  const triumphsLoc = Localizer.Triumphs;

  const getTriumphType = (): TriumphType => {
    switch (rootHash) {
      case activeSealsRootHash:
        return "activeSeal";
      case legacyTriumphsRootHash:
        return "legacyTriumph";
      case legacySealsRootHash:
        return "legacySeal";
      case medalsRootHash:
        return "medals";
      case exoticCatsRootHash:
        return "exoticCats";
      default:
        return "activeTriumph";
    }
  };

  const getRootHashFromTriumphType = (tType: TriumphType): number => {
    switch (tType) {
      case "legacyTriumph":
        return legacyTriumphsRootHash;
      case "activeSeal":
        return activeSealsRootHash;
      case "legacySeal":
        return legacySealsRootHash;
      case "exoticCats":
        return exoticCatsRootHash;
      case "medals":
        return medalsRootHash;
      default:
        return activeTriumphsRootNodeHash;
    }
  };

  const triumphType = getTriumphType();
  const isLegacy =
    triumphType === "legacyTriumph" || triumphType === "legacySeal";
  const isRootPage =
    !parentNodeHash || (parentNodeHash && Number.isNaN(parentNodeHash));

  const getProfileResponse = () => {
    if (destiny2Disabled || !destinyMembership.selectedMembership) {
      return;
    }

    Platform.Destiny2Service.GetProfile(
      destinyMembership.selectedMembership.membershipType,
      destinyMembership.selectedMembership.membershipId,
      [
        DestinyComponentType.CharacterProgressions,
        DestinyComponentType.PresentationNodes,
        DestinyComponentType.Records,
        DestinyComponentType.Collectibles,
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
        ? globalState.loggedInUser?.user.membershipId
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
            globalState.loggedInUser?.user.membershipId
      );

      const triumphsParams: PresentationNodeParams = {
        mid: destinyMembership.selectedMembership?.membershipId,
        mtype: EnumUtils.getNumberValue(
          destinyMembership.selectedMembership?.membershipType,
          BungieMembershipType
        ).toString(),
        cid: destinyMembership.selectedCharacter?.characterId,
        root: (!Number.isNaN(rootHash) && rootHash !== 0
          ? rootHash
          : activeTriumphsRootNodeHash
        ).toString(),
      };

      if (parentNodeHash) {
        triumphsParams.parent = parentNodeHash.toString();
      }

      if (catNodeHash) {
        triumphsParams.category = catNodeHash.toString();
      }

      if (subCatNodeHash) {
        triumphsParams.subcategory = subCatNodeHash.toString();
      }

      if (sort) {
        triumphsParams.sort = sort;
      }

      history.push(RouteHelper.NewTriumphs(triumphsParams).url);

      getProfileResponse();
    }
  }, [destinyMembership]);

  const noUserSpecified = !membershipType || !membershipId;
  const noDestinyMembershipAvailable =
    !destinyMembership || (!profileResponse && hasDestinyAccount);

  return (
    <SystemDisabledHandler
      systems={[SystemNames.Destiny2, SystemNames.CoreAreaTriumphs]}
    >
      <BungieHelmet
        title={Localizer.Triumphs.PageName}
        description={Localizer.Triumphs.PageName}
      />
      <ContainerBackground />
      <>
        {noUserSpecified || noDestinyMembershipAvailable ? null : (
          <Grid className={styles.presentationNodesContent}>
            {!hasDestinyAccount && (
              <GridCol cols={12}>
                {Localizer.PresentationNodes.ADestinyAccountIsRequired}
              </GridCol>
            )}
            {hasDestinyAccount && (
              <div>
                <GridCol cols={12} className={styles.nodesHeader}>
                  <Breadcrumb
                    pageType={"triumphs"}
                    rootHash={rootHash}
                    parentNodeHash={parentNodeHash}
                    categoryNodeHash={catNodeHash}
                    subCategoryHash={subCatNodeHash}
                    sort={sort}
                  />
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
                {isRootPage && (
                  <ScoreHeader profileResponse={profileResponse} />
                )}
                <div>
                  <GridCol
                    cols={isRootPage ? 8 : 12}
                    mobile={12}
                    className={classNames({
                      [styles.triumphParents]: !isRootPage,
                    })}
                  >
                    {isRootPage && (
                      <div className={styles.presentationNodeSectionTitle}>
                        <Anchor
                          className={classNames(styles.subNavItem, {
                            [styles.on]: !isLegacy,
                          })}
                          url={RouteHelper.NewTriumphs({
                            mid:
                              destinyMembership?.selectedMembership
                                ?.membershipId,
                            mtype: EnumUtils.getNumberValue(
                              destinyMembership?.selectedMembership
                                ?.membershipType,
                              BungieMembershipType
                            )?.toString(),
                            cid:
                              destinyMembership?.selectedCharacter?.characterId,
                            root: activeTriumphsRootNodeHash.toString(),
                            sort: sort,
                          })}
                        >
                          {triumphsLoc.TriumphsSubNav}
                        </Anchor>
                        <Anchor
                          className={classNames(styles.subNavItem, {
                            [styles.on]: isLegacy,
                          })}
                          url={RouteHelper.NewTriumphs({
                            mid:
                              destinyMembership?.selectedMembership
                                ?.membershipId,
                            mtype: EnumUtils.getNumberValue(
                              destinyMembership?.selectedMembership
                                ?.membershipType,
                              BungieMembershipType
                            )?.toString(),
                            cid:
                              destinyMembership?.selectedCharacter?.characterId,
                            root: legacyTriumphsRootHash.toString(),
                            sort: sort,
                          })}
                        >
                          {triumphsLoc.LegacyTriumphsSubNav}
                        </Anchor>
                      </div>
                    )}
                    <Parents
                      profileResponse={profileResponse}
                      isLegacy={isLegacy}
                      isRootPage={isRootPage}
                      parentNodeHash={parentNodeHash}
                      sort={sort}
                      triumphType={triumphType}
                    />
                    {globalState.responsive.mobile && isRootPage && (
                      <BannersParents />
                    )}
                  </GridCol>
                  {!globalState.responsive.mobile && isRootPage && (
                    <BannersParents />
                  )}
                  {!isRootPage && (
                    <DetailContainer
                      profileResponse={profileResponse}
                      categoryHash={catNodeHash}
                      rootHash={rootHash}
                      parentHash={parentNodeHash}
                      subCategoryHash={subCatNodeHash}
                      sort={sort}
                    />
                  )}
                </div>
              </div>
            )}
          </Grid>
        )}
      </>
    </SystemDisabledHandler>
  );
};

export default withDestinyDefinitions(Triumphs, {
  types: [
    "DestinyPresentationNodeDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
