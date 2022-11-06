// Created by atseng, 2022
// Copyright Bungie, Inc.

import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Responses } from "@Platform";
import { ProgressBar } from "@UI/Destiny/PresentationNodes/ProgressBar";
import styles from "@UI/Destiny/PresentationNodes/RecordDetailModal.module.scss";
import { PresentationNodeUtils } from "@Utilities/PresentationNodeUtils";
import React from "react";

interface MetricsDetailModalProps
  extends D2DatabaseComponentProps<
    "DestinyObjectiveDefinition" | "DestinyMetricDefinition"
  > {
  metricHash: number;
  profileResponse: Responses.DestinyProfileResponse;
}

const MetricsDetailModal: React.FC<MetricsDetailModalProps> = (props) => {
  const metricDef = props.definitions.DestinyMetricDefinition.get(
    props.metricHash
  );

  if (!metricDef) {
    return null;
  }

  const metricComponentData =
    props.profileResponse?.metrics?.data?.metrics?.[props.metricHash];

  const completedObjectives = metricComponentData?.objectiveProgress?.complete
    ? 1
    : 0;
  const total = metricComponentData?.objectiveProgress ? 1 : 0;

  const objectiveDef = props.definitions.DestinyObjectiveDefinition.get(
    metricComponentData?.objectiveProgress?.objectiveHash
  );

  return (
    <div>
      <div className={styles.modalHeader}>
        {metricDef?.displayProperties?.icon && (
          <img
            src={metricDef.displayProperties.icon}
            alt={metricDef.displayProperties?.name}
          />
        )}
        <h2>{metricDef.displayProperties?.name}</h2>
      </div>
      <div className={styles.description}>
        {metricDef?.displayProperties?.description}
      </div>
      {completedObjectives < total &&
        metricComponentData.objectiveProgress &&
        PresentationNodeUtils.ShowProgressBarForSingleObjective(
          metricComponentData.objectiveProgress,
          objectiveDef
        ) && (
          <div className={styles.objectiveWrapper}>
            <ProgressBar
              progressToTotal={metricComponentData.objectiveProgress.progress}
              total={objectiveDef.completionValue}
              isCompact={false}
              showBarWhenComplete={false}
              progressPercent={
                (metricComponentData.objectiveProgress.progress /
                  objectiveDef.completionValue) *
                100
              }
              showText={true}
              description={""}
              customText={`[${PresentationNodeUtils.ProgressString(
                objectiveDef,
                metricComponentData.objectiveProgress
              )}]`}
            />
          </div>
        )}
    </div>
  );
};

export default withDestinyDefinitions(MetricsDetailModal, {
  types: ["DestinyMetricDefinition", "DestinyObjectiveDefinition"],
});
