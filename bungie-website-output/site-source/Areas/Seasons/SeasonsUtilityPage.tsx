// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { SeasonsDestinyMembershipDataStore } from "@Areas/Seasons/DataStores/SeasonsDestinyMembershipDataStore";
import { DataStore } from "@bungie/datastore";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { DestinyComponentType, PlatformErrorCodes } from "@Enum";
import { DestinyMembershipDataStorePayload } from "@Global/DataStore/DestinyMembershipDataStore";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Actions, Components, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import seasonItemModalStyles from "./Progress/SeasonItemModal.module.scss";
import { SpinnerContainer, SpinnerDisplayMode } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
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

type Props = ISeasonsUtilityPageProps;

interface ISeasonsUtilityPageState {
  destinyMembershipData: DestinyMembershipDataStorePayload;
  itemDetailCanClaim: boolean;
  itemDetailModalOpen: boolean;
  itemDetailLoading: boolean;
  itemDetailElement: Element;
  itemDetailHash: number;
  itemDetailRewardIndex: number;
  itemDetailClaiming: boolean;
  itemClaimed: IClaimedReward;
  characterProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent;
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
  private readonly destroy: DestroyCallback[] = [];

  private static readonly InitialState: ISeasonsUtilityPageState = {
    destinyMembershipData: SeasonsDestinyMembershipDataStore.state,
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
    characterProgressions: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = SeasonsUtilityPage.InitialState;
  }

  public componentDidMount() {
    this.destroy.push(
      SeasonsDestinyMembershipDataStore.observe((destinyMembershipData) => {
        this.setState({
          destinyMembershipData,
        });
      })
    );

    SeasonsDestinyMembershipDataStore.actions.loadUserData();
  }

  public componentDidUpdate(
    prevProps: Props,
    prevState: ISeasonsUtilityPageState
  ) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(this.props.globalState);

    if (
      this.state.destinyMembershipData?.selectedMembership &&
      prevState.destinyMembershipData?.selectedMembership?.membershipId !==
        this.state.destinyMembershipData?.selectedMembership?.membershipId
    ) {
      const {
        membershipId,
        membershipType,
      } = this.state.destinyMembershipData?.selectedMembership;

      Platform.Destiny2Service.GetProfile(membershipType, membershipId, [
        DestinyComponentType.CharacterProgressions,
      ])
        .then((data) => {
          this.setState({
            characterProgressions: data?.characterProgressions,
          });
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          if (e.errorCode === PlatformErrorCodes.DestinyAccountNotFound) {
            Modal.open(Localizer.Seasons.PlayDestiny2ToUnlock);
          } else {
            Modal.error(e);
          }
        });
    }

    // if user logs in then need to load everything
    if (!wasAuthed && isNowAuthed) {
      SeasonsDestinyMembershipDataStore.actions.loadUserData(undefined, true);
    }

    //user logs out
    if (wasAuthed && !isNowAuthed) {
      this.setState(SeasonsUtilityPage.InitialState);
    }
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroy);
  }

  public render() {
    const isAnonymous = !UserUtils.isAuthenticated(this.props.globalState);

    if (
      ConfigUtils.SystemStatus("AccountServices") &&
      !isAnonymous &&
      !this.state.destinyMembershipData?.loaded
    ) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }

    const { characterProgressions } = this.state;

    const {
      loaded,
      membershipData,
      memberships,
      characters,
      selectedCharacter,
      selectedMembership,
      isCrossSaved,
    } = this.state.destinyMembershipData;

    const charactersLoaded =
      !isAnonymous && loaded && characters && characterProgressions;

    const forCharacter =
      selectedCharacter?.characterId !== ""
        ? characterProgressions?.data[selectedCharacter?.characterId]
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
            className={seasonItemModalStyles.seasonItemModal}
            contentClassName={seasonItemModalStyles.modalContent}
            onClose={this.closeItemDetailModal}
          >
            <div
              className={seasonItemModalStyles.itemModal}
              dangerouslySetInnerHTML={sanitizeHTML(
                this.state.itemDetailElement
                  ?.getElementsByTagName("template")
                  ?.item(0)?.innerHTML
              )}
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
                memberships !== null &&
                charactersLoaded && (
                  <SeasonsPageNav
                    characterId={selectedCharacter?.characterId}
                    seasonHash={seasonHash}
                    characterProgressions={forCharacter?.progressions}
                    platformProgression={characterProgressions}
                    membershipType={selectedMembership?.membershipType}
                  />
                )}
            </SystemDisabledHandler>
            {UserUtils.isAuthenticated(this.props.globalState) &&
              (memberships === null || !charactersLoaded) && (
                <SeasonsPageNav seasonHash={seasonHash} />
              )}
            <div className={styles.seasonInfoContainer}>
              <SeasonHeader seasonHash={seasonHash} />

              {UserUtils.isAuthenticated(this.props.globalState) &&
                memberships === null && (
                  <Button
                    buttonType={"gold"}
                    url={RouteHelper.ProfileSettings(
                      this.props.globalState?.loggedInUser?.user?.membershipId,
                      "Accounts"
                    )}
                  >
                    {Localizer.Seasons.LinkADestinyAccountTo}
                  </Button>
                )}

              {charactersLoaded && (
                <DestinyAccountWrapper
                  membershipDataStore={SeasonsDestinyMembershipDataStore}
                >
                  {({
                    platformSelector,
                    characterSelector,
                  }: IAccountFeatures) => (
                    <div className={styles.dropdownFlexWrapper}>
                      {platformSelector}
                      {characterSelector}
                    </div>
                  )}
                </DestinyAccountWrapper>
              )}
            </div>

            <SeasonPassRewardProgression
              seasonHash={seasonHash}
              characterClassHash={
                charactersLoaded
                  ? characters[selectedCharacter?.characterId]?.classHash
                  : 0
              }
              characterProgressions={
                charactersLoaded ? forCharacter?.progressions : undefined
              }
              handleClaimingClick={(itemHash, rewardIndex, canClaim) =>
                this.openItemDetailModal(itemHash, rewardIndex, canClaim)
              }
              claimedReward={this.state.itemClaimed}
            />

            {charactersLoaded && !isCurrentSeason && (
              <RedeemSeasonRewards
                characterId={selectedCharacter?.characterId}
                seasonHash={seasonHash}
                platformProgressions={characterProgressions}
                characterProgressions={forCharacter?.progressions}
                membershipType={selectedMembership?.membershipType}
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
    const {
      selectedCharacter,
      selectedMembership,
    } = this.state.destinyMembershipData;

    if (!this.state.itemDetailClaiming) {
      this.setState({ itemDetailClaiming: true });

      const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
        characterId: selectedCharacter?.characterId,
        membershipType: selectedMembership?.membershipType,
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

  private readonly closeItemDetailModal = () => {
    this.setState({
      itemDetailModalOpen: false,
      itemDetailElement: null,
      itemDetailRewardIndex: 0,
      itemDetailHash: 0,
      itemDetailCanClaim: false,
    });
  };
}

export default withGlobalState(SeasonsUtilityPage, [
  "loggedInUser",
  "crossSavePairingStatus",
]);
