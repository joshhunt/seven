// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Localizer } from "@Global/Localizer";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Tokens, Platform } from "@Platform";
import moment from "moment";
import { UserUtils } from "@Utilities/UserUtils";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import styles from "./PartnerRewards.module.scss";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { SystemNames } from "@Global/SystemNames";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { AclEnum } from "@Enum";

interface IPartnerRewardsRouteParams {
  membershipId: string;
}

interface IPartnerRewardsProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps<IPartnerRewardsRouteParams> {}

interface IPartnerRewardsState {
  rewards: Tokens.PartnerOfferSkuHistoryResponse[];
  loggedInUserCanReadHistory: boolean;
}

/**
 * PartnerRewards - Replace this description
 *  *
 * @param {IPartnerRewardsProps} props
 * @returns
 */
class PartnerRewards extends React.Component<
  IPartnerRewardsProps,
  IPartnerRewardsState
> {
  private readonly appIds = [
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
  ];

  constructor(props: IPartnerRewardsProps) {
    super(props);

    this.state = {
      rewards: null,
      loggedInUserCanReadHistory: false,
    };
  }

  public componentDidMount() {
    this.getRewardsHistory();
  }

  public componentDidUpdate(prevProps: IPartnerRewardsProps) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(this.props.globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      this.getRewardsHistory();
    }
  }

  private readonly getRewardsHistory = () => {
    // Get membershipId from url if it is provided - this is so admins can view a user's partner rewards history too
    const { membershipId } = this.props.match.params;
    const { loggedInUser } = this.props.globalState;

    if (ConfigUtils.SystemStatus("PartnerOfferClaims")) {
      if (
        UserUtils.isAuthenticated(this.props.globalState) &&
        (this.appIds[0] !== 0 || this.appIds[1] !== 0)
      ) {
        const canViewHistory =
          (membershipId && membershipId === loggedInUser.user.membershipId) ||
          loggedInUser.userAcls.includes(AclEnum.BNextPrivateUserDataReader);
        const hasPrivateDataReadPermissions = loggedInUser.userAcls.includes(
          AclEnum.BNextPrivateUserDataReader
        );
        // if there isn't a parameter in the url, provide history for the logged in user
        // otherwise use the membershipId provided but only for people with permission to see that user's history
        if (canViewHistory || !membershipId) {
          this.setState({ loggedInUserCanReadHistory: true });
          const membershipIdUsedForHistory =
            hasPrivateDataReadPermissions && membershipId
              ? membershipId
              : UserUtils.loggedInUserMembershipIdFromCookie;

          this.appIds[0] &&
            Platform.TokensService.GetPartnerOfferSkuHistory(
              this.appIds[0],
              membershipIdUsedForHistory
            )
              .then((data) => this.setState({ rewards: data }))
              .catch(ConvertToPlatformError)
              .catch((e: PlatformError) => Modal.error(e));

          this.appIds[1] &&
            Platform.TokensService.GetPartnerOfferSkuHistory(
              this.appIds[1],
              membershipIdUsedForHistory
            )
              .then((data) => this.setState({ rewards: data }))
              .catch(ConvertToPlatformError)
              .catch((e: PlatformError) => Modal.error(e));
        }
      }
    }
  };

  private readonly makeDateString = (date) => {
    const d = moment.utc(date);
    const dateString = Localizer.Format(Localizer.Time.MonthDayYear, {
      month: d.format("MMM"),
      day: d.format("DD"),
      year: d.format("YYYY"),
    });

    return dateString;
  };

  private readonly claimRewards = () => {
    let modalShown = false;

    this.appIds[0] &&
      Platform.TokensService.ApplyMissingPartnerOffersWithoutClaim(
        this.appIds[0],
        UserUtils.loggedInUserMembershipIdFromCookie
      )
        .then((rewardsWereClaimed) => {
          rewardsWereClaimed &&
            Modal.open(Localizer.PartnerOffers.ClaimSuccessMessage);
          modalShown = true;
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => Modal.error(e));

    this.appIds[1] &&
      Platform.TokensService.ApplyMissingPartnerOffersWithoutClaim(
        this.appIds[1],
        UserUtils.loggedInUserMembershipIdFromCookie
      )
        .then(
          (rewardsWereClaimed) =>
            rewardsWereClaimed &&
            !modalShown &&
            Modal.open(Localizer.PartnerOffers.ClaimSuccessMessage)
        )
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => Modal.error(e));
  };

  public render() {
    return (
      <SystemDisabledHandler systems={["PartnerOfferClaims"]}>
        <RequiresAuth>
          <BungieHelmet
            title={Localizer.CodeRedemption.PartnerRewards}
            image={"/7/ca/bungie/bgs/pcregister/engram.jpg"}
          >
            <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
          </BungieHelmet>

          {this.state.loggedInUserCanReadHistory ? (
            <div>
              {this.state.rewards && this.state.rewards[0] ? (
                this.state.rewards.map((r, i) => {
                  return (
                    <div key={i}>
                      <TwoLineItem
                        itemTitle={r.LocalizedName}
                        itemSubtitle={r.LocalizedDescription}
                        flair={
                          r.AllOffersApplied ? (
                            <div>{this.makeDateString(r.ClaimDate)}</div>
                          ) : (
                            <Button
                              size={BasicSize.Small}
                              onClick={() => this.claimRewards()}
                            >
                              {Localizer.PartnerOffers.Claim}
                            </Button>
                          )
                        }
                      />
                    </div>
                  );
                })
              ) : (
                <p className={styles.noResults}>
                  {Localizer.Coderedemption.NoResults}
                </p>
              )}
            </div>
          ) : (
            // if this isn't your membershipId in the url or you're not an admin, you don't get to see my rewards
            <div>
              <p className={styles.noResults}>
                {Localizer.PartnerOffers.NotYourAccount}
              </p>
            </div>
          )}
        </RequiresAuth>
      </SystemDisabledHandler>
    );
  }
}

const PartnerRewardsOuter = withGlobalState(PartnerRewards, ["loggedInUser"]);
export default withRouter(PartnerRewardsOuter);
