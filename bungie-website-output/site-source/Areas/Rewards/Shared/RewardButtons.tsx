import { ConvertToPlatformError } from "@ApiIntermediary";
import { Reward } from "@Areas/Rewards/Rewards";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { ShowAuthModal } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useRef } from "react";
import { useHistory } from "react-router";

interface RewardButtonsProps {
  reward: Reward;
}

export const RewardButtons: React.FC<RewardButtonsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "crossSavePairingStatus",
  ]);
  const { destinyData } = useGameData();
  const history = useHistory();
  const membershipType =
    destinyData.selectedMembership?.membershipType ||
    destinyData.membershipData?.destinyMemberships?.[0]?.membershipType ||
    BungieMembershipType.None;
  const rewardLoc = Localizer.Bungierewards;

  const emailCode = (
    rewardId: string,
    mType: BungieMembershipType,
    isDigital: boolean
  ) => {
    if (isDigital) {
      const platform = destinyData.membershipData?.primaryMembershipId
        ? globalState?.crossSavePairingStatus?.primaryMembershipType
        : destinyData.selectedMembership?.membershipType ??
          BungieMembershipType.None;

      gotoRewardItemPage(rewardId, platform);
    } else {
      // non digital items: send an email
      Platform.TokensService.EmailBungieReward(rewardId, mType)
        .then(() => {
          //email sent
          gotoRewardItemPage(rewardId, mType);
        })
        .catch(ConvertToPlatformError)
        .catch(Modal.error);
    }
  };

  const gotoRewardItemPage = (
    rewardId: string,
    mType: BungieMembershipType
  ) => {
    const rewardUrl = RouteHelper.ClaimDigitalReward({
      rewardId: rewardId,
      mtype: EnumUtils.getNumberValue(mType, BungieMembershipType).toString(),
    });

    history.push(rewardUrl.url);
  };

  const userAvailability =
    props.reward.rewardDisplay.UserRewardAvailabilityModel;

  if (!userAvailability) {
    return null;
  }

  const mailRewardText = userAvailability.AvailabilityModel.IsOffer
    ? rewardLoc.GetUnlockCode
    : rewardLoc.GetUnlockCode;
  const hideAppliedOffer =
    userAvailability.AvailabilityModel.OfferApplied &&
    !userAvailability.AvailabilityModel.DecryptedToken;
  const loyaltyMailAppliedText = rewardLoc.OfferApplied;

  const modalRef = useRef<Modal>();

  if (
    userAvailability.AvailabilityModel.OfferApplied &&
    userAvailability.AvailabilityModel.HasOffer &&
    !userAvailability.AvailabilityModel.DecryptedToken
  ) {
    return (
      <Button buttonType={"disabled"} disabled={true} size={BasicSize.Small}>
        {loyaltyMailAppliedText}
      </Button>
    );
  }

  if (userAvailability.IsUnlockedForUser) {
    return (
      <Button
        buttonType={"gold"}
        className={classNames({ [styles.hide]: hideAppliedOffer })}
        size={BasicSize.Small}
        onClick={() =>
          emailCode(
            props.reward.rewardId,
            membershipType,
            userAvailability.AvailabilityModel.IsOffer
          )
        }
      >
        {mailRewardText}
      </Button>
    );
  } else {
    if (UserUtils.isAuthenticated(globalState)) {
      return (
        <Button
          buttonType={"gold"}
          className={classNames({ [styles.hide]: hideAppliedOffer })}
          disabled={true}
          size={BasicSize.Small}
          onClick={() =>
            emailCode(
              props.reward.rewardId,
              membershipType,
              userAvailability.AvailabilityModel.IsOffer
            )
          }
        >
          {mailRewardText}
        </Button>
      );
    } else {
      return (
        <Button
          buttonType={"gold"}
          className={classNames(styles.disabled, {
            [styles.hide]: hideAppliedOffer,
          })}
          onClick={() =>
            ShowAuthModal(
              {
                onSignIn: () => {
                  modalRef.current?.close();
                },
              },
              modalRef
            )
          }
          size={BasicSize.Small}
        >
          {rewardLoc.SignInToEarn}
        </Button>
      );
    }
  }
};
