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

  /*
	internal static DestinyObjectiveProgress BuildForObjective(
			uint objectiveHash,
			IUnlockContext itemUnlockContext)
		{
			DestinyObjectiveProgress objectiveProgress = null;

			var objectiveDefinition = DestinyDefinitionUtility.GetInternalDefinition<DestinyObjectiveDefinition>(objectiveHash);

			if (objectiveDefinition != null)
			{
				bool hasProgress = false;
				int? progress = null;

				if (itemUnlockContext.HasValue(objectiveDefinition.unlockValueHash))
				{
					hasProgress = true;
					progress = itemUnlockContext.GetValue(objectiveDefinition.unlockValueHash);
				}
				else if (objectiveDefinition.progressUnlockExpression != null)
				{
					var progressResult = UnlockExpressionParser.EvaluateExpression(objectiveDefinition.progressUnlockExpression, itemUnlockContext);

					if (progressResult != null)
					{
						progress = progressResult.valueResult;
						hasProgress = true;
					}
				}

				objectiveProgress = new DestinyObjectiveProgress()
				{
					objectiveHash = objectiveDefinition.hash,
					progress = progress,
					completionValue = CalculateCompletionValue(objectiveDefinition, itemUnlockContext)
				};

				if (hasProgress)
				{
					if (objectiveDefinition.isCountingDownward)
					{
						// from <branch>\shared\engine\source\engine\investment\shared_logic\objective\investment_objective_utilities.cpp
						// The objective is completed if:
						//   a) The unlock value is not the default value (0) AND
						//   b) The unlock value is less than or equal to the completion value.
						objectiveProgress.complete = (objectiveProgress.progress != 0
							&& objectiveProgress.progress <= objectiveProgress.completionValue);
					}
					else
					{
						objectiveProgress.complete = (objectiveProgress.progress >= objectiveProgress.completionValue);
					}

					if (objectiveProgress.complete && !objectiveDefinition.allowOvercompletion)
					{
						objectiveProgress.progress = objectiveProgress.completionValue;
					}
				}
				else
				{
					objectiveProgress.complete = false;
				}

				objectiveProgress.visible =
					UnlockExpressionParser.IsExpressionSuccess(objectiveDefinition.visibilityUnlockExpression, itemUnlockContext);

				if (objectiveDefinition.isDisplayOnlyObjective && objectiveDefinition?.displayOnlyValueOverride?.steps != null && objectiveDefinition.displayOnlyValueOverride.steps.Any())
				{
					var displayValue = UnlockExpressionParser.EvaluateExpression(objectiveDefinition.displayOnlyValueOverride, itemUnlockContext);
					objectiveProgress.progress = displayValue?.valueResult ?? 0;
				}

				var locationDefinition =
						DestinyDefinitionUtility.GetInternalDefinition<DestinyLocationDefinition>(
							objectiveDefinition.locationHash);

				if (locationDefinition != null && locationDefinition.locationReleases != null)
				{
					var locationRelease =
						locationDefinition.locationReleases.FirstOrDefault(
							lr =>
								UnlockExpressionParser.EvaluateExpression(lr.activeUnlockExpression, itemUnlockContext)
									.processingResult);

					if (locationRelease != null)
					{
						objectiveProgress.activityHash = locationRelease.activityHash;
						objectiveProgress.destinationHash = locationRelease.destinationHash;
					}
				}
			}

			return objectiveProgress;
		}
	 */
}
