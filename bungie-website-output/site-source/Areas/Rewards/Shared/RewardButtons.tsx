// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { RewardsDataStore } from "@Areas/Rewards/DataStores/RewardsDataStore";
import { RewardsDestinyMembershipDataStore } from "@Areas/Rewards/DataStores/RewardsDestinyMembershipDataStore";
import { IReward } from "@Areas/Rewards/Rewards";
import styles from "@Areas/Rewards/Shared/RewardItem.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, OptInFlags } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { ShowAuthModal } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { EmailValidationState, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useRef } from "react";
import { useHistory } from "react-router";

interface RewardButtonsProps {
  reward: IReward;
}

export const RewardButtons: React.FC<RewardButtonsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "crossSavePairingStatus",
  ]);
  const destinyMembership = useDataStore(RewardsDestinyMembershipDataStore);
  const history = useHistory();
  const membershipType =
    destinyMembership?.selectedMembership?.membershipType ||
    destinyMembership?.membershipData?.destinyMemberships[0]?.membershipType ||
    BungieMembershipType.None;
  const rewardLoc = Localizer.Bungierewards;
  const settingsModalRef = React.createRef<Modal>();

  const emailCode = (
    isVerified: boolean,
    settingsFullfied: boolean,
    rewardId: string,
    mType: BungieMembershipType,
    isDigital: boolean
  ) => {
    if (!isVerified) {
      //email not verified
      Modal.error(new Error(rewardLoc.VerificationRequiredHeader));

      return;
    }

    if (!settingsFullfied) {
      Modal.open(
        <Anchor
          url={RouteHelper.EmailAndSms()}
          target="_blank"
          onClick={() => settingsModalRef.current.close()}
        >
          {rewardLoc.PleaseUpdateYourEmail}
        </Anchor>,
        {},
        settingsModalRef
      );

      return;
    }

    if (isDigital) {
      const platform = destinyMembership?.isCrossSaved
        ? globalState?.crossSavePairingStatus?.primaryMembershipType
        : destinyMembership?.selectedMembership.membershipType ??
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
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
  };

  const gotoRewardItemPage = (
    rewardId: string,
    mType: BungieMembershipType
  ) => {
    //refresh the rewards list, it has changed
    if (mType !== BungieMembershipType.BungieNext) {
      RewardsDataStore.actions.getPlatformRewardsList(
        destinyMembership.selectedMembership.membershipId,
        destinyMembership.selectedMembership.membershipType
      );
    } else {
      RewardsDataStore.actions.getRewardsList(
        globalState.loggedInUser.user.membershipId
      );
    }

    const rewardUrl = RouteHelper.ClaimDigitalReward({
      rewardId: rewardId,
      mtype: EnumUtils.getNumberValue(mType, BungieMembershipType).toString(),
    });

    history.push(rewardUrl.url);
  };

  const renderButtons = (): React.ReactElement => {
    const userAvailability =
      props.reward.bungieRewardDisplay.UserRewardAvailabilityModel;

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

    const emailSettingsOptInFlags = UserUtils.isAuthenticated(globalState)
      ? parseInt(globalState.loggedInUser.emailUsage, 10)
      : OptInFlags.None;
    const emailSettingsFulfilled =
      (emailSettingsOptInFlags & OptInFlags.Marketing) ===
        OptInFlags.Marketing &&
      (emailSettingsOptInFlags & OptInFlags.Social) === OptInFlags.Social;

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
              UserUtils.getEmailValidationState(
                globalState.loggedInUser.emailStatus
              ) === EmailValidationState.Verified,
              emailSettingsFulfilled,
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
                UserUtils.getEmailValidationState(
                  globalState.loggedInUser.emailStatus
                ) === EmailValidationState.Verified,
                emailSettingsFulfilled,
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

  return <div className={styles.rewardButtonContainer}>{renderButtons()}</div>;
};
