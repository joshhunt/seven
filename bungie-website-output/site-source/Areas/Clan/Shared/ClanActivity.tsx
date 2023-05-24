// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Milestones } from "@Platform";
import { Tooltip } from "@UIKit/Controls/Tooltip";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./ClanWeeklyRewards.module.scss";

interface ClanActivityProps
  extends D2DatabaseComponentProps<"DestinyMilestoneDefinition"> {
  weeklyRewards: Milestones.DestinyMilestone;
  activity: Milestones.DestinyMilestoneRewardEntry;
}

const ClanActivity: React.FC<ClanActivityProps> = (props) => {
  if (!props.activity) {
    return null;
  }

  const [showTooltip, setShowToolTip] = useState(false);

  const clansLoc = Localizer.Clans;
  const currentWeekRewards = props.weeklyRewards.rewards.find(
    (r) => r.rewardCategoryHash === 1064137897
  );
  const milestoneDef = props.definitions.DestinyMilestoneDefinition.get(
    props.weeklyRewards.milestoneHash
  );
  const rewardDef = Object.values(milestoneDef.rewards).find(
    (r) => r.categoryHash === currentWeekRewards.rewardCategoryHash
  );
  const activityDef = Object.values(rewardDef.rewardEntries).find(
    (e) => e.rewardEntryHash === props.activity.rewardEntryHash
  );

  const earned = props.activity.earned ? "completed" : "";
  const redeemed = props.activity.redeemed ? "earned" : "";
  const icon = activityDef.displayProperties.icon;

  const tooltipString = `${activityDef.displayProperties.name} - ${activityDef.displayProperties.description}`;

  return (
    <div
      className={classNames(styles.activity, styles[earned], styles[redeemed])}
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
      style={{
        backgroundImage: `url(${icon})${
          props.activity.earned
            ? ", url(/img/theme/destiny/bgs/clan/earnedClanEngram.png)"
            : ", url(/img/theme/destiny/bgs/clan/clanEngram.png)"
        }`,
      }}
      title={tooltipString}
    >
      <span className={styles.activityTip}>
        {props.activity.earned
          ? clansLoc.EngramCompletePickupEngram
          : tooltipString}
      </span>
      <Tooltip
        visible={showTooltip}
        classNames={{ tooltip: styles.activityTip }}
      >
        {props.activity.earned
          ? clansLoc.EngramCompletePickupEngram
          : tooltipString}
      </Tooltip>
    </div>
  );
};

export default withDestinyDefinitions(ClanActivity, {
  types: ["DestinyMilestoneDefinition"],
});
