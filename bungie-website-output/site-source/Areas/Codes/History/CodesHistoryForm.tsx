// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { CodesDataStore } from "@Areas/Codes/CodesDataStore";
import styles from "@Areas/Codes/History/CodesHistoryForm.module.scss";
import { CodesPlatformSelector } from "@Areas/Codes/History/CodesPlatformSelector";
import { PlatformError } from "@CustomErrors";
import { AclEnum, BungieMembershipType, OfferRedeemMode } from "@Enum";
import { useDataStore } from "@Global/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localizer";
import { Contracts, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Anchor } from "@UI/Navigation/Anchor";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface CodesHistoryFormProps {
  membershipId?: string;
}

export const CodesHistoryForm: React.FC<CodesHistoryFormProps> = (props) => {
  const initialOffers: Contracts.OfferHistoryResponse[] = null;

  const [loggedInUserCanReadHistory, setLoggedInUserCanReadHistory] = useState(
    false
  );
  const [offers, setOffers] = useState(initialOffers);
  const codesDataStorePayload = useDataStore(CodesDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    // If there is a membership id at the end of the url, it will get passed down through props

    /* There are four situations we need to handle before we make this platform call:
     * admin user looking at another user's history - membershipId exists and hasPrivateDataReadPermissions
     * admin user looking at their own history - no membershipId or id matches the admin's and hasPrivateDataReadPermissions
     * user looking at their own history - no membershipId or canViewHistory
     * user looking at another person's history - membershipId and !canViewHistory
     */
    const canViewHistory =
      (props.membershipId &&
        props.membershipId === globalState.loggedInUser.user.membershipId) ||
      globalState.loggedInUser.userAcls.includes(
        AclEnum.BNextPrivateUserDataReader
      );
    const hasPrivateDataReadPermissions = globalState.loggedInUser.userAcls.includes(
      AclEnum.BNextPrivateUserDataReader
    );

    if (canViewHistory || !props.membershipId) {
      setLoggedInUserCanReadHistory(true);

      hasPrivateDataReadPermissions && props.membershipId
        ? Platform.TokensService.GetUserOfferHistory(props.membershipId)
            .then((response) => {
              setOffers(response);
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e))
        : Platform.TokensService.GetCurrentUserOfferHistory()
            .then((response) => {
              setOffers(response);
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e));
    }
  }, []);

  const _showRedeemModal = (offer: Contracts.OfferHistoryResponse) => {
    const hasDestinyAccount =
      codesDataStorePayload.userMemberships?.length > 0 &&
      codesDataStorePayload.userMemberships?.[0] !== BungieMembershipType.None;
    const noDestinyAccountsErrorMessage = Localizer.FormatReact(
      Localizer.Coderedemption.LinkedDestinyAccountRequiredHistory,
      {
        settings: (
          <Anchor
            url={RouteHelper.Settings({ category: "Accounts" })}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.settingsLinkLabel}
          </Anchor>
        ),
        codeHistory: (
          <Anchor
            url={RouteHelper.CodeHistoryReact()}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.RedemptionHistoryLinkLabel}
          </Anchor>
        ),
      }
    );
    const helpErrorMessage = Localizer.FormatReact(
      Localizer.Coderedemption.HelpForumsMessage,
      {
        helpLink: (
          <Anchor
            url={RouteHelper.Help()}
            className={styles.link}
            sameTab={false}
          >
            {Localizer.Coderedemption.helpLinkLabel}
          </Anchor>
        ),
      }
    );

    const twoLineItem = (
      <TwoLineItem
        itemTitle={offer.OfferDisplayName}
        itemSubtitle={offer.OfferDisplayDetail}
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
                    window.location.reload(true);
                  }
                })
                .catch(ConvertToPlatformError)
                .catch((e: PlatformError) => Modal.error(e));

              return true;
            },
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
          },
          confirmButtonProps: {
            labelOverride: Localizer.Coderedemption.ErrorAcknowledge,
          },
        });
  };

  return (
    <SystemDisabledHandler systems={["BungieTokens"]}>
      {loggedInUserCanReadHistory ? (
        <>
          {
            // For each offer, decide whether to show the date, a "redeem" button or "pending" as the flair
            offers?.length > 0 ? (
              offers.map((o, i) => {
                let flair = null;

                switch (_offerOrRedeem(o)) {
                  case "date":
                    flair = (
                      <div className={styles.date}>
                        {_makeDateString(o.OfferPurchaseDate)}
                      </div>
                    );
                    break;
                  case "pending":
                    flair = Localizer.Coderedemption.pending;
                    break;
                  case "redeem":
                    flair = (
                      <Button
                        size={BasicSize.Small}
                        onClick={() => _showRedeemModal(o)}
                      >
                        {Localizer.Coderedemption.ClickRedeem}
                      </Button>
                    );
                    break;
                  default:
                    flair = (
                      <div className={styles.date}>
                        {_makeDateString(o.OfferPurchaseDate)}
                      </div>
                    );
                }

                return (
                  <div key={i}>
                    <TwoLineItem
                      itemTitle={o.OfferDisplayName}
                      itemSubtitle={o.OfferDisplayDetail}
                      icon={
                        <img
                          src={o.OfferImagePath}
                          className={styles.offerIcon}
                        />
                      }
                      flair={flair}
                    />

                    <PermissionsGate
                      permissions={[AclEnum.BNextPrivateUserDataReader]}
                    >
                      <div className={styles.adminCode}>{o.Code}</div>
                    </PermissionsGate>
                  </div>
                );
              })
            ) : (
              <p className={styles.noResponse}>
                {Localizer.Coderedemption.NoResults}
              </p>
            )
          }
        </>
      ) : (
        // if this isn't your membershipId in the url or you're not an admin, you don't get to see the history!
        <p className={styles.noResponse}>
          {Localizer.Coderedemption.NotYourAccount}
        </p>
      )}
    </SystemDisabledHandler>
  );
};

const _makeDateString = (date) => {
  const d = moment.utc(date);
  const dateString = Localizer.Format(Localizer.Time.MonthDayYear, {
    month: d.format("MMM"),
    day: d.format("DD"),
    year: d.format("YYYY"),
  });

  return dateString;
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
