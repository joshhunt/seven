// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Platform } from "@Platform";
import { ContentUtils } from "@Utilities/ContentUtils";
import styles from "./Calendar13.module.scss";
import { Localizer } from "@Global/Localization/Localizer";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { LegacyRef, useEffect, useState } from "react";

interface Calendar13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Calendar13: React.FC<Calendar13Props> = (props) => {
  const [calendar, setCalendar] = useState();

  useEffect(() => {
    Platform.ContentService.GetContentByTagAndType(
      "season-calendar-chosen",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    ).then((item) => {
      const calendarTemp = ContentUtils.marketingMediaAssetFromContent(item);
      setCalendar(calendarTemp);
    });
  }, []);

  return calendar?.largeImage ? (
    <div
      id={"calendar"}
      ref={props.inputRef}
      className={styles.calendarSection}
    >
      <h2 className={styles.title}>{Localizer.Seasons.Calendar}</h2>

      <div
        className={styles.calendar}
        role={"article"}
        style={{ backgroundImage: `url(${calendar.thumbnailImage})` }}
        onClick={() => {
          Modal.open(
            <img
              src={calendar.largeImage}
              className={styles.largeImage}
              alt={Localizer.Seasons.Calendar}
            />,
            {
              isFrameless: true,
            }
          );
        }}
      />
    </div>
  ) : null;
};
