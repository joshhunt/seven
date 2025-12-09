// Created by jlauer, 2019
// Copyright Bungie, Inc.

import React, { useState } from "react";
import { DestinyDefinitions } from "@Definitions";
import { DestinyClass, DestinyProgressionRewardItemState } from "@Enum";
import { World } from "@Platform";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { DestinyTooltip } from "@UI/Destiny/Tooltips/DestinyTooltip";
import { Tooltip } from "@UI/UIKit/Controls/Tooltip";
import classNames from "classnames";
import styles from "./SeasonPassRewardProgression.module.scss";
import {
  CharacterClass,
  CompleteState,
  SeasonPassRewardStep,
} from "./SeasonPassRewardStep";

interface SeasonPassRewardProgressionProps {
  definitions: any;
  globalState: any;
  ownsPremium: boolean;
  rewardProgressionHash?: number;
  characterProgressions?: { [key: number]: World.DestinyProgression };
  characterClassHash?: number;
  handleClaimingClick?: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  claimedReward?: any;
  claimedOverrides?: number[];
}

type Props = SeasonPassRewardProgressionProps;

const SeasonPassRewardProgression: React.FC<Props> = ({
  definitions,
  globalState,
  ownsPremium,
  rewardProgressionHash,
  characterProgressions,
  characterClassHash,
  handleClaimingClick,
  claimedReward,
  claimedOverrides,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipDesc, setTooltipDesc] = useState("");
  const [tooltipHeaderClass, setTooltipHeaderClass] = useState("");

  const effRewardHash = rewardProgressionHash;
  const rewardsDef = effRewardHash
    ? definitions.DestinyProgressionDefinition.get(effRewardHash)
    : undefined;

  const characterSeasonalProgress: World.DestinyProgression | undefined =
    characterProgressions && effRewardHash !== undefined
      ? characterProgressions[effRewardHash]
      : undefined;
  const hasCharacterProgression =
    typeof characterSeasonalProgress !== "undefined";

  function getCharacterClass(): CharacterClass {
    const table = definitions?.DestinyClassDefinition as any;
    if (!table || !characterClassHash) {
      return CharacterClass.Hunter;
    }
    const def = table.get?.(characterClassHash);
    const classTypeDefEnum = def ? def.classType : null;
    if (classTypeDefEnum === DestinyClass.Titan) return CharacterClass.Titan;
    if (classTypeDefEnum === DestinyClass.Warlock)
      return CharacterClass.Warlock;
    return CharacterClass.Hunter;
  }

  const characterClass: CharacterClass =
    hasCharacterProgression && characterClassHash !== 0
      ? getCharacterClass()
      : CharacterClass.Hunter;
  const slidesPer = globalState?.responsive?.mobile ? 5 : 10;

  const adjustedSteps: unknown[] = rewardsDef?.steps ?? [];

  const allSeasonRewardItems = rewardsDef?.rewardItems ?? [];

  function getRewardIndex(stepIdx: number, displayStyle: string): number {
    const currentStepNumber = stepIdx + 1;
    const items = allSeasonRewardItems.filter(
      (a: DestinyDefinitions.DestinyProgressionRewardItemQuantity) =>
        a.rewardedAtProgressionLevel === currentStepNumber &&
        a.uiDisplayStyle === displayStyle
    );
    if (items.length === 3) {
      return allSeasonRewardItems.findIndex(
        (a: DestinyDefinitions.DestinyProgressionRewardItemQuantity) =>
          a.rewardedAtProgressionLevel === currentStepNumber &&
          a.uiDisplayStyle === displayStyle &&
          items.indexOf(a) === characterClass
      );
    }
    const withAcq = items.find(
      (a: DestinyDefinitions.DestinyProgressionRewardItemQuantity) =>
        a.acquisitionBehavior
    );
    const item = withAcq ?? items[0];
    return allSeasonRewardItems.indexOf(item);
  }

  const getRewardState = (index: number) => {
    const base =
      hasCharacterProgression &&
      index >= 0 &&
      characterSeasonalProgress?.rewardItemStates?.[index] !== undefined
        ? characterSeasonalProgress!.rewardItemStates[index]
        : 0;
    if (claimedOverrides && claimedOverrides.includes(index)) {
      return (base | DestinyProgressionRewardItemState.Claimed) as number;
    }
    return base;
  };

  const getCompleteState = (
    rewardState: DestinyProgressionRewardItemState
  ): CompleteState => {
    if (rewardState & DestinyProgressionRewardItemState.Claimed)
      return "Complete";
    if (rewardState & DestinyProgressionRewardItemState.Earned)
      return "Incomplete";
    return "None";
  };

  let ownsPremiumInner = Boolean(ownsPremium);
  if (!ownsPremiumInner && hasCharacterProgression) {
    const states = characterSeasonalProgress!.rewardItemStates || [];
    const items = allSeasonRewardItems;
    for (let idx = 0; idx < states.length && idx < items.length; idx++) {
      const it = items[idx];
      if (it?.uiDisplayStyle !== "premium") continue;
      const st = states[idx] as number;
      if (
        (st & DestinyProgressionRewardItemState.ClaimAllowed) !== 0 ||
        (st & DestinyProgressionRewardItemState.Claimed) !== 0
      ) {
        ownsPremiumInner = true;
        break;
      }
    }
  }

  const steps = adjustedSteps.map((_a: unknown, i: number) => {
    const freeIndex = getRewardIndex(i, "free");
    const premiumIndex = getRewardIndex(i, "premium");

    const freeRewardState = getRewardState(freeIndex);
    const premiumRewardState = getRewardState(premiumIndex);

    let freeCompleteState = getCompleteState(freeRewardState);
    let premiumCompleteState = getCompleteState(premiumRewardState);

    if (claimedOverrides?.includes(freeIndex)) freeCompleteState = "Complete";
    if (claimedOverrides?.includes(premiumIndex))
      premiumCompleteState = "Complete";

    // Start from API states and overlay claimed overrides so the child sees them as claimed
    const rewardItemStates = hasCharacterProgression
      ? [...(characterSeasonalProgress!.rewardItemStates || [])]
      : ([] as number[]);
    if (claimedOverrides && rewardItemStates.length) {
      for (const idx of claimedOverrides) {
        if (idx >= 0 && idx < rewardItemStates.length) {
          rewardItemStates[idx] = (rewardItemStates[idx] |
            DestinyProgressionRewardItemState.Claimed) as number;
        }
      }
    }

    const handleClickForStep = (
      itemHash: number,
      _passedIndex: number,
      canClaim: boolean
    ) => {
      const stepLevel = i + 1;
      const match = allSeasonRewardItems.find(
        (a: DestinyDefinitions.DestinyProgressionRewardItemQuantity) =>
          a.rewardedAtProgressionLevel === stepLevel && a.itemHash === itemHash
      );
      const track: "free" | "premium" =
        match?.uiDisplayStyle === "premium" ? "premium" : "free";
      const resolvedIndex = getRewardIndex(i, track);
      handleClaimingClick?.(itemHash, resolvedIndex, canClaim);
    };

    return (
      <SeasonPassRewardStep
        key={i}
        onMouseOver={(title: string, desc: string, className: string) => {
          if (!showTooltip) {
            setShowTooltip(true);
            setTooltipTitle(title);
            setTooltipDesc(desc);
            setTooltipHeaderClass(className);
          }
        }}
        onMouseLeave={() => {
          if (showTooltip) {
            setShowTooltip(false);
            setTooltipTitle("");
            setTooltipDesc("");
            setTooltipHeaderClass("");
          }
        }}
        stepIndex={i}
        progressionDef={rewardsDef}
        itemDefinitions={definitions.DestinyInventoryItemLiteDefinition}
        character={characterClass}
        freeCompleteState={freeCompleteState}
        premiumCompleteState={premiumCompleteState}
        rewardStates={rewardItemStates}
        characterSeasonalOverrideStates={
          characterSeasonalProgress &&
          characterSeasonalProgress.rewardItemSocketOverrideStates
        }
        handleClaimingClick={handleClickForStep}
        claimedReward={claimedReward}
        isCurrentSeason={true}
        xpProgressToNextStep={characterSeasonalProgress?.progressToNextLevel}
        hasReachedStep={(idx: number) =>
          hasCharacterProgression && characterSeasonalProgress!.level > idx
        }
        ownsPremium={ownsPremiumInner}
      />
    );
  });

  const chunked = steps.reduce<JSX.Element[][]>(
    (acc, _val, i) =>
      i % slidesPer ? acc : [...acc, steps.slice(i, i + slidesPer)],
    []
  );

  return (
    <div className={styles.stepWrapper}>
      <SeasonCarousel
        className={styles.seasonCarousel}
        showProgress={true}
        startAtPosition={
          characterSeasonalProgress
            ? Math.ceil(
                characterSeasonalProgress.level /
                  (globalState?.responsive?.mobile ? 5 : 10)
              ) - 1
            : 0
        }
        topLabel={null}
      >
        {chunked.map((c, i) => (
          <div key={i} className={styles.rewardSlide}>
            {c}
          </div>
        ))}
      </SeasonCarousel>
      <Tooltip visible={showTooltip} position={"tr"} distance={10}>
        <DestinyTooltip
          className={styles.destinyTooltip}
          title={tooltipTitle}
          headerProps={{
            className: classNames(
              styles.tooltipHeader,
              styles[tooltipHeaderClass]
            ),
            iconProps: { hidden: true },
          }}
        >
          {tooltipDesc}
        </DestinyTooltip>
      </Tooltip>
    </div>
  );
};

export default SeasonPassRewardProgression;
