// Created by larobinson, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/FireteamFinder/Components/Detail/FireteamDetail.module.scss";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import React, { useMemo } from "react";

interface FireteamSummaryProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderOptionDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
  > {
  fireteam: FireteamFinder.DestinyFireteamFinderListing;
}

const FireteamSummary: React.FC<FireteamSummaryProps> = (props) => {
  const ifValidShowLabel = (label: string) =>
    label && label.length > 0 && <li>{label}</li>;

  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const {
    applicationRequired,
    allowOfflinePlayers,
    platform,
    hasMic,
    locale,
    minGuardianRank,
  } = fireteamDefinition ?? {};

  return (
    <div className={styles.flex}>
      <ul className={styles.list}>
        {ifValidShowLabel(applicationRequired?.label?.toString())}
        {ifValidShowLabel(hasMic?.label?.toString())}
        {ifValidShowLabel(platform?.label?.toString())}
        {ifValidShowLabel(locale?.label?.toString())}
      </ul>
      <ul className={styles.list}>
        <li>
          {allowOfflinePlayers
            ? Localizer.Fireteams.AllowOfflinePlayers
            : Localizer.Fireteams.OnlinePlayersOnly}
        </li>
        {minGuardianRank?.label && (
          <li>
            {Localizer.Format(Localizer.Fireteams.FormatMinimumGuardianRank, {
              rank: minGuardianRank.label,
            })}
          </li>
        )}
      </ul>
    </div>
  );
};

export default withDestinyDefinitions(FireteamSummary, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
  ],
});
