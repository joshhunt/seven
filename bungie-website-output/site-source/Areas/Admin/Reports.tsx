// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ReportItem } from "@Areas/Admin/Shared/ReportItem";
import { ReportsSidebar } from "@Areas/Admin/Shared/ReportsSidebar";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Contracts, Models, Platform } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useEffect, useState } from "react";
import styles from "../Admin/Shared/ReportItem.module.scss";

interface ReportsProps extends GlobalStateComponentProps<"loggedInUser"> {}

const Reports: React.FC<ReportsProps> = (props) => {
  const [reports, setReports] = useState(null);
  const [reportsFetchErrorString, setReportsFetchErrorString] = useState("");
  const [locale, setLocale] = useState(Localizer.CurrentCultureName);
  const [queueLength, setQueueLength] = useState(0);
  const [queueReceived, setQueueReceived] = useState(false);

  useEffect(() => {
    getReports();
    getPendingReportCount();
  }, []);

  const getPendingReportCount = () => {
    Platform.AdminService.GetPendingReportCount()
      .then((response) => {
        setQueueLength(response);
        setQueueReceived(true);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setQueueReceived(true);
        Modal.error(e);
      });
  };

  const getReports = (loc = "en") => {
    const reportAssignmentFilter: Contracts.ReportAssignmentFilter = {
      locale: loc,
    };

    Platform.AdminService.GetAssignedReports(reportAssignmentFilter)
      .then((response) => {
        setReports(response);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setReportsFetchErrorString(`${e.message} (${e.errorCode})`);
        Modal.error(e);
      });
  };

  const convertLangToOptions = (languages: Models.CoreSetting[]) => {
    const langOptions: IDropdownOption[] = languages.map((value) => {
      return {
        label: value.displayName,
        value: value.displayName,
      };
    });

    return langOptions;
  };

  const updateLang = (value: string) => {
    setLocale(value);
    getReports(value);
  };
  if (!reports) {
    return <div />;
  }

  const reportQueue = `Report Queue`;
  const errorOccurred = `An error occurred while trying to load assignments:`;
  const forumPostLang = `Forum Post Language: `;
  const totalItems = `Total Items in Queue: `;
  const noReports = `There are no reports currently waiting for you.`;

  const someReportsAutoGenerated = `Some reports are auto generated based on Bungie-configured triggers rather than user reports. These allow us to be on the look out for conversations that tend to go bad, but merely tripping the trigger does not automatically mean a ban is required. Evaluate these like any other report.`;
  const resolveNoAction = `You may also mark an item as "Resolve No Action". This does not mark a user guilty, but it also does not punish those who reported the item. You should use this ton especially on items that have already been manually moderated.`;
  const blastRadiusBan = `You may sometimes select a "blast radius" ban, where all posts made by the user in a 1 hour radius around the reported post are permanently removed as well.  This tool should be used only for combating overwhelming spam attacks where it is more important to clear the content fast, as the extra posts removed.`;
  const guiltyVerdictsRemove = `Guilty verdicts remove the offending content, and will ban the user responsible, unless you select the warn option. Note that bans will notifiy users about why they were banned and for how long, with the exception of permanent bans, which do not notify the user.`;
  const multipleReportTypes = `There are multiple types of reports that can appear. They include posts, tags, group profiles, user profiles, and private messages.
Each has specific considerations, read the instructions carefully. For example, don't alias a tag unless the tag violates the code of conduct - which it almost
never will.`;
  const refreshItemList = `Refresh your item list.`;
  const youHaveNum = `You have ${reports.length} items waiting for your review.`;

  /*if (props.globalState?.loggedInUser?.userAcls.indexOf(AclEnum.BNextForumNinja) === -1)
	{
		return (<Redirect to={RouteHelper.Home.url} />);
	}*/

  return (
    <Grid className={styles.container_body}>
      <GridCol cols={12} className={styles.report_header} />
      <GridCol cols={4} className={styles.sidebar}>
        <h1>{reportQueue}</h1>
        {reportsFetchErrorString?.length > 0 && (
          <div>
            {errorOccurred} <span>{reportsFetchErrorString}</span>
          </div>
        )}
        {reportsFetchErrorString === "" && (
          <>
            <div>
              {forumPostLang}
              <Dropdown
                className={styles.langDropDown}
                options={convertLangToOptions(
                  props.globalState.coreSettings.userContentLocales
                )}
                onChange={(value) => updateLang(value)}
              />
            </div>
            <br />
            <br />
            <div>
              <div>
                <strong>{totalItems}</strong> {queueLength}
              </div>
            </div>
            <br />
            <br />
            <div>
              {reports.length === 0 && <div>{noReports}</div>}
              {reports.length > 0 && (
                <ReportsSidebar
                  itemsCount={reports.length}
                  refreshPageFn={() => getReports()}
                />
              )}
            </div>
          </>
        )}
      </GridCol>
      <GridCol cols={8} className={styles.contentHolder}>
        <div className={styles.content}>
          <div className={styles.mainContent}>
            {reports.map((report: Contracts.ReportedItemResponse) => {
              return (
                <ReportItem
                  key={report.reportedItem}
                  report={report}
                  updateFollowingJudgment={() => {
                    getReports();
                    getPendingReportCount();
                  }}
                  updateReportCount={() => setQueueLength(queueLength - 1)}
                />
              );
            })}
          </div>
        </div>
      </GridCol>
    </Grid>
  );
};

export default Reports;
