// Created by larobinson, 2020
// Copyright Bungie, Inc.

import moment from "moment";
import React from "react";
import { Localizer } from "@bungie/localization";

interface TimestampProps {
  time: string;
}

export const Timestamp: React.FC<TimestampProps> = (props) => {
  const m = moment(props.time, undefined, "en").locale(
    Localizer.CurrentCultureName
  );

  const minuteAgo = moment().subtract(1, "minutes");
  const hourAgo = moment().subtract(1, "hours");
  const dayAgo = moment().subtract(1, "days");
  const weekAgo = moment().subtract(7, "days");
  const yearAgo = moment().subtract(365, "days");

  let timeString: string;

  if (m.isBefore(yearAgo)) {
    timeString = Localizer.Format(Localizer.Time.monthabbrdayyearhourminute, {
      monthabbr: m.format("MMM"),
      day: m.format("Do"),
      hour12: m.format("h"),
      hour24: m.format("H"),
      minute: m.format("MM"),
      ampm: m.format("a"),
      year: m.format("YYYY"),
    });
  } else if (m.isBefore(weekAgo)) {
    timeString = Localizer.Format(Localizer.Time.monthabbrdayhourminute, {
      monthabbr: m.format("MMM"),
      day: m.format("Do"),
      hour12: m.format("h"),
      hour24: m.format("H"),
      minute: m.format("MM"),
      ampm: m.format("a"),
    });
  } else if (m.isBefore(dayAgo)) {
    const now = moment();
    const timeAgo = moment.duration(m.diff(now));
    const daysAgo = Math.floor(Math.abs(timeAgo.asDays()));

    timeString =
      daysAgo === 1
        ? Localizer.Time.DayAgo
        : Localizer.Format(Localizer.Time.DaysAgo, { days: daysAgo });
  } else if (m.isBefore(hourAgo)) {
    const now = moment();
    const timeAgo = moment.duration(m.diff(now));
    const hoursAgo = Math.floor(Math.abs(timeAgo.asHours()));

    timeString =
      hoursAgo === 1
        ? Localizer.Time.HourAgo
        : Localizer.Format(Localizer.Time.HoursAgo, { hours: hoursAgo });
  } else if (m.isBefore(minuteAgo)) {
    const now = moment();
    const timeAgo = moment.duration(m.diff(now));
    const minutesAgo = Math.floor(Math.abs(timeAgo.asMinutes()));

    timeString =
      minutesAgo === 1
        ? Localizer.Time.MinuteAgo
        : Localizer.Format(Localizer.Time.MinutesAgo, { minutes: minutesAgo });
  } else {
    timeString = Localizer.Time.TimeFormatOneMinuteAgo;
  }

  return <span>{timeString}</span>;
};
