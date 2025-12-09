import {
  ConvertToPlatformError,
  ConvertToPlatformErrorSync,
} from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { AclEnum, DropStateEnum } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { Platform, Tokens } from "@Platform";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { usePrevious } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./PartnerRewards.module.scss";
import { FaTwitch } from "@react-icons/all-files/fa/FaTwitch";
import { StringUtils } from "@Utilities/StringUtils";
import { Typography, Button, Select } from "plxp-web-ui/components/base";
import { mockPartnerRewards } from "./PartnerRewardsMockData";

interface IPartnerRewardsRouteParams {
  membershipId: string;
}

const partnerNames = [
  "TwitchRewardsAppId",
  "PrimeGamingAppId",
  "DonorDriveAppId",
  "NeteaseUUBoosterAppId",
  "TiltifyAppId",
  "BungieTwitchDropsAppId",
];

const partners = partnerNames
  .map((name) => ({
    partnerName: name,
    partnerId: Number(
      ConfigUtils.GetParameter(SystemNames.PartnerOfferClaims, name, 0)
    ),
  }))
  .filter((p) => p.partnerId !== 0);

type MergedRewards =
  | ({ type: "Twitch"; partnerId: number } & Tokens.TwitchDropHistoryResponse)
  | ({
      type: "PartnerOffer";
      partnerId: number;
    } & Tokens.PartnerOfferSkuHistoryResponse);

const MOCK_PARTNER_REWARDS_QUERY_PARAM = "mockPartnerRewards";

export const PartnerRewards: React.FC = () => {
  const [rewardItems, setRewardItems] = useState<MergedRewards[]>([]);
  const [filteredRewardItems, setFilteredRewardItems] = useState<
    MergedRewards[]
  >([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(0);
  const search = useLocation().search;
  const usingMockRewards = useMemo(() => {
    const params = new URLSearchParams(search);

    return params.has(MOCK_PARTNER_REWARDS_QUERY_PARAM);
  }, [search]);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const prevGlobalState = usePrevious(globalState);
  const { membershipId } = useParams<IPartnerRewardsRouteParams>();

  useEffect(() => {
    if (!usingMockRewards) {
      return;
    }

    setRewardItems(mockPartnerRewards);
    setFilteredRewardItems(mockPartnerRewards);
  }, [usingMockRewards]);

  useEffect(() => {
    if (usingMockRewards) {
      return;
    }

    const wasAuthed =
      prevGlobalState && UserUtils.isAuthenticated(prevGlobalState);
    const isNowAuthed = UserUtils.isAuthenticated(globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      getRewardsHistory();
    }
  }, [globalState, usingMockRewards]);

  useEffect(() => {
    if (selectedPartnerId === 0) {
      setFilteredRewardItems(rewardItems);
    } else {
      setFilteredRewardItems(
        rewardItems.filter((r) => r.partnerId === selectedPartnerId)
      );
    }
  }, [selectedPartnerId, rewardItems]);

  const getRewardsHistory = async () => {
    // Get membershipId from url if it is provided - this is so admins can view a user's partner rewards history too
    const { loggedInUser } = globalState;
    if (
      !UserUtils.isAuthenticated(globalState) ||
      !ConfigUtils.SystemStatus("PartnerOfferClaims")
    ) {
      return;
    }
    // if there isn't a parameter in the url, provide history for the logged in user
    // otherwise use the membershipId provided but only for people with permission to see that user's history)
    const membershipIdUsedForHistory =
      loggedInUser?.userAcls.includes(AclEnum.BNextPrivateUserDataReader) &&
      membershipId
        ? membershipId
        : UserUtils.loggedInUserMembershipIdFromCookie;
    try {
      const dataArray = await Promise.all(
        partners.map(async ({ partnerId }) => {
          const result = await Platform.TokensService.GetPartnerRewardHistory(
            membershipIdUsedForHistory,
            partnerId
          );

          const merged: MergedRewards[] = [
            ...(result.TwitchDrops?.map((td) => ({
              type: "Twitch" as const,
              partnerId,
              ...td,
            })) ?? []),
            ...(result.PartnerOffers?.map((po) => ({
              type: "PartnerOffer" as const,
              partnerId,
              ...po,
            })) ?? []),
          ];
          return merged;
        })
      );
      const seenTwitch = new Set<string>();
      const flat: MergedRewards[] = [];
      for (const inner of dataArray) {
        for (const reward of inner) {
          if (reward.type === "PartnerOffer") {
            flat.push(reward);
          } else if (!seenTwitch.has(reward.Title)) {
            seenTwitch.add(reward.Title);
            flat.push(reward);
          }
        }
      }

      flat.sort((a, b) => {
        const dateA = a.type === "Twitch" ? a.CreatedAt : a.ClaimDate;
        const dateB = b.type === "Twitch" ? b.CreatedAt : b.ClaimDate;
        return DateTime.fromISO(dateB, { zone: "utc" })
          .diff(DateTime.fromISO(dateA, { zone: "utc" }))
          .toObject().milliseconds;
      });
      setRewardItems(flat);
      setFilteredRewardItems(flat);
    } catch (e) {
      Modal.error(ConvertToPlatformErrorSync(e));
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

  const claimRewards = async () => {
    let modalShown = false;
    // Get history for all partner apps
    for (const { partnerId } of partners) {
      try {
        const rewarded = await Platform.TokensService.ApplyMissingPartnerOffersWithoutClaim(
          partnerId,
          UserUtils.loggedInUserMembershipIdFromCookie
        );
        if (rewarded && !modalShown) {
          Modal.open(Localizer.PartnerOffers.ClaimSuccessMessage);
        }
        modalShown = true;
      } catch (e) {
        Modal.error(ConvertToPlatformErrorSync(e));
      }
    }
  };

  const forceDropsRepair = () => {
    Platform.TokensService.ForceDropsRepair()
      .then(getRewardsHistory)
      .catch(ConvertToPlatformError)
      .catch(Modal.error);
  };

  return (
    <SystemDisabledHandler systems={["PartnerOfferClaims"]}>
      <RequiresAuth>
        <div className={styles.container}>
          {ConfigUtils.SystemStatus(SystemNames.TwitchDropEngineEnabled) && (
            <div className={styles.missingDropsButton}>
              <div className={styles.dropsContainer}>
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
                  variant="outlined"
                  className={styles.btnRefresh}
                  onClick={() => forceDropsRepair()}
                >
                  {Localizer.CodeRedemption.IDonTSeeMyTwitchDrops}
                </Button>
              </div>
            </div>
          )}
          {/* <Select
						labelArea={{ labelString: '' }}
						selectProps={{
							displayEmpty: false,
							value: partners.find(p => p.partnerId === selectedPartnerId)?.partnerId,
							onChange: (e) => setSelectedPartnerId(e.target.value as number),
							placeholder: Localizer.CodeRedemption.AllPartners
						}}
						menuOptions={partners.map(p => ({
							value: p.partnerId,
							label: p.partnerName
						})).concat([ { value: 0, label: Localizer.CodeRedemption.AllPartners } ])}
					/> */}
          <div className={styles.rewardList}>
            {filteredRewardItems.map((r) =>
              r.type === "Twitch" ? (
                <React.Fragment key={`twitch-${r.Title}`}>
                  <div className={styles.reward}>
                    <div className={styles.rewardContent}>
                      <Typography
                        className={styles.title}
                        color="textPrimary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body1"
                      >
                        {StringUtils.decodeHtmlEntities(r.Title)}
                      </Typography>
                      <Typography
                        className={styles.subTitle}
                        color="textSecondary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body2"
                      >
                        {StringUtils.decodeHtmlEntities(r.Description)}
                      </Typography>
                    </div>
                    <div className={styles.flair}>
                      {r.ClaimState === DropStateEnum.Fulfilled ? (
                        <div>{makeDateString(r.CreatedAt)}</div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className={styles.divider} />
                </React.Fragment>
              ) : (
                <React.Fragment key={`partner-${r.SkuIdentifier}`}>
                  <div className={styles.reward}>
                    <div className={styles.rewardContent}>
                      <Typography
                        className={styles.title}
                        color="textPrimary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body1"
                      >
                        {StringUtils.decodeHtmlEntities(r.LocalizedName)}
                      </Typography>
                      <Typography
                        className={styles.subTitle}
                        color="textSecondary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body2"
                      >
                        {StringUtils.decodeHtmlEntities(r.LocalizedDescription)}
                      </Typography>
                    </div>
                    <div className={styles.flair}>
                      {r.AllOffersApplied ? (
                        <div>{makeDateString(r.ClaimDate)}</div>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => claimRewards()}
                        >
                          {Localizer.PartnerOffers.Claim}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className={styles.divider} />
                </React.Fragment>
              )
            )}
          </div>
          {rewardItems.length === 0 && (
            <div>
              <p className={styles.noResults}>
                {Localizer.Coderedemption.NoResults}
              </p>
            </div>
          )}
        </div>
      </RequiresAuth>
    </SystemDisabledHandler>
  );
};
