// Created by jlauer, 2019
// Copyright Bungie, Inc.

import SeasonProgressUtils from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { IClaimedReward } from "@Areas/Seasons/SeasonsUtilityPage";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { DestinyClass, DestinyProgressionRewardItemState } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { World } from "@Platform";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { DestinyTooltip } from "@UI/Destiny/Tooltips/DestinyTooltip";
import { Tooltip } from "@UI/UIKit/Controls/Tooltip";
import classNames from "classnames";
import * as React from "react";
import styles from "./SeasonPassRewardProgression.module.scss";
import {
  CharacterClass,
  CompleteState,
  SeasonPassRewardStep,
} from "./SeasonPassRewardStep";

// Required props
interface ISeasonPassRewardProgressionProps
  extends GlobalStateComponentProps<"responsive">,
    D2DatabaseComponentProps<
      | "DestinyInventoryItemLiteDefinition"
      | "DestinySeasonDefinition"
      | "DestinySeasonPassDefinition"
      | "DestinyProgressionDefinition"
      | "DestinyClassDefinition"
    > {
  seasonHash: number;
  characterProgressions?: { [key: number]: World.DestinyProgression };
  characterClassHash?: number;
  handleClaimingClick?: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => void;
  claimedReward?: IClaimedReward;
}

// Default props
interface DefaultProps {}

type Props = ISeasonPassRewardProgressionProps & DefaultProps;

interface ISeasonPassRewardProgressionState {
  showTooltip: boolean;
  tooltipTitle: string;
  tooltipDesc: string;
  tooltipHeaderClass: string;
}

class SeasonPassRewardProgression extends React.Component<
  Props,
  ISeasonPassRewardProgressionState
> {
  public static defaultProps: DefaultProps = {};

  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltip: false,
      tooltipDesc: "",
      tooltipTitle: "",
      tooltipHeaderClass: "",
    };
  }

  public render() {
    const {
      definitions,
      seasonHash,
      characterProgressions,
      characterClassHash,
      globalState,
    } = this.props;

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);
    const seasonPassDef = SeasonProgressUtils?.getCurrentSeasonPass({
      seasonHash: seasonHash,
      definitions: definitions,
    });
    const rewardsDef = definitions.DestinyProgressionDefinition.get(
      seasonPassDef.rewardProgressionHash
    );

    const characterSeasonalProgress =
      typeof characterProgressions !== "undefined"
        ? characterProgressions[seasonPassDef.rewardProgressionHash]
        : undefined;
    const hasCharacterProgression =
      typeof characterSeasonalProgress !== "undefined";
    const characterClass: CharacterClass =
      hasCharacterProgression && characterClassHash !== 0
        ? this.getCharacterClass(characterClassHash)
        : CharacterClass.Hunter;
    const slidesPer = globalState.responsive.mobile ? 5 : 10;
    // For current season without acts, show all progression steps
    const isCurrentSeason =
      seasonHash ===
      globalState.coreSettings?.destiny2CoreSettings?.currentSeasonHash;
    const maxActRankCount = getActiveActsRankCount(
      seasonDef.acts,
      isCurrentSeason
    );

    const characterSeasonalOverrideStates =
      characterSeasonalProgress &&
      characterSeasonalProgress.rewardItemSocketOverrideStates;

    function getActiveActsRankCount(
      acts: DestinyDefinitions.DestinySeasonActDefinition[],
      isCurrentSeason: boolean
    ) {
      const totalSteps = rewardsDef?.steps?.length || 0;
      const actCount = acts?.length || 0;

      // If no acts exist, return all available progression steps
      if (actCount === 0) {
        return totalSteps;
      }

      // For seasons with acts, calculate available ranks based on act timing
      let rankCount = 0;
      const currentDateTime = new Date();

      for (let actIndex = 0; actIndex < actCount; actIndex++) {
        const act = acts[actIndex];
        const actStartTime = new Date(act.startTime);

        // For current season, include all acts regardless of timing to allow progression
        // For previous seasons, only include acts that have started
        if (isCurrentSeason || actStartTime <= currentDateTime) {
          rankCount += act.rankCount;
        } else {
          break;
        }
      }

      // Ensure we don't exceed total available steps
      return Math.min(rankCount, totalSteps);
    }

    const adjustedSteps = rewardsDef.steps.filter((value, index) => {
      return index < maxActRankCount;
    });

    const allSeasonRewardItems = rewardsDef.rewardItems;

    function getRewardIndex(stepIdx: number, displayStyle: string): number {
      const currentStepNumber = stepIdx + 1;
      const items = allSeasonRewardItems.filter(
        (a) =>
          a.rewardedAtProgressionLevel === currentStepNumber &&
          a.uiDisplayStyle === displayStyle
      );
      if (items.length === 3) {
        return allSeasonRewardItems.findIndex(
          (a) =>
            a.rewardedAtProgressionLevel === currentStepNumber &&
            a.uiDisplayStyle === displayStyle &&
            items.indexOf(a) === characterClass
        );
      }
      const withAcq = items.find((a) => a.acquisitionBehavior);
      const item = withAcq ?? items[0];
      return allSeasonRewardItems.indexOf(item);
    }

    const getRewardState = (index: number) =>
      hasCharacterProgression &&
      index >= 0 &&
      characterSeasonalProgress.rewardItemStates[index] !== undefined
        ? characterSeasonalProgress.rewardItemStates[index]
        : 0;
    const getCompleteState = (
      rewardState: DestinyProgressionRewardItemState
    ): CompleteState => {
      if (rewardState & DestinyProgressionRewardItemState.Claimed)
        return "Complete";
      if (rewardState & DestinyProgressionRewardItemState.Earned)
        return "Incomplete";
      return "None";
    };

    // ----- PREMIUM PASS OWNERSHIP DETECTION -----
    // Use the original method of checking premium reward states since ownershipUnlockFlagHash is 0 in client data
    let ownsPremium = false;
    if (hasCharacterProgression && characterSeasonalProgress.level > 0) {
      // Check premium reward at current level to see if user has premium access
      const currentLevelIndex = Math.min(
        characterSeasonalProgress.level - 1,
        adjustedSteps.length - 1
      );
      const premiumIndex = getRewardIndex(currentLevelIndex, "premium");
      const premiumState = getRewardState(premiumIndex);
      // If premium reward at current level has ClaimAllowed flag, user owns premium
      ownsPremium =
        (premiumState & DestinyProgressionRewardItemState.ClaimAllowed) !== 0 ||
        (premiumState & DestinyProgressionRewardItemState.Claimed) !== 0;
    }

    const steps = adjustedSteps.map((step, i) => {
      // Find reward indices for free and premium at this step
      const freeIndex = getRewardIndex(i, "free");
      const premiumIndex = getRewardIndex(i, "premium");

      const freeRewardState = getRewardState(freeIndex);
      const premiumRewardState = getRewardState(premiumIndex);

      const freeCompleteState = getCompleteState(freeRewardState);
      const premiumCompleteState = getCompleteState(premiumRewardState);

      const rewardItemStates = hasCharacterProgression
        ? characterSeasonalProgress.rewardItemStates
        : [];

      return (
        <SeasonPassRewardStep
          key={i}
          onMouseOver={(title: string, desc: string, className: string) =>
            this.showTooltip(title, desc, className)
          }
          onMouseLeave={() => this.hideTooltip()}
          stepIndex={i}
          progressionDef={rewardsDef}
          itemDefinitions={definitions.DestinyInventoryItemLiteDefinition}
          character={characterClass}
          freeCompleteState={freeCompleteState}
          premiumCompleteState={premiumCompleteState}
          rewardStates={rewardItemStates}
          characterSeasonalOverrideStates={characterSeasonalOverrideStates}
          handleClaimingClick={this.props.handleClaimingClick}
          claimedReward={this.props.claimedReward}
          isCurrentSeason={isCurrentSeason}
          xpProgressToNextStep={characterSeasonalProgress?.progressToNextLevel}
          hasReachedStep={(i: number) =>
            hasCharacterProgression && characterSeasonalProgress.level > i
          }
          ownsPremium={ownsPremium}
        />
      );
    });

    const chunked = this.chunk(steps, slidesPer);

    const slides = chunked.map((a: React.ReactNode, i: number) => (
      <div key={i} className={styles.rewardSlide}>
        {a}
      </div>
    ));

    return (
      <div className={styles.stepWrapper}>
        <SeasonCarousel
          className={styles.seasonCarousel}
          showProgress={true}
          startAtPosition={
            typeof characterSeasonalProgress !== "undefined"
              ? Math.ceil(characterSeasonalProgress.level / slidesPer) - 1
              : 0
          }
          topLabel={null}
        >
          {slides}
        </SeasonCarousel>
        <Tooltip visible={this.state.showTooltip} position={"tr"} distance={10}>
          <DestinyTooltip
            className={styles.destinyTooltip}
            title={this.state.tooltipTitle}
            headerProps={{
              className: classNames(
                styles.tooltipHeader,
                styles[this.state.tooltipHeaderClass]
              ),
              iconProps: { hidden: true },
            }}
          >
            {this.state.tooltipDesc}
          </DestinyTooltip>
        </Tooltip>
      </div>
    );
  }

  // Chunk an array up into smaller pieces
  private readonly chunk = (arr: any[], size: number) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  private showTooltip(title: string, desc: string, headerClass: string) {
    if (!this.state.showTooltip) {
      this.setState({
        showTooltip: true,
        tooltipTitle: title,
        tooltipDesc: desc,
        tooltipHeaderClass: headerClass,
      });
    }
  }

  private hideTooltip() {
    if (this.state.showTooltip) {
      this.setState({
        showTooltip: false,
        tooltipTitle: "",
        tooltipDesc: "",
        tooltipHeaderClass: "",
      });
    }
  }

  private getCharacterClass(classHash: number): CharacterClass {
    let classType: CharacterClass = CharacterClass.Hunter;

    const classTypeDefEnum =
      this.props.definitions.DestinyClassDefinition &&
      typeof this.props.definitions.DestinyClassDefinition.get(classHash) !==
        "undefined"
        ? this.props.definitions.DestinyClassDefinition.get(classHash).classType
        : null;

    if (classTypeDefEnum === DestinyClass.Titan) {
      classType = CharacterClass.Titan;
    } else if (classTypeDefEnum === DestinyClass.Warlock) {
      classType = CharacterClass.Warlock;
    }

    return classType;
  }
}

export default withGlobalState(
  withDestinyDefinitions(SeasonPassRewardProgression, {
    types: [
      "DestinyInventoryItemLiteDefinition",
      "DestinySeasonDefinition",
      "DestinySeasonPassDefinition",
      "DestinyProgressionDefinition",
      "DestinyClassDefinition",
    ],
  }),
  ["responsive"]
);
