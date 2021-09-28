// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportGroupContext } from "@Areas/Admin/Shared/ReportGroupContext";
import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { IgnoredItemType } from "@Enum";
import { Contracts, Messages } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface ReportItemMessageProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemMessage: React.FC<ReportItemMessageProps> = (props) => {
  const report = props.report;
  const message: Messages.Message = report.entity;
  const title =
    report.reportedItemType === IgnoredItemType.PrivateMessage
      ? `Reported Private Message`
      : `Reported Group Wall Post`;
  const reportedOn = `Reported On:`;
  const messageSubject = `Message Subject:`;
  const messageBody = `Message Body:`;
  const messageCreatedOn = `Message Created On:`;
  const clickForUserContext = `Click here for User Context`;

  return (
    <React.Fragment>
      <h3>{title}</h3>
      <ReportReason report={report} />
      <div>
        <strong>{reportedOn}</strong>{" "}
        <span data-reporttime={report.dateCreated}>{report.dateCreated}</span>
      </div>
      <br />
      <div>
        {message.subject?.length > 0 && (
          <>
            <strong>{messageSubject}</strong>
            <span>{message.subject}</span>
            <br />
            <br />
          </>
        )}
        <strong>{messageBody}</strong>
        <br />
        <span>{message.body}</span>
        <br />
        <br />
      </div>
      <div>
        <strong>{messageCreatedOn}</strong>{" "}
        <span data-reporttime={message.dateSent}>{message.dateSent}</span>
      </div>
      <br />
      <ReportGroupContext report={report} />
      <div>
        <Anchor url={`/en/Profile/254/${message.memberFromId}`}>
          <strong>{clickForUserContext}</strong>
        </Anchor>
      </div>
      <br />
    </React.Fragment>
  );
};
