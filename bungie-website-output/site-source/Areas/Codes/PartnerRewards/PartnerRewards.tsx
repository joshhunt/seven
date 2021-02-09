// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { AclEnum } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
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
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import moment from "moment";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import styles from "./PartnerRewards.module.scss";

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
      if (UserUtils.isAuthenticated(this.props.globalState)) {
        const canViewHistory =
          (membershipId && membershipId === loggedInUser.user.membershipId) ||
          loggedInUser.userAcls.includes(AclEnum.BNextPrivateUserDataReader);
        const hasPrivateDataReadPermissions = loggedInUser.userAcls.includes(
          AclEnum.BNextPrivateUserDataReader
        );
        // if there isn't a parameter in the url, provide history for the logged in user
        // otherwise use the membershipId provided but only for people with permission to see that user's history)
        if (canViewHistory || !membershipId) {
          this.setState({ loggedInUserCanReadHistory: true });
          const membershipIdUsedForHistory =
            hasPrivateDataReadPermissions && membershipId
              ? membershipId
              : UserUtils.loggedInUserMembershipIdFromCookie;

          // Get history for all partner apps
          const promises = this.appIds.map((id) => {
            return Platform.TokensService.GetPartnerOfferSkuHistory(
              id,
              membershipIdUsedForHistory
            );
          });

          Promise.all(promises)
            .then((dataArray) => {
              let rewards = dataArray.reduce((a, c) => a.concat(c), []);
              rewards = this.sortByDate(rewards);
              this.setState({ rewards });
            })
            .catch(ConvertToPlatformError)
            .catch((e: PlatformError) => Modal.error(e));
        }
      }
    }
  };

  private readonly makeDateString = (date: string) => {
    const d = moment.utc(date);

    return Localizer.Format(Localizer.Time.MonthDayYear, {
      day: d.format("DD"),
      month: d.format("MMM"),
      year: d.format("YYYY"),
    });
  };

  private readonly sortByDate = (
    array: Tokens.PartnerOfferSkuHistoryResponse[]
  ) => {
    return array.sort(
      (a, b) =>
        moment.utc(b.ClaimDate).valueOf() - moment.utc(a.ClaimDate).valueOf()
    );
  };

  private readonly claimRewards = () => {
    let modalShown = false;
    // Get history for all partner apps
    this.appIds.forEach((i) => {
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

          {this.state.loggedInUserCanReadHistory && (
            <div>
              {this.state.rewards?.map((r, i) => (
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
              ))}
              {!this.state.rewards?.length && (
                <p className={styles.noResults}>
                  {Localizer.Coderedemption.NoResults}
                </p>
              )}
            </div>
          )}

          {
            // if this isn't your membershipId in the url or you're not an admin, you don't get to see my rewards
            !this.state.loggedInUserCanReadHistory && (
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
  }
}

const PartnerRewardsOuter = withGlobalState(PartnerRewards, ["loggedInUser"]);
export default withRouter(PartnerRewardsOuter);
