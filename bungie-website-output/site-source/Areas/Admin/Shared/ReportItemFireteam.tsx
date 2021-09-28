// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ReportReason } from "@Areas/Admin/Shared/ReportReason";
import { Contracts, Fireteam } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";

interface ReportItemFireteamProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportItemFireteam: React.FC<ReportItemFireteamProps> = (
  props
) => {
  const report = props.report;
  const fireteam: Fireteam.FireteamSummary = report.entity;
  const reportedUserFireteam = `Reported User for Fireteam`;
  const reportedOn = `Reported On:`;
  const fireteamDesc = `Fireteam Description:`;
  const fireteamClanId = `Fireteam Group/Clan Id:`;

  const fireteamUrl = fireteam.isPublic
    ? `/en/ClanV2/PublicFireteam?groupId=${fireteam.groupId}&fireteamId=${fireteam.fireteamId}`
    : `/en/ClanV2/Fireteam?groupId=${fireteam.groupId}&fireteamId=${fireteam.fireteamId}`;
  const clickForFireteam = `Click to see Fireteam`;

  return (
    <>
      <h3>{reportedUserFireteam}</h3>
      <ReportReason report={report} />
      <div>
        <strong>{reportedOn}</strong>{" "}
        <span data-reporttime={report.dateCreated}>{report.dateCreated}</span>
      </div>
      <br />
      <div>
        <strong>{fireteamDesc}</strong>
        <br />
        <span>{fireteam.title}</span>
        <br />
        <strong>{fireteamClanId}</strong>
        <br />
        <span>{fireteam.groupId}</span>
      </div>
      <br />
      <br />
      <div>
        <Anchor url={fireteamUrl} target={`_blank`}>
          {clickForFireteam}
        </Anchor>
      </div>
    </>
  );
};
