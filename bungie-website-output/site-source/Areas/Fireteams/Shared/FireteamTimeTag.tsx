// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Shared/FireteamTags.module.scss";
import calendarStyles from "@Areas/Fireteams/Shared/AddToCalendar.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Fireteam } from "@Platform";
import { AiFillCalendar } from "@react-icons/all-files/ai/AiFillCalendar";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { CalendarUtils, ICalendarOptions } from "@Utilities/CalendarUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

interface FireteamTimeTagProps {
  fireteamSummary: Fireteam.FireteamSummary;
  addToCalendarAvailable: boolean;
}

export const FireteamTimeTag: React.FC<FireteamTimeTagProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const fireteamsLoc = Localizer.Fireteams;

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
  const isScheduled = !!props.fireteamSummary?.scheduledTime;

  const dateString = isScheduled
    ? luxonDate.toLocal().toLocaleString(dateFormat)
    : Localizer.Clans.Now;

  const activityTypeString = globalState.coreSettings.fireteamActivities.find(
    (a) => a.identifier === props.fireteamSummary?.activityType?.toString()
  )?.displayName;

  const openModal = () => {
    if (!isScheduled) {
      return false;
    }

    const startTime = DateTime.fromISO(
      props.fireteamSummary?.scheduledTime
    ).toISO({ format: "basic" });

    const calendarOptions: ICalendarOptions = {
      start: startTime,
      title: props.fireteamSummary?.title,
      summary: Localizer.Format(Localizer.Fireteams.ScheduledFireteamFor, {
        activity: activityTypeString,
      }),
    };

    Modal.open(
      <div className={calendarStyles.addToCalendarModal}>
        <Button
          buttonType={"darkblue"}
          size={BasicSize.Small}
          onClick={() => CalendarUtils.AddToSystemCalendar(calendarOptions)}
        >
          {fireteamsLoc.AddToSystemCalendar}
        </Button>
        <Button
          buttonType={"darkblue"}
          size={BasicSize.Small}
          onClick={() => CalendarUtils.AddGoogleEvent(calendarOptions)}
        >
          {fireteamsLoc.AddToGoogleCalendar}
        </Button>
      </div>
    );
  };

  return (
    <div
      className={classNames(styles.scheduledTime, styles.tag, {
        [calendarStyles.addToCalendarButton]:
          isScheduled && props.addToCalendarAvailable,
      })}
      onClick={() => openModal()}
    >
      <AiFillCalendar />
      {dateString}
      {props.addToCalendarAvailable && isScheduled && (
        <span>{Localizer.Fireteams.SaveToCalendar}</span>
      )}
    </div>
  );
};
