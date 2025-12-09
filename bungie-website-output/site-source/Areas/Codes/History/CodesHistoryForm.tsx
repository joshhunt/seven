import { ConvertToPlatformError } from "@ApiIntermediary";
import { CodesDataStore } from "@Areas/Codes/CodesDataStore";
import styles from "@Areas/Codes/History/CodesHistoryForm.module.scss";
import { CodesPlatformSelector } from "@Areas/Codes/History/CodesPlatformSelector";
import { PlatformError } from "@CustomErrors";
import { AclEnum, BungieMembershipType, OfferRedeemMode } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Contracts, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography } from "plxp-web-ui/components/base";
import { mockOfferHistory } from "./CodesHistoryMockData";

interface CodesHistoryFormProps {
  membershipId?: string;
}

const MOCK_CODES_HISTORY_QUERY_PARAM = "mockCodesHistory";

export const CodesHistoryForm: React.FC<CodesHistoryFormProps> = (props) => {
  const [loggedInUserCanReadHistory, setLoggedInUserCanReadHistory] = useState(
    false
  );
  const [offers, setOffers] = useState<Contracts.OfferHistoryResponse[]>([]);
  const search = useLocation().search;
  const usingMockRewards = useMemo(() => {
    const params = new URLSearchParams(search);

    return params.has(MOCK_CODES_HISTORY_QUERY_PARAM);
  }, [search]);
  const codesDataStorePayload = useDataStore(CodesDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const loggedInUser = globalState.loggedInUser;
  const loggedInUserMembershipId = loggedInUser?.user.membershipId;
  const loggedInUserAcls = loggedInUser?.userAcls ?? [];
  const loggedInUserAclKey = loggedInUserAcls.join("|");

  useEffect(() => {
    if (usingMockRewards) {
      setLoggedInUserCanReadHistory(true);
      setOffers(mockOfferHistory);

      return;
    }

    // If there is a membership id at the end of the url, it will get passed down through props

    /* There are four situations we need to handle before we make this platform call:
     * admin user looking at another user's history - membershipId exists and hasPrivateDataReadPermissions
     * admin user looking at their own history - no membershipId or id matches the admin's and hasPrivateDataReadPermissions
     * user looking at their own history - no membershipId or canViewHistory
     * user looking at another person's history - membershipId and !canViewHistory
     */
    const canViewHistory =
      (props.membershipId && props.membershipId === loggedInUserMembershipId) ||
      loggedInUserAcls.includes(AclEnum.BNextPrivateUserDataReader);
    const hasPrivateDataReadPermissions = loggedInUserAcls.includes(
      AclEnum.BNextPrivateUserDataReader
    );

    if (canViewHistory || !props.membershipId) {
      setLoggedInUserCanReadHistory(true);

      hasPrivateDataReadPermissions && props.membershipId
        ? Platform.TokensService.GetUserOfferHistory(props.membershipId)
            .then(setOffers)
            .catch(ConvertToPlatformError)
            .catch(Modal.error)
        : Platform.TokensService.GetCurrentUserOfferHistory()
            .then((response) => {
              setOffers(
                response.filter((o) => o.OfferKey !== "goliath_alpha_access")
              );
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e));
    }
  }, [
    loggedInUserAclKey,
    loggedInUserMembershipId,
    props.membershipId,
    usingMockRewards,
  ]);

  const _showRedeemModal = (offer: Contracts.OfferHistoryResponse) => {
    const hasDestinyAccount =
      codesDataStorePayload.userMemberships?.length > 0 &&
      codesDataStorePayload.userMemberships?.[0] !== BungieMembershipType.None;
    const noDestinyAccountsErrorMessage = (
      <>
        {Localizer.FormatReact(
          Localizer.Coderedemption.LinkedDestinyAccountRequiredHistory,
          {
            settings: (
              <Anchor
                url={RouteHelper.Settings({ category: "Accounts" })}
                sameTab={false}
              >
                {Localizer.Coderedemption.settingsLinkLabel}
              </Anchor>
            ),
            codeHistory: (
              <Anchor url={RouteHelper.CodeHistoryReact()} sameTab={false}>
                {Localizer.Coderedemption.RedemptionHistoryLinkLabel}
              </Anchor>
            ),
          }
        )}
      </>
    );
    const helpErrorMessage = (
      <>
        {Localizer.FormatReact(Localizer.Coderedemption.HelpForumsMessage, {
          helpLink: (
            <Anchor url={RouteHelper.Help()} sameTab={false}>
              {Localizer.Coderedemption.helpLinkLabel}
            </Anchor>
          ),
        })}
      </>
    );

    const twoLineItem = (
      <TwoLineItem
        normalWhiteSpace
        itemTitle={<SafelySetInnerHTML html={offer.OfferDisplayName} />}
        itemSubtitle={<SafelySetInnerHTML html={offer.OfferDisplayDetail} />}
        icon={<img className={styles.offerIcon} src={offer.OfferImagePath} />}
      />
    );

    hasDestinyAccount
      ? ConfirmationModal.show({
          type: "none",
          children:
            offer.RedeemType === OfferRedeemMode.Consumable ? (
              <CodesPlatformSelector twoLineItem={twoLineItem} />
            ) : (
              Localizer.CodeRedemption.NonconsumablePickupSuccess
            ),
          confirmButtonProps: {
            onClick: () => {
              // This should not need to be updated so in such a ham-handed way, however, without it, it passes through "0" for selected membership the first time a platform is selected...
              const mem = CodesDataStore.state.selectedMembership;
              Platform.TokensService.ApplyOfferToCurrentDestinyMembership(
                mem,
                offer.OfferKey
              )
                .then((data) => {
                  if (data.OfferDisplayName) {
                    window.location.reload();
                  }
                })
                .catch(ConvertToPlatformError)
                .catch((e: PlatformError) => Modal.error(e));

              return true;
            },
            labelOverride: null,
          },
        })
      : ConfirmationModal.show({
          type: "warning",
          children: (
            <div className={styles.container}>
              <h1 className={styles.noDestinyTitle}>
                {Localizer.Coderedemption.LinkedDestinyAccountRequiredHeader}
              </h1>
              <h3 className={styles.noDestinyText}>
                {noDestinyAccountsErrorMessage}
              </h3>
              <h3 className={styles.noDestinyText}>{helpErrorMessage}</h3>
            </div>
          ),
          cancelButtonProps: {
            disable: true,
            labelOverride: null,
          },
          confirmButtonProps: {
            labelOverride: Localizer.Coderedemption.ErrorAcknowledge,
          },
        });
  };
  const getFlair = (o: Contracts.OfferHistoryResponse) => {
    switch (_offerOrRedeem(o)) {
      case "date":
        return (
          <div className={styles.date}>
            {_makeDateString(o.OfferPurchaseDate)}
          </div>
        );
      case "pending":
        return Localizer.Coderedemption.pending;
      case "redeem":
        return (
          <Button
            size="medium"
            variant="contained"
            onClick={() => _showRedeemModal(o)}
          >
            {Localizer.Coderedemption.ClickRedeem}
          </Button>
        );
      default:
        return (
          <div className={styles.date}>
            {_makeDateString(o.OfferPurchaseDate)}
          </div>
        );
    }
  };

  return (
    <SystemDisabledHandler systems={["BungieTokens"]}>
      <div className={styles.container}>
        <div className={styles.messages}>
          {!loggedInUserCanReadHistory && (
            <p>{Localizer.Coderedemption.NotYourAccount}</p>
          )}
          {offers.length === 0 && loggedInUserCanReadHistory && (
            <p>{Localizer.Coderedemption.NoResults}</p>
          )}
        </div>
        <div className={styles.offerListContainer}>
          {offers.map((o) => (
            <>
              <div
                className={styles.offerContainer}
                key={`${o.OfferKey}-${o.Code}`}
              >
                <img src={o.OfferImagePath} className={styles.offerIcon} />
                <div className={styles.mobileLineBreak}>
                  <div className={styles.offer}>
                    <div className={styles.offerText}>
                      <Typography
                        className={styles.offerName}
                        color="textPrimary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body1"
                      >
                        <SafelySetInnerHTML html={o.OfferDisplayName} />
                      </Typography>
                      <Typography
                        className={styles.offerDetail}
                        color="textSecondary"
                        component="p"
                        themeVariant="bungie-core"
                        variant="body2"
                      >
                        <SafelySetInnerHTML html={o.OfferDisplayDetail} />
                      </Typography>
                    </div>
                    <Typography
                      className={styles.code}
                      color="Primary"
                      component="p"
                      themeVariant="bungie-core"
                      variant="body2"
                    >
                      {o.Code}
                    </Typography>
                  </div>
                  <div className={styles.flair}>{getFlair(o)}</div>
                </div>
              </div>

              <div className={styles.divider} />
            </>
          ))}
        </div>
      </div>
    </SystemDisabledHandler>
  );
};

const _makeDateString = (date: string) => {
  const d = DateTime.fromISO(date);

  return d?.toFormat("DD", {
    locale: LocalizerUtils.useAltChineseCultureString(
      Localizer.CurrentCultureName
    ),
  });
};
const _offerOrRedeem = (offer: Contracts.OfferHistoryResponse) => {
  if (
    offer.ConsumableQuantity > 0 &&
    (offer.RedeemType === OfferRedeemMode.Unlock ||
      offer.RedeemType === OfferRedeemMode.Consumable)
  ) {
    return "redeem";
  } else if (offer.RedeemType === OfferRedeemMode.Off) {
    return "pending";
  } else {
    return "date";
  }
};
