// Created by atseng, 2023
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { EmailValidationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import styles from "./ApplicationEmailVerification.module.scss";

export const ApplicationEmailVerification: React.FC = () => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const applicationLoc = Localizer.Application;
  const messagesLoc = Localizer.Messages;

  const emailStatus = (statusString: string) => (
    <div className={styles.emailStatus}>{statusString}</div>
  );

  const resendVerificationAnchor = (
    <div className={styles.emailStatusAction}>
      <Anchor
        url={RouteHelper.ResendEmailVerification(
          globalState.loggedInUser?.user?.membershipId
        )}
        target={"_blank"}
      >
        {messagesLoc.UserEmailRequestVerification}
      </Anchor>
    </div>
  );

  const emailVerificationState = () => {
    switch (globalState?.loggedInUser?.emailStatus) {
      case EmailValidationStatus.VALID:
        return emailStatus(messagesLoc.UserEmailValid);

      case EmailValidationStatus.VERIFYING:
        return (
          <>
            {emailStatus(messagesLoc.UserEmailVerificationSent)}
            {resendVerificationAnchor}
          </>
        );
      case EmailValidationStatus.NONE:
        return (
          <>
            {emailStatus(messagesLoc.UserEmailStatusNotFound)}
            {resendVerificationAnchor}
          </>
        );
      default:
        return (
          <>
            {emailStatus(messagesLoc.UserEmailMissingOrInvalidBlacklist)}
            {resendVerificationAnchor}
          </>
        );
    }
  };

  return (
    <div className={styles.emailVerification}>
      <h4>{applicationLoc.VerifyYourEmailAddress}</h4>
      <p className={styles.email}>{globalState?.loggedInUser?.email}</p>
      <p className={styles.link}>
        <Anchor url={RouteHelper.EmailAndSms()} target={"_blank"}>
          {applicationLoc.ChangeEmailLink}
        </Anchor>
      </p>
      {emailVerificationState()}
    </div>
  );
};
