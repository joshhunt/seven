// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DestinyDefinitions } from "@Definitions";
import { DestinyUnlockValueUIStyle } from "@Enum";
import {
  Collectibles,
  Definitions,
  Metrics,
  Presentation,
  Quests,
  Records,
  Responses,
} from "@Platform";

export class PresentationNodeUtils {
  public static GetPresentationComponentData(
    nodeHash: number,
    characterId: string,
    profileResponse: Responses.DestinyProfileResponse
  ): Presentation.DestinyPresentationNodeComponent {
    const profileData =
      profileResponse?.profilePresentationNodes?.data?.nodes?.[nodeHash];
    const characterDataList =
      profileResponse?.characterPresentationNodes?.data?.[characterId];

    const characterData = characterDataList?.nodes?.[nodeHash];

    return profileData ?? characterData;
  }

  public static GetRecordComponentData(
    nodeHash: number,
    characterId: string,
    profileResponse: Responses.DestinyProfileResponse
  ): Records.DestinyRecordComponent {
    const profileData =
      profileResponse?.profileRecords?.data?.records?.[nodeHash];
    const characterDataList =
      profileResponse?.characterRecords?.data?.[characterId];

    const characterData = characterDataList?.records?.[nodeHash];

    return profileData ?? characterData;
  }

  public static GetCollectibleComponentData(
    collectibleHash: number,
    characterId: string,
    profileResponse: Responses.DestinyProfileResponse
  ): Collectibles.DestinyCollectibleComponent {
    const profileData =
      profileResponse?.profileCollectibles?.data?.collectibles?.[
        collectibleHash
      ];
    const characterDataList =
      profileResponse?.characterCollectibles?.data?.[characterId];

    const characterData = characterDataList?.collectibles?.[collectibleHash];

    return profileData ?? characterData;
  }

  public static GetMetricComponentData(
    metricHash: number,
    characterId: string,
    profileResponse: Responses.DestinyProfileResponse
  ): Metrics.DestinyMetricComponent {
    return profileResponse?.metrics?.data?.metrics?.[metricHash];
  }

  public static ProgressString(
    objectiveDefinition: DestinyDefinitions.DestinyObjectiveDefinition,
    progress: Quests.DestinyObjectiveProgress
  ): string {
    if (objectiveDefinition && progress) {
      let progressText = progress.progress;
      const totalText = progress.completionValue;

      if (
        (!objectiveDefinition || !objectiveDefinition.allowOvercompletion) &&
        progress.progress >= progress.completionValue
      ) {
        progressText = progress.completionValue;
      }

      if (
        objectiveDefinition &&
        objectiveDefinition.allowOvercompletion &&
        progress.progress >= progress.completionValue
      ) {
        return progress.progress.toString();
      }

      return `${progressText} / ${totalText}`;
    }

    return "";
  }

  public static ShowProgressBarForSingleObjective(
    objectiveProgress: Quests.DestinyObjectiveProgress,
    objectiveDefinition: Definitions.DestinyObjectiveDefinition
  ): boolean {
    let showProgressBar = false;

    if (objectiveDefinition) {
      let valueStyle = objectiveDefinition.inProgressValueStyle;
      if (objectiveProgress.complete) {
        valueStyle = objectiveDefinition.completedValueStyle;
      }

      if (
        objectiveDefinition.allowOvercompletion ||
        objectiveDefinition.completionValue > 1 ||
        (objectiveProgress.complete &&
          valueStyle !== DestinyUnlockValueUIStyle.Automatic)
      ) {
        switch (valueStyle) {
          case DestinyUnlockValueUIStyle.Automatic:
          case DestinyUnlockValueUIStyle.Fraction:
          case DestinyUnlockValueUIStyle.Percentage:
          case DestinyUnlockValueUIStyle.FractionFloat:
          case DestinyUnlockValueUIStyle.Integer:
            showProgressBar = true;
            break;
          case DestinyUnlockValueUIStyle.DateTime:
          case DestinyUnlockValueUIStyle.TimeDuration:
          case DestinyUnlockValueUIStyle.Checkbox:
          case DestinyUnlockValueUIStyle.Hidden:
          case DestinyUnlockValueUIStyle.Multiplier:
            showProgressBar = false;
            break;
        }
      }
    }

    return showProgressBar;
  }

  public static CommendationAdjustedScore(score: number) {
    return Math.round((score * 9999) / (score + 5000));
  }

  /* Match and replace variables in record strings */
  public static SanitizeRecordDescription(
    description: string,
    profileStringVariables: Responses.DestinyProfileResponse["profileStringVariables"]
  ) {
    /* Match {var: + one or more digits + } */
    if (description) {
      const VARIABLE_HASH_REGEX = /\{var:(\d+)\}/g;
      const stringVariables =
        profileStringVariables?.data.integerValuesByHash || {};

      /* Replace the {var:SOME_NUMBERS} in the provided string with the matching variable OR return it if there is no match. */
      return description.replace(VARIABLE_HASH_REGEX, (fullMatch, key) =>
        Object?.hasOwn(stringVariables, key)
          ? String(stringVariables[key])
          : fullMatch
      );
    }

    return null;
  }
}
