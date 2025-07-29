import React, { useMemo } from "react";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { FaRegCalendar } from "@react-icons/all-files/fa/FaRegCalendar";
import classNames from "classnames";
import { DateTime } from "luxon";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import styles from "./DateAndTimeFooter.module.scss";

interface FireteamListingCardProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  fireteam: FireteamFinder.DestinyFireteamFinderListing;
  lobbyStateOverride?: DestinyFireteamFinderLobbyState;
  linkToDetails?: boolean;
  showHover?: boolean;
  largeActivityName?: boolean;
}

const DateAndTimeFooter: React.FC<FireteamListingCardProps> = (props) => {
  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const { scheduledDateAndTime } = fireteamDefinition ?? {};

  const dateFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const luxonDate = DateTime.fromISO(scheduledDateAndTime ?? "", {
    zone: "utc",
  });
  const dateString = luxonDate.toLocal().toLocaleString(dateFormat);

  return (
    <div className={classNames(styles.cardFooter, styles.section)}>
      <FaRegCalendar />
      {Localizer.Format(Localizer.Fireteams.ScheduledStarts, {
        startingdatetime: dateString,
      })}
    </div>
  );
};

export default withDestinyDefinitions(DateAndTimeFooter, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
