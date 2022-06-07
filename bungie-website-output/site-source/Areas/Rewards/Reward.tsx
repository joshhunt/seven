// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Rewards/Reward.module.scss";
import stylesContainer from "@Areas/Rewards/Rewards.module.scss";
import { RewardClaimButtons } from "@Areas/Rewards/Shared/RewardClaimButtons";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Tokens } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IRewardClaimParams } from "@Routes/RouteParams";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface RewardProps {}

export const Reward: React.FC<RewardProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const isSignedIn = UserUtils.isAuthenticated(globalState);
  const params = useParams<IRewardClaimParams>();
  const rewardLoc = Localizer.Bungierewards;

  const rewardId = params.rewardId ?? "";
  const bungieMembershipType =
    BungieMembershipType[params.mtype as keyof typeof BungieMembershipType] ??
    BungieMembershipType.None;

  const [claimResponse, setClaimResponse] = useState<
    Tokens.BungieRewardClaimResponse
  >();

  if (bungieMembershipType === BungieMembershipType.None || rewardId === "") {
    return (
      <div className={styles.rewarditemOuter}>
        <div className={styles.rewarditemContainer}>
          <div className={styles.rewarditemMeta}>
            <h3 className={styles.sectionHeader}>
              {bungieMembershipType === BungieMembershipType.None
                ? Localizer.Messages.DestinyInvalidMembershipType
                : rewardLoc.InvalidRewardId}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const claimDigitalReward = () => {
    if (isSignedIn && !claimResponse) {
      Platform.TokensService.ClaimDigitalBungieReward(
        rewardId,
        bungieMembershipType
      )
        .then((result) => {
          setClaimResponse(result);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
  };

  const copyToClipboard = () => {
    //copy the claim url to clipboard
    navigator.clipboard.writeText(codeRedeemUrl).then(
      function () {
        Modal.open(rewardLoc.copied);
      },
      function () {
        Modal.open(rewardLoc.ThereWasAProblemCopying);
      }
    );
  };

  useEffect(() => {
    claimDigitalReward();
  }, [params]);

  if (!isSignedIn) {
    return <RequiresAuth onSignIn={() => claimDigitalReward()} />;
  }

  if (!ConfigUtils.SystemStatus(SystemNames.D2RewardsReact) || !claimResponse) {
    return null;
  }

  const bungieHelpLink = RouteHelper.HelpArticle(47107);

  const isDoubleReward =
    claimResponse.DecryptedToken &&
    claimResponse.OfferAsCode &&
    claimResponse.CodeCharges > 1;

  const codeRedeemUrl = RouteHelper.CodeRedemptionWithCode(
    claimResponse.DecryptedToken
  );

  const timeZone = DateTime.now().zone;
  const redemptionEndDate = DateTime.fromISO(claimResponse.RedemptionEndDate, {
    zone: "utc",
  });

  const redemptionEndDateFormatted =
    redemptionEndDate && redemptionEndDate > DateTime.now()
      ? redemptionEndDate.setZone(timeZone).toLocaleString({
          locale: Localizer.CurrentCultureName,
          month: "short",
          year: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

  return (
    <SystemDisabledHandler systems={[SystemNames.D2Rewards]}>
      <BungieHelmet title={rewardLoc.AvailableRewardsHeader}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.rewardContent}>
        <div className={styles.rewarditemOuter}>
          <div
            className={classNames(
              stylesContainer.claimRewardsBreadcrumb,
              styles.claimRewardsBreadcrumb
            )}
          >
            <Anchor url={RouteHelper.Rewards()}>
              {rewardLoc.BungieRewards}
            </Anchor>
            <Anchor url={RouteHelper.DigitalRewards()}>
              {rewardLoc.AvailableRewardsHeader}
            </Anchor>
            <p>{claimResponse.RewardDisplayProperties.Name}</p>
          </div>
          <div className={styles.rewarditemContainer}>
            <div className={styles.rewarditemMeta}>
              <img src={claimResponse.RewardDisplayProperties.ImagePath} />
              <h3 className={styles.sectionHeader}>
                {StringUtils.decodeHtmlEntities(
                  claimResponse.RewardDisplayProperties.Name
                )}
              </h3>
              <p>
                {StringUtils.decodeHtmlEntities(
                  claimResponse.RewardDisplayProperties.Description
                )}
              </p>
              {isDoubleReward && (
                <>
                  <p className={styles.codeHeader}>
                    {rewardLoc.SendThisCodeToYourFriend}
                  </p>
                  <div className={styles.rewarditemCode}>
                    <p className={styles.code}>
                      {claimResponse.DecryptedToken}
                    </p>
                    <p className={styles.codeurl}>{codeRedeemUrl}</p>
                    <p className={styles.date}>
                      {rewardLoc.SpendFriendTokenBy}{" "}
                      <span>{redemptionEndDateFormatted}</span>
                    </p>
                  </div>
                  <div className={styles.rewarditemLinks}>
                    <div
                      onClick={() => copyToClipboard()}
                      className={styles.copyurl}
                    >
                      {rewardLoc.CopyUrlToClipboard}
                    </div>
                    <Anchor
                      target={"_blank"}
                      className={styles.help}
                      url={bungieHelpLink}
                    >
                      {rewardLoc.RewardsHelp}
                    </Anchor>
                  </div>
                </>
              )}
            </div>
            <RewardClaimButtons
              isAnon={!isSignedIn}
              claimResponse={claimResponse}
            />
          </div>
        </div>
      </div>
    </SystemDisabledHandler>
  );
};
