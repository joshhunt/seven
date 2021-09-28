// Created by atseng, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/Admin/Shared/ReportItem.module.scss";
import { ReportItemFireteam } from "@Areas/Admin/Shared/ReportItemFireteam";
import { ReportItemGroupProfile } from "@Areas/Admin/Shared/ReportItemGroupProfile";
import { ReportItemJudgement } from "@Areas/Admin/Shared/ReportItemJudgement";
import { ReportItemMessage } from "@Areas/Admin/Shared/ReportItemMessage";
import { ReportItemPost } from "@Areas/Admin/Shared/ReportItemPost";
import { ReportItemTag } from "@Areas/Admin/Shared/ReportItemTag";
import { ReportItemUserMessage } from "@Areas/Admin/Shared/ReportItemUserMessage";
import { ReportItemUserProfile } from "@Areas/Admin/Shared/ReportItemUserProfile";
import { IgnoredItemType } from "@Enum";
import { Contracts } from "@Platform";
import React from "react";

interface ReportItemProps {
  report: Contracts.ReportedItemResponse;
  updateFollowingJudgment?: () => void;
  updateReportCount?: () => void;
}

interface ReportItemState {}

export const ReportItem: React.FC<ReportItemProps> = (props) => {
  const updateAfterJudgement = () => {
    props.updateFollowingJudgment && props.updateFollowingJudgment();
  };

  return (
    <div className={styles.reportItemContainer}>
      {props.report.reportedItemType === IgnoredItemType.Post && (
        <ReportItemPost report={props.report} />
      )}
      {props.report.reportedItemType === IgnoredItemType.Tag && (
        <ReportItemTag report={props.report} />
      )}
      {props.report.reportedItemType === IgnoredItemType.GroupProfile && (
        <ReportItemGroupProfile report={props.report} />
      )}
      {props.report.reportedItemType === IgnoredItemType.UserProfile && (
        <ReportItemUserProfile report={props.report} />
      )}
      {props.report.reportedItemType === IgnoredItemType.UserPrivateMessage && (
        <ReportItemUserMessage report={props.report} />
      )}
      {(props.report.reportedItemType === IgnoredItemType.PrivateMessage ||
        props.report.reportedItemType === IgnoredItemType.GroupWallPost) && (
        <ReportItemMessage report={props.report} />
      )}
      {props.report.reportedItemType === IgnoredItemType.Fireteam && (
        <ReportItemFireteam report={props.report} />
      )}
      <ReportItemJudgement
        report={props.report}
        judgementMade={() => updateAfterJudgement()}
        updateReportCount={() => props.updateReportCount ?? null}
      />
    </div>
  );
};
