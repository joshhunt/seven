// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import styles from "@Areas/User/AccountComponents/Privacy.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { NotificationGrouping, NotificationMethods } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { Grid, GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React, { Fragment, useContext, useEffect, useState } from "react";
import accountStyles from "../Account.module.scss";

interface NotificationDetail {
  name: string;
  type: string;
  EMAIL: boolean;
  MOBILE_PUSH: boolean;
  WEB_ONLY: boolean;
  grouping: string;
}

export const Notifications: React.FC = () => {
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);
  const [notifications, setNotifications] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  let initialNotifications: NotificationDetail[] = [];

  useEffect(() => {
    Platform.UserService.GetNotificationSettings(
      useQueryMid
        ? membershipIdFromQuery
        : globalStateData?.loggedInUser?.user?.membershipId
    )
      .then((notifs) => {
        initialNotifications = notifs.map((notification) => {
          /*JIRA: CTPLXP-2149 -- This is not the ideal method of removing these notifications
           * Deprecation needs to occur within services, full scope undefined but seen in:
           * NotificationTypes.cs, NotificationDefinitions.cs, NotificationController.cs, GroupActivityProcessor.cs
           * */
          if (
            notification?.notificationType === "43" ||
            notification?.notificationType === "11" ||
            notification?.notificationType === "5"
          ) {
            return {
              name: null,
              type: null,
              EMAIL: null,
              MOBILE_PUSH: null,
              WEB_ONLY: null,
              grouping: null,
            };
          }

          const emailValid = EnumUtils.hasFlag(
            notification.possibleMethods,
            NotificationMethods.EMAIL
          );
          const emailChecked =
            notification?.notificationMethod === "1" ||
            notification?.notificationMethod === "3" ||
            notification?.notificationMethod === "5" ||
            notification?.notificationMethod === "7";
          const pushValid = EnumUtils.hasFlag(
            notification.possibleMethods,
            NotificationMethods.MOBILE_PUSH
          );
          const pushChecked =
            notification?.notificationMethod === "2" ||
            notification?.notificationMethod === "3" ||
            notification?.notificationMethod === "6" ||
            notification?.notificationMethod === "7";
          const webValid = EnumUtils.hasFlag(
            notification.possibleMethods,
            NotificationMethods.WEB_ONLY
          );
          const webChecked =
            notification?.notificationMethod === "4" ||
            notification?.notificationMethod === "5" ||
            notification?.notificationMethod === "6" ||
            notification?.notificationMethod === "7";

          return {
            name: notification?.displayName,
            type: notification?.notificationType,
            EMAIL: emailValid ? emailChecked : null,
            MOBILE_PUSH: pushValid ? pushChecked : null,
            WEB_ONLY: webValid ? webChecked : null,
            grouping: EnumUtils.getStringValue(
              notification?.grouping,
              NotificationGrouping
            ),
          } as NotificationDetail;
        });

        setNotifications(initialNotifications);
      })
      .catch(ConvertToPlatformError)
      .catch((err) => Modal.error(err));
  }, []);

  const showSettingsChangedToast = () => {
    Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
      position: "br",
    });
  };

  const updateNotificationPreference = (
    checked: boolean,
    type: string,
    method: NotificationMethods
  ) => {
    setSubmitting(true);

    // the update endpoint expects a list of changed settings, but it is a better user experience to be able to update one at a time and not have to confirm teh change as that is the more common use case
    const notificationUpdateRequest = {
      settings: [
        {
          notificationType: type,
          notifyEmail:
            method === NotificationMethods.EMAIL
              ? checked
              : notifications.find(
                  (notification) => notification.type === type
                )[NotificationMethods.EMAIL],
          notifyWeb:
            method === NotificationMethods.WEB_ONLY
              ? checked
              : notifications.find(
                  (notification) => notification.type === type
                )[NotificationMethods.WEB_ONLY],
          notifyMobile:
            method === NotificationMethods.MOBILE_PUSH
              ? checked
              : notifications.find(
                  (notification) => notification.type === type
                )[NotificationMethods.MOBILE_PUSH],
        },
      ],
    };

    Platform.UserService.UpdateNotificationSetting(notificationUpdateRequest)
      .then((errors) => {
        GlobalStateDataStore.actions
          .refreshCurrentUser(true)
          .async.then((data) => {
            showSettingsChangedToast();
          });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e))
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleChange = (
    checked: boolean,
    type: string,
    method: NotificationMethods
  ) => {
    const currentNotifications = [...notifications];
    const clickedNotificationByType = currentNotifications.find(
      (notification) => notification.type === type
    );
    const notificationMethod = EnumUtils.getStringValue(
      method,
      NotificationMethods
    );

    clickedNotificationByType[notificationMethod] = !clickedNotificationByType[
      notificationMethod
    ];

    setNotifications(currentNotifications);
    updateNotificationPreference(checked, type, method);
  };

  return (
    <div className={styles.notifications}>
      <GridCol cols={12}>
        <h3>{Localizer.Userpages.NotificationSettingsHeader}</h3>
      </GridCol>
      <Grid>
        {EnumUtils.getStringKeys(NotificationGrouping).map(
          (grouping: string, i) => {
            // Filter notifications for the current grouping
            const groupingNotifications = notifications.filter(
              (ns) => ns.grouping === grouping
            );

            return grouping.toLowerCase() !== "none" &&
              groupingNotifications.length > 0 ? (
              <Fragment key={`${grouping}-${i}`}>
                <GridDivider cols={12} className={accountStyles.mainDivider} />
                <GridCol
                  key={grouping.toString()}
                  cols={3}
                  medium={12}
                  className={styles.groupingTitle}
                >
                  <div>
                    {
                      Localizer.Profile[
                        "NotificationGrouping_" + grouping.toString()
                      ]
                    }
                  </div>
                </GridCol>
                <GridCol cols={9} medium={12}>
                  <div>
                    <GridCol cols={6} />
                    <GridCol cols={2} className={styles.centered}>
                      <p>{Localizer.Helptext.NotificationHeaderEMail}</p>
                    </GridCol>
                    <GridCol cols={2} className={styles.centered}>
                      <p>{Localizer.Helptext.NotificationHeaderMobile}</p>
                    </GridCol>
                    <GridCol cols={2} className={styles.centered}>
                      <p>{Localizer.Helptext.NotificationHeaderWeb}</p>
                    </GridCol>
                  </div>
                  {groupingNotifications.map((notification, i) => {
                    return (
                      <Fragment key={`${notification?.name}-${i}`}>
                        {i !== 0 ? (
                          <GridDivider
                            cols={12}
                            className={styles.optionsRowDivider}
                          />
                        ) : (
                          <div className={styles.firstRowSpace} />
                        )}
                        <GridCol cols={6} key={notification.name.toString()}>
                          <p className={styles.notificationTitle}>
                            {notification.name}
                          </p>
                        </GridCol>
                        {EnumUtils.getStringKeys(NotificationMethods).map(
                          (specificMethod) => {
                            if (
                              NotificationMethods[
                                specificMethod as EnumStrings<
                                  typeof NotificationMethods
                                >
                              ] === NotificationMethods.None
                            ) {
                              return null;
                            }
                            {
                              /* We have specifically set this to null above if we don't want a checkbox for this option to show at all */
                            }

                            return notification[specificMethod.toString()] !==
                              null ? (
                              <GridCol
                                cols={2}
                                className={styles.centered}
                                key={
                                  notification.name + specificMethod.toString()
                                }
                              >
                                <div>
                                  <Checkbox
                                    checked={
                                      notifications.find(
                                        (x) => x.name === notification.name
                                      )?.[specificMethod.toString()]
                                    }
                                    onChecked={(checked) => {
                                      handleChange(
                                        checked,
                                        notification.type,
                                        NotificationMethods[
                                          specificMethod as EnumStrings<
                                            typeof NotificationMethods
                                          >
                                        ]
                                      );
                                    }}
                                  />
                                </div>
                              </GridCol>
                            ) : (
                              <GridCol
                                cols={2}
                                className={styles.centered}
                                key={
                                  notification.name + specificMethod.toString()
                                }
                              />
                            );
                          }
                        )}
                      </Fragment>
                    );
                  })}
                </GridCol>
              </Fragment>
            ) : null;
          }
        )}
      </Grid>
    </div>
  );
};
