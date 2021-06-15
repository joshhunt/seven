// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Actions, Platform, Responses, User } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import SeasonCalendar from "./Progress/SeasonCalendar";
import SeasonHeader from "./Progress/SeasonHeader";
import SeasonPassRewardProgression from "./Progress/SeasonPassRewardProgression";
import SeasonsPageNav from "./Progress/SeasonsPageNav";
import RedeemSeasonRewards from "./Redeem/RedeemSeasonRewards";
import styles from "./SeasonsUtilityPage.module.scss";

export interface IClaimedReward {
  rewardIndex: number;
  itemHash: number;
}

// Required props
interface ISeasonsUtilityPageProps
  extends GlobalStateComponentProps<"loggedInUser" | "crossSavePairingStatus"> {
  seasonHash: number;
}

// Default props - these will have values set in SeasonsUtilityPage.defaultProps
interface DefaultProps {}

type Props = ISeasonsUtilityPageProps & DefaultProps;

interface ISeasonsUtilityPageState {
  memberships: User.UserMembershipData;
  profileResponse: Responses.DestinyProfileResponse;

  isLoading: boolean;
  characterId: string;
  currentMembershipType: BungieMembershipType;

  itemDetailCanClaim: boolean;
  itemDetailModalOpen: boolean;
  itemDetailLoading: boolean;
  itemDetailElement: Element;
  itemDetailHash: number;
  itemDetailRewardIndex: number;
  itemDetailClaiming: boolean;
  itemClaimed: IClaimedReward;
}

/**
 * SeasonsUtilityPage - Base Season Utility Page
 *  *
 * @param {ISeasonsUtilityPageProps} props
 * @returns
 */
class SeasonsUtilityPage extends React.Component<
  Props,
  ISeasonsUtilityPageState
> {
  private static readonly InitialState: ISeasonsUtilityPageState = {
    memberships: null,
    profileResponse: null,
    characterId: "",
    isLoading: false,
    currentMembershipType: null,
    itemDetailCanClaim: false,
    itemDetailModalOpen: false,
    itemDetailLoading: false,
    itemDetailElement: null,
    itemDetailRewardIndex: 0,
    itemDetailHash: 0,
    itemDetailClaiming: false,
    itemClaimed: {
      itemHash: 0,
      rewardIndex: 0,
    },
  };

  constructor(props: Props) {
    super(props);

    this.state = SeasonsUtilityPage.InitialState;

    this.closeItemDetailModal = this.closeItemDetailModal.bind(this);
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    this.loadUserData();
  }

  public componentDidUpdate(prevProps: Props) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(this.props.globalState);

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      this.loadUserData(true);
    }

    //user logs out
    if (wasAuthed && !isNowAuthed) {
      this.setState(SeasonsUtilityPage.InitialState);
    }
  }

  private get characters() {
    return (
      this.state.profileResponse &&
      this.state.profileResponse.characters &&
      this.state.profileResponse.characters.data
    );
  }

  public render() {
    const isAnonymous = !UserUtils.isAuthenticated(this.props.globalState);

    if (this.state.isLoading) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }

    const charactersLoaded =
      !isAnonymous &&
      this.state.profileResponse &&
      this.characters &&
      typeof this.state.profileResponse.characterProgressions !== "undefined";

    const forCharacter =
      this.state.characterId !== ""
        ? this.state.profileResponse.characterProgressions.data[
            this.state.characterId
          ]
        : null;

    const seasonHash = this.props.seasonHash;

    const isCurrentSeason =
      seasonHash ===
      this.props.globalState.coreSettings.destiny2CoreSettings
        .currentSeasonHash;

    return (
      <React.Fragment>
        {this.state.itemDetailElement !== null && (
          <Modal
            open={this.state.itemDetailModalOpen}
            className={styles.itemDetailModal}
            contentClassName={styles.itemDetailModalContent}
            onClose={this.closeItemDetailModal}
          >
            <div
              className={styles.itemModal}
              dangerouslySetInnerHTML={{
                __html: this.state.itemDetailElement
                  .getElementsByTagName("template")
                  .item(0).innerHTML,
              }}
            />
            {charactersLoaded &&
              !isCurrentSeason &&
              this.state.itemDetailCanClaim && (
                <div className={styles.buttonHolder}>
                  <Button
                    buttonType={"gold"}
                    onClick={() => this.claimFromModal()}
                    disabled={this.state.itemDetailClaiming}
                    loading={this.state.itemDetailClaiming}
                  >
                    {Localizer.Seasons.Claim}
                  </Button>
                </div>
              )}
          </Modal>
        )}

        <Grid>
          <GridCol cols={12}>
            <SystemDisabledHandler systems={["Destiny2"]}>
              {UserUtils.isAuthenticated(this.props.globalState) &&
                this.state.memberships !== null &&
                charactersLoaded && (
                  <SeasonsPageNav
                    characterId={this.state.characterId}
                    seasonHash={seasonHash}
                    characterProgressions={forCharacter.progressions}
                    platformProgression={
                      this.state.profileResponse.characterProgressions
                    }
                    membershipType={
                      this.state.profileResponse.profile.data.userInfo
                        .membershipType
                    }
                  />
                )}
            </SystemDisabledHandler>
            {UserUtils.isAuthenticated(this.props.globalState) &&
              (this.state.memberships === null || !charactersLoaded) && (
                <SeasonsPageNav seasonHash={seasonHash} />
              )}
            <div className={styles.seasonInfoContainer}>
              <SeasonHeader seasonHash={seasonHash} />

              <RequiresAuth />

              {UserUtils.isAuthenticated(this.props.globalState) &&
                this.state.memberships === null && (
                  <Button
                    buttonType={"gold"}
                    url={RouteHelper.ProfileSettings(
                      this.props.globalState.loggedInUser.user.membershipId,
                      "Accounts"
                    )}
                  >
                    {Localizer.Seasons.LinkADestinyAccountTo}
                  </Button>
                )}

              {charactersLoaded && (
                <DestinyAccountWrapper>
                  {({
                    platformSelector,
                    characterSelector,
                    bnetProfile,
                  }: IAccountFeatures) => (
                    <div className={styles.dropdownFlexWrapper}>
                      {platformSelector}
                      {characterSelector}
                    </div>
                  )}
                </DestinyAccountWrapper>
              )}
            </div>

            {charactersLoaded && (
              <SeasonPassRewardProgression
                seasonHash={seasonHash}
                characterClassHash={
                  charactersLoaded
                    ? this.characters[this.state.characterId].classHash
                    : 0
                }
                characterProgressions={
                  charactersLoaded ? forCharacter.progressions : undefined
                }
                handleClick={(itemHash, rewardIndex, canClaim) =>
                  this.openItemDetailModal(itemHash, rewardIndex, canClaim)
                }
                claimedReward={this.state.itemClaimed}
              />
            )}

            {charactersLoaded && !isCurrentSeason && (
              <RedeemSeasonRewards
                characterId={this.state.characterId}
                seasonHash={seasonHash}
                platformProgressions={
                  this.state.profileResponse.characterProgressions
                }
                characterProgressions={forCharacter.progressions}
                membershipType={
                  this.state.profileResponse.profile.data.userInfo
                    .membershipType
                }
                handleClick={(itemHash, rewardIndex, canClaim) =>
                  this.openItemDetailModal(itemHash, rewardIndex, canClaim)
                }
                itemClaimed={(itemHash: number, rewardIndex: number) =>
                  this.markItemClaimed(itemHash, rewardIndex)
                }
                claimedReward={this.state.itemClaimed}
              />
            )}
          </GridCol>
        </Grid>
        {isCurrentSeason && <SeasonCalendar seasonHash={seasonHash} />}
      </React.Fragment>
    );
  }

  private async loadUserData(forceReload = false) {
    let memberships = this.state.memberships;
    if (!memberships || forceReload) {
      memberships = await Platform.UserService.GetMembershipDataForCurrentUser();
    }

    const isCrossSaved =
      typeof this.props.globalState.crossSavePairingStatus !== "undefined" &&
      typeof this.props.globalState.crossSavePairingStatus
        .primaryMembershipType !== "undefined";

    let membership = memberships.destinyMemberships[0];

    if (isCrossSaved) {
      membership = memberships.destinyMemberships.find(
        (a) =>
          a.membershipType ===
          this.props.globalState.crossSavePairingStatus.primaryMembershipType
      );
    } else if (this.state.currentMembershipType) {
      membership = memberships.destinyMemberships.find(
        (a) => a.membershipType === this.state.currentMembershipType
      );
    }

    let profileResponse: Responses.DestinyProfileResponse = null;
    let targetCharacterId = "";

    if (typeof membership === "undefined") {
      // rare instance of bnet users without destiny membership, show the anonymous view

      this.setState({
        isLoading: false,
      });

      return;
    }

    try {
      profileResponse = await Platform.Destiny2Service.GetProfile(
        membership.membershipType,
        membership.membershipId,
        [
          DestinyComponentType.Profiles,
          DestinyComponentType.CharacterProgressions,
          DestinyComponentType.Characters,
        ]
      );

      const hasCharacterData =
        typeof profileResponse.characters !== "undefined" &&
        typeof profileResponse.characters.data !== "undefined";

      if (hasCharacterData) {
        targetCharacterId = Object.keys(profileResponse.characters.data)[0];
      }
    } catch {
      this.setState({
        isLoading: false,
      });

      console.log(
        `There was an error getting Destiny info for ${membership.displayName}(${membership.membershipId}): ${membership.membershipType}`
      );
    }

    this.setState({
      currentMembershipType: membership.membershipType,
      memberships,
      isLoading: false,
      profileResponse,
      characterId: targetCharacterId,
    });
  }

  private updateCharacter(characterId: string) {
    this.setState({
      characterId: characterId,
    });
  }

  private async updatePlatform(platform: string) {
    if (
      platform !==
      EnumUtils.getStringValue(
        this.state.currentMembershipType,
        BungieMembershipType
      )
    ) {
      this.setState({
        isLoading: true,
      });

      const matchingAccount = this.state.memberships.destinyMemberships.find(
        (value) =>
          EnumUtils.looseEquals(
            value.membershipType,
            platform,
            BungieMembershipType
          )
      );

      //set the new membership, and clear out the outdated profileResponse so that it will update
      this.setState(
        {
          currentMembershipType: matchingAccount.membershipType,
          characterId: "",
        },
        () => this.loadUserData()
      );
    }
  }

  private async openItemDetailModal(
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) {
    //add loading spinner
    this.setState({
      itemDetailHash: itemHash,
      itemDetailLoading: true,
      itemDetailModalOpen: true,
      itemDetailRewardIndex: rewardIndex,
      itemDetailCanClaim: canClaim,
    });

    const response = await fetch(
      `/${Localizer.CurrentCultureName}/Gear/ItemSummary/${itemHash}`
    );

    const myJson = await response.text();

    const doc = new DOMParser().parseFromString(myJson, "text/html");

    this.setState({
      itemDetailLoading: false,
      itemDetailElement: doc.getElementById("gear-item-summary-container"),
    });
  }

  private claimFromModal() {
    if (!this.state.itemDetailClaiming) {
      this.setState({ itemDetailClaiming: true });

      const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
        characterId: this.state.characterId,
        membershipType: this.state.currentMembershipType,
        rewardIndex: this.state.itemDetailRewardIndex,
        seasonHash: this.props.seasonHash,
      };

      Platform.Destiny2Service.ClaimSeasonPassReward(input)
        .then(() => {
          this.setState({
            itemDetailClaiming: false,
            itemDetailModalOpen: false,
            itemClaimed: {
              itemHash: this.state.itemDetailHash,
              rewardIndex: this.state.itemDetailRewardIndex,
            },
          });
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          this.setState({
            itemDetailClaiming: false,
          });

          this.closeItemDetailModal();

          Modal.error(e);
        });
    }
  }

  private markItemClaimed(itemHash: number, rewardIndex: number) {
    if (
      typeof this.state.itemClaimed === "undefined" ||
      (typeof this.state.itemClaimed !== "undefined" &&
        this.state.itemClaimed.rewardIndex !== rewardIndex)
    ) {
      this.setState({
        itemClaimed: {
          itemHash: itemHash,
          rewardIndex: rewardIndex,
        },
      });
    }
  }

  private closeItemDetailModal() {
    this.setState({
      itemDetailModalOpen: false,
      itemDetailElement: null,
      itemDetailRewardIndex: 0,
      itemDetailHash: 0,
      itemDetailCanClaim: false,
    });
  }
}

export default withGlobalState(SeasonsUtilityPage, [
  "loggedInUser",
  "crossSavePairingStatus",
]);
