// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./CreateFireteam.module.scss";
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
import { MandarinTraditional } from "flatpickr/dist/l10n/zh-tw.js";
import Flatpickr from "react-flatpickr";
import { Icon } from "@UIKit/Controls/Icon";

interface FireteamSchedulerProps {
  dateTimeValue: string;
  setDateTimeValue: (d: string) => void;
}

export const FireteamScheduler: React.FC<FireteamSchedulerProps> = (props) => {
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
          return MandarinTraditional;
        case "zh-chs":
          return Mandarin;
      }
    }

    return null;
  };

  return (
    <div className={classNames(styles.calendar)}>
      <div className={classNames(styles.schedulerWrapper, styles.inputBox)}>
        <Icon
          iconType={"fa"}
          iconName={"calendar"}
          className={classNames(styles.flexIcon)}
        />
        <Flatpickr
          className={classNames(styles.flatpickrInput)}
          data-enable-time
          value={props?.dateTimeValue}
          options={{
            animate: true,
            clickOpens: true,
            dateFormat: "Z",
            altInput: true,
            onReady: () => {
              const defaultDateTime = DateTime.now().toUTC().toString();

              props.setDateTimeValue(defaultDateTime);
            },
            altFormat: `F j, Y ${
              Localizer.CurrentCultureName === "en" ? "h:i K" : "H:i"
            }`,
            maxDate: DateTime.now().plus({ weeks: 2 }).toUTC().toString(),
            minDate: DateTime.now().startOf("day").toUTC().toString(),
            time_24hr: Localizer.CurrentCultureName !== "en",
            locale: convertLocaleToFlatpickrLocale(
              Localizer.CurrentCultureName
            ),
          }}
          onChange={([newValue]) => {
            if (newValue) {
              props.setDateTimeValue(newValue.toUTCString());
            } else {
              props.setDateTimeValue(DateTime.now().toUTC().toString());
            }
          }}
          aria-label={Localizer.Fireteams.ChooseAStartingTime}
          name={"dateTimePicker"}
        />
      </div>
    </div>
  );
};
