// Created by atseng, 2019
// Copyright Bungie, Inc.

import DestinyCollectibleDetailItemModalContent from "@UI/Destiny/DestinyCollectibleDetailItemContent";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { EnumUtils } from "@Utilities/EnumUtils";
import React from "react";
import styles from "./SeasonPassRewardProgression.module.scss";
import seasonItemModalStyles from "./SeasonItemModal.module.scss";
import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";
import { DestinyProgressionRewardItemState, ItemState } from "@Enum";
import { IClaimedReward } from "../SeasonsUtilityPage";

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
  completeState: CompleteState;
  rewardStates: DestinyProgressionRewardItemState[];
  onMouseOver: (title: string, desc: string, className: string) => void;
  onMouseLeave: () => void;
  /* if not defined, clicking will show the anonymous item detail modal */
  handleClaimingClick?: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  /* this lets this component know if a item was claimed */
  claimedReward: IClaimedReward;
  /* Object of reward items that use item index as keys that show reward stats */
  characterSeasonalOverrideStates?: CharacterOverrideStateProps;
}

interface ISeasonPassRewardStepState {
  itemDetailModalOpen: boolean;
  itemDetail: Element;
}

/**
 * SeasonPassRewardStep - Replace this description
 *  *
 * @param {ISeasonPassRewardStepProps} props
 * @returns
 */
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
      completeState,
      characterSeasonalOverrideStates,
    } = this.props;

    const allSeasonRewardItems = progressionDef.rewardItems;
    const displayedStepNumber = stepIndex + 1;
    const rewardsAt = allSeasonRewardItems.filter(
      (a) => a.rewardedAtProgressionLevel === displayedStepNumber
    );

    const premiumRewards = rewardsAt.filter(
      (a) => a.uiDisplayStyle === "premium"
    );
    let premiumReward: DestinyDefinitions.DestinyProgressionRewardItemQuantity;
    let premiumClaimed = false;
    let indexOfPremiumReward = -1;
    let isPremiumHighlightedObjective = false;

    if (premiumRewards) {
      //multiple reward items of the same display style at the same step means that there are character specific rewards

      //Hunter[0], Titan[1], Warlock[2] is always the order
      //character specific step
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
        premiumClaimed = this.itemClaimed(
          indexOfPremiumReward,
          premiumReward,
          rewardStates[indexOfPremiumReward]
        );

        if (characterSeasonalOverrideStates) {
          isPremiumHighlightedObjective = this.itemIsHighlightedObjective(
            indexOfPremiumReward,
            characterSeasonalOverrideStates
          );
        }
      }
    }

    const freeRewards = rewardsAt.filter((a) => a.uiDisplayStyle === "free");
    let freeReward: DestinyDefinitions.DestinyProgressionRewardItemQuantity;
    let freeClaimed = false;
    let indexOfFreeReward = -1;
    let isFreeHighlightedObjective = false;

    if (freeRewards) {
      //multiple reward items of the same display style at the same step means that there are character specific rewards

      //Hunter[0], Titan[1], Warlock[2] is always the order
      const freeCharacterStep =
        freeRewards.filter((r) => r.acquisitionBehavior)?.length === 3;

      freeReward = freeCharacterStep
        ? freeRewards[character]
        : freeRewards.find((r) => r.acquisitionBehavior) ?? freeRewards[0];

      if (typeof freeReward !== "undefined") {
        indexOfFreeReward =
          freeReward &&
          this.itemIndex(freeReward, allSeasonRewardItems, displayedStepNumber);
        freeClaimed = this.itemClaimed(
          indexOfFreeReward,
          freeReward,
          rewardStates[indexOfFreeReward]
        );

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
        <div className={styles.step}>
          <div
            className={classNames(styles.progressionPip, {
              [styles.completed]: completeState === "Complete",
            })}
          >
            {displayedStepNumber}
          </div>
          {this.itemFragment(
            freeReward,
            indexOfFreeReward,
            completeState,
            freeClaimed,
            false,
            isFreeHighlightedObjective
          )}
          {this.itemFragment(
            premiumReward,
            indexOfPremiumReward,
            completeState,
            premiumClaimed,
            true,
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
    isHighlightedObjective?: boolean
  ): React.ReactElement {
    const itemDef =
      typeof item !== "undefined" &&
      this.props.itemDefinitions.get(item.itemHash);

    return (
      <div
        className={classNames(isPremium ? styles.premium : styles.free, {
          [styles.claimed]: isClaimed,
          [styles.availableReward]:
            typeof itemDef !== "undefined" &&
            typeof itemDef.displayProperties !== "undefined",
        })}
      >
        {isClaimed && (
          <Icon
            className={styles.checkIcon}
            iconType={"fa"}
            iconName={"check"}
          />
        )}
        {typeof itemDef !== "undefined" &&
          typeof itemDef.displayProperties !== "undefined" && (
            <div
              className={styles.iconWrapper}
              onClick={() => {
                //character is 0 for hunter and so need to explicitly check for undefined
                if (
                  this.props.character === undefined ||
                  !this.props.handleClaimingClick
                ) {
                  //anonymous or lack of characters/no destiny account version of modal
                  this.openItemDetailModal(item.itemHash);
                } else {
                  this.props.handleClaimingClick(
                    item.itemHash,
                    rewardIndex,
                    !isClaimed && completeState === "Complete"
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
