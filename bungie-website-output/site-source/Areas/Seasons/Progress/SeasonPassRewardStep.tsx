// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonPassRewardProgression.module.scss";
import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";
import { DestinyProgressionRewardItemState } from "@Enum";
import { IClaimedReward } from "../SeasonsUtilityPage";

export type CompleteState = "None" | "Incomplete" | "Complete";
export enum CharacterClass {
  Hunter,
  Titan,
  Warlock,
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
  handleClick: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  /* this lets this component know if a item was claimed */
  claimedReward: IClaimedReward;
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
    title: string,
    desc: string,
    className: string
  ) => {
    //this.setState({ tooltipRewardIndex: rewardIndex });
    this.props.onMouseOver(title, desc, className);
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

    if (premiumRewards) {
      //multiple reward items of the same display style at the same step means that there are character specific rewards

      //Hunter[0], Titan[1], Warlock[2] is always the order
      premiumReward =
        typeof premiumRewards[character] !== "undefined"
          ? premiumRewards[character]
          : premiumRewards[0];

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
      }
    }

    const freeRewards = rewardsAt.filter((a) => a.uiDisplayStyle === "free");
    let freeReward: DestinyDefinitions.DestinyProgressionRewardItemQuantity;
    let freeClaimed = false;
    let indexOfFreeReward = -1;

    if (freeRewards) {
      //multiple reward items of the same display style at the same step means that there are character specific rewards

      //Hunter[0], Titan[1], Warlock[2] is always the order
      freeReward =
        typeof freeRewards[character] !== "undefined"
          ? freeRewards[character]
          : freeRewards[0];

      if (typeof freeReward !== "undefined") {
        indexOfFreeReward =
          freeReward &&
          this.itemIndex(freeReward, allSeasonRewardItems, displayedStepNumber);

        freeClaimed = this.itemClaimed(
          indexOfFreeReward,
          freeReward,
          rewardStates[indexOfFreeReward]
        );
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
            false
          )}
          {this.itemFragment(
            premiumReward,
            indexOfPremiumReward,
            completeState,
            premiumClaimed,
            true
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

  private itemFragment(
    item: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
    rewardIndex: number,
    completeState: CompleteState,
    isClaimed: boolean,
    isPremium: boolean
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
              onClick={() =>
                this.props.handleClick(
                  item.itemHash,
                  rewardIndex,
                  !isClaimed && completeState === "Complete"
                )
              }
            >
              <img
                src={itemDef.displayProperties.icon}
                alt={itemDef.displayProperties.name}
                width="75"
                onMouseEnter={() =>
                  this.onMouseOver(
                    itemDef.displayProperties.name,
                    itemDef.displayProperties.description,
                    itemDef.inventory.tierTypeName
                  )
                }
                onMouseLeave={this.onMouseLeave}
              />
            </div>
          )}
      </div>
    );
  }
}
