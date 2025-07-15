// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./RedeemSeasonRewardItem.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import * as Globals from "@Enum";
import { Actions, Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";

// Required props
export interface IRedeemSeasonRewardItemProps {
  itemHash: number;
  imagePath: string;
  title: string;
  desc: string;
  rankReward: number;
  characterId: string;
  membershipType: Globals.BungieMembershipType;
  rewardIndex: number;
  seasonHash: number;
  seasonPassHash: number;
  isHighlightedObjective: boolean;
  itemClaimed: (rewardIndex: number, itemHash: number) => void;
  handleClick: (itemHash: number, rewardIndex: number) => void;
}

type Props = IRedeemSeasonRewardItemProps;

interface IRedeemSeasonRewardItemState {
  isClaiming: boolean;
}

/**
 * RedeemSeasonRewardItem - Unclaimed Reward Item that has a button to allow claiming
 *  *
 * @param {IRedeemSeasonRewardItemProps} props
 * @returns
 */
export class RedeemSeasonRewardItem extends React.Component<
  Props,
  IRedeemSeasonRewardItemState
> {
  constructor(props: Props) {
    super(props);

    this.claimReward = this.claimReward.bind(this);

    this.state = {
      isClaiming: false,
    };
  }

  public render() {
    const claimButton = Localizer.Seasons.Claim;

    const redeemRewardRank = Localizer.Format(
      Localizer.Seasons.RedeemRankRankrewardReward,
      { rankReward: this.props.rankReward, title: this.props.title }
    );

    return (
      <React.Fragment>
        <div
          className={styles.rewardItem}
          key={this.props.seasonHash.toString()}
        >
          <div
            onClick={() =>
              this.props.handleClick(
                this.props.itemHash,
                this.props.rewardIndex
              )
            }
          >
            <img
              className={classNames({
                [styles.highlightObjBorder]: this.props.isHighlightedObjective,
                [styles.baseBorder]: !this.props.isHighlightedObjective,
              })}
              src={this.props.imagePath}
              alt={redeemRewardRank}
            />
          </div>
          <div className={styles.itemContent}>
            <h5>{redeemRewardRank}</h5>
            <p>{this.props.desc}</p>
          </div>
          <Button
            className={styles.claimButton}
            disabled={this.state.isClaiming}
            onClick={() => this.claimReward(this.props.itemHash)}
            buttonType={!this.state.isClaiming ? "teal" : "disabled"}
            loading={this.state.isClaiming}
            size={BasicSize.Medium}
          >
            {claimButton}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  private claimReward(itemHash: number) {
    if (!this.state.isClaiming) {
      this.setState({ isClaiming: true });

      const input: Actions.DestinyClaimSeasonPassRewardActionRequest = {
        seasonHash: this.props.seasonHash,
        seasonPassHash: this.props.seasonPassHash,
        rewardIndex: this.props.rewardIndex,
        characterId: this.props.characterId,
        membershipType: this.props.membershipType,
      };

      Platform.Destiny2Service.ClaimSeasonPassReward(input)
        .then(() => {
          this.props.itemClaimed(this.props.rewardIndex, itemHash);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          this.setState({
            isClaiming: false,
          });

          Modal.error(e);
        });
    }
  }
}
