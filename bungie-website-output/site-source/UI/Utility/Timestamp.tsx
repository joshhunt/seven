// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DateTime } from "luxon";
import React from "react";
import { Localizer } from "@bungie/localization";

interface TimestampProps {
  time: string;
}

export const Timestamp: React.FC<TimestampProps> = (props) => {
  const date = DateTime.fromISO(props.time);
  const now = DateTime.now();
  const timeAgo = now.diff(date, ["years", "weeks", "days", "hours"]);

  let timeString: string;

  if (timeAgo?.years >= 1 || timeAgo?.weeks >= 1) {
    timeString = Localizer.Format(Localizer.Time.monthabbrdayyearhourminute, {
      monthabbr: date.toFormat("MMM"),
      day: date.toFormat("dd"),
      hour12: date.toFormat("hh"),
      hour24: date.toFormat("HH"),
      minute: date.toFormat("mm"),
      ampm: date.toFormat("a"),
      year: date.toFormat("yyyy"),
    });
  } else if (timeAgo?.days >= 1) {
    const daysAgo = Math.floor(Math.abs(timeAgo?.days));

    timeString =
      daysAgo === 1
        ? Localizer.Time.DayAgo
        : Localizer.Format(Localizer.Time.DaysAgo, { days: daysAgo });
  } else if (timeAgo?.hours >= 1) {
    const hoursAgo = Math.floor(Math.abs(timeAgo?.hours));

    timeString =
      hoursAgo === 1
        ? Localizer.Time.HourAgo
        : Localizer.Format(Localizer.Time.HoursAgo, { hours: hoursAgo });
  } else if (timeAgo?.minutes >= 1) {
    const minutesAgo = Math.floor(Math.abs(timeAgo?.minutes));

    timeString =
      minutesAgo === 1
        ? Localizer.Time.MinuteAgo
        : Localizer.Format(Localizer.Time.MinutesAgo, { minutes: minutesAgo });
  } else {
    timeString = Localizer.Time.TimeFormatOneMinuteAgo;
  }

  return <span>{timeString}</span>;
};
