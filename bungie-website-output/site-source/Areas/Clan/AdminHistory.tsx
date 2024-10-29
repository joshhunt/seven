// Created by atseng, 2023
// Copyright Bungie, Inc.

import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { Localizer } from "@bungie/localization/Localizer";
import { AdminHistoryMembershipFlags } from "@Enum";
import { Contracts, Platform } from "@Platform";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { BasicSize } from "@UIKit/UIKitUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useParams } from "react-router";
import { Form, Formik } from "formik";
import styles from "./Shared/ClanSettings.module.scss";
import stylesHistory from "./Shared/ClanHistory.module.scss";
import "flatpickr/dist/themes/airbnb.css";

interface SearchParams {
  startDate: string;
  endDate: string;
  uniqueUserName: string;
}

export const AdminHistory: React.FC = () => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const clanId = params?.clanId ?? "0";
  const currentPage = params?.page ? parseInt(params?.page, 10) : 0;
  const maxPageSize = 25;

  const [adminHistory, setAdminHistory] = useState<
    Contracts.AdminHistoryEntry[]
  >();
  const [searchParams, setSearchParams] = useState<SearchParams>();

  const getAdminHistory = (page = 0, historySearchParams?: SearchParams) => {
    const adminHistoryFlag = AdminHistoryMembershipFlags.None;

    if (historySearchParams) {
      setSearchParams(historySearchParams);
    }

    Platform.AdminService.GetAdminHistory(
      adminHistoryFlag,
      page,
      historySearchParams?.uniqueUserName ?? "",
      historySearchParams?.startDate ??
        DateTime.now().minus({ days: 14 }).toUTC().toISO(),
      historySearchParams?.endDate ?? DateTime.now().toUTC().toISO(),
      clanId
    ).then((result) => {
      setAdminHistory(result);
    });
  };

  useEffect(() => {
    getAdminHistory();
  }, []);

  if (!adminHistory) {
    return null;
  }

  const historyExtraContent = (historyItem: Contracts.AdminHistoryEntry) => {
    if (
      historyItem.historyTypeText === "GroupWallModerate" ||
      historyItem.historyTypeText === "GroupWallBan"
    ) {
      return <blockquote>{historyItem.historyItemText}</blockquote>;
    }

    if (historyItem.foundTargetUser) {
      const targetUserString = `${historyItem.targetUser.displayName} (${historyItem.targetUser.uniqueName}) [${historyItem.targetMembershipId}]`;

      return (
        <p>
          <strong>{clansLoc.TargetUser}</strong> {targetUserString}
        </p>
      );
    }
  };

  const gotoPage = (newPage: number) => {
    getAdminHistory(newPage, searchParams);
  };

  return (
    <SettingsWrapper>
      <div className={styles.searchBox}>
        <Formik
          initialValues={{
            startDate: DateTime.now().minus({ days: 14 }).toUTC().toISO(),
            endDate: DateTime.now().toUTC().toISO(),
            uniqueUserName: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            getAdminHistory(0, values);
          }}
        >
          {(formikProps) => {
            return (
              <Form className={styles.clanSettingsForm}>
                <h6>{clansLoc.FilterHistory}</h6>
                <div className={styles.section}>
                  <label>{clansLoc.StartDateRetainedAtLeast}</label>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <Flatpickr
                      data-enable-time
                      value={formikProps.initialValues.startDate}
                      options={{
                        animate: true,
                        clickOpens: true,
                        dateFormat: "Z",
                        altInput: true,
                        altFormat: `F j, Y`,
                        maxDate: DateTime.now().toUTC().toISO(),
                        minDate: formikProps.initialValues.startDate,
                        enableTime: false,
                        locale: LocalizerUtils.convertLocaleToFlatpickrLocale(
                          Localizer.CurrentCultureName
                        ),
                      }}
                      onChange={([newValue]) => {
                        formikProps.setFieldValue(
                          "startDate",
                          DateTime.fromJSDate(newValue).toUTC().toISO()
                        );
                      }}
                    />
                  </div>
                </div>
                <div className={styles.section}>
                  <label>{clansLoc.EndDateNoMoreThan60Days}</label>
                  <div
                    className={classNames(
                      styles.inputBoxTitle,
                      styles.inputBox
                    )}
                  >
                    <Flatpickr
                      data-enable-time
                      value={formikProps.initialValues.endDate}
                      options={{
                        animate: true,
                        clickOpens: true,
                        dateFormat: "Z",
                        altInput: true,
                        altFormat: `F j, Y`,
                        maxDate: DateTime.now().toUTC().toISO(),
                        minDate: formikProps.initialValues.startDate,
                        enableTime: false,
                        locale: LocalizerUtils.convertLocaleToFlatpickrLocale(
                          Localizer.CurrentCultureName
                        ),
                      }}
                      onChange={([newValue]) => {
                        formikProps.setFieldValue(
                          "endDate",
                          DateTime.fromJSDate(newValue).toUTC().toISO()
                        );
                      }}
                    />
                  </div>
                </div>
                <FormikTextInput
                  classes={{ container: styles.inputBox }}
                  name={"uniqueUserName"}
                  type={"text"}
                  placeholder={clansLoc.UniqueUserNameOptional}
                />
                <Button
                  buttonType={"gold"}
                  submit={true}
                  size={BasicSize.Small}
                >
                  {clansLoc.GetHistory}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <h6 className={stylesHistory.sectionHeader}>{clansLoc.AdminHistory}</h6>
      {adminHistory?.length === 0 && <p>{clansLoc.ThereWereNoResults}</p>}
      <ul className={stylesHistory.historyList}>
        {adminHistory.map((a, index) => {
          const bungieGlobalName = UserUtils.getBungieNameFromBnetGeneralUser(
            a.adminUser
          );

          const displayNameString =
            a.adminUser &&
            `${a.adminUser.displayName} (${
              bungieGlobalName.bungieGlobalName +
              bungieGlobalName.bungieGlobalCodeWithHashtag
            })`;

          return (
            <li key={index}>
              <TwoLineItem
                itemTitle={
                  !a.adminUser ? clansLoc.ModeratorBungie : displayNameString
                }
                itemSubtitle={!a.adminUser ? "" : a.adminUser.membershipId}
                icon={
                  <IconCoin
                    iconImageUrl={
                      !a.adminUser
                        ? "/img/profile/avatars/disembodied_soul.gif"
                        : a.adminUser.profilePicturePath
                    }
                  />
                }
                flair={
                  <span className={stylesHistory.date}>
                    {DateTime.fromISO(a.historyDate).toFormat("yyyy LLL dd")}
                  </span>
                }
              />
              <div className={stylesHistory.extraContent}>
                <p>
                  <strong>{clansLoc.ActionType}</strong>{" "}
                  <span>{clansLoc[a.historyTypeText]}</span>
                </p>
                {historyExtraContent(a)}
              </div>
            </li>
          );
        })}
      </ul>
      <div className={stylesHistory.simplePager}>
        {currentPage > 0 && (
          <Button
            buttonType={"clear"}
            onClick={() => gotoPage(currentPage - 1)}
          >
            {Localizer.Actions.Prev}
          </Button>
        )}
        {adminHistory.length === maxPageSize && (
          <Button
            buttonType={"clear"}
            onClick={() => gotoPage(currentPage + 1)}
          >
            {Localizer.Actions.Next}
          </Button>
        )}
      </div>
    </SettingsWrapper>
  );
};
