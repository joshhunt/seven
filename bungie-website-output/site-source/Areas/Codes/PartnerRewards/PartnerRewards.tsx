// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PlatformError } from "@CustomErrors";
import { AclEnum, DropStateEnum } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Tokens } from "@Platform";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { usePrevious } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./PartnerRewards.module.scss";
import { FaTwitch } from "@react-icons/all-files/fa/FaTwitch";
import { StringUtils } from "@Utilities/StringUtils";

interface IPartnerRewardsRouteParams {
  membershipId: string;
}

export const PartnerRewards: React.FC = () => {
  const appIds = [
    Number(
      ConfigUtils.GetParameter(
        SystemNames.PartnerOfferClaims,
        "TwitchRewardsAppId",
        0
      )
    ),
    Number(
      ConfigUtils.GetParameter(
        SystemNames.PartnerOfferClaims,
        "PrimeGamingAppId",
        0
      )
    ),
    Number(
      ConfigUtils.GetParameter(
        SystemNames.PartnerOfferClaims,
        "DonorDriveAppId",
        0
      )
    ),
    Number(
      ConfigUtils.GetParameter(
        SystemNames.PartnerOfferClaims,
        "NeteaseUUBoosterAppId",
        0
      )
    ),
  ].filter((a) => a !== 0);

  const [rewardItems, setRewardItems] = useState<
    (Tokens.PartnerOfferSkuHistoryResponse | Tokens.TwitchDropHistoryResponse)[]
  >();

  const [loggedInUserCanReadHistory, setLoggedInUserCanReadHistory] = useState(
    false
  );
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const prevGlobalState = usePrevious(globalState);
  const { membershipId } = useParams<IPartnerRewardsRouteParams>();

  useEffect(() => {
    getRewardsHistory();
  }, []);

  useEffect(() => {
    const wasAuthed =
      prevGlobalState && UserUtils.isAuthenticated(prevGlobalState);
    const isNowAuthed = UserUtils.isAuthenticated(globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      getRewardsHistory();
    }
  }, [globalState]);

  const getRewardsHistory = () => {
    // Get membershipId from url if it is provided - this is so admins can view a user's partner rewards history too
    const { loggedInUser } = globalState;

    if (ConfigUtils.SystemStatus("PartnerOfferClaims")) {
      if (UserUtils.isAuthenticated(globalState)) {
        const canViewHistory =
          (membershipId && membershipId === loggedInUser.user.membershipId) ||
          loggedInUser.userAcls.includes(AclEnum.BNextPrivateUserDataReader);
        const hasPrivateDataReadPermissions = loggedInUser.userAcls.includes(
          AclEnum.BNextPrivateUserDataReader
        );
        // if there isn't a parameter in the url, provide history for the logged in user
        // otherwise use the membershipId provided but only for people with permission to see that user's history)
        if (canViewHistory || !membershipId) {
          setLoggedInUserCanReadHistory(true);
          const membershipIdUsedForHistory =
            hasPrivateDataReadPermissions && membershipId
              ? membershipId
              : UserUtils.loggedInUserMembershipIdFromCookie;

          // Get history for all partner apps
          const promises = appIds.map((id) => {
            return Platform.TokensService.GetPartnerRewardHistory(
              membershipIdUsedForHistory,
              id
            );
          });

          Promise.all(promises)
            .then((dataArray) => {
              setRewardItems(getRewardItems(dataArray));
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e));
        }
      }
    }
  };

  const makeDateString = (date: string) => {
    const dateObj = DateTime.fromISO(date, { zone: "utc" });

    const timeZone = DateTime.now().zone;

    return dateObj.setZone(timeZone).toLocaleString({
      locale: LocalizerUtils.useAltChineseCultureString(
        Localizer.CurrentCultureName
      ),
      month: "short",
      year: "numeric",
      day: "numeric",
    });
  };

  const getRewardItems = (
    rewardResponses: Tokens.PartnerRewardHistoryResponse[]
  ) => {
    const rewItems: (
      | Tokens.PartnerOfferSkuHistoryResponse
      | Tokens.TwitchDropHistoryResponse
    )[] = [];

    rewardResponses.forEach((r) => {
      if (r.TwitchDrops?.length) {
        r.TwitchDrops.forEach((tw) => {
          //filter out the dupes
          if (
            !rewItems.find(
              (i) => (i as Tokens.TwitchDropHistoryResponse).Title === tw.Title
            )
          ) {
            rewItems.push(tw);
          }
        });
      }

      if (r.PartnerOffers?.length) {
        r.PartnerOffers.forEach((po) => rewItems.push(po));
      }
    });

    rewItems.sort((a, b) => {
      const dateA = a.hasOwnProperty("SkuIdentifier")
        ? (a as Tokens.PartnerOfferSkuHistoryResponse).ClaimDate
        : (a as Tokens.TwitchDropHistoryResponse).CreatedAt;

      const dateB = b.hasOwnProperty("SkuIdentifier")
        ? (b as Tokens.PartnerOfferSkuHistoryResponse).ClaimDate
        : (b as Tokens.TwitchDropHistoryResponse).CreatedAt;

      return DateTime.fromISO(dateB, { zone: "utc" })
        .diff(DateTime.fromISO(dateA, { zone: "utc" }))
        .toObject().milliseconds;
    });

    return rewItems;
  };

  const claimRewards = () => {
    let modalShown = false;
    // Get history for all partner apps
    appIds.forEach((i) => {
      Platform.TokensService.ApplyMissingPartnerOffersWithoutClaim(
        i,
        UserUtils.loggedInUserMembershipIdFromCookie
      )
        .then((rewardsWereClaimed) => {
          if (rewardsWereClaimed && !modalShown) {
            Modal.open(Localizer.PartnerOffers.ClaimSuccessMessage);
          }
          modalShown = true;
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => Modal.error(e));
    });
  };

  const forceDropsRepair = () => {
    Platform.TokensService.ForceDropsRepair()
      .then(() => {
        getRewardsHistory();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => Modal.error(e));
  };

  return (
    <SystemDisabledHandler systems={["PartnerOfferClaims"]}>
      <RequiresAuth>
        <BungieHelmet
          title={Localizer.CodeRedemption.PartnerRewards}
          image={"/7/ca/bungie/bgs/pcregister/engram.jpg"}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.missingDropsButton}>
          <GridCol cols={12} className={styles.dropsContainer}>
            <FaTwitch />
            <div className={styles.dropsContentContainer}>
              <p className={styles.dropsTitle}>
                {Localizer.CodeRedemption.MissingTwitchRewards}
              </p>
              <p className={styles.dropsDescription}>
                {Localizer.CodeRedemption.MissingTwitchRewardsYou}
              </p>
            </div>
            <Button
              size={BasicSize.Small}
              buttonType={"gold"}
              className={styles.btnRefresh}
              onClick={() => forceDropsRepair()}
            >
              {Localizer.CodeRedemption.IDonTSeeMyTwitchDrops}
            </Button>
          </GridCol>
        </div>
        {loggedInUserCanReadHistory && (
          <div>
            {rewardItems?.map((r, index) => {
              const isPartnerOffer = r.hasOwnProperty("SkuIdentifier");

              if (!isPartnerOffer) {
                const tw: Tokens.TwitchDropHistoryResponse = r as Tokens.TwitchDropHistoryResponse;

                return (
                  <div key={index}>
                    <TwoLineItem
                      itemTitle={StringUtils.decodeHtmlEntities(tw.Title)}
                      itemSubtitle={StringUtils.decodeHtmlEntities(
                        tw.Description
                      )}
                      flair={
                        tw.ClaimState &&
                        tw.ClaimState === DropStateEnum.Fulfilled ? (
                          <div>{makeDateString(tw.CreatedAt)}</div>
                        ) : (
                          ""
                        )
                      }
                    />
                  </div>
                );
              } else {
                const po: Tokens.PartnerOfferSkuHistoryResponse = r as Tokens.PartnerOfferSkuHistoryResponse;

                return (
                  <div key={index}>
                    <TwoLineItem
                      itemTitle={StringUtils.decodeHtmlEntities(
                        po.LocalizedName
                      )}
                      itemSubtitle={StringUtils.decodeHtmlEntities(
                        po.LocalizedDescription
                      )}
                      flair={
                        po.AllOffersApplied ? (
                          <div>{makeDateString(po.ClaimDate)}</div>
                        ) : (
                          <Button
                            size={BasicSize.Small}
                            onClick={() => claimRewards()}
                          >
                            {Localizer.PartnerOffers.Claim}
                          </Button>
                        )
                      }
                    />
                  </div>
                );
              }
            })}
            {!rewardItems?.length && (
              <p className={styles.noResults}>
                {Localizer.Coderedemption.NoResults}
              </p>
            )}
          </div>
        )}

        {
          // if this isn't your membershipId in the url or you're not an admin, you don't get to see my rewards
          !loggedInUserCanReadHistory && (
            <div>
              <p className={styles.noResults}>
                {Localizer.PartnerOffers.NotYourAccount}
              </p>
            </div>
          )
        }
      </RequiresAuth>
    </SystemDisabledHandler>
  );
};
