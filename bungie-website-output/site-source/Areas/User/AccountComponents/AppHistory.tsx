// Created by larobinson, 2022
// Copyright Bungie, Inc.

import {
  formatDateForAccountTable,
  ViewerPermissionContext,
} from "@Areas/User/Account";
import accountStyles from "@Areas/User/Account.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Activities, Platform } from "@Platform";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { Grid, GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import Table from "antd/lib/table";
import styles from "./AppHistory.module.scss";

interface IAppActivityResult {
  date: string;
  activity: Activities.DestinyItemActivityRecord["details"];
  item: Activities.DestinyItemActivityDetails["itemSummary"];
  character: Activities.DestinyItemActivityDetails["characterSummary"];
  application: Activities.DestinyItemActivityRecord["application"];
  status: string;
}

interface ApplicationHistoryProps {}

export const ApplicationHistory: React.FC<ApplicationHistoryProps> = (
  props
) => {
  const { Column } = Table;
  const params = new URLSearchParams(location.search);

  const initialFilter: Record<string, any> = {
    app: params.get("app") || "0",
    act: params.get("act") || "-1",
    days: params.get("days") || "30",
  };

  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [continuationToken, setContinuationToken] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(initialFilter);

  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const [applicationHistory, setApplicationHistory] = useState<
    IAppActivityResult[]
  >([]);
  const [otherActivities, setOtherActivities] = useState([]);
  const [otherApplications, setOtherApplications] = useState([]);

  useEffect(() => {
    loadActivity();
  }, []);

  useEffect(() => {
    history.replaceState(
      null,
      null,
      location.pathname +
        `?${Object.keys(filter)
          .map((k) => filter[k] && `${k}=${filter[k]}`)
          .filter((x) => x !== null)
          .join("&")}`
    );
  }, [filter]);

  const makeTwoLineItemForCharacter = (
    item: Activities.DestinyItemActivityDetails["itemSummary"],
    characterSummary: Activities.DestinyItemActivityDetails["characterSummary"]
  ) => {
    return (
      <TwoLineItem
        icon={<IconCoin iconImageUrl={item?.iconPath} />}
        itemTitle={item?.name}
        itemSubtitle={`${
          characterSummary.className ?? Localizer.Profile.StatusUnknown
        }`}
      />
    );
  };

  const loadActivity = async (
    applicationId = "0",
    daysInPast = "0",
    activityType = "-1",
    aggregate = false
  ) => {
    const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);

    const mId = useQueryMid
      ? membershipIdFromQuery
      : globalStateData?.loggedInUser?.user?.membershipId;

    let response = null;
    setLoading(true);

    try {
      response = await Platform.ActivityService.GetDestinyItemActivities(
        BungieMembershipType.BungieNext,
        mId,
        continuationToken || null, //this has to do with pagination
        0,
        null, // can be ignored
        0,
        -1
      );

      if (response) {
        setHasMore(response?.hasMore);
        setContinuationToken(response?.replacementContinuationToken);

        const resultsData: IAppActivityResult[] = response?.results.map(
          (res) => {
            return {
              activity: res.details,
              application: res.application,
              item: res?.details?.itemSummary,
              character: res?.details?.characterSummary,
              date: res?.details?.creationDate,
              status: res?.details?.outcome === 1 ? "Success" : "Failure",
            };
          }
        );

        aggregate
          ? setApplicationHistory(applicationHistory.concat(resultsData))
          : setApplicationHistory(resultsData);
        setApplicationHistory(resultsData);
        const memory: Record<string, any> = {};

        const activities = resultsData
          .map((row) => row.activity)
          .filter((act) => {
            if (!memory[act.activityDescription]) {
              memory[act.activityDescription] = true;

              return true;
            }

            return false;
          });

        const applications = resultsData
          .map((row) => row.application)
          .filter((app) => {
            if (!memory[app.name]) {
              memory[app.name] = true;

              return true;
            }

            return false;
          });

        setOtherActivities(activities);
        setOtherApplications(applications);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const loadMore = () => {
    loadActivity(filter.app, filter.days, filter.act, true);
  };

  return (
    <Grid>
      <GridCol cols={12}>
        <h3>{Localizer.account.AppHistory}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        <div style={{ marginBottom: 16 }}>
          <Dropdown
            onChange={(value) => {
              setFilter({ ...filter, act: value });
            }}
            selectedValue={filter["act"] || "-1"}
            className={styles.dropdown}
            options={[
              { label: Localizer.Application.ActionSort, value: "-1" },
              ...otherActivities.map((act) => ({
                label: act.activityDescription,
                value: act.activityType.toString(),
              })),
            ]}
          />
          <Dropdown
            onChange={(value) => {
              setFilter({ ...filter, app: value });
            }}
            selectedValue={filter["app"] || "0"}
            options={[
              { label: Localizer.Application.ApplicationSort, value: "0" },
              ...otherApplications.map((app) => ({
                value: app.applicationId.toString(),
                label: app.name,
              })),
            ]}
            className={styles.dropdown}
          />
          <Dropdown
            onChange={(value) => {
              setFilter({ ...filter, days: value });
            }}
            selectedValue={filter["days"] || "30"}
            options={[
              { label: Localizer.Application.LastThirtyDays, value: "30" },
              { label: Localizer.Application.LastSixtyDays, value: "60" },
              { label: Localizer.Application.LastNinetyDays, value: "90" },
            ]}
            className={styles.dropdown}
          />
        </div>
        <Table
          loading={loading}
          dataSource={applicationHistory}
          bordered={false}
          className={styles.table}
          pagination={false}
          size={"small"}
          locale={{ emptyText: Localizer.Profile.Codes_NoResults }}
        >
          <Column
            title={
              <div className={styles.title}>{Localizer.Application.Date}</div>
            }
            dataIndex={"date"}
            key={"date"}
            onFilter={(value: string, record: IAppActivityResult) => {
              const recordDate = DateTime.fromISO(record.date);
              const filterDate = recordDate.minus({ days: Number(value) });

              return filterDate.startOf("day") <= recordDate.startOf("day");
            }}
            filteredValue={[filter.days.toString()]}
            render={(value, record, i) => (
              <div key={i}>{formatDateForAccountTable(value)}</div>
            )}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.title}>{Localizer.Application.Action}</div>
            }
            dataIndex={"activity"}
            key={"activity"}
            render={(value, record: IAppActivityResult) =>
              record.activity.activityDescription
            }
            onFilter={(value: string, record: IAppActivityResult) => {
              return (
                value === record.activity.activityType.toString() ||
                value === "-1"
              );
            }}
            filteredValue={[filter.act.toString()]}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.title}>{Localizer.Application.Item}</div>
            }
            dataIndex={"item"}
            key={"item"}
            render={(value, record: IAppActivityResult) =>
              makeTwoLineItemForCharacter(record.item, record.character)
            }
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.title}>
                {Localizer.Application.Application}
              </div>
            }
            dataIndex={"application"}
            key={"application"}
            render={(value, record: IAppActivityResult) =>
              record.application.name
            }
            onFilter={(value: string, record: IAppActivityResult) => {
              return (
                value === record.application.applicationId.toString() ||
                value === "0"
              );
            }}
            filteredValue={[filter.app.toString()]}
            filterMode={"menu"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.title}>{Localizer.Application.Status}</div>
            }
            dataIndex={"status"}
            key={"status"}
            fixed={"left"}
          />
        </Table>

        {hasMore && (
          <Button onClick={loadMore}>{Localizer.Profile.LoadMore}</Button>
        )}
      </GridCol>
    </Grid>
  );
};
