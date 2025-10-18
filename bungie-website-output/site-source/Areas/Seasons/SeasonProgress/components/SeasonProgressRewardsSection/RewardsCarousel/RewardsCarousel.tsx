// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import SeasonPassRewardProgression from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/SeasonPassRewardStep/SeasonPassRewardProgression";
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
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";
import { DestinyComponentType } from "@Enum";

export interface IClaimedReward {
  rewardIndex: number;
  itemHash: number;
}

export type RewardsCarouselProps = {
  seasonHash: number;
  seasonPassHash?: number;
  // No internal fallbacks: caller must provide these
  rewardProgressionHash: number | undefined;
  isPassActive: boolean | undefined;
  ownsPremium: boolean;
  definitions?: any;
};

const RewardsCarousel: React.FC<RewardsCarouselProps> = ({
  seasonHash,
  seasonPassHash,
  rewardProgressionHash,
  isPassActive,
  ownsPremium,
  definitions,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "coreSettings",
  ]);
  const { destinyData, isLoading, error } = useGameData();

  const selectedMembership = destinyData.selectedMembership;

  const { profile, isLoading: profileIsLoading } = useProfileData({
    membershipId: selectedMembership?.membershipId,
    membershipType: selectedMembership?.membershipType,
    components: [
      DestinyComponentType.Characters,
      DestinyComponentType.CharacterProgressions,
    ],
  });
  const selectedCharacter =
    profile?.characters?.data?.[destinyData.selectedCharacterId];

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
  const [claimedOverrides, setClaimedOverrides] = useState<number[]>([]);

  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);
  const accountServicesEnabled = ConfigUtils.SystemStatus(
    SystemNames.AccountServices
  );
  const isAnonymous = !UserUtils.isAuthenticated(globalState);

  const charactersLoaded = !isAnonymous && !profileIsLoading;
  const characterClassHash = selectedCharacter?.classHash || 0;
  const selectedCharacterProgressions =
    profile?.characterProgressions?.data?.[destinyData.selectedCharacterId]
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
        membershipType={selectedMembership?.membershipType}
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
      membershipType: selectedMembership?.membershipType,
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
        setClaimedOverrides((prev) =>
          prev.includes(itemDetailRewardIndex)
            ? prev
            : [...prev, itemDetailRewardIndex]
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setItemDetailClaiming(false);
        closeItemDetailModal();
        Modal.error(e);
      });
  };

  const closeItemDetailModal = useCallback(() => {
    setItemDetailModalOpen(false);
    setItemDetailElement(null);
    setItemDetailRewardIndex(0);
    setItemDetailHash(0);
    setItemDetailCanClaim(false);
  }, []);

  if (
    !destiny2Disabled &&
    accountServicesEnabled &&
    !isAnonymous &&
    isLoading
  ) {
    return (
      <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
    );
  }

  if (error && !isAnonymous) {
    return <div>Error loading Destiny account data: {error}</div>;
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
          {charactersLoaded && !isPassActive && itemDetailCanClaim && (
            <div className={seasonItemModalStyles.itemModalActions}>
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
        definitions={definitions}
        globalState={globalState}
        rewardProgressionHash={rewardProgressionHash}
        characterClassHash={characterClassHash}
        characterProgressions={selectedCharacterProgressions}
        handleClaimingClick={openItemDetailModal}
        claimedReward={itemClaimed}
        ownsPremium={!!ownsPremium}
        claimedOverrides={claimedOverrides}
      />
    </>
  );
};

export default RewardsCarousel;
