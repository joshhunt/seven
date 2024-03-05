// Created by atseng, 2023
// Copyright Bungie, Inc.

import modalStyles from "./CreateFireteamModals.module.scss";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import React from "react";

interface CreateFireteamModalHeaderProps {
  title: string;
  onSave: () => void;
  onClose: () => void;
}

export const CreateFireteamModalHeader: React.FC<CreateFireteamModalHeaderProps> = (
  props
) => {
  return (
    <div className={modalStyles.header}>
      <span>{props.title}</span>
      <span
        className={classNames(modalStyles.modalAction, modalStyles.save)}
        onClick={() => {
          props.onSave();
        }}
      >
        {Localizer.Actions.Save}
      </span>
    </div>
  );
};
