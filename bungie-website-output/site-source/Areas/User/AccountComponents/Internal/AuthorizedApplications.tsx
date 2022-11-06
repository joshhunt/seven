// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import styles from "@Areas/User/AccountComponents/AccountLinking.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { AclEnum, AuthorizationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Global/Routes/RouteHelper";
import { Applications, Platform } from "@Platform";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { AuthorizedAppFlair } from "./AccountLinking/AuthorizedAppFlair";

interface AuthorizedApplicationsProps {
  /** The mid of the onPageUser */
  membershipId: string;
}

export const AuthorizedApplications: React.FC<AuthorizedApplicationsProps> = (
  props
) => {
  const getLocalizedDateString = (
    date: string,
    status: "approve" | "expire"
  ) => {
    const luxonDate = DateTime.fromISO(date);
    const expirationDateString = Localizer.Format(
      Localizer.Time.CompactMonthDayYear,
      { month: luxonDate.month, day: luxonDate.day, year: luxonDate.year }
    );

    return status === "approve"
      ? Localizer.Format(Localizer.Accountlinking.ApprovedOnDate, {
          DATE: expirationDateString,
        })
      : Localizer.Format(Localizer.Accountlinking.ExpiresOnDate, {
          DATE: expirationDateString,
        });
  };

  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [applicationData, setApplicationData] = useState<
    Applications.Authorization[]
  >([]);
  const isAuthorized = (authStatus: AuthorizationStatus) =>
    EnumUtils.looseEquals(
      authStatus,
      AuthorizationStatus.Active,
      AuthorizationStatus
    );
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const appsUnlinked: string[] = [];
  const appsWithError: string[] = [];

  useEffect(() => {
    getApplicationAuthorization();
  }, []);

  const onPageMembershipId = isSelf ? loggedInUserId : membershipIdFromQuery;

  const getApplicationAuthorization = () => {
    Platform.ApplicationService.GetAuthorizations(onPageMembershipId, 0)
      .then((data) => {
        setApplicationData(data.results);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const updateButton = (appId: string, state: "unlink" | "error") => {
    if (state === "unlink") {
      appsUnlinked.push(appId);
    } else if (state === "error") {
      appsWithError.push(appId);
    }
  };

  const removeApplicationAuthorization = (applicationId: string) => {
    isSelf &&
      Platform.ApplicationService.RevokeAuthorization(
        loggedInUserId,
        applicationId
      )
        .then((errors) => {
          if (errors === 0) {
            getApplicationAuthorization();
            updateButton(applicationId, "unlink");
          }
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
          updateButton(applicationId, "error");
        });
  };

  const canSeeAndEditApplications = globalStateData?.loggedInUser?.userAcls?.includes(
    AclEnum.BNextApplicationSupervision
  );
  const allowedToReadUserDataAndAppData =
    isSelf || (isAdmin && canSeeAndEditApplications);

  return (
    applicationData?.length > 0 &&
    allowedToReadUserDataAndAppData && (
      <div className={styles.applications}>
        <GridDivider cols={12} />
        <GridCol cols={2} medium={12}>
          {Localizer.Accountlinking.AuthorizedApplications}
        </GridCol>

        <GridCol cols={8} medium={12}>
          {applicationData?.map((app, i) => {
            return (
              <TwoLineItem
                key={i}
                itemTitle={
                  <span>
                    <a href={app.link}> {app.name} </a>
                    <Icon iconName={"external-link"} iconType={"fa"} />
                  </span>
                }
                itemSubtitle={
                  <span className={styles.appAuthContainer}>
                    <span className={styles.appStatus}>
                      {
                        Localizer.AccountLinking[
                          `${EnumUtils.getStringValue(
                            app.authorizationStatus,
                            AuthorizationStatus
                          )}`
                        ]
                      }
                    </span>
                    {isAuthorized(app.authorizationStatus) && (
                      <span className={styles.appExpires}>
                        {getLocalizedDateString(
                          app.authExpirationDate,
                          "expire"
                        )}
                      </span>
                    )}
                    <span className={styles.appApproved}>
                      {getLocalizedDateString(app.authorizationDate, "approve")}
                    </span>
                    <Anchor
                      className={styles.appHistory}
                      url={RouteHelper.ApplicationHistory(
                        app.applicationId.toString()
                      )}
                    >
                      {Localizer.Accountlinking.GetHistory}
                    </Anchor>
                  </span>
                }
                icon={
                  <IconCoin
                    icon={{
                      iconName: "rocket",
                      iconType: "fa",
                      style: { fontSize: "3rem" },
                    }}
                  />
                }
                flair={
                  <AuthorizedAppFlair
                    id={app.applicationId.toString()}
                    name={app.name}
                    unlink={(id: string) => {
                      removeApplicationAuthorization(id);
                    }}
                    unlinkedRecently={appsUnlinked.includes(
                      app.applicationId.toString()
                    )}
                    revoked={
                      app.authorizationStatus === AuthorizationStatus.Revoked
                    }
                    error={appsWithError.includes(app.applicationId.toString())}
                  />
                }
              />
            );
          })}
        </GridCol>
      </div>
    )
  );
};
