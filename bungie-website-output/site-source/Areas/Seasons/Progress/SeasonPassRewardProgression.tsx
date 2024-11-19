// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { DateTime } from "luxon";
import * as React from "react";
import styles from "./SeasonPassRewardProgression.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { World } from "@Platform";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import classNames from "classnames";
import { SeasonPassRewardStep, CharacterClass } from "./SeasonPassRewardStep";
import { Tooltip } from "@UI/UIKit/Controls/Tooltip";
import { DestinyTooltip } from "@UI/Destiny/Tooltips/DestinyTooltip";
import { Localizer } from "@bungie/localization";
import { DestinyClass } from "@Enum";
import { IClaimedReward } from "../SeasonsUtilityPage";
import { DestinyDefinitions } from "@Definitions";

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
  /** If you want to be able to claim the reward by clicking on it, pass a function in that will do that */
  handleClaimingClick?: (
    itemHash: number,
    rewardIndex: number,
    canClaim: boolean
  ) => {};
  claimedReward?: IClaimedReward;
}

// Default props - these will have values set in SeasonPassRewardProgression.defaultProps
interface DefaultProps {}

type Props = ISeasonPassRewardProgressionProps & DefaultProps;

interface ISeasonPassRewardProgressionState {
  showTooltip: boolean;
  tooltipTitle: string;
  tooltipDesc: string;
  tooltipHeaderClass: string;
}

/**
 * SeasonPassRewardProgression - Shows the Season Pass rewards carousel at any size
 *  *
 * @param {ISeasonPassRewardProgressionProps} props
 * @returns
 */
class SeasonPassRewardProgression extends React.Component<
  Props,
  ISeasonPassRewardProgressionState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltip: false,
      tooltipDesc: "",
      tooltipTitle: "",
      tooltipHeaderClass: "",
    };
  }

  public static defaultProps: DefaultProps = {};

  // Chunk an array up into smaller pieces
  private readonly chunk = (arr: any[], size: number) =>
    arr.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
      []
    );

  public render() {
    const {
      definitions,
      seasonHash,
      characterProgressions,
      characterClassHash,
      globalState,
    } = this.props;

    // this is the season definition
    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);

    // this is the season pass definition
    const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
      seasonDef.seasonPassHash
    );

    // this is the definition for a character's progress along the rewards in the season pass
    const rewardsDef = definitions.DestinyProgressionDefinition.get(
      seasonPassDef.rewardProgressionHash
    );

    // Note: The season pass progression hash from the season definition is the same as the reward progression hash from the season pass definition

    // this is the character's progress along the season pass
    const characterSeasonalProgress =
      typeof characterProgressions !== "undefined" &&
      typeof characterProgressions[seasonDef.seasonPassProgressionHash] !==
        "undefined"
        ? characterProgressions[seasonDef.seasonPassProgressionHash]
        : undefined;

    const characterPrestigeProgress =
      typeof characterProgressions !== "undefined" &&
      typeof characterProgressions[seasonPassDef.prestigeProgressionHash] !==
        "undefined" &&
      characterProgressions[seasonPassDef.prestigeProgressionHash].level > 0
        ? characterProgressions[seasonPassDef.prestigeProgressionHash]
        : undefined;

    const hasCharacterProgression =
      typeof characterSeasonalProgress !== "undefined";

    const characterClass: CharacterClass =
      hasCharacterProgression && characterClassHash !== 0
        ? this.getCharacterClass(characterClassHash)
        : CharacterClass.Hunter;

    const slidesPer = globalState.responsive.mobile ? 4 : 10;
    const maxActRankCount = getActiveActsRankCount(seasonDef.acts);
    const isLastAct = () =>
      DateTime.now() >
      DateTime.fromISO(seasonDef.acts[seasonDef.acts.length - 1].startTime);

    const maxSeasonRewardCount = rewardsDef.steps.length;

    const characterSeasonalOverrideStates =
      characterSeasonalProgress &&
      characterSeasonalProgress.rewardItemSocketOverrideStates;

    const handleRankDisplay = (
      characterSeasonalProgress: World.DestinyProgression
    ) => {
      const characterSeasonRank =
        hasCharacterProgression && characterSeasonalProgress.level;
      const characterPrestigeRank =
        characterPrestigeProgress && characterPrestigeProgress.level;
      const isPrestige =
        typeof characterPrestigeProgress !== "undefined" &&
        characterPrestigeRank > 0;

      if (isPrestige) {
        if (maxActRankCount >= maxSeasonRewardCount) {
          if (isLastAct) {
            if (characterSeasonRank >= maxActRankCount) {
              return characterPrestigeRank + maxActRankCount; // Adding prestige levels to max rank when at max rank
            } else {
              return characterSeasonRank; // Regular season progression level when below max rank
            }
          } else {
            return Math.min(characterSeasonRank, maxActRankCount); // Smaller number between regular season level and max rank of current act
          }
        }
      }
      return characterSeasonRank; // Default
    };

    function getActiveActsRankCount(
      acts: DestinyDefinitions.DestinySeasonActDefinition[]
    ) {
      // default to the total rewards progression rank count
      var rankCount = rewardsDef?.steps?.length;

      const actCount = acts?.length;
      if (acts && actCount && actCount > 0) {
        rankCount = 0;

        var actIndex = 0;
        const currentDateTime = new Date();

        // if we have acts, assume we're at least on act 1, and add up the rank counts for any active acts
        do {
          rankCount += acts[actIndex].rankCount;

          actIndex += 1;
        } while (
          actIndex < actCount &&
          new Date(acts[actIndex].startTime) <= currentDateTime
        );
      }

      return rankCount;
    }

    const adjustedSteps = rewardsDef.steps.filter((value, index) => {
      return index < maxActRankCount;
    });

    const steps = adjustedSteps.map((value, i) => {
      const completeState = hasCharacterProgression
        ? i < characterSeasonalProgress.level
          ? "Complete"
          : "Incomplete"
        : "None";

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
          completeState={completeState}
          rewardStates={rewardItemStates}
          characterSeasonalOverrideStates={characterSeasonalOverrideStates}
          handleClaimingClick={(
            itemHash: number,
            rewardIndex: number,
            canClaim: boolean
          ) => this.props.handleClaimingClick(itemHash, rewardIndex, canClaim)}
          claimedReward={this.props.claimedReward}
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
          showProgress={typeof characterProgressions !== "undefined"}
          startAtPosition={
            typeof characterProgressions !== "undefined" &&
            typeof characterSeasonalProgress !== "undefined"
              ? Math.ceil(characterSeasonalProgress.level / slidesPer) - 1
              : 0
          }
          topLabel={
            hasCharacterProgression &&
            seasonHash ===
              this.props.globalState.coreSettings.destiny2CoreSettings
                .currentSeasonHash
              ? this.getCurrentSeasonProgressBar(
                  characterSeasonalProgress,
                  handleRankDisplay
                )
              : null
          }
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
              iconProps: {
                hidden: true,
              },
            }}
          >
            {this.state.tooltipDesc}
          </DestinyTooltip>
        </Tooltip>
      </div>
    );
  }

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

  private getCurrentSeasonProgressBar(
    characterSeasonalProgress: World.DestinyProgression,
    handleDisplay: (
      characterSeasonalProgress: World.DestinyProgression
    ) => number
  ) {
    if (!characterSeasonalProgress) {
      return null;
    }

    const rankLabel = Localizer.Format(
      Localizer.Seasons.RankCharacterseasonprogressionlevel,
      {
        characterSeasonProgressionLevel: handleDisplay(
          characterSeasonalProgress
        ),
      }
    );

    const progressLabel = `${characterSeasonalProgress.progressToNextLevel.toLocaleString()}/${characterSeasonalProgress.nextLevelAt.toLocaleString()}`;

    const progressPercentage =
      (characterSeasonalProgress.progressToNextLevel /
        characterSeasonalProgress.nextLevelAt) *
      100;

    const cssBar: React.CSSProperties = {
      width: `${progressPercentage}%`,
    };

    return (
      <React.Fragment>
        <div className={styles.seasonRankBar}>
          <span className={styles.rank}>{rankLabel}</span>
          <div className={styles.bar} style={cssBar} />
          <span className={styles.progress}>{progressLabel}</span>
        </div>
      </React.Fragment>
    );
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
