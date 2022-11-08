// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PlatformError } from "@CustomErrors";
import { AclEnum, DropStateEnum } from "@Enum";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
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
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { usePrevious } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "react-router";
import styles from "./PartnerRewards.module.scss";
import { FaTwitch } from "@react-icons/all-files/fa/FaTwitch";

interface IPartnerRewardsRouteParams {
  membershipId: string;
}

interface IPartnerRewardsProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps<IPartnerRewardsRouteParams> {}

/**
 * PartnerRewards - Replace this description
 *  *
 * @returns
 */
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

  const [rewards, setRewards] = useState<Tokens.PartnerRewardHistoryResponse[]>(
    null
  );
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
              let allRewards = dataArray.reduce((a, c) => a.concat(c), []);
              allRewards = sortByDate(allRewards);

              setRewards(allRewards);
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

  const sortByDate = (array: Tokens.PartnerRewardHistoryResponse[]) => {
    return array.sort((a, b) => {
      const aDate =
        a.PartnerOffers?.[0]?.ClaimDate ?? a.TwitchDrops?.[0]?.CreatedAt;
      const bDate =
        b.PartnerOffers?.[0]?.ClaimDate ?? b.TwitchDrops?.[0]?.CreatedAt;

      return DateTime.fromISO(bDate, { zone: "utc" })
        .diff(DateTime.fromISO(aDate, { zone: "utc" }))
        .toObject().milliseconds;
    });
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
            {rewards
              ?.filter(
                (
                  v: Tokens.PartnerRewardHistoryResponse,
                  i: number,
                  a: Tokens.PartnerRewardHistoryResponse[]
                ) => {
                  // Removes duplicate TwitchDrops rewards due to multiple appid for Twitch by finding the first entry with the specific title
                  // Partner rewards are excluded from filter
                  return (
                    v.PartnerOffers?.[0] ||
                    a.findIndex(
                      (v2) =>
                        v.TwitchDrops?.[0] &&
                        v2.TwitchDrops?.[0] &&
                        v2.TwitchDrops[0]?.Title === v.TwitchDrops[0]?.Title
                    ) === i
                  );
                }
              )
              ?.filter((r) => r.PartnerOffers?.[0] || r.TwitchDrops?.[0])
              ?.map((r, i) => {
                const partnerOffer = r.PartnerOffers?.[0];
                const twitchDrop = r.TwitchDrops?.[0];

                if (twitchDrop) {
                  return (
                    <div key={i}>
                      <TwoLineItem
                        itemTitle={twitchDrop.Title}
                        itemSubtitle={twitchDrop.Description}
                        flair={
                          twitchDrop.ClaimState &&
                          twitchDrop.ClaimState === DropStateEnum.Fulfilled ? (
                            <div>{makeDateString(twitchDrop.CreatedAt)}</div>
                          ) : (
                            ""
                          )
                        }
                      />
                    </div>
                  );
                }

                if (partnerOffer) {
                  return (
                    <div key={i}>
                      <TwoLineItem
                        itemTitle={partnerOffer.LocalizedName}
                        itemSubtitle={partnerOffer.LocalizedDescription}
                        flair={
                          partnerOffer.AllOffersApplied ? (
                            <div>{makeDateString(partnerOffer.ClaimDate)}</div>
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

                return null;
              })}
            {!rewards?.length && (
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
