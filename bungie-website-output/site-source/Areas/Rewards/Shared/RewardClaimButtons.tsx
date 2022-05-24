// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Rewards/Reward.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Tokens } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import React from "react";

interface RewardClaimButtonsProps {
  isAnon: boolean;
  claimResponse: Tokens.BungieRewardClaimResponse;
}

export const RewardClaimButtons: React.FC<RewardClaimButtonsProps> = (
  props
) => {
  const rewardLoc = Localizer.Bungierewards;
  const bungieHelpLink = RouteHelper.HelpArticle(47107);
  const isDoubleReward =
    props.claimResponse.DecryptedToken &&
    props.claimResponse.OfferAsCode &&
    props.claimResponse.CodeCharges > 1;

  const renderButtonsForOffers = () => {
    if (!props.claimResponse.IsOffer) {
      return null;
    }

    if (props.isAnon) {
      return (
        <>
          <div className={styles.signinRequired}>
            <h5 className={styles.sectionHeader}>{rewardLoc.SignInRequired}</h5>
            <p>{rewardLoc.SignInInstructions}</p>
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
          <RequiresAuth
            onSignIn={() => GlobalStateDataStore.actions.refreshCurrentUser()}
          />
        </>
      );
    } else {
      if (props.claimResponse.OfferAsCode) {
        if (isDoubleReward) {
          const codeRedeemUrl = RouteHelper.CodeRedemptionWithCode(
            props.claimResponse.DecryptedToken
          );

          return (
            <Button
              url={codeRedeemUrl}
              buttonType={"gold"}
              className={styles.btnEmailcode}
            >
              {rewardLoc.RedeemYourCode}
            </Button>
          );
        } else if (props.claimResponse.RedemptionPeriodExpired) {
          return (
            <div className={styles.signinRequired}>
              <h5 className={styles.sectionHeader}>
                {rewardLoc.RedemptionPeriodExpired}
              </h5>
              <p>{rewardLoc.RedemptionPeriodExpiredInstructions}</p>
              <Anchor
                target="_blank"
                className={styles.help}
                url={bungieHelpLink}
              >
                {rewardLoc.RewardsHelp}
              </Anchor>
            </div>
          );
        } else {
          return (
            <div className={styles.signinRequired}>
              <h5 className={styles.sectionHeader}>
                {rewardLoc.OfferNotOwned}
              </h5>
              <p>
                <Anchor url={RouteHelper.Rewards()}>
                  {rewardLoc.OfferNotOwnedInstructions}
                </Anchor>
              </p>
              <Anchor
                target="_blank"
                className={styles.help}
                url={bungieHelpLink}
              >
                {rewardLoc.RewardsHelp}
              </Anchor>
            </div>
          );
        }
      } else if (props.claimResponse.OfferApplied) {
        return (
          <div className={styles.signinRequired}>
            <h5 className={styles.sectionHeader}>{rewardLoc.OfferApplied}</h5>
            {props.claimResponse.IsLoyaltyReward && (
              <p>{rewardLoc.OfferLoyaltyRewardApplied}</p>
            )}
            {!props.claimResponse.IsLoyaltyReward && (
              <p>{rewardLoc.OfferAppliedDetails}</p>
            )}
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
        );
      } else if (props.claimResponse.OwnsOffer) {
        return (
          <div className={styles.signinRequired}>
            <h5 className="section-header">{rewardLoc.OfferOwnedNotApplied}</h5>
            {props.claimResponse.IsLoyaltyReward && (
              <p>{rewardLoc.OfferOwnedNotAppliedInstructions}</p>
            )}
            {!props.claimResponse.IsLoyaltyReward && (
              <p>{rewardLoc.OfferOwnedNotAppliedInstructions}</p>
            )}
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
        );
      } else if (props.claimResponse.RedemptionPeriodExpired) {
        return (
          <div className={styles.signinRequired}>
            <h5 className={styles.sectionHeader}>
              {rewardLoc.RedemptionPeriodExpired}
            </h5>
            <p>{rewardLoc.RedemptionPeriodExpiredInstructions}</p>
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
        );
      } else {
        return (
          <div className={styles.signinRequired}>
            <h5 className={styles.sectionHeader}>{rewardLoc.OfferNotOwned}</h5>
            <p>
              <Anchor url={RouteHelper.DigitalRewards()}>
                {rewardLoc.OfferNotOwnedInstructions}
              </Anchor>
            </p>
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
        );
      }
    }
  };

  const renderNonOfferButtons = () => {
    if (props.claimResponse.IsOffer) {
      return null;
    }

    if (props.claimResponse.ClaimPeriodExpired) {
      return (
        <div className="signin-required">
          <h5 className="section-header">{rewardLoc.ClaimPeriodExpired}</h5>
          <p>{rewardLoc.ClaimPeriodExpiredInstructions}</p>
          <Anchor target={"_blank"} className="help" url="@bungieHelpLink">
            {rewardLoc.RewardsHelp}
          </Anchor>
        </div>
      );
    } else if (props.claimResponse.RedemptionPeriodExpired) {
      return (
        <div className="signin-required">
          <h5 className="section-header">
            {rewardLoc.RedemptionPeriodExpired}
          </h5>
          <p>{rewardLoc.RedemptionPeriodExpiredInstructions}</p>
          <Anchor
            target={"_blank"}
            className={styles.help}
            url={bungieHelpLink}
          >
            {rewardLoc.RewardsHelp}
          </Anchor>
        </div>
      );
    } else {
      return (
        <>
          <div className="signin-required">
            <h5 className="section-header">{rewardLoc.SignInRequired}</h5>
            <p>{rewardLoc.SignInInstructions}</p>
            <Anchor
              target={"_blank"}
              className={styles.help}
              url={bungieHelpLink}
            >
              {rewardLoc.RewardsHelp}
            </Anchor>
          </div>
          <RequiresAuth
            onSignIn={() => GlobalStateDataStore.actions.refreshCurrentUser()}
          />
        </>
      );
    }
  };

  return (
    <div className={styles.buttons}>
      {renderButtonsForOffers()}
      {renderNonOfferButtons()}
    </div>
  );
};
