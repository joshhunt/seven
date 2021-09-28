// Created by atseng, 2020
// Copyright Bungie, Inc.

import { Contracts } from "@Platform";
import React from "react";
import { Anchor } from "@UI/Navigation/Anchor";

interface ReportGroupContextProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportGroupContext: React.FC<ReportGroupContextProps> = (
  props
) => {
  const groupContext = `Click for reported item Group context`;

  return (
    <div>
      <strong>
        <Anchor url={`/en/Clan/${props.report.reportedItemGroupContextId}`}>
          {groupContext}
        </Anchor>
      </strong>
    </div>
  );
};
