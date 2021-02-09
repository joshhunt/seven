// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Platform } from "@Platform";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import styles from "./Calendar13.module.scss";
import { Localizer } from "@Global/Localization/Localizer";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { LegacyRef, useEffect, useState } from "react";

interface Calendar13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Calendar13: React.FC<Calendar13Props> = (props) => {
  const [calendar, setCalendar] = useState<IMarketingMediaAsset>();

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

  return (
    <div id={"calendar"} ref={props.inputRef}>
      {calendar?.largeImage ? (
        <div className={styles.calendarSection}>
          <h2 className={styles.title}>{Localizer.Seasons.Calendar}</h2>

          <div
            className={styles.calendar}
            role={"article"}
            style={{ backgroundImage: `url(${calendar.largeImage})` }}
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
      ) : null}
    </div>
  );
};
