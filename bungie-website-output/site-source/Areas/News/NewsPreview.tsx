// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { DateTime } from "luxon";
import React from "react";
import { RouteHelper } from "../../Global/Routes/RouteHelper";
import { Anchor } from "../../UI/Navigation/Anchor";
import styles from "./NewsPreview.module.scss";

interface NewsPreviewItemProps {
  articleData: any;
}

export const NewsPreview: React.FC<NewsPreviewItemProps> = ({
  articleData,
}) => {
  const { image, subtitle, date, title, url } = articleData;

  const luxonDate = DateTime.fromISO(date.toString());
  const timeSince = luxonDate.diffNow();
  const timeString =
    Math.abs(timeSince.as("hours")) > 24
      ? Localizer.time.CompactMonthDayYear
      : Localizer.time.TimeHoursSince;

  const time = Localizer.Format(timeString, {
    monthabbr: Localizer.time["MonthAbbr" + luxonDate.month],
    month: luxonDate.month,
    day: luxonDate.day,
    year: luxonDate.year,
    hours: Math.ceil(timeSince.as("hours")),
  });

  return (
    <Anchor
      className={styles.previewContainer}
      url={RouteHelper.TemporaryNewsArticle({ articleUrl: url.slice(1) })}
    >
      <div
        style={{ backgroundImage: `url(${image.url}` }}
        className={styles.thumbnail}
      />
      <div className={styles.text}>
        <h4 className={styles.subtitle}>
          {subtitle}
          <span>{" – " + time}</span>
        </h4>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </Anchor>
  );
};
