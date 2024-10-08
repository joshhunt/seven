// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ReportItem } from "@Areas/Admin/Shared/ReportItem";
import { ReportsSidebar } from "@Areas/Admin/Shared/ReportsSidebar";
import { PlatformError } from "@CustomErrors";
import { Contracts, Platform } from "@Platform";
import { IReportParams } from "@Routes/RouteParams";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "../Admin/Shared/ReportItem.module.scss";

interface ReportProps {}

export const Report: React.FC<ReportProps> = (props) => {
  const params = useParams<IReportParams>();

  const missingReportId = `Missing Report Id`;
  const reportQueue = `Report Queue`;

  const [report, setReport] = useState<Contracts.ReportedItemResponse[]>(null);

  const reportId = params?.reportId ?? "";

  const getReportFromId = () => {
    Platform.AdminService.GetReportFromId(reportId)
      .then((response) => {
        setReport(response);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  useEffect(() => {
    if (reportId !== "" && !report) {
      getReportFromId();
    }
  }, [report, reportId]);

  if (!report) {
    return null;
  }

  if (reportId === "") {
    return <div>{missingReportId}</div>;
  }

  return (
    <Grid className={styles.container_body}>
      <GridCol cols={12} className={styles.report_header} />
      <GridCol cols={4} className={styles.sidebar}>
        <h1>{reportQueue}</h1>
        <div>
          <ReportsSidebar itemsCount={0} />
        </div>
      </GridCol>
      <GridCol cols={8} className={styles.contentHolder}>
        <div className={styles.content}>
          <div>{<ReportItem report={report[0]} />}</div>
        </div>
      </GridCol>
    </Grid>
  );
};
