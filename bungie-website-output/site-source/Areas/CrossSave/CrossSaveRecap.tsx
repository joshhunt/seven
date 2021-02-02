// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { BungieMembershipType, DestinyGameVersions } from "@Enum";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinyHeader } from "@UI/Destiny/DestinyHeader";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { CrossSaveAccountCard } from "./Activate/Components/CrossSaveAccountCard";
import { CrossSaveAccountLinkItem } from "./Activate/Components/CrossSaveAccountLinkItem";
import { CrossSaveSilverBalance } from "./Activate/Components/CrossSaveSilverBalance";
import styles from "./CrossSaveRecap.module.scss";
import { CrossSaveCardHeader } from "./Shared/CrossSaveCardHeader";
import { CrossSaveClanCard } from "./Shared/CrossSaveClanCard";
import {
  CrossSaveFlowStateDataStore,
  CrossSaveValidGameVersions,
  ICrossSaveFlowState,
} from "./Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "./Shared/CrossSaveUtils";

interface ICrossSaveRecapProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"loggedInUser" | "loggedInUserClans"> {}

interface ICrossSaveRecapState {
  flowState: ICrossSaveFlowState;
}

/**
 * CrossSaveRecap - Review an activated Cross Save account
 *  *
 * @param {ICrossSaveRecapProps} props
 * @returns
 */
class CrossSaveRecap extends React.Component<
  ICrossSaveRecapProps,
  ICrossSaveRecapState
> {
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICrossSaveRecapProps) {
    super(props);

    this.state = {
      flowState: CrossSaveFlowStateDataStore.state,
    };
  }

  public componentDidMount() {
    this.subs.push(
      CrossSaveFlowStateDataStore.observe((flowState) => {
        this.setState({
          flowState,
        });
      })
    );
  }

  private entitlementOwned(
    membershipType: BungieMembershipType,
    gameVersion: DestinyGameVersions
  ) {
    const memberShipTypeString = BungieMembershipType[
      membershipType
    ] as EnumStrings<typeof BungieMembershipType>;
    const entitlements = this.state.flowState.entitlements.platformEntitlements[
      memberShipTypeString
    ];

    return (
      entitlements && EnumUtils.hasFlag(gameVersion, entitlements.gameVersions)
    );
  }

  private createBuyOrDownloadLink(gameVersion: DestinyGameVersions) {
    switch (gameVersion) {
      case DestinyGameVersions.Destiny2:
        return RouteHelper.NewLight();
      case DestinyGameVersions.Forsaken:
        return RouteHelper.DestinyBuy({ target: "Forsaken" });
      case DestinyGameVersions.Shadowkeep:
        return RouteHelper.DestinyBuy({ target: "Shadowkeep" });
      default:
        return RouteHelper.DestinyBuy();
    }
  }

  public render() {
    const { flowState } = this.state;

    const { globalState } = this.props;

    const indexPath = RouteDefs.Areas.CrossSave.resolve("Index");
    const isLoggedIn = UserUtils.isAuthenticated(globalState);
    if (!isLoggedIn || (flowState.loaded && !flowState.isActive)) {
      return UrlUtils.PushRedirect(indexPath, this.props);
    }

    const userClans = globalState.loggedInUserClans
      ? globalState.loggedInUserClans.results
      : [];
    const clan = userClans.filter(
      (myClan) =>
        myClan.member.destinyUserInfo.membershipType ===
          flowState.primaryMembershipType && myClan.group.groupType === 1
    )[0];
    const linkedAccounts = flowState.includedMembershipTypes || [];
    const deactivateLink = RouteDefs.Areas.CrossSave.getAction(
      "Deactivate"
    ).resolve();
    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );

    return (
      <SpinnerContainer
        loading={!flowState.loaded}
        delayRenderUntilLoaded={true}
        loadingLabel={Localizer.Crosssave.LoadingCrossSaveData}
      >
        <Grid>
          <GridCol cols={12}>
            <DestinyHeader
              title={Localizer.Crosssave.SystemActive}
              breadcrumbs={[
                Localizer.Crosssave.ActivateCrossSaveHeader,
                Localizer.Crosssave.SubtitleRecapPage,
              ]}
              separator={Localizer.Crosssave.Separator}
            />
            <p className={styles.description}>
              {Localizer.Crosssave.SystemActiveExplanation}
            </p>
          </GridCol>
        </Grid>
        <Grid strictMode={true}>
          <GridCol
            cols={3}
            pico={12}
            tiny={12}
            mobile={9}
            medium={6}
            large={4}
            className={styles.centerWhenSmall}
          >
            <CrossSaveAccountCard
              flowState={flowState}
              membershipType={flowState.primaryMembershipType}
              hideAccountInfo={true}
              showCharacterOrigin={true}
              headerOverride={
                <CrossSaveCardHeader>
                  <h3>{Localizer.Crosssave.CharactersHeader}</h3>
                </CrossSaveCardHeader>
              }
            />
          </GridCol>
          <GridCol
            cols={3}
            pico={12}
            tiny={12}
            mobile={9}
            medium={6}
            large={4}
            className={styles.centerWhenSmall}
          >
            {clan && (
              <CrossSaveAccountCard
                flowState={flowState}
                membershipType={flowState.primaryMembershipType}
                hideAccountInfo={true}
                hideCharacters={true}
                headerOverride={
                  <CrossSaveCardHeader>
                    <h3>{Localizer.Crosssave.ClanHeader}</h3>
                  </CrossSaveCardHeader>
                }
              >
                <CrossSaveClanCard clan={clan} />
              </CrossSaveAccountCard>
            )}
          </GridCol>
        </Grid>
        <Grid>
          <GridCol cols={12}>
            <p className={styles.connectedAccounts}>
              {Localizer.Crosssave.ConnectedAccounts}
            </p>
          </GridCol>
        </Grid>
        <Grid strictMode={true}>
          {pairableMembershipTypes.map((mt) => (
            <GridCol
              key={mt}
              cols={3}
              pico={12}
              tiny={12}
              mobile={9}
              medium={6}
              large={4}
              className={styles.centerWhenSmall}
            >
              {linkedAccounts && linkedAccounts.includes(mt) ? (
                <CrossSaveAccountCard
                  className={styles.entitlementAccountCard}
                  flowState={flowState}
                  membershipType={mt}
                  hideCharacters={true}
                  hideAccountInfo={true}
                >
                  <div className={styles.displayName}>
                    {
                      flowState.pairingStatus.profiles[BungieMembershipType[mt]]
                        .platformDisplayName
                    }
                  </div>
                  <div className={styles.silverContainer}>
                    <CrossSaveSilverBalance
                      crossSaveActive={true}
                      membershipType={mt}
                      flowState={flowState}
                    />
                  </div>
                  <div className={styles.entitlementsContainer}>
                    {CrossSaveValidGameVersions.map((gv) =>
                      this.entitlementOwned(mt, gv) ? (
                        <div key={gv} className={styles.owned}>
                          <Icon
                            className={styles.ownedIcon}
                            iconType={"fa"}
                            iconName={"check"}
                          />
                          {Localizer.Format(Localizer.Crosssave.OwnedLabel, {
                            platformName:
                              Localizer.Crosssave[DestinyGameVersions[gv]],
                          })}
                        </div>
                      ) : (
                        <Button
                          key={gv}
                          size={BasicSize.Small}
                          buttonType={"gold"}
                          url={this.createBuyOrDownloadLink(gv)}
                          className={styles.notOwnedButton}
                          caps={true}
                        >
                          {DestinyGameVersions.Destiny2 === gv
                            ? Localizer.Format(
                                Localizer.Crosssave.DownloadLabel,
                                { platformName: Localizer.Crosssave.Destiny2 }
                              )
                            : Localizer.Format(Localizer.Crosssave.BuyLabel, {
                                platformName:
                                  Localizer.Crosssave[DestinyGameVersions[gv]],
                              })}
                        </Button>
                      )
                    )}
                  </div>
                </CrossSaveAccountCard>
              ) : (
                <CrossSaveAccountLinkItem
                  className={styles.cardNeedsAuth}
                  stateIdentifier={flowState.stateIdentifier}
                  membershipType={mt}
                  flowState={flowState}
                  onAccountLinked={CrossSaveFlowStateDataStore.onAccountLinked}
                  hideAccountInfo={true}
                  linkedCredentialTypes={
                    globalState.loggedInUser.crossSaveCredentialTypes
                  }
                />
              )}
            </GridCol>
          ))}
          <br />
        </Grid>
        <Grid>
          <GridCol cols={12}>
            <div className={styles.deactivateButton}>
              <Button
                buttonType={"red"}
                url={deactivateLink}
                caps={true}
                className={styles.deactivateButton}
              >
                {Localizer.Crosssave.DisableButtonLabel}
              </Button>
            </div>
          </GridCol>
        </Grid>
      </SpinnerContainer>
    );
  }
}

export default withGlobalState(CrossSaveRecap, [
  "loggedInUser",
  "loggedInUserClans",
]);
