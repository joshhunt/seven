// Created by atseng, 2019
// Copyright Bungie, Inc.

import { DateTime } from "luxon";
import * as React from "react";
import styles from "./SeasonHeader.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Localizer } from "@bungie/localization";
import { SeasonsArray } from "../SeasonsDefinitions";

// Required props
interface ISeasonHeaderProps
  extends D2DatabaseComponentProps<
    | "DestinyInventoryItemLiteDefinition"
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
  > {}

// Default props - these will have values set in SeasonHeader.defaultProps
interface DefaultProps {
  seasonHash: number;
}

type Props = ISeasonHeaderProps & DefaultProps;

interface ISeasonHeaderState {}

/**
 * SeasonHeader - Replace this description
 *  *
 * @param {ISeasonHeaderProps} props
 * @returns
 */
class SeasonHeader extends React.Component<Props, ISeasonHeaderState> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { definitions, seasonHash } = this.props;

    const seasonDetailsButton = Localizer.Seasons.SeasonDetails;

    const timeLoc = Localizer.Time;

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);

    const seasonOnPage = SeasonsArray.find(
      (season) => season.seasonNumber === seasonDef.seasonNumber
    );

    const getTimeRemainingString = () => {
      const timeDisplay = DateTime.fromISO(seasonDef.endDate);

      const diff = timeDisplay.diffNow("days");

      let timeString = "";

      const monthDiff = diff.as("months");

      if (Math.round(monthDiff) === 1) {
        timeString = Localizer.Format(timeLoc.TimeRemainingMonth, {
          month: "1",
        });
      } else {
        if (monthDiff > 1) {
          timeString = Localizer.Format(timeLoc.TimeRemainingMonths, {
            months: Math.round(monthDiff),
          });
        } else {
          timeString =
            diff.days > 1
              ? `${Math.round(diff.days)} ${timeLoc.days}`
              : `1 ${timeLoc.day}`;
        }
      }

      return diff.days > 0
        ? Localizer.Format(Localizer.Seasons.TimeRemaining, {
            time: timeString,
          })
        : Localizer.Seasons.SeasonComplete;
    };

    return (
      <div className={styles.seasonHeader}>
        <h2>{seasonOnPage.title}</h2>
        <p>{getTimeRemainingString()}</p>
      </div>
    );
  }
}

export default withDestinyDefinitions(SeasonHeader, {
  types: [
    "DestinyInventoryItemLiteDefinition",
    "DestinySeasonDefinition",
    "DestinySeasonPassDefinition",
    "DestinyProgressionDefinition",
  ],
});
