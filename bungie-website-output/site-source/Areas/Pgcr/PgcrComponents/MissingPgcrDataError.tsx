// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import React from "react";
import styles from "../Pgcr.module.scss";

export const MissingPgcrDataError = () => {
  return (
    <div className={styles.disabledWrapper}>
      {Localizer.Messages.DestinyContentSectionNotFound}
    </div>
  );
};
