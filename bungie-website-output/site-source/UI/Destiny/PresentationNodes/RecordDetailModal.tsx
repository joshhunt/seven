// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyRecordState } from "@Enum";
import { PresentationNodeDestinyMembershipDataStore } from "@Global/DataStore/PresentationNodeDestinyMembershipStore";
import { Responses } from "@Platform";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import React from "react";
import styles from "./RecordDetailModal.module.scss";

interface RecordDetailModalProps
  extends D2DatabaseComponentProps<
    | "DestinyRecordDefinition"
    | "DestinyObjectiveDefinition"
    | "DestinyLoreDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  recordHash: number;
  profileResponse: Responses.DestinyProfileResponse;
}

const RecordDetailModal: React.FC<RecordDetailModalProps> = (props) => {
  const recordDef = props.definitions.DestinyRecordDefinition.get(
    props.recordHash
  );

  if (!recordDef) {
    return null;
  }

  const destinyMembership = useDataStore(
    PresentationNodeDestinyMembershipDataStore
  );

  const recordComponent = PresentationNodeUtils.GetRecordComponentData(
    recordDef.hash,
    destinyMembership?.selectedCharacter?.characterId,
    props.profileResponse
  );

  const isObscured = EnumUtils.hasFlag(
    recordComponent.state,
    DestinyRecordState.Obscured
  );
  const loreDef = props.definitions.DestinyLoreDefinition.get(
    recordDef.loreHash
  );

  let completedObjectives =
    recordComponent?.objectives?.filter((o) => o.complete)?.length ?? 0;
  let objectivesTotal = recordComponent?.objectives?.length ?? 0;
  let objDef = null;

  const interval = recordDef.intervalInfo;
  const intervalScoreTotal = recordDef.intervalInfo?.intervalObjectives
    ?.map((i) => i.intervalScoreValue)
    ?.reduce((a, b) => a + b, 0);

  const intervalRecordComponent = recordComponent?.intervalObjectives;

  const intervalsCompleted = intervalRecordComponent
    ?.filter((i) => i.complete)
    ?.map((i) => i.objectiveHash);
  const intervalCompletedTotalScore =
    interval?.intervalObjectives
      ?.filter((i) =>
        intervalsCompleted?.some((c) => c === i.intervalObjectiveHash)
      )
      ?.map((i) => i.intervalScoreValue)
      ?.reduce((a, b) => a + b, 0) ?? 0;

  const currentIntervalStep = intervalsCompleted
    ? intervalsCompleted.length
    : 0;

  const intervalCompletionTotalValue =
    recordComponent?.intervalObjectives?.[currentIntervalStep]?.completionValue;
  const intervalProgressTotal =
    recordComponent?.intervalObjectives?.[currentIntervalStep]?.progress;

  const intervalCompletionScoreText = intervalRecordComponent
    ? `${intervalCompletedTotalScore} / ${intervalScoreTotal}${Localizer.Triumphs.Pts}`
    : recordDef.completionInfo?.ScoreValue
    ? `${recordDef.completionInfo?.ScoreValue}${Localizer.Triumphs.Pts}`
    : "";
  const intervalScoreProgressBarDesc =
    props.definitions.DestinyObjectiveDefinition.get(
      intervalRecordComponent?.[currentIntervalStep]?.objectiveHash
    )?.progressDescription ?? "";

  const intervalScoreProgressBar =
    intervalRecordComponent &&
    intervalRecordComponent.length === 1 &&
    intervalProgressTotal ? (
      <div className={styles.intervalProgressBar}>
        <ProgressBar
          progressToTotal={intervalProgressTotal}
          total={intervalCompletionTotalValue}
          isCompact={false}
          showBarWhenComplete={false}
          progressPercent={
            (intervalProgressTotal / intervalCompletionTotalValue) * 100
          }
          showText={true}
          description={intervalScoreProgressBarDesc}
          customText={""}
        />
      </div>
    ) : null;
  if (objectivesTotal === 1) {
    const firstObjective = recordComponent.objectives[0];
    objDef = props.definitions.DestinyObjectiveDefinition.get(
      firstObjective.objectiveHash
    );

    if (objDef) {
      completedObjectives = recordComponent.objectives[0].progress;
      objectivesTotal = objDef.completionValue;
    }
  }

  //objective rewards, not interval rewards
  const rewards = recordDef.rewardItems?.length
    ? recordDef.rewardItems?.map((r) => {
        const rewardDef = props.definitions?.DestinyInventoryItemLiteDefinition.get(
          r.itemHash
        );

        if (!rewardDef) {
          return null;
        }

        return (
          <p className={styles.rewardItem} key={r.itemHash}>
            <span
              className={styles.rewardIcon}
              style={{
                backgroundImage: `url(${rewardDef.displayProperties?.icon})`,
              }}
              title={rewardDef.displayProperties?.name}
            />
            {rewardDef.displayProperties?.name}
          </p>
        );
      })
    : null;

  const completed = () => {
    if (recordComponent?.state === DestinyRecordState.None) {
      return true;
    }

    if (intervalRecordComponent) {
      return intervalsCompleted.length === intervalRecordComponent.length;
    }

    if (objectivesTotal) {
      return completedObjectives >= objectivesTotal;
    }

    return false;
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        {recordDef?.displayProperties?.icon && (
          <img
            src={recordDef.displayProperties.icon}
            alt={recordDef.displayProperties.name}
          />
        )}
        <h2>{recordDef.displayProperties.name}</h2>
        {!completed() && (
          <p className={styles.completionScoreTotal}>
            {intervalCompletionScoreText ??
              recordDef.completionInfo?.ScoreValue}
          </p>
        )}
        {completedObjectives < objectivesTotal &&
          recordComponent?.objectives?.length > 1 &&
          PresentationNodeUtils.ShowProgressBarForSingleObjective(
            recordComponent.objectives[0],
            objDef
          ) && (
            <ProgressBar
              progressToTotal={completedObjectives}
              total={objectivesTotal}
              isCompact={true}
              showBarWhenComplete={false}
              progressPercent={(completedObjectives / objectivesTotal) * 100}
              showText={false}
              description={""}
              customText={""}
            />
          )}
        {intervalScoreProgressBar}
      </div>

      {!loreDef && !isObscured && (
        <div className={styles.description}>
          {recordDef.displayProperties?.description}
        </div>
      )}

      {recordComponent.objectives &&
        !isObscured &&
        recordComponent.objectives.map((o) => {
          const objectiveDef = props.definitions.DestinyObjectiveDefinition.get(
            o.objectiveHash
          );

          if (
            PresentationNodeUtils.ShowProgressBarForSingleObjective(
              o,
              objectiveDef
            )
          ) {
            return (
              <div className={styles.objectiveWrapper}>
                <ProgressBar
                  progressToTotal={o.progress}
                  total={o.completionValue}
                  isCompact={false}
                  showBarWhenComplete={true}
                  progressPercent={
                    (o.progress / objectiveDef.completionValue) * 100
                  }
                  showText={true}
                  description={objectiveDef.progressDescription}
                  customText={""}
                />
              </div>
            );
          }
        })}

      {rewards && (
        <div>
          <p className={styles.rewardsHeader}>{Localizer.Triumphs.Rewards}</p>
          {rewards}
        </div>
      )}

      {recordComponent.intervalObjectives &&
        !isObscured &&
        recordComponent.intervalObjectives.map((o, index) => {
          const objectiveDef = props.definitions.DestinyObjectiveDefinition.get(
            o.objectiveHash
          );

          const intervalRewards =
            interval.intervalRewards?.[index].intervalRewardItems;

          const intervalCompleted = o.progress >= objectiveDef.completionValue;

          if (
            PresentationNodeUtils.ShowProgressBarForSingleObjective(
              o,
              objectiveDef
            )
          ) {
            return (
              <div className={styles.objectiveWrapper}>
                {!intervalCompleted ? (
                  <ProgressBar
                    progressToTotal={o.progress}
                    total={o.completionValue}
                    isCompact={false}
                    showBarWhenComplete={true}
                    progressPercent={
                      (o.progress / objectiveDef.completionValue) * 100
                    }
                    showText={true}
                    description={objectiveDef.progressDescription}
                    customText={""}
                  />
                ) : intervalRewards && intervalRewards?.length ? (
                  <span className={styles.claimedRewardLabel}>
                    {Localizer.Triumphs.RewardEarned}
                  </span>
                ) : null}
                <div>
                  {intervalRewards.map((r) => {
                    const rewardDef = props.definitions.DestinyInventoryItemLiteDefinition.get(
                      r.itemHash
                    );

                    return (
                      <p className={styles.rewardItem} key={r.itemHash}>
                        <span
                          className={styles.rewardIcon}
                          style={{
                            backgroundImage: `url(${rewardDef.displayProperties?.icon})`,
                          }}
                          title={rewardDef.displayProperties?.name}
                        />
                        {rewardDef.displayProperties?.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          }
        })}

      {loreDef && !isObscured && (
        <div className={styles.loreWrapper}>
          <h2>{Localizer.PresentationNodes.Lore}</h2>
          <p className={styles.loreDescription}>
            {loreDef.displayProperties.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default withDestinyDefinitions(RecordDetailModal, {
  types: [
    "DestinyRecordDefinition",
    "DestinyObjectiveDefinition",
    "DestinyLoreDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
