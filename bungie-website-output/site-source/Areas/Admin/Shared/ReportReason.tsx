// Created by atseng, 2020
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contracts, Platform } from "@Platform";
import React, { useEffect, useState } from "react";
import styles from "./ReportItem.module.scss";

interface ReportReasonProps {
  report: Contracts.ReportedItemResponse;
}

export const ReportReason: React.FC<ReportReasonProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [autoReportTriggerText, setAutoReportTriggerText] = useState("");

  const getAutoReportTriggerText = (id: number) => {
    Platform.AdminService.GetAutoTriggerFromId(id).then(
      (reportTrigger: any) => {
        const offensiveString = props.report?.entity?.body?.match(
          reportTrigger?.Text?.Pattern ?? ""
        );

        setAutoReportTriggerText(offensiveString);
      }
    );
  };

  useEffect(() => {
    if (
      props.report?.AutoTriggerHelpText &&
      props.report.AutoTriggerHelpText !== "" &&
      autoReportTriggerText === ""
    ) {
      getAutoReportTriggerText(props.report.autoTriggerId);
    }
  }, [props.report, autoReportTriggerText]);

  const autoReportTrigger = `Auto Report Trigger: `;
  const autoReportedFor = `Auto Reported For: `;
  const autoReportTriggerTextLabel = `Auto Report Trigger Text: `;

  const reportedFor = `Reported For: `;
  const reportsFiled = `reports filed`;

  const reasonText = globalState.coreSettings?.ignoreReasons?.find(
    (value) => value.identifier === props.report.reason
  )?.displayName;

  return (
    <React.Fragment>
      {props.report?.autoTriggerId && (
        <React.Fragment>
          {!!autoReportTriggerText && (
            <div>
              <strong>{autoReportTriggerTextLabel}</strong>{" "}
              <span>{autoReportTriggerText}</span>
            </div>
          )}
          <div>
            <strong className={styles.label}>{autoReportTrigger}</strong>
            <span>{props.report.AutoTriggerHelpText}</span>
          </div>
          <div>
            <strong className={styles.label}>{autoReportedFor}</strong>
            <span>{reasonText}</span>
          </div>
        </React.Fragment>
      )}
      {!props.report?.autoTriggerId && (
        <div>
          <strong className={styles.label}>{reportedFor}</strong>
          <span>{reasonText}</span>
          <strong>
            (<span>{props.report.reportCount}</span> {reportsFiled})
          </strong>
        </div>
      )}
    </React.Fragment>
  );
};
