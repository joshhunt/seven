// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "@UI/GlobalAlerts/EmailValidationGlobalBar.module.scss";
import { GlobalBar } from "@UI/GlobalAlerts/GlobalBar";
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
  // previously, once the localStorage value was set to not show, we never updated it again. Now it will update to show again if someone changes their email
  const isVisibleInitially = () => {
    const isVerified =
      getEmailValidationState() !== EmailValidationState.None &&
      getEmailValidationState() !== EmailValidationState.Verifying;

    if (!!window.localStorage?.getItem(emailLocalStorageKey)) {
      return window.localStorage.getItem(emailLocalStorageKey) === "true";
    } else {
      window.localStorage.setItem(emailLocalStorageKey, isVerified.toString());

      return isVerified;
    }
  };

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
