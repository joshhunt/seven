// Created by atseng, 2019
// Copyright Bungie, Inc.

import SeasonProgressUtils from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { Localizer } from "@bungie/localization";
import { DestinyDefinitions } from "@Definitions";
import {
  BungieMembershipType,
  DestinyProgressionRewardItemState,
  ItemState,
} from "@Enum";
import { Components } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import React from "react";
import {
  IRedeemSeasonRewardItemProps,
  RedeemSeasonRewardItem,
} from "../RedeemSeasonRewardItem/RedeemSeasonRewardItem";
import { useAppSelector } from "@Global/Redux/store";
import { selectDestinyAccount } from "@Global/Redux/slices/destinyAccountSlice";

import styles from "./RedeemSeasonRewards.module.scss";

interface IRedeemSeasonRewardsProps {
  characterId: string;
  seasonHash: number;
  seasonPassHash?: number;
  rewardProgressionHash?: number;
  definitions: any;
  membershipType: BungieMembershipType;
  handleClick: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  itemClaimed?: (itemHash: number, rewardIndex: number) => void;
  claimedReward?: { itemHash: number; rewardIndex: number };
  claimedOverrides?: number[];
}
const RedeemSeasonRewards = (props: IRedeemSeasonRewardsProps) => {
  const [rewardItems, setRewardItems] = React.useState<
    IRedeemSeasonRewardItemProps[]
  >([]);

  const destinyAccount = useAppSelector(selectDestinyAccount);
  const platformProgressions = (destinyAccount as any)
    ?.characterProgressions as
    | Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
    | undefined;

  const effRewardHash = props.rewardProgressionHash;

  const getCharProg = (charId: string) =>
    platformProgressions?.data?.[charId]?.progressions?.[effRewardHash ?? -1];

  React.useEffect(() => {
    const unclaimedItems: IRedeemSeasonRewardItemProps[] = [];

    const charProg = props.characterId
      ? getCharProg(props.characterId)
      : undefined;

    if (charProg) {
      const characterSeasonalOverrideStates =
        charProg.rewardItemSocketOverrideStates;
      const rewardsDef = effRewardHash
        ? props.definitions.DestinyProgressionDefinition.get(effRewardHash)
        : undefined;

      rewardsDef?.rewardItems.forEach(
        (
          value: DestinyDefinitions.DestinyProgressionRewardItemQuantity,
          index: number
        ) => {
          if (props.claimedOverrides?.includes(index)) {
            return; // already claimed in UI
          }
          const rewardItemState = charProg.rewardItemStates[index];

          if (
            (rewardItemState & DestinyProgressionRewardItemState.Earned) !==
              0 &&
            (rewardItemState &
              DestinyProgressionRewardItemState.ClaimAllowed) !==
              0 &&
            (rewardItemState & DestinyProgressionRewardItemState.Claimed) ===
              0 &&
            (rewardItemState & DestinyProgressionRewardItemState.Invisible) ===
              0
          ) {
            const rewardItemDef = props.definitions.DestinyInventoryItemLiteDefinition.get(
              value.itemHash
            );

            if (rewardItemDef?.displayProperties) {
              const overrideStateNum =
                characterSeasonalOverrideStates?.[index]?.itemState ?? 0;
              const isHighlightedObjective =
                (overrideStateNum & ItemState.HighlightedObjective) !== 0 &&
                overrideStateNum === ItemState.HighlightedObjective;
              const rewardItem: IRedeemSeasonRewardItemProps = {
                itemHash: value.itemHash,
                rankReward: value.rewardedAtProgressionLevel,
                imagePath: rewardItemDef.displayProperties.icon,
                title: rewardItemDef.displayProperties.name,
                desc: rewardItemDef.displayProperties.description,
                isHighlightedObjective,
                characterId: props.characterId,
                membershipType: props.membershipType,
                rewardIndex: index,
                seasonHash: props.seasonHash,
                seasonPassHash: props.seasonPassHash,
                itemClaimed: () => props.itemClaimed?.(value.itemHash, index),
                handleClick: () =>
                  props.handleClick(value.itemHash, index, true),
              };

              unclaimedItems.push(rewardItem);
            }
          }
        }
      );
    }

    setRewardItems(
      unclaimedItems.sort((a, b) => (a.rankReward < b.rankReward ? -1 : 1))
    );
  }, [
    props.characterId,
    props.seasonHash,
    props.definitions,
    platformProgressions,
    props.seasonPassHash,
    props.rewardProgressionHash,
    props.claimedOverrides,
  ]);

  const title = Localizer.Seasons.UnclaimedRewards;
  const desc = Localizer.Format(Localizer.Seasons.YouHaveStrongNumunclaimed, {
    totalNumUnclaimed: SeasonProgressUtils.getUnclaimedRewardsForPlatform(
      props.seasonHash,
      props.definitions,
      platformProgressions,
      props.seasonPassHash
    ),
    numUnclaimed: rewardItems.length,
    seasonName: props.definitions.DestinySeasonDefinition.get(props.seasonHash)
      ?.displayProperties.name,
  });

  if (!platformProgressions) {
    return null;
  }

  return (
    <React.Fragment>
      {rewardItems.length > 0 && (
        <React.Fragment>
          <h4 className={styles.titleUnclaimedRewards}>{title}</h4>
          <p
            className={styles.descUnclaimedRewards}
            dangerouslySetInnerHTML={sanitizeHTML(desc)}
          />
          <div className={styles.listUnClaimed}>
            {rewardItems.map((value: IRedeemSeasonRewardItemProps) => (
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
                isHighlightedObjective={value.isHighlightedObjective}
                seasonHash={value.seasonHash}
                seasonPassHash={props.seasonPassHash}
                itemClaimed={() =>
                  props.itemClaimed?.(value.itemHash, value.rewardIndex)
                }
                handleClick={(itemHash: number, rewardIndex: number) =>
                  props.handleClick(itemHash, rewardIndex, true)
                }
              />
            ))}
          </div>
        </React.Fragment>
      )}
      {rewardItems.length === 0 && null}
    </React.Fragment>
  );
};

export default RedeemSeasonRewards;
