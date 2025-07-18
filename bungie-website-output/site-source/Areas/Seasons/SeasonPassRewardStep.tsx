// Created by atseng, 2019
// Copyright Bungie, Inc.

import { IClaimedReward } from "@Areas/Seasons/SeasonsUtilityPage";
import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { DestinyProgressionRewardItemState, ItemState } from "@Enum";
import DestinyCollectibleDetailItemModalContent from "@UI/Destiny/DestinyCollectibleDetailItemContent";
import { FaLock } from "react-icons/fa";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React from "react";
import seasonItemModalStyles from "./SeasonItemModal.module.scss";
import styles from "./SeasonPassRewardProgression.module.scss";

export type CompleteState = "None" | "Incomplete" | "Complete";
export enum CharacterClass {
  Hunter,
  Titan,
  Warlock,
}

interface CharacterOverrideStateProps {
  [key: number]: {
    rewardItemStats: {
      [key: number]: {
        statHash: number;
        value: number;
      };
    };
    itemState: number;
  };
}

interface ISeasonPassRewardStepProps {
  stepIndex: number;
  progressionDef: DestinyDefinitions.DestinyProgressionDefinition;
  itemDefinitions: DefinitionsFetcherized<"DestinyInventoryItemLiteDefinition">;
  character: CharacterClass;
  claimedReward: IClaimedReward;
  onMouseOver: (title: string, desc: string, className: string) => void;
  onMouseLeave: () => void;
  handleClaimingClick?: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  characterSeasonalOverrideStates?: CharacterOverrideStateProps;
  isCurrentSeason: boolean;
  hasReachedStep: boolean;
  ownsPremium: boolean;
  progressToNextStepScaled?: number;
  freeCompleteState: CompleteState;
  premiumCompleteState: CompleteState;
  rewardStates: DestinyProgressionRewardItemState[];
}

interface ISeasonPassRewardStepState {
  itemDetailModalOpen: boolean;
  itemDetail: Element;
}

export class SeasonPassRewardStep extends React.Component<
  ISeasonPassRewardStepProps,
  ISeasonPassRewardStepState
> {
  constructor(props: ISeasonPassRewardStepProps) {
    super(props);

    this.state = {
      itemDetailModalOpen: false,
      itemDetail: null,
    };
  }

  private readonly onMouseOver = (
    itemDef: DestinyDefinitions.DestinyInventoryItemLiteDefinition
  ) => {
    const desc =
      itemDef.displayProperties.description !== ""
        ? itemDef.displayProperties.description
        : itemDef.itemTypeAndTierDisplayName;
    this.props.onMouseOver(
      itemDef.displayProperties.name,
      desc,
      itemDef.inventory.tierTypeName
    );
  };
  private readonly onMouseLeave = () => {
    this.props.onMouseLeave();
  };

  public render() {
    const {
      progressionDef,
      stepIndex,
      character,
      rewardStates,
      characterSeasonalOverrideStates,
      isCurrentSeason,
      progressToNextStepScaled,
      freeCompleteState,
      premiumCompleteState,
      hasReachedStep,
    } = this.props;

    const allSeasonRewardItems = progressionDef.rewardItems;
    const displayedStepNumber = stepIndex + 1;
    const rewardsAt = allSeasonRewardItems.filter(
      (a) => a.rewardedAtProgressionLevel === displayedStepNumber
    );

    /** --------- PREMIUM ---------- */
    const premiumRewards = rewardsAt.filter(
      (a) => a.uiDisplayStyle === "premium"
    );
    let premiumReward: DestinyDefinitions.DestinyProgressionRewardItemQuantity;
    let premiumClaimed = false;
    let indexOfPremiumReward = -1;
    let isPremiumHighlightedObjective = false;
    let isPremiumAvailable = false;

    if (premiumRewards) {
      const premiumCharacterStep =
        premiumRewards.filter((r) => r.acquisitionBehavior)?.length === 3;
      premiumReward = premiumCharacterStep
        ? premiumRewards[character]
        : premiumRewards.find((r) => r.acquisitionBehavior) ??
          premiumRewards[0];

      if (typeof premiumReward !== "undefined") {
        indexOfPremiumReward =
          premiumReward &&
          this.itemIndex(
            premiumReward,
            allSeasonRewardItems,
            displayedStepNumber
          );
        const premiumRewardState = rewardStates[indexOfPremiumReward];
        premiumClaimed = this.itemClaimed(
          indexOfPremiumReward,
          premiumReward,
          premiumRewardState
        );
        isPremiumAvailable = this.itemAvailable(premiumRewardState);
        if (characterSeasonalOverrideStates) {
          isPremiumHighlightedObjective = this.itemIsHighlightedObjective(
            indexOfPremiumReward,
            characterSeasonalOverrideStates
          );
        }
      }
    }

    /** --------- FREE ---------- */
    const freeRewards = rewardsAt.filter((a) => a.uiDisplayStyle === "free");
    let freeReward: DestinyDefinitions.DestinyProgressionRewardItemQuantity;
    let freeClaimed = false;
    let indexOfFreeReward = -1;
    let isFreeHighlightedObjective = false;
    let isFreeAvailable = false;

    if (freeRewards) {
      const freeCharacterStep =
        freeRewards.filter((r) => r.acquisitionBehavior)?.length === 3;
      freeReward = freeCharacterStep
        ? freeRewards[character]
        : freeRewards.find((r) => r.acquisitionBehavior) ?? freeRewards[0];

      if (typeof freeReward !== "undefined") {
        indexOfFreeReward =
          freeReward &&
          this.itemIndex(freeReward, allSeasonRewardItems, displayedStepNumber);
        const freeRewardState = rewardStates[indexOfFreeReward];
        freeClaimed = this.itemClaimed(
          indexOfFreeReward,
          freeReward,
          freeRewardState
        );
        isFreeAvailable = this.itemAvailable(freeRewardState);

        if (characterSeasonalOverrideStates) {
          isFreeHighlightedObjective = this.itemIsHighlightedObjective(
            indexOfFreeReward,
            characterSeasonalOverrideStates
          );
        }
      }
    }

    return (
      <React.Fragment>
        <div className={styles.step} data-testid="season-pass-step">
          {displayedStepNumber > 100 &&
          displayedStepNumber <= 110 &&
          this.props.isCurrentSeason ? (
            <div className={styles.progressAndRewardLevel}>
              <span className={styles.stepNumber}>{displayedStepNumber}</span>
              <div className={styles.progressionPipContainer}>
                {Array.from({ length: 5 }, (_, index) => {
                  const pipThreshold = (index + 1) / 5;
                  const isCompleted = progressToNextStepScaled >= pipThreshold;

                  return (
                    <div
                      key={index}
                      className={classNames(styles.miniProgressionPip, {
                        [styles.completed]: isCompleted,
                      })}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={classNames(styles.progressionPip, {
                [styles.completed]: hasReachedStep,
              })}
            >
              {displayedStepNumber}
            </div>
          )}
          {this.itemFragment(
            freeReward,
            indexOfFreeReward,
            freeCompleteState,
            freeClaimed,
            false,
            isFreeAvailable,
            isFreeHighlightedObjective
          )}
          {this.itemFragment(
            premiumReward,
            indexOfPremiumReward,
            premiumCompleteState,
            premiumClaimed,
            true,
            isPremiumAvailable,
            isPremiumHighlightedObjective
          )}
        </div>
      </React.Fragment>
    );
  }

  private itemClaimed(
    index: number,
    item: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
    rewardState: DestinyProgressionRewardItemState
  ): boolean {
    if (
      typeof this.props.claimedReward !== "undefined" &&
      this.props.claimedReward.rewardIndex === index &&
      this.props.claimedReward.itemHash === item.itemHash
    ) {
      return true;
    } else {
      return (rewardState & DestinyProgressionRewardItemState.Claimed) !== 0;
    }
  }

  private itemAvailable(
    rewardState: DestinyProgressionRewardItemState
  ): boolean {
    return (
      (rewardState & DestinyProgressionRewardItemState.ClaimAllowed) !== 0 &&
      (rewardState & DestinyProgressionRewardItemState.Claimed) === 0
    );
  }

  private itemIndex(
    item: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
    rewardItems: DestinyDefinitions.DestinyProgressionRewardItemQuantity[],
    displayedStepNumber: number
  ): number {
    return rewardItems.findIndex(
      (value) =>
        value.itemHash === item.itemHash &&
        value.rewardedAtProgressionLevel === displayedStepNumber
    );
  }

  /* Highlighted Objective items refer to Deepsight items which should have a red-orange border. */
  private itemIsHighlightedObjective(
    index: number,
    characterSeasonalOverrideStates: CharacterOverrideStateProps
  ): boolean {
    const overrideItemStateNum =
      characterSeasonalOverrideStates?.[index]?.itemState || null;
    return (
      EnumUtils.hasFlag(overrideItemStateNum, ItemState.HighlightedObjective) &&
      overrideItemStateNum === ItemState.HighlightedObjective
    );
  }

  private itemFragment(
    item: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
    rewardIndex: number,
    completeState: CompleteState,
    isClaimed: boolean,
    isPremium: boolean,
    isAvailable: boolean,
    isHighlightedObjective?: boolean
  ): React.ReactElement {
    const itemDef =
      typeof item !== "undefined" &&
      this.props.itemDefinitions.get(item.itemHash);
    const itemDefined =
      typeof itemDef !== "undefined" &&
      typeof itemDef.displayProperties !== "undefined";

    const isLocked = isPremium && !this.props.ownsPremium;

    return (
      <div
        className={classNames(isPremium ? styles.premium : styles.free, {
          [styles.locked]: isLocked,
          [styles.claimed]: isClaimed,
          [styles.availableReward]: itemDefined && isAvailable,
          [styles.completed]: completeState === "Complete",
        })}
        style={{ position: "relative" }}
      >
        {/* lock overlay */}
        {isLocked && (
          <span className={styles.lockOverlay} data-testid="lock-overlay">
            <FaLock />
          </span>
        )}

        {isClaimed && (
          <Icon
            className={styles.checkIcon}
            iconType={"fa"}
            iconName={"check"}
            data-testid="check-icon"
          />
        )}
        {itemDefined && (
          <div
            className={styles.iconWrapper}
            onClick={() => {
              if (
                this.props.character === undefined ||
                !this.props.handleClaimingClick
              ) {
                this.openItemDetailModal(item.itemHash);
              } else {
                this.props.handleClaimingClick(
                  item.itemHash,
                  rewardIndex,
                  !isClaimed && completeState === "Incomplete"
                );
              }
            }}
          >
            <div
              className={classNames(styles.icon, {
                [styles.highlightObjBorder]: isHighlightedObjective,
                [styles.baseBorder]: !isHighlightedObjective,
              })}
              style={{
                backgroundImage: `${
                  itemDef?.iconWatermark?.length > 0
                    ? `url(${itemDef.iconWatermark}), `
                    : ``
                }url(${itemDef.displayProperties.icon})`,
              }}
              onMouseEnter={() => this.onMouseOver(itemDef)}
              onMouseLeave={this.onMouseLeave}
            >
              {item.quantity > 1 && <span>{item.quantity}</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  private async openItemDetailModal(itemHash: number) {
    Modal.open(
      <>
        <DestinyCollectibleDetailItemModalContent itemHash={itemHash} />
      </>,
      {
        className: seasonItemModalStyles.seasonItemModal,
        contentClassName: seasonItemModalStyles.modalContent,
      }
    );
  }
}
