import { RankSigil } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/RankSigil";
import SeasonTitleSection from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/SeasonTitleSection/SeasonTitleSection";
import { UnclaimedRewardsAlert } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout/UnclaimedRewardsAlert";
import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { Localizer } from "@bungie/localization";
import { DateTime } from "luxon";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./SeasonHeaderLayout.module.scss";

interface ISeasonHeaderProps {
  isCurrentSeason?: boolean;
  seasonUtilArgs: ISeasonUtilArgs;
}

const SeasonHeaderLayout: React.FC<ISeasonHeaderProps> = ({
  seasonUtilArgs,
  isCurrentSeason,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    updateTimeRemaining();
  });
  const updateTimeRemaining = () => {
    const {
      startDate,
      endDate,
    } = SeasonProgressUtils?.getCurrentSeasonPassStartAndEnd(seasonUtilArgs);

    if (endDate) {
      const timeDisplay = DateTime.fromJSDate(endDate);
      const diff = timeDisplay.diffNow(["months", "days", "hours"]);

      let timeString = "";

      if (diff.months >= 1) {
        timeString =
          diff.months === 1
            ? Localizer.Format(Localizer.Time.TimeRemainingMonth, {
                month: "1",
              })
            : Localizer.Format(Localizer.Time.TimeRemainingMonths, {
                months: Math.round(diff.months),
              });
      } else if (diff.days >= 1) {
        timeString =
          diff.days > 1
            ? `${Math.round(diff.days)} ${Localizer.Time.days}`
            : `1 ${Localizer.Time.day}`;
      } else if (diff.hours >= 1) {
        timeString = `${Math.round(diff.hours)} ${Localizer.Time.hours}`;
      } else {
        timeString = "";
      }

      setTimeRemaining(
        diff.hours > 0
          ? Localizer.Format(Localizer.Seasons.TimeRemaining, {
              time: timeString,
            })
          : Localizer.Seasons.SeasonComplete
      );
    } else if (startDate) {
      setTimeRemaining(
        Localizer.Format(Localizer.Time.CompactMonthDayYear, {
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          year: startDate.getFullYear(),
        })
      );
    } else {
      setTimeRemaining("");
    }
  };

  return (
    <div className={styles.sigilHeaderContainer}>
      <RankSigil seasonUtilArgs={seasonUtilArgs} />
      <SeasonTitleSection
        seasonUtilArgs={seasonUtilArgs}
        timeRemaining={timeRemaining}
      />
      <UnclaimedRewardsAlert seasonUtilArgs={seasonUtilArgs} />
    </div>
  );
};

export default SeasonHeaderLayout;
