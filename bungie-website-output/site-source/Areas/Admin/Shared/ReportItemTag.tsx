// Created by atseng, 2020
// Copyright Bungie, Inc.

import { Contracts } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface ReportItemTagProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemTag: React.FC<ReportItemTagProps> = (props) => {
  const report = props.report;
  const reportedTag = `Reported Tag`;
  const reportedOn = `Reported On:`;
  const tagReported = `Tag Reported:`;
  const tagContext = `Click for Tag Context`;

  return (
    <React.Fragment>
      <h3>{reportedTag}</h3>
      <div>
        <strong>{reportedOn}</strong>{" "}
        <span data-reporttime={report.dateCreated}>{report.dateCreated}</span>
      </div>
      <br />
      <div>
        <strong>{tagReported}</strong>
        <br />
        <span>{report.reportedItem}</span>
      </div>
      <br />
      <br />
      <div>
        <Anchor
          url={`/en/Forums/Topics?tg=${report.reportedItem}`}
          target="_blank"
        >
          <strong>{tagContext}</strong>
        </Anchor>
      </div>
    </React.Fragment>
  );
};
