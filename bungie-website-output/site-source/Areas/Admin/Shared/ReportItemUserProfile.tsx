// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { Contracts, User } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface ReportItemUserProfileProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemUserProfile: React.FC<ReportItemUserProfileProps> = (
  props
) => {
  const report = props.report;
  const user: User.GeneralUser = report.entity;
  const reportedUserProfile = `Reported User Profile`;
  const reportedOn = `Reported On:`;
  const userUniqueName = `User Unique Name:`;
  const userUniqueNameDesc = `${user.uniqueName} (id: ${report.reportedItem})`;
  const userDisplayName = `User DisplayName:`;
  const userMotto = `User Motto:`;
  const userStatus = `User Status Text:`;
  const clickForUserProfile = `Click for User Profile`;

  return (
    <React.Fragment>
      <h3>{reportedUserProfile}</h3>
      <ReportReason report={props.report} />
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
        <strong>{userMotto}</strong>
        <br />
        <span>{user.about}</span>
        <br />
        <br />
        <strong>{userStatus}</strong>
        <br />
        <span>{user.statusText}</span>
        <br />
      </div>
      <br />
      <br />
      <div>
        <Anchor url={`/en/Profile/254/${report.reportedItem}`} target="_blank">
          <strong>{clickForUserProfile}</strong>
        </Anchor>
      </div>
    </React.Fragment>
  );
};
