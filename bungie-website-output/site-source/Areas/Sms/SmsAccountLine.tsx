// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import styles from "./SmsPage.module.scss";

interface SmsAccountLine {}

export const SmsAccountLine: React.FC<SmsAccountLine> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const loggedIn = UserUtils.isAuthenticated(globalState);

  return loggedIn ? (
    <div className={styles.handlerContainer}>
      <div className={styles.accountTitle}>{Localizer.sms.youraccount}</div>
      <div className={styles.profileLine}>
        <img
          className={styles.playerIcon}
          src={globalState.loggedInUser.user.profilePicturePath}
        />
        <div className={styles.displayName}>
          {UserUtils.loggedInUserDisplayName(globalState)}
        </div>
        <AuthTrigger isSignOut={true}>
          <span className={styles.signOut}>{Localizer.sms.SignOut}</span>
        </AuthTrigger>
      </div>
    </div>
  ) : null;
};
