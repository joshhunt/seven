// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
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
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { Anchor } from "@UI/Navigation/Anchor";
import { ShowAuthModal } from "@UI/User/Auth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EmailValidationState, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useRef } from "react";

interface RewardButtonsProps {
  reward: IReward;
}

export const RewardButtons: React.FC<RewardButtonsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "crossSavePairingStatus",
  ]);
  const destinyMembership = useDataStore(RewardsDestinyMembershipDataStore);
  const membershipType =
    destinyMembership?.selectedMembership?.membershipType ||
    destinyMembership?.membershipData?.destinyMemberships[0]?.membershipType ||
    BungieMembershipType.None;
  const rewardLoc = Localizer.Bungierewards;
  const platformModalRef = React.createRef<Modal>();
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
      Modal.error(rewardLoc.verificationrequiredheader);

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
      //digital item: need to choose platform if more than one platform and not crosssaved
      if (
        !destinyMembership?.isCrossSaved &&
        destinyMembership?.membershipData?.destinyMemberships?.length > 1
      ) {
        Modal.open(platformSelectorModal(rewardId), {}, platformModalRef);
      } else {
        const platform = destinyMembership?.isCrossSaved
          ? globalState?.crossSavePairingStatus?.primaryMembershipType
          : destinyMembership?.membershipData?.destinyMemberships[0]
              ?.membershipType ?? BungieMembershipType.None;

        gotoRewardItemPage(rewardId, platform);
      }
    } else {
      // non digital items: send an email
      Platform.TokensService.EmailBungieReward(rewardId, mType)
        .then(() => {
          //email sent

          //goto the reward item Page
          gotoRewardItemPage(rewardId, mType);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
  };

  const platformSelectorModal = (rewardId: string) => {
    return (
      <div
        className={classNames(
          styles.containerRewards,
          styles.containerPlatformSelector
        )}
      >
        <p className="header-description">{rewardLoc.WhereWouldYouLikeThis}</p>
        <DestinyPlatformSelector
          userMembershipData={destinyMembership?.membershipData}
          onChange={(value) => {
            const mtype =
              BungieMembershipType[value as keyof typeof BungieMembershipType];
            platformModalRef.current.close();

            gotoRewardItemPage(rewardId, mtype);
          }}
          defaultValue={membershipType}
          crossSavePairingStatus={globalState?.crossSavePairingStatus}
        />
      </div>
    );
  };

  const gotoRewardItemPage = (
    rewardId: string,
    mType: BungieMembershipType
  ) => {
    window.location.href = `/${Localizer.CurrentCultureName}/Emails/RewardItem?id=${rewardId}&mt=${mType}`;
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
