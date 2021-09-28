// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { GroupType } from "@Enum";
import { Contracts, GroupsV2 } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import styles from "./ReportItem.module.scss";

interface ReportItemGroupProfileProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemGroupProfile: React.FC<ReportItemGroupProfileProps> = (
  props
) => {
  const group: GroupsV2.GroupV2 = props.report.entity;
  const groupTypeString = GroupType[group.groupType];
  const reportedGroupProfile = `Reported ${groupTypeString} Profile`;

  const reportedOn = `Reported On:`;
  const reported = `Reported:`;
  const reportId = `(id: ${props.report.reportedItem})`;
  const motto = `Motto:`;
  const missionStatement = `Mission Statement:`;
  const clickForClan = `Click for Clan Profile`;
  const clickForEditHistory = `Click for Clan Profile`;
  const clickForGroup = `Click for Group Context`;

  return (
    <React.Fragment>
      <h3>{reportedGroupProfile}</h3>
      <ReportReason report={props.report} />
      <div>
        <strong className={styles.label}>{reportedOn}</strong>{" "}
        <span data-reporttime={props.report.dateCreated}>
          {props.report.dateCreated}
        </span>
      </div>
      <div>
        <p className={styles.label}>
          {groupTypeString} {reported}
        </p>
        <p>
          {group.name} {reportId}
        </p>
        <p className={styles.label}>
          {groupTypeString} {motto}
        </p>
        <div>{group.motto}</div>
        <p className={styles.label}>
          {groupTypeString} {missionStatement}
        </p>
        <div>{group.about}</div>
      </div>
      <div className={styles.contextButtons}>
        {group.groupType === GroupType.Clan && (
          <React.Fragment>
            <Anchor
              target="_blank"
              url={`/en/ClanV2/?groupid=${props.report.reportedItem}`}
            >
              {clickForClan}
            </Anchor>
            <Anchor
              target="_blank"
              url={`/en/ClanV2/edithistory?groupid=${props.report.reportedItem}`}
            >
              {clickForEditHistory}
            </Anchor>
          </React.Fragment>
        )}

        {group.groupType !== GroupType.Clan && (
          <Anchor target="_blank" url={`/en/Clan/${props.report.reportedItem}`}>
            {clickForGroup}
          </Anchor>
        )}
      </div>
    </React.Fragment>
  );
};
