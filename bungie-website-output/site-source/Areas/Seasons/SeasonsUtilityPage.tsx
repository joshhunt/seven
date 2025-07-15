// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { SeasonsDestinyMembershipDataStore } from "@Areas/Seasons/DataStores/SeasonsDestinyMembershipDataStore";
import SeasonProgressUtils from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import * as Globals from "@Enum";
import { DestinyComponentType, PlatformErrorCodes } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Actions, Components, Platform, Seasons } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import DestinyCollectibleDetailItemContent from "@UI/Destiny/DestinyCollectibleDetailItemContent";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useEffect, useState } from "react";
import SeasonHeader from "./SeasonHeader";
import seasonItemModalStyles from "./SeasonItemModal.module.scss";
import SeasonPassRewardProgression from "./SeasonPassRewardProgression";
import RedeemSeasonRewards from "./SeasonProgress/components/SeasonProgressRewardsSection/RedeemSeasonRewards/RedeemSeasonRewards";
import SeasonsPageNav from "./SeasonsPageNav";
import styles from "./SeasonsUtilityPage.module.scss";

export interface IClaimedReward {
  rewardIndex: number;
  itemHash: number;
}

interface ISeasonsUtilityPageProps
  extends D2DatabaseComponentProps<
    | "DestinyClassDefinition"
    | "DestinySeasonDefinition"
    | "DestinyProgressionDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  seasonHash: number;
}

/**
 * SeasonsUtilityPage - Base Season Utility Page
 *  *
 * @param {ISeasonsUtilityPageProps} props
 * @returns
 */
const SeasonsUtilityPage: React.FC<ISeasonsUtilityPageProps> = ({
  seasonHash,
  definitions,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(SeasonsDestinyMembershipDataStore);
  const [itemDetailCanClaim, setItemDetailCanClaim] = useState(false);
  const [itemDetailModalOpen, setItemDetailModalOpen] = useState(false);
  const [itemDetailLoading, setItemDetailLoading] = useState(false);
  const [itemDetailElement, setItemDetailElement] = useState<ReactNode>();
  const [itemDetailRewardIndex, setItemDetailRewardIndex] = useState(0);
  const [itemDetailHash, setItemDetailHash] = useState(0);
  const [itemDetailClaiming, setItemDetailClaiming] = useState(false);
  const [itemClaimed, setItemClaimed] = useState<IClaimedReward>({
    itemHash: 0,
    rewardIndex: 0,
  });
  const [characterProgressions, setCharacterProgressions] = useState<
    Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
  >();

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);

  const seasonPassHash = SeasonProgressUtils?.getCurrentSeasonPass({
    seasonHash,
    definitions,
  })?.hash;

  useEffect(() => {
    if (!destiny2Disabled) {
      SeasonsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destiny2Disabled]);

  useEffect(() => {
    if (!destiny2Disabled && destinyMembership?.selectedMembership) {
      Platform.Destiny2Service.GetProfile(
        destinyMembership?.selectedMembership?.membershipType,
        destinyMembership?.selectedMembership?.membershipId,
        [DestinyComponentType.CharacterProgressions]
      )
        .then((data) => {
          setCharacterProgressions(data?.characterProgressions);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          if (e.errorCode === PlatformErrorCodes.DestinyAccountNotFound) {
            // don't do anything, we already pop a lot of modals, they'll know if they see no characters on an accounts
          } else {
            Modal.error(e);
          }
        });
    }
  }, [globalState.loggedInUser, destinyMembership?.selectedMembership]);

  const isAnonymous = !UserUtils.isAuthenticated(globalState);

  if (
    !destiny2Disabled &&
    ConfigUtils.SystemStatus(SystemNames.AccountServices) &&
    !isAnonymous &&
    !destinyMembership?.loaded
  ) {
    return (
      <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
    );
  }

  const charactersLoaded =
    !isAnonymous &&
    destinyMembership?.loaded &&
    destinyMembership?.characters &&
    characterProgressions;

  const forCharacter =
    destinyMembership?.selectedCharacter?.characterId !== ""
      ? characterProgressions?.data[
          destinyMembership?.selectedCharacter?.characterId
        ]
      : null;

  const isCurrentSeason =
    seasonHash ===
    globalState.coreSettings.destiny2CoreSettings.currentSeasonHash;

  const openItemDetailModal = (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => {
    setItemDetailHash(itemHash);
    setItemDetailModalOpen(true);
    setItemDetailRewardIndex(rewardIndex);
    setItemDetailCanClaim(canClaim);

    setItemDetailLoading(false);
    setItemDetailElement(
      <DestinyCollectibleDetailItemContent
        itemHash={itemHash}
        membershipType={destinyMembership?.selectedMembership?.membershipType}
        membershipId={destinyMembership?.selectedMembership?.membershipId}
      />
    );

    return {};
  };

  const claimFromModal = () => {
    if (!itemDetailClaiming) {
      setItemDetailClaiming(true);

      const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
        seasonHash: seasonHash,
        seasonPassHash: seasonPassHash,
        rewardIndex: itemDetailRewardIndex,
        characterId: destinyMembership?.selectedCharacter?.characterId,
        membershipType: destinyMembership?.selectedMembership?.membershipType,
      };

      Platform.Destiny2Service.ClaimSeasonPassReward(input)
        .then(() => {
          setItemDetailClaiming(false);
          setItemDetailModalOpen(false);
          setItemClaimed({
            itemHash: itemDetailHash,
            rewardIndex: itemDetailRewardIndex,
          });
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          setItemDetailClaiming(false);

          closeItemDetailModal();

          Modal.error(e);
        });
    }
  };

  const markItemClaimed = (itemHash: number, rewardIndex: number) => {
    if (
      !itemClaimed ||
      (itemClaimed && itemClaimed.rewardIndex !== rewardIndex)
    ) {
      setItemClaimed({ itemHash: itemHash, rewardIndex: rewardIndex });
    }
  };

  const closeItemDetailModal = () => {
    setItemDetailModalOpen(false);
    setItemDetailElement(null);
    setItemDetailRewardIndex(0);
    setItemDetailHash(0);
    setItemDetailCanClaim(false);
  };

  return (
    <>
      {itemDetailElement && (
        <Modal
          open={itemDetailModalOpen}
          className={seasonItemModalStyles.seasonItemModal}
          contentClassName={seasonItemModalStyles.modalContent}
          onClose={() => closeItemDetailModal()}
        >
          <div className={seasonItemModalStyles.itemModal}>
            {itemDetailElement}
          </div>
          {charactersLoaded && !isCurrentSeason && itemDetailCanClaim && (
            <div className={styles.buttonHolder}>
              <Button
                buttonType={"gold"}
                onClick={() => claimFromModal()}
                disabled={itemDetailClaiming}
                loading={itemDetailClaiming}
              >
                {Localizer.Seasons.Claim}
              </Button>
            </div>
          )}
        </Modal>
      )}

      <Grid>
        <GridCol cols={12}>
          <SystemDisabledHandler systems={["Destiny2"]}>
            {
              <SeasonsPageNav
                characterId={destinyMembership?.selectedCharacter?.characterId}
                seasonHash={seasonHash}
                characterProgressions={forCharacter?.progressions}
                platformProgression={characterProgressions}
                membershipType={
                  destinyMembership?.selectedMembership?.membershipType
                }
              />
            }
          </SystemDisabledHandler>
          <div className={styles.seasonInfoContainer}>
            <SeasonHeader seasonHash={seasonHash} />

            {!isAnonymous && !destinyMembership?.memberships && (
              <Button
                buttonType={"gold"}
                url={RouteHelper.ProfileSettings(
                  globalState?.loggedInUser?.user?.membershipId,
                  "Accounts"
                )}
              >
                {Localizer.Seasons.LinkADestinyAccountTo}
              </Button>
            )}
          </div>
          {charactersLoaded && (
            <DestinyAccountWrapper
              membershipDataStore={SeasonsDestinyMembershipDataStore}
            >
              {({ platformSelector, characterSelector }: IAccountFeatures) => (
                <div className={styles.dropdownFlexWrapper}>
                  {platformSelector}
                  {characterSelector}
                </div>
              )}
            </DestinyAccountWrapper>
          )}

          <SeasonPassRewardProgression
            seasonHash={seasonHash}
            characterClassHash={
              charactersLoaded
                ? destinyMembership?.characters[
                    destinyMembership?.selectedCharacter?.characterId
                  ]?.classHash
                : 0
            }
            characterProgressions={
              charactersLoaded ? forCharacter?.progressions : undefined
            }
            handleClaimingClick={(itemHash, rewardIndex, canClaim) =>
              openItemDetailModal(itemHash, rewardIndex, canClaim)
            }
            claimedReward={itemClaimed}
          />

          {charactersLoaded && !isCurrentSeason && (
            <RedeemSeasonRewards
              characterId={destinyMembership?.selectedCharacter?.characterId}
              seasonHash={seasonHash}
              platformProgressions={characterProgressions}
              characterProgressions={forCharacter?.progressions}
              membershipType={
                destinyMembership?.selectedMembership?.membershipType
              }
              handleClick={(itemHash, rewardIndex, canClaim) =>
                openItemDetailModal(itemHash, rewardIndex, canClaim)
              }
              itemClaimed={(itemHash: number, rewardIndex: number) =>
                markItemClaimed(itemHash, rewardIndex)
              }
              claimedReward={itemClaimed}
            />
          )}
        </GridCol>
      </Grid>
    </>
  );
};

export default withDestinyDefinitions(SeasonsUtilityPage, {
  types: [
    "DestinyClassDefinition",
    "DestinySeasonDefinition",
    "DestinyProgressionDefinition",
    "DestinySeasonPassDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
