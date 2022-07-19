// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import React, { useEffect } from "react";
import { Prompt, useHistory } from "react-router";
import styles from "../../Account.module.scss";

interface SaveButtonBarProps extends React.HTMLProps<HTMLDivElement> {
  saveButton: React.ReactNode;
  showing: boolean;
}

export const SaveButtonBar: React.FC<SaveButtonBarProps> = (props) => {
  const confirmNavigation = (e: Event) => {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = Localizer.messages.beforeunloadconfirmationmessage;
  };

  const history = useHistory();

  useEffect(() => {
    if (props.showing) {
      window.addEventListener("beforeunload", confirmNavigation);

      return () => {
        window.removeEventListener("beforeunload", confirmNavigation);
      };
    }
  }, [props.showing]);

  return (
    <div
      className={classNames(props.className, styles.saveButtonBar, {
        [styles.showing]: props.showing,
      })}
    >
      <p>{Localizer.Account.YourSettingsHaveChanged}</p>
      {props.saveButton}
      <Prompt
        when={props.showing}
        message={Localizer.messages.beforeunloadconfirmationmessage}
      />
    </div>
  );
};
