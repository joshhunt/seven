// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { Contracts, User } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface ReportItemUserMessageProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemUserMessage: React.FC<ReportItemUserMessageProps> = (
  props
) => {
  const report = props.report;
  const user: User.GeneralUser = report.entity;
  const reportedUserForMessage = `Reported User for Private Messages`;
  const reportedOn = `Reported On:`;
  const userUniqueName = `User Unique Name:`;
  const userUniqueNameDesc = `${user.uniqueName} (id: ${report.reportedItem})`;
  const userDisplayName = `User DisplayName:`;
  const relevantPrivateMessage = `Relevant private messages:`;
  const clickForUserProfile = `Click for User Profile`;

  return (
    <React.Fragment>
      <h3>{reportedUserForMessage}</h3>
      <ReportReason report={report} />
      <div>
        <strong>{reportedOn}</strong>{" "}
        <span data-reporttime={report.dateCreated}>{report.dateCreated}</span>
      </div>
      <br />
      <div>
        <strong>{userUniqueName}</strong>
        <br />
        <span>{userUniqueNameDesc}</span>
        <br />
        <br />
        <strong>{userDisplayName}</strong>
        <br />
        <span>{user.displayName}</span>
        <br />
        <br />
        <strong>{relevantPrivateMessage}</strong>
        <br />
        {report.RelatedStrings.map((stg, index) => (
          <React.Fragment key={index}>
            <span>{stg}</span>
            <br />
            <br />
          </React.Fragment>
        ))}
        <br />
      </div>
      <br />
      <br />
      <div>
        <Anchor target="_blank" url={`/en/Profile/254/${report.reportedItem}`}>
          <strong>{clickForUserProfile}</strong>
        </Anchor>
      </div>
    </React.Fragment>
  );
};
