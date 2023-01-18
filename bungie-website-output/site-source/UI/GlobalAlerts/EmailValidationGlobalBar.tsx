// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "@UI/GlobalAlerts/EmailValidationGlobalBar.module.scss";
import { GlobalBar } from "@UI/GlobalAlerts/GlobalBar";
import { EnumUtils } from "@Utilities/EnumUtils";
import { EmailValidationState, UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";

export const emailLocalStorageKey = "show-email-validation-alert";

export const EmailValidationGlobalBar: React.FC = (props) => {
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const getEmailValidationState = (): EmailValidationState => {
    if (!loggedInUser) {
      return null;
    }

    return UserUtils.getEmailValidationState(loggedInUser.emailStatus);
  };

  // the specific global alert bar should not control its visibility status, but it should define the requirements for it to show initially and
  // then defer to localStorage which is updated by GlobalBar itself
  const isVisibleInitially = () => {
    const showEmailAlert = !EnumUtils.looseEquals(
      getEmailValidationState(),
      EmailValidationState.Verified,
      EmailValidationState
    );

    //never show the bar if users email is validated
    if (!showEmailAlert) {
      return false;
    }

    //use the localstorage as a fallback
    if (!!window.localStorage?.getItem(emailLocalStorageKey)) {
      return window.localStorage.getItem(emailLocalStorageKey) === "true";
    } else {
      return true;
    }
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <GlobalBar
      initiallyVisible={isVisibleInitially()}
      barClassNames={styles.emailValidation}
      url={RouteHelper.EmailAndSms()}
      message={Localizer.Emails.VerifyYourEmail}
      dismissible={true}
      localStorageKey={emailLocalStorageKey}
    />
  );
};
