import { Localizer } from "@Global/Localizer";
import React from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Season11Image } from "@Areas/Seasons/ProductPages/Season11/Season11Utils";
import styles from "./Season11Calendar.module.scss";

export const Season11Calendar = () => {
  const calendarImagePreLocale = ConfigUtils.GetParameter<string | null>(
    SystemNames.Season11Page,
    "CalendarImage",
    ""
  );
  if (!calendarImagePreLocale) {
    return null;
  }

  const calendarImage = calendarImagePreLocale.replace(
    "{locale}",
    Localizer.CurrentCultureName
  );

  return (
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.smallTitle}>{Localizer.Seasons.Calendar}</h3>
      </div>
      <Anchor
        className={styles.calendar}
        url={Season11Image(calendarImage)}
        sameTab={false}
      >
        <img
          src={Season11Image(calendarImage)}
          alt={Localizer.Seasons.Calendar}
          width={960}
        />
      </Anchor>
    </div>
  );
};
