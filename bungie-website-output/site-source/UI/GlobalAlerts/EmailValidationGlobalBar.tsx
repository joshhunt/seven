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

export const EmailValidationGlobalBar: React.FC = (props) => {
  const localStorageKey = "show-email-validation-alert";
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const getEmailValidationState = (): EmailValidationState => {
    if (!loggedInUser) {
      return null;
    }

    return UserUtils.getEmailValidationState(loggedInUser.emailStatus);
  };

  // the specific global alert bar should not control its visibility status, but it should define the requirements for it to show initially and then defer to localStorage which is updated by GlobalBar itself
  const isVisibleInitially = () => {
    if (JSON.parse(window.localStorage.getItem(localStorageKey)) !== null) {
      return JSON.parse(window.localStorage.getItem(localStorageKey));
    } else {
      const isNotVerified =
        getEmailValidationState() === EmailValidationState.None ||
        getEmailValidationState() === EmailValidationState.Verifying;
      window.localStorage.setItem(localStorageKey, isNotVerified.toString());

      return isNotVerified;
    }
  };

  return (
    <GlobalBar
      initiallyVisible={isVisibleInitially()}
      barClassNames={styles.emailValidation}
      url={RouteHelper.EmailAndSms()}
      message={Localizer.Emails.VerifyYourEmail}
      dismissible={true}
      localStorageKey={localStorageKey}
    />
  );
};
