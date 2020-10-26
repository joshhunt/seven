// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Platform, Contracts, CrossSave } from "@Platform";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Localizer } from "@Global/Localizer";
import moment from "moment/moment";
import styles from "./CodesHistoryForm.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { OfferRedeemMode, BungieMembershipType, AclEnum } from "@Enum";
import CodesPlatformSelectModal from "./CodesPlatformSelectModal";
import ConfirmationModal from "@UI/UIKit/Controls/Modal/ConfirmationModal";
import { DestroyCallback, DataStore } from "@Global/DataStore";
import { ICodesState, CodesDataStore } from "../CodesDataStore";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { PermissionsGate } from "@UI/User/PermissionGate";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";

interface ICodesHistoryFormProps
  extends GlobalStateComponentProps<"loggedInUser"> {
  crossSaveStatus: CrossSave.CrossSavePairingStatus;
  membershipId?: string;
}

interface ICodesHistoryFormState {
  offers: Contracts.OfferHistoryResponse[];
  CodesDataStorePayload: ICodesState;
  loggedInUserCanReadHistory: boolean;
}

/**
 * CodesHistoryForm - Replace this description
 *  *
 * @param {ICodesHistoryFormProps} props
 * @returns
 */
export class CodesHistoryFormInner extends React.Component<
  ICodesHistoryFormProps,
  ICodesHistoryFormState
> {
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICodesHistoryFormProps) {
    super(props);

    this.state = {
      offers: null,
      CodesDataStorePayload: CodesDataStore.state,
      loggedInUserCanReadHistory: false,
    };
  }

  public componentDidMount() {
    // If there is a membership id at the end of the url, it will get passed down through props
    const { membershipId } = this.props;
    const { loggedInUser } = this.props.globalState;

    /* There are four situations we need to handle before we make this platform call:
     * admin user looking at another user's history - membershipId exists and hasPrivateDataReadPermissions
     * admin user looking at their own history - no membershipId or id matches the admin's and hasPrivateDataReadPermissions
     * user looking at their own history - no membershipId or canViewHistory
     * user looking at another person's history - membershipId and !canViewHistory
     */
    const canViewHistory =
      (membershipId && membershipId === loggedInUser.user.membershipId) ||
      loggedInUser.userAcls.includes(AclEnum.BNextPrivateUserDataReader);
    const hasPrivateDataReadPermissions = loggedInUser.userAcls.includes(
      AclEnum.BNextPrivateUserDataReader
    );

    if (canViewHistory || !membershipId) {
      this.setState({ loggedInUserCanReadHistory: true });
      hasPrivateDataReadPermissions && membershipId
        ? Platform.TokensService.GetUserOfferHistory(membershipId)
            .then((offers) => {
              this.setState({
                offers,
              });
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e))
        : Platform.TokensService.GetCurrentUserOfferHistory()
            .then((offers) => {
              this.setState({
                offers,
              });
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e));
    }

    this.subs.push(
      CodesDataStore.observe(
        (data) => {
          data &&
            this.setState({
              CodesDataStorePayload: data,
            });
        },
        null,
        true
      )
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  public makeDateString(date) {
    const d = moment.utc(date);
    const dateString = Localizer.Format(Localizer.Time.MonthDayYear, {
      month: d.format("MMM"),
      day: d.format("DD"),
      year: d.format("YYYY"),
    });

    return dateString;
  }

  public offerOrRedeem(offer: Contracts.OfferHistoryResponse) {
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
  }

  private readonly showRedeemModal = (
    offer: Contracts.OfferHistoryResponse
  ) => {
    const {
      selectedPlatform,
      userPlatforms,
    } = this.state.CodesDataStorePayload;
    const hasDestinyAccount =
      userPlatforms &&
      userPlatforms.length > 0 &&
      userPlatforms[0] !== BungieMembershipType.None;
    const noDestinyAccountsErrorMessage = Localizer.FormatReact(
      Localizer.Coderedemption.LinkedDestinyAccountRequiredHistory,
      {
        settings: (
          <Anchor
            url={RouteHelper.Settings({ category: "Accounts" })}
            className={styles.link}
            sameTab={false}
          >
            {" "}
            {Localizer.Coderedemption.settingsLinkLabel}{" "}
          </Anchor>
        ),
        codeHistory: (
          <Anchor
            url={RouteHelper.CodeHistoryReact()}
            className={styles.link}
            sameTab={false}
          >
            {" "}
            {Localizer.Coderedemption.RedemptionHistoryLinkLabel}{" "}
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
        icon={
          <img
            src={offer.OfferImagePath}
            style={{ width: "2.5rem", height: "2.5rem" }}
          />
        }
      />
    );

    hasDestinyAccount
      ? ConfirmationModal.show({
          type: "none",
          children:
            offer.RedeemType === OfferRedeemMode.Consumable ? (
              <CodesPlatformSelectModal
                twoLineItem={twoLineItem}
                crossSaveStatus={this.props.crossSaveStatus}
              />
            ) : (
              <div>{Localizer.CodeRedemption.NonconsumablePickupSuccess}</div>
            ),
          confirmButtonProps: {
            onClick: () => {
              Platform.TokensService.ApplyOfferToCurrentDestinyMembership(
                selectedPlatform,
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

  public render() {
    return (
      <SystemDisabledHandler systems={["BungieTokens"]}>
        {this.state.loggedInUserCanReadHistory ? (
          <div>
            {this.state.offers && this.state.offers.length > 0 ? (
              // For each offer, decide whether to show the date, a "redeem" button or "pending" as the flair
              this.state.offers.map((o, i) => {
                let flair = null;

                switch (this.offerOrRedeem(o)) {
                  case "date":
                    flair = (
                      <div style={{ minWidth: "26%" }}>
                        {this.makeDateString(o.OfferPurchaseDate)}
                      </div>
                    );
                    break;
                  case "pending":
                    flair = <div>{Localizer.Coderedemption.pending}</div>;
                    break;
                  case "redeem":
                    flair = (
                      <Button
                        size={BasicSize.Small}
                        onClick={() => this.showRedeemModal(o)}
                      >
                        {Localizer.Coderedemption.ClickRedeem}
                      </Button>
                    );
                    break;
                  default:
                    flair = (
                      <div style={{ minWidth: "26%" }}>
                        {this.makeDateString(o.OfferPurchaseDate)}
                      </div>
                    );
                }
                {
                  // Show offer in a two line item with the correct flair
                }

                return (
                  <div key={i}>
                    <TwoLineItem
                      itemTitle={o.OfferDisplayName}
                      itemSubtitle={o.OfferDisplayDetail}
                      icon={
                        <img
                          src={o.OfferImagePath}
                          style={{ width: "2.5rem", height: "2.5rem" }}
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
            )}
          </div>
        ) : (
          // if this isn't your membershipId in the url or you're not an admin, you don't get to see the history!
          <div>
            <p className={styles.noResponse}>
              {Localizer.Coderedemption.NotYourAccount}
            </p>
          </div>
        )}
      </SystemDisabledHandler>
    );
  }
}

export const CodesHistoryForm = withGlobalState(CodesHistoryFormInner, [
  "loggedInUser",
]);
