// Created by atseng, 2019
// Copyright Bungie, Inc.

import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { IClaimedReward } from "@Areas/Seasons/SeasonsUtilityPage";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import {
  BungieMembershipType,
  DestinyProgressionRewardItemState,
  ItemState,
} from "@Enum";
import { Components, World } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { EnumUtils } from "@Utilities/EnumUtils";
import * as React from "react";
import {
  IRedeemSeasonRewardItemProps,
  RedeemSeasonRewardItem,
} from "../RedeemSeasonRewardItem/RedeemSeasonRewardItem";

import styles from "./RedeemSeasonRewards.module.scss";

// Required props
interface IRedeemSeasonRewardsProps
  extends D2DatabaseComponentProps<
    | "DestinyInventoryItemLiteDefinition"
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
  > {
  seasonHash: number;
  platformProgressions: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent;
  characterProgressions: { [key: number]: World.DestinyProgression };
  characterId: string;
  membershipType: BungieMembershipType;
  handleClick: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  //when item is claimed from this component
  itemClaimed?: (itemHash: number, rewardIndex: number) => void;
  //when item is claimed from outside this component
  claimedReward?: IClaimedReward;
}

// Default props - these will have values set in RedeemSeasonRewards.defaultProps
interface DefaultProps {}

type Props = IRedeemSeasonRewardsProps & DefaultProps;

interface IRedeemSeasonRewardsState {
  rewardItems: IRedeemSeasonRewardItemProps[];
}

/**
 * RedeemSeasonRewards - A list of Unclaimed Season Rewards
 *  *
 * @param {IRedeemSeasonRewardsProps} props
 * @returns
 */
class RedeemSeasonRewards extends React.Component<
  Props,
  IRedeemSeasonRewardsState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rewardItems: [],
    };

    this.claimedReward = this.claimedReward.bind(this);
  }

  public componentDidMount() {
    this.getUnclaimedRewardItems();
  }

  public componentDidUpdate(
    prevProps: IRedeemSeasonRewardsProps,
    prevState: IRedeemSeasonRewardsState
  ) {
    //characterProgressions loaded
    if (
      this.props.characterProgressions &&
      prevProps.characterProgressions !== this.props.characterProgressions
    ) {
      this.getUnclaimedRewardItems();
    }

    //update the rewards if user claims from outside this component
    if (prevProps.claimedReward !== this.props.claimedReward) {
      this.claimedReward(
        this.props.claimedReward.rewardIndex,
        this.props.claimedReward.itemHash
      );
    }

    //update the rewards if character changes
    if (prevProps.characterId !== this.props.characterId) {
      this.getUnclaimedRewardItems();
    }
  }

  public getHighlightedObjectiveStatus = (
    itemIndex: number,
    characterSeasonalOverrideStates: any
  ) => {
    const overrideItemStateNum =
      characterSeasonalOverrideStates?.[itemIndex]?.itemState || null;

    return (
      EnumUtils.hasFlag(overrideItemStateNum, ItemState.HighlightedObjective) &&
      overrideItemStateNum === ItemState.HighlightedObjective
    );
  };

  public render() {
    const { definitions, seasonHash } = this.props;

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);
    const seasonPassDef = SeasonProgressUtils?.getCurrentSeasonPass({
      seasonHash: seasonHash,
      definitions: definitions,
    });
    const characterSeasonalOverrideStates =
      this?.props?.characterProgressions &&
      this?.props?.characterProgressions[seasonPassDef?.rewardProgressionHash]
        ?.rewardItemSocketOverrideStates;

    const seasonName = seasonDef?.displayProperties.name;

    const title = Localizer.Seasons.UnclaimedRewards;
    const desc = Localizer.Format(Localizer.Seasons.YouHaveStrongNumunclaimed, {
      totalNumUnclaimed: SeasonProgressUtils.getUnclaimedRewardsForPlatform(
        seasonHash,
        definitions,
        this.props.platformProgressions
      ),
      numUnclaimed: this.state.rewardItems.length,
      seasonName: seasonName,
    });

    if (!this.props.characterProgressions) {
      return null;
    }

    return (
      <React.Fragment>
        {this.state.rewardItems.length > 0 && (
          <React.Fragment>
            <h4 className={styles.titleUnclaimedRewards}>{title}</h4>
            <p
              className={styles.descUnclaimedRewards}
              dangerouslySetInnerHTML={sanitizeHTML(desc)}
            />
            <div className={styles.listUnClaimed}>
              {this.state.rewardItems.map(
                (value: IRedeemSeasonRewardItemProps) => (
                  <RedeemSeasonRewardItem
                    itemHash={value.itemHash}
                    key={value.rewardIndex}
                    title={value.title}
                    rankReward={value.rankReward}
                    desc={value.desc}
                    imagePath={value.imagePath}
                    characterId={value.characterId}
                    membershipType={value.membershipType}
                    rewardIndex={value.rewardIndex}
                    isHighlightedObjective={this.getHighlightedObjectiveStatus(
                      value.rewardIndex,
                      characterSeasonalOverrideStates
                    )}
                    seasonHash={value.seasonHash}
                    seasonPassHash={seasonPassDef?.hash}
                    itemClaimed={() =>
                      this.props.itemClaimed(value.itemHash, value.rewardIndex)
                    }
                    handleClick={(itemHash: number, rewardIndex: number) =>
                      this.props.handleClick(itemHash, rewardIndex, true)
                    }
                  />
                )
              )}
            </div>
          </React.Fragment>
        )}
        {this.state.rewardItems.length === 0 && null}
      </React.Fragment>
    );
  }

  private getUnclaimedRewardItems() {
    const {
      characterId,
      definitions,
      seasonHash,
      characterProgressions,
    } = this.props;

    if (characterProgressions) {
      const seasonPassDef = SeasonProgressUtils.getCurrentSeasonPass({
        seasonHash: seasonHash,
        definitions: definitions,
      });
      //get the players progression
      const progression =
        characterProgressions[seasonPassDef?.rewardProgressionHash];
      const characterSeasonalOverrideStates =
        progression.rewardItemSocketOverrideStates;

      const rewardsDef = definitions.DestinyProgressionDefinition.get(
        seasonPassDef?.rewardProgressionHash
      );

      this.setState({
        rewardItems: rewardsDef.rewardItems
          .reduce(
            (
              validItems: IRedeemSeasonRewardItemProps[],
              value: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
              index: number
            ) => {
              const rewardItemState = progression.rewardItemStates[index];

              if (
                rewardItemState & DestinyProgressionRewardItemState.Earned &&
                rewardItemState &
                  DestinyProgressionRewardItemState.ClaimAllowed &&
                (rewardItemState &
                  DestinyProgressionRewardItemState.Claimed) ===
                  0 &&
                (rewardItemState &
                  DestinyProgressionRewardItemState.Invisible) ===
                  0
              ) {
                const rewardItemDef = definitions.DestinyInventoryItemLiteDefinition.get(
                  value.itemHash
                );

                if (rewardItemDef.displayProperties) {
                  const rewardItem: IRedeemSeasonRewardItemProps = {
                    itemHash: value.itemHash,
                    rankReward: value.rewardedAtProgressionLevel,
                    imagePath: rewardItemDef.displayProperties.icon,
                    title: rewardItemDef.displayProperties.name,
                    desc: rewardItemDef.displayProperties.description,
                    isHighlightedObjective: this.getHighlightedObjectiveStatus(
                      value.itemHash,
                      characterSeasonalOverrideStates
                    ),
                    characterId: characterId,
                    membershipType: this.props.membershipType,
                    rewardIndex: index,
                    seasonHash: seasonHash,
                    seasonPassHash: seasonPassDef?.hash,
                    itemClaimed: () =>
                      this.props.itemClaimed(value.itemHash, index),
                    handleClick: () =>
                      this.props.handleClick(value.itemHash, index, true),
                  };

                  validItems.push(rewardItem);
                }
              }

              return validItems;
            },
            []
          )
          .sort((a, b) => (a.rankReward < b.rankReward ? -1 : 1)),
      });
    }
  }

  private claimedReward(rewardIndex: number, itemHash: number) {
    const def = this.props.definitions.DestinyInventoryItemLiteDefinition.get(
      itemHash
    );
    const icon = def.displayProperties.icon;
    const title = def.displayProperties.name;
    const desc = Localizer.Seasons.RewardClaimedSuccess;

    const content = (
      <div className={styles.successClaimed}>
        <img src={icon} />
        <div>
          <p className={styles.successTitle}>{title}</p>
          <p className={styles.successDesc}>{desc}</p>
        </div>
      </div>
    );

    Toast.show(content, {
      position: "br",
      timeout: 2500,
    });

    // remove it from the array
    this.setState({
      rewardItems: this.state.rewardItems.filter(
        (i: any) => !(i.itemHash === itemHash && i.rewardIndex === rewardIndex)
      ),
    });
  }
}

export default withDestinyDefinitions(RedeemSeasonRewards, {
  types: [
    "DestinyInventoryItemLiteDefinition",
    "DestinySeasonDefinition",
    "DestinySeasonPassDefinition",
    "DestinyProgressionDefinition",
  ],
});
