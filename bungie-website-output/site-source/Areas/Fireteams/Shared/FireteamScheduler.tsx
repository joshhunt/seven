// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Shared/CreateFireteam.module.scss";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { French } from "flatpickr/dist/l10n/fr.js";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { German } from "flatpickr/dist/l10n/de.js";
import { Italian } from "flatpickr/dist/l10n/it.js";
import { Japanese } from "flatpickr/dist/l10n/ja.js";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { Polish } from "flatpickr/dist/l10n/pl.js";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";
import Flatpickr from "react-flatpickr";

interface FireteamSchedulerProps {
  dateTimeValue: Date;
  setDateTimeValue: (d: Date) => void;
}

export const FireteamScheduler: React.FC<FireteamSchedulerProps> = (props) => {
  const [dateTimeValue, setDateTimeValue] = useState(props.dateTimeValue);

  const setNewDateTimeValue = () => {
    props.setDateTimeValue(dateTimeValue);
  };

  const convertLocaleToFlatpickrLocale = (loc: string) => {
    if (Localizer.validLocales.some((l) => l.name === loc) && loc !== "en") {
      switch (loc) {
        case "fr":
          return French;
        case "es":
          return Spanish;
        case "de":
          return German;
        case "it":
          return Italian;
        case "ja":
          return Japanese;
        case "pt-br":
          return Portuguese;
        case "ru":
          return Russian;
        case "pl":
          return Polish;
        case "ko":
          return Korean;
        case "zh-cht":
        case "zh-chs":
          return Mandarin;
      }
    }

    return null;
  };

  return (
    <div className={styles.calendar}>
      <div className={classNames(styles.inputBoxTitle, styles.inputBox)}>
        <Flatpickr
          data-enable-time
          value={dateTimeValue}
          options={{
            animate: true,
            clickOpens: true,
            dateFormat: "Z",
            altInput: true,
            onReady: () => {
              const defaultDateTime = DateTime.now()
                .plus({ hours: 1 })
                .toUTC()
                .toJSDate();

              setDateTimeValue(defaultDateTime);
              props.setDateTimeValue(defaultDateTime);
            },
            altFormat: `F j, Y ${
              Localizer.CurrentCultureName === "en" ? "h:i K" : "H:i"
            }`,
            maxDate: DateTime.now().plus({ weeks: 2 }).toUTC().toISO(),
            minDate: DateTime.now().startOf("day").toUTC().toISO(),
            time_24hr: Localizer.CurrentCultureName !== "en",
            locale: convertLocaleToFlatpickrLocale(
              Localizer.CurrentCultureName
            ),
          }}
          onChange={([newValue]) => {
            props.setDateTimeValue(newValue);
            setDateTimeValue(newValue);
          }}
        />
      </div>
    </div>
  );
};
