// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import styles from "./NewsPreview.module.scss";

interface NewsPreviewItemProps {
  articleData: any;
}

export const NewsPreview: React.FC<NewsPreviewItemProps> = ({
  articleData,
}) => {
  const { image, mobile_image, subtitle, date, title, url } = articleData;

  const images = useCSWebpImages(
    useMemo(
      () => ({
        previewImg: mobile_image?.url ?? image?.url,
      }),
      [articleData]
    )
  );

  const luxonDate = DateTime?.fromISO(date?.toString());
  const timeSince = luxonDate?.diffNow();
  const timeHours = Math.abs(timeSince?.as("hours"));
  const timeString =
    timeHours > 24
      ? Localizer.time.CompactMonthDayYear
      : Localizer.time.TimeHoursSince;

  const time = Localizer.Format(timeString, {
    monthabbr: Localizer.time["MonthAbbr" + luxonDate?.month],
    month: luxonDate?.month,
    day: luxonDate?.day,
    year: luxonDate?.year,
    hours: Math.ceil(timeHours),
  });

  return (
    <Anchor
      className={styles.previewContainer}
      url={RouteHelper.NewsArticle({ articleUrl: url?.hosted_url?.slice(1) })}
    >
      <div
        style={{ backgroundImage: `url(${images?.previewImg}` }}
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
