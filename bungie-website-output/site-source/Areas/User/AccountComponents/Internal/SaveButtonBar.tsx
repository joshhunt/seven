// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import React from "react";
import styles from "../../Account.module.scss";

interface SaveButtonBarProps extends React.HTMLProps<HTMLDivElement> {
  saveButton: React.ReactNode;
  on: boolean;
}

export const SaveButtonBar: React.FC<SaveButtonBarProps> = (props) => {
  return (
    <div
      className={classNames(props.className, styles.saveButtonBar, {
        [styles.on]: props.on,
      })}
    >
      <p>{Localizer.Account.YourSettingsHaveChanged}</p>
      {props.saveButton}
    </div>
  );
};
