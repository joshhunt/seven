// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import SeasonPassRewardProgression from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/SeasonPassRewardStep/SeasonPassRewardProgression";
import RedeemSeasonRewards from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/RedeemSeasonRewards/RedeemSeasonRewards";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  selectDestinyAccount,
  selectSelectedMembership,
  selectSelectedCharacter,
  selectIsDataLoaded,
  selectHasCharacters,
} from "@Global/Redux/slices/destinyAccountSlice";
import { useAppSelector } from "@Global/Redux/store";
import { SystemNames } from "@Global/SystemNames";
import { Actions, Components, Platform } from "@Platform";
import DestinyCollectibleDetailItemContent from "@UI/Destiny/DestinyCollectibleDetailItemContent";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useState, useCallback } from "react";
import seasonItemModalStyles from "../../../../SeasonItemModal.module.scss";

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
} & Record<string, any>;

const RewardsCarousel: React.FC<RewardsCarouselProps> = (props) => {
  const {
    seasonHash,
    seasonPassHash,
    rewardProgressionHash,
    isPassActive,
    ownsPremium,
    definitions,
  } = props;
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "coreSettings",
  ]);
  const destinyAccount = useAppSelector(selectDestinyAccount);
  const selectedMembership = useAppSelector(selectSelectedMembership);
  const selectedCharacter = useAppSelector(selectSelectedCharacter);
  const isDataLoaded = useAppSelector(selectIsDataLoaded);
  const hasCharacters = useAppSelector(selectHasCharacters);

  const [itemDetailCanClaim, setItemDetailCanClaim] = useState(false);
  const [itemDetailModalOpen, setItemDetailModalOpen] = useState(false);
  const [itemDetailLoading, setItemDetailLoading] = useState(false);
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

  const charactersLoaded =
    !isAnonymous &&
    destinyAccount.status === "succeeded" &&
    isDataLoaded &&
    hasCharacters;

  const characterClassHash = selectedCharacter?.characterData?.classHash || 0;

  // Prefer selected character's embedded progressions; fall back to the slice dictionary by characterId
  const platformProgressions = (destinyAccount as any)
    ?.characterProgressions as
    | Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
    | undefined;
  const selectedCharacterProgressions = React.useMemo(() => {
    const direct = selectedCharacter?.characterProgressions?.progressions;
    if (direct) return direct;
    const id = selectedCharacter?.id;
    const dict: any = platformProgressions?.data;
    return id && dict?.[id]?.progressions ? dict[id].progressions : undefined;
  }, [selectedCharacter, platformProgressions]);

  // Resolve the membership type to use: prefer the selected character's platform
  const membershipTypeForChar =
    (selectedCharacter as any)?.membershipType ??
    (selectedCharacter as any)?.membership?.membershipType;
  const membershipTypeToUse =
    membershipTypeForChar ?? selectedMembership?.membershipType;

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
    setItemDetailLoading(false);
    setItemDetailElement(
      <DestinyCollectibleDetailItemContent
        itemHash={itemHash}
        membershipType={membershipTypeToUse}
        membershipId={selectedMembership.membershipId}
      />
    );
    return {};
  };

  const claimFromModal = async () => {
    if (itemDetailClaiming || !selectedCharacter?.id || !selectedMembership) {
      return;
    }
    setItemDetailClaiming(true);
    const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
      characterId: selectedCharacter?.id,
      membershipType: membershipTypeToUse as any,
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

  const markItemClaimed = useCallback(
    (itemHash: number, rewardIndex: number) => {
      setItemClaimed((prev) =>
        prev?.rewardIndex !== rewardIndex ? { itemHash, rewardIndex } : prev
      );
      setClaimedOverrides((prev) =>
        prev.includes(rewardIndex) ? prev : [...prev, rewardIndex]
      );
    },
    []
  );

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
    destinyAccount.status === "loading"
  ) {
    return (
      <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
    );
  }

  if (destinyAccount.status === "failed" && !isAnonymous) {
    return <div>Error loading Destiny account data</div>;
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
        seasonHash={seasonHash}
        seasonPassHash={seasonPassHash}
        rewardProgressionHash={rewardProgressionHash}
        characterClassHash={characterClassHash}
        characterProgressions={selectedCharacterProgressions}
        handleClaimingClick={openItemDetailModal}
        claimedReward={itemClaimed}
        ownsPremium={!!ownsPremium}
        claimedOverrides={claimedOverrides}
      />

      {charactersLoaded &&
        !isPassActive &&
        selectedCharacter &&
        selectedMembership && (
          <RedeemSeasonRewards
            characterId={selectedCharacter.id}
            seasonHash={seasonHash}
            seasonPassHash={seasonPassHash}
            rewardProgressionHash={rewardProgressionHash}
            definitions={definitions}
            membershipType={membershipTypeToUse}
            handleClick={openItemDetailModal}
            itemClaimed={markItemClaimed}
            claimedReward={itemClaimed}
            claimedOverrides={claimedOverrides}
          />
        )}
    </>
  );
};

export default RewardsCarousel;
