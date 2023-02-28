// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Shared/FireteamTags.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Fireteam } from "@Platform";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

interface FireteamTimeTagProps {
  fireteamSummary: Fireteam.FireteamSummary;
}

export const FireteamTimeTag: React.FC<FireteamTimeTagProps> = (props) => {
  const dateFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const luxonDate = DateTime.fromISO(
    props.fireteamSummary.scheduledTime ?? "",
    { zone: "utc" }
  );

  const dateString = props.fireteamSummary.scheduledTime
    ? luxonDate.toLocal().toLocaleString(dateFormat)
    : Localizer.Clans.Now;

  return (
    <div className={classNames(styles.scheduledTime, styles.tag)}>
      {dateString}
    </div>
  );
};
