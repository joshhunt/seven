// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import SeasonPassRewardProgression from "@Areas/Seasons/SeasonPassRewardProgression";
import RedeemSeasonRewards from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/RedeemSeasonRewards/RedeemSeasonRewards";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Actions, Platform } from "@Platform";
import DestinyCollectibleDetailItemContent from "@UI/Destiny/DestinyCollectibleDetailItemContent";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useState, useCallback, useMemo } from "react";
import seasonItemModalStyles from "../../../../SeasonItemModal.module.scss";
import styles from "../../../../SeasonsUtilityPage.module.scss";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";
import { DestinyComponentType } from "@Enum";

export interface IClaimedReward {
  rewardIndex: number;
  itemHash: number;
}

interface IRewardsCarouselProps {
  seasonHash: number;
  seasonPassHash: number;
}

/**
 * RewardsCarousel - Base Season Utility Page
 *  *
 * @param {IRewardsCarouselProps} props
 * @returns
 */
const RewardsCarousel: React.FC<IRewardsCarouselProps> = ({
  seasonHash,
  seasonPassHash,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "coreSettings",
  ]);

  const { destinyData, isLoading, error: destinyDataError } = useGameData();
  const { profile } = useProfileData({
    membershipId: destinyData.selectedMembership?.membershipId,
    membershipType: destinyData.selectedMembership?.membershipType,
    components: [
      DestinyComponentType.CharacterProgressions,
      DestinyComponentType.Characters,
    ],
  });

  const [itemDetailCanClaim, setItemDetailCanClaim] = useState(false);
  const [itemDetailModalOpen, setItemDetailModalOpen] = useState(false);
  const [itemDetailElement, setItemDetailElement] = useState<ReactNode>(null);
  const [itemDetailRewardIndex, setItemDetailRewardIndex] = useState(0);
  const [itemDetailHash, setItemDetailHash] = useState(0);
  const [itemDetailClaiming, setItemDetailClaiming] = useState(false);
  const [itemClaimed, setItemClaimed] = useState<IClaimedReward>({
    itemHash: 0,
    rewardIndex: 0,
  });

  const selectedCharacter = useMemo(() => {
    if (!profile || !destinyData.selectedCharacterId) {
      return;
    }
    return profile.characters?.data?.[destinyData.selectedCharacterId];
  }, [profile, destinyData.selectedCharacterId]);

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);
  const accountServicesEnabled = ConfigUtils.SystemStatus(
    SystemNames.AccountServices
  );
  const isAnonymous = !UserUtils.isAuthenticated(globalState);
  const selectedMembership = destinyData.selectedMembership;

  // Check if we have the data we need
  const charactersLoaded = !isAnonymous && !isLoading && profile;
  const isCurrentSeason =
    seasonHash ===
    globalState.coreSettings?.destiny2CoreSettings?.currentSeasonHash;

  // Calculate character class hash from selected character
  const characterClassHash = selectedCharacter?.classHash || 0;

  // Extract the selected character's progressions for SeasonPassRewardProgression
  const progressions =
    profile?.characterProgressions?.data?.[selectedCharacter?.characterId]
      ?.progressions;

  const openItemDetailModal = (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => {
    if (!selectedMembership) {
      console.error("No selected membership available");
      return {};
    }

    setItemDetailHash(itemHash);
    setItemDetailModalOpen(true);
    setItemDetailRewardIndex(rewardIndex);
    setItemDetailCanClaim(canClaim);

    setItemDetailElement(
      <DestinyCollectibleDetailItemContent
        itemHash={itemHash}
        membershipType={selectedMembership.membershipType}
        membershipId={selectedMembership.membershipId}
      />
    );

    return {};
  };

  const claimFromModal = async () => {
    if (
      itemDetailClaiming ||
      !destinyData.selectedCharacterId ||
      !selectedMembership
    ) {
      return;
    }

    setItemDetailClaiming(true);

    const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
      characterId: destinyData.selectedCharacterId,
      membershipType: selectedMembership.membershipType,
      rewardIndex: itemDetailRewardIndex,
      seasonHash: seasonHash,
      seasonPassHash: seasonPassHash,
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
  };

  const markItemClaimed = useCallback(
    (itemHash: number, rewardIndex: number) => {
      if (
        !itemClaimed ||
        (itemClaimed && itemClaimed.rewardIndex !== rewardIndex)
      ) {
        setItemClaimed({ itemHash, rewardIndex });
      }
    },
    [itemClaimed]
  );

  const closeItemDetailModal = useCallback(() => {
    setItemDetailModalOpen(false);
    setItemDetailElement(null);
    setItemDetailRewardIndex(0);
    setItemDetailHash(0);
    setItemDetailCanClaim(false);
  }, []);

  // Show spinner while loading
  if (!destiny2Disabled && accountServicesEnabled && isLoading) {
    return (
      <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
    );
  }

  // Handle error states
  if (destinyDataError) {
    return <div>Error loading Destiny account data: {destinyDataError}</div>;
  }

  return (
    <>
      {itemDetailElement && (
        <Modal
          open={itemDetailModalOpen}
          className={seasonItemModalStyles.seasonItemModal}
          contentClassName={seasonItemModalStyles.modalContent}
          onClose={closeItemDetailModal}
        >
          <div className={seasonItemModalStyles.itemModal}>
            {itemDetailElement}
          </div>
          {charactersLoaded && !isCurrentSeason && itemDetailCanClaim && (
            <div className={styles.buttonHolder}>
              <Button
                buttonType={"gold"}
                onClick={claimFromModal}
                disabled={itemDetailClaiming}
                loading={itemDetailClaiming}
              >
                {Localizer.Seasons.Claim}
              </Button>
            </div>
          )}
        </Modal>
      )}

      <SeasonPassRewardProgression
        seasonHash={seasonHash}
        characterClassHash={characterClassHash}
        characterProgressions={progressions}
        handleClaimingClick={openItemDetailModal}
        claimedReward={itemClaimed}
      />

      {charactersLoaded &&
        !isCurrentSeason &&
        selectedCharacter &&
        selectedMembership && (
          <RedeemSeasonRewards
            characterId={selectedCharacter.characterId}
            seasonHash={seasonHash}
            platformProgressions={profile?.characterProgressions}
            characterProgressions={progressions}
            membershipType={selectedMembership.membershipType}
            handleClick={openItemDetailModal}
            itemClaimed={markItemClaimed}
            claimedReward={itemClaimed}
          />
        )}
    </>
  );
};

export default RewardsCarousel;
