// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./FireteamCreationTime.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Fireteam } from "@Platform";
import { AiOutlineClockCircle } from "@react-icons/all-files/ai/AiOutlineClockCircle";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

interface FireteamCreationTimeProps {
  fireteamSummary: Fireteam.FireteamSummary;
  showScheduledTimeOverride?: boolean;
}

export const FireteamCreationTime: React.FC<FireteamCreationTimeProps> = (
  props
) => {
  const formatCreatedTime = (creationDate: string) => {
    const timeLoc = Localizer.Time;
    const creationLuxonDate = DateTime.fromISO(creationDate, { zone: "utc" });
    const dateFormat: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    const timeSince = creationLuxonDate.diffNow("seconds");

    const seconds = -timeSince.seconds;

    if (seconds < 86400) {
      if (seconds < 60) {
        return `${Math.round(seconds)}${timeLoc.SecondsLetter}`;
      } else {
        if (seconds < 3600) {
          return `${Math.round(seconds / 60)}${timeLoc.MinutesLetter}`;
        } else {
          if (seconds < 86400) {
            return `${Math.round(seconds / 60 / 24)}${timeLoc.HoursLetter}`;
          }
        }
      }
    }

    return creationLuxonDate.toLocal().toLocaleString(dateFormat);
  };

  if (
    !props.fireteamSummary ||
    (props.fireteamSummary.scheduledTime && !props.showScheduledTimeOverride)
  ) {
    return null;
  }

  return (
    <p className={styles.creationDate}>
      <AiOutlineClockCircle />
      {formatCreatedTime(props.fireteamSummary.dateCreated)}
    </p>
  );
};
