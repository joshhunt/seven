// Created by atseng, 2023
// Copyright Bungie, Inc.

import ClanActivity from "@Areas/Clan/Shared/ClanActivity";
import { Milestones, Platform } from "@Platform";
import React, { useEffect, useState } from "react";
import styles from "./ClanWeeklyRewards.module.scss";

interface ClanWeeklyRewardsProps {
  clanId: string;
}

export const ClanWeeklyRewards: React.FC<ClanWeeklyRewardsProps> = (props) => {
  const [weeklyRewards, setWeeklyRewards] = useState<
    Milestones.DestinyMilestone
  >();

  const getWeeklyRewards = () => {
    Platform.Destiny2Service.GetClanWeeklyRewardState(props.clanId).then(
      (result) => {
        setWeeklyRewards(result);
      }
    );
  };

  useEffect(() => {
    getWeeklyRewards();
  }, []);

  if (!weeklyRewards) {
    return null;
  }

  const currentWeekRewards = weeklyRewards.rewards.find(
    (r) => r.rewardCategoryHash === 1064137897
  );

  return (
    <div className={styles.activityContainer}>
      {(!currentWeekRewards || !currentWeekRewards.entries) && (
        <>
          <div className={styles.activity} />
          <div className={styles.activity} />
          <div className={styles.activity} />
          <div className={styles.activity} />
        </>
      )}
      {currentWeekRewards &&
        currentWeekRewards.entries &&
        currentWeekRewards.entries.map((e) => (
          <ClanActivity
            activity={e}
            weeklyRewards={weeklyRewards}
            key={e.rewardEntryHash}
          />
        ))}
    </div>
  );
};
