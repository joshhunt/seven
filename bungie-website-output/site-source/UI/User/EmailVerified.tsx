// Created by atseng, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { EmailValidationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import classNames from "classnames";
import React from "react";
import { FiMail } from "react-icons/fi";
import styles from "./EmailVerified.module.scss";

interface EmailVerifiedProps extends React.HTMLProps<HTMLDivElement> {
  hideSubtitle?: boolean;
}

export const EmailVerified: React.FC<EmailVerifiedProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  if (!globalState.loggedInUser) {
    return null;
  }

  const emailVerified =
    (globalState.loggedInUser.emailStatus & EmailValidationStatus.VALID) ===
    EmailValidationStatus.VALID;

  if (!emailVerified) {
    return null;
  }

  const registrationLoc = Localizer.Registration;

  const classes = [styles.emailVerified];
  if (props.className) {
    classes.push(props.className);
  }

  const subtitle = props.hideSubtitle
    ? ""
    : Localizer.FormatReact(registrationLoc.EmailVerifiedDesc, {
        emailSettingsLink: (
          <Anchor url={RouteHelper.EmailAndSms()}>
            {registrationLoc.UpdateItHere}
          </Anchor>
        ),
      });

  return (
    <TwoLineItem
      className={classNames(classes)}
      itemTitle={Localizer.Format(registrationLoc.EmailVerified, {
        email: globalState.loggedInUser.email,
      })}
      itemSubtitle={subtitle}
      icon={<FiMail />}
    />
  );
};
