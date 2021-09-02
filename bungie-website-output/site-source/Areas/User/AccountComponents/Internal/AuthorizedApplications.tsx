// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import styles from "@Areas/User/AccountComponents/AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { AclEnum, AuthorizationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Applications, Platform } from "@Platform";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";

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
  >(null);
  const isAuthorized = (authStatus: AuthorizationStatus) =>
    EnumUtils.looseEquals(
      authStatus,
      AuthorizationStatus.Active,
      AuthorizationStatus
    );
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );

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

  const removeApplicationAuthorization = (applicationId: string) => {
    isSelf &&
      Platform.ApplicationService.RevokeAuthorization(
        loggedInUserId,
        applicationId
      )
        .then((errors) => {
          if (errors === 0) {
            getApplicationAuthorization();
          }
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
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

        <GridCol cols={8} medium={12} className={styles.paginatedContent}>
          {applicationData?.map((app, i) => {
            return (
              <TwoLineItem
                key={i}
                itemTitle={
                  <span>
                    <a href={app.link} className={styles.appName}>
                      {" "}
                      {app.name}{" "}
                    </a>
                    <Icon iconName={"external-link"} iconType={"fa"} />
                  </span>
                }
                itemSubtitle={
                  <span className={styles.appAuthContainer}>
                    <span className={styles.appApproved}>
                      {getLocalizedDateString(app.authorizationDate, "approve")}
                    </span>
                    <span>
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
                    </span>
                    <span className={styles.appHistory}>
                      {Localizer.Accountlinking.GetHistory}
                    </span>
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
                  <Button
                    className={styles.removeButton}
                    buttonType={"gold"}
                    size={BasicSize.Small}
                    onClick={() => {
                      removeApplicationAuthorization(
                        app.applicationId.toString()
                      );
                    }}
                  >
                    {Localizer.UserPages.Unlink}
                  </Button>
                }
              />
            );
          })}
        </GridCol>
      </div>
    )
  );
};
