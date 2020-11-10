// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonPassRewardProgression.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { World, Character } from "@Platform";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import classNames from "classnames";
import {
  SeasonPassRewardStep,
  CharacterClass,
  CompleteState,
} from "./SeasonPassRewardStep";
import { Tooltip } from "@UI/UIKit/Controls/Tooltip";
import { DestinyTooltip } from "@UI/Destiny/Tooltips/DestinyTooltip";
import { Localizer } from "@Global/Localizer";
import { DestinyDefinitions } from "@Definitions";
import { DestinyClass } from "@Enum";
import { IClaimedReward } from "../SeasonsUtilityPage";

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
  handleClick: (itemHash: number, rewardIndex: number, canClaim: boolean) => {};
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

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);
    const seasonPassDef = definitions.DestinySeasonPassDefinition.get(
      seasonDef.seasonPassHash
    );
    const rewardsDef = definitions.DestinyProgressionDefinition.get(
      seasonPassDef.rewardProgressionHash
    );

    const characterSeasonPassRewardProgression =
      typeof characterProgressions !== "undefined" &&
      typeof characterProgressions[seasonDef.seasonPassProgressionHash] !==
        "undefined"
        ? characterProgressions[seasonDef.seasonPassProgressionHash]
        : undefined;

    const prestigeProgression =
      typeof characterProgressions !== "undefined" &&
      typeof characterProgressions[seasonDef.seasonPassProgressionHash] !==
        "undefined" &&
      characterProgressions[seasonDef.seasonPassProgressionHash].level > 0
        ? characterProgressions[seasonPassDef.prestigeProgressionHash]
        : undefined;

    const characterSeasonPassProgression =
      typeof characterSeasonPassRewardProgression !== "undefined"
        ? typeof prestigeProgression !== "undefined" &&
          prestigeProgression.level > 0
          ? prestigeProgression
          : characterSeasonPassRewardProgression
        : undefined;

    const hasCharacterProgression =
      typeof characterSeasonPassProgression !== "undefined";

    const character: CharacterClass =
      hasCharacterProgression && characterClassHash !== 0
        ? this.getCharacterClass(characterClassHash)
        : CharacterClass.Hunter;

    const slidesPer = globalState.responsive.mobile ? 4 : 10;

    //remove the unwanted
    const adjustedSteps = rewardsDef.steps.filter((value, index) => {
      return index < 100;
    });

    const steps = adjustedSteps.map((value, i) => {
      const completeState = hasCharacterProgression
        ? i < characterSeasonPassRewardProgression.level
          ? "Complete"
          : "Incomplete"
        : "None";

      const rewardItemStates = hasCharacterProgression
        ? characterSeasonPassRewardProgression.rewardItemStates
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
          character={character}
          completeState={completeState}
          rewardStates={rewardItemStates}
          handleClick={(
            itemHash: number,
            rewardIndex: number,
            canClaim: boolean
          ) => this.props.handleClick(itemHash, rewardIndex, canClaim)}
          claimedReward={this.props.claimedReward}
        />
      );
    });

    const chunked = this.chunk(steps, slidesPer);

    const slides = chunked.map((a, i) => (
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
            typeof characterSeasonPassRewardProgression !== "undefined"
              ? Math.ceil(
                  characterSeasonPassRewardProgression.level / slidesPer
                ) - 1
              : 0
          }
          topLabel={
            hasCharacterProgression &&
            seasonHash ===
              this.props.globalState.coreSettings.destiny2CoreSettings
                .currentSeasonHash
              ? this.getCurrentSeasonProgressBar(
                  characterSeasonPassProgression,
                  typeof prestigeProgression !== "undefined" &&
                    prestigeProgression.level > 0
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
    characterSeasonProgression: World.DestinyProgression,
    isPrestige: boolean
  ) {
    const seasonPass = Localizer.Seasons.SeasonPass;
    const seasonalRank = Localizer.Seasons.SeasonalRank;

    const rankLabel = Localizer.Format(
      Localizer.Seasons.RankCharacterseasonprogressionlevel,
      {
        characterSeasonProgressionLevel: isPrestige
          ? characterSeasonProgression.level + 100
          : characterSeasonProgression.level,
      }
    );
    const progressLabel = `${characterSeasonProgression.progressToNextLevel.toLocaleString()}/${characterSeasonProgression.nextLevelAt.toLocaleString()}`;

    const progressPercentage =
      (characterSeasonProgression.progressToNextLevel /
        characterSeasonProgression.nextLevelAt) *
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
