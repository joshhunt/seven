// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import styles from "./ActivityStamp.module.scss";
import React from "react";

interface ActivityStampProps {
  activityGraphDefinitions: DefinitionsFetcherized<
    "DestinyFireteamFinderActivityGraphDefinition"
  >;
  activityGraphId: string;
}

export const ActivityStamp: React.FC<ActivityStampProps> = ({
  activityGraphDefinitions,
  activityGraphId,
}) => {
  const activity = activityGraphDefinitions.get(activityGraphId);
  const parentActivity = activityGraphDefinitions.get(activity?.parentHash);

  if (!activity) {
    return <div />; // Or any other placeholder
  }

  return (
    <div className={styles.activityLabel}>
      <div>
        {`${parentActivity.displayProperties.name}: ${activity.displayProperties.name}`}
      </div>
    </div>
  );
};
