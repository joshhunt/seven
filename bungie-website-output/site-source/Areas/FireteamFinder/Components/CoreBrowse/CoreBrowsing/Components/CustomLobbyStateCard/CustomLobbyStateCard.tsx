import React from "react";
import { FireteamFinder } from "@Platform";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import styles from "./CustomLobbyStateCard.module.scss";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import FireteamListingCard from "../FireteamListingCard/FireteamListingCard";
import NoFireteamsFound from "../NoFireteamsFound/NoFireteamsFound";

interface CustomLobbyStateCardProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  activeFireteams: FireteamFinder.DestinyFireteamFinderListing[];
  scheduledFireteams: FireteamFinder.DestinyFireteamFinderListing[];
}

const CustomLobbyStateCard: React.FC<CustomLobbyStateCardProps> = ({
  activeFireteams,
  scheduledFireteams,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.sectionHeader}>
        {Localizer.Fireteams.PlayingNow}
      </span>
      {activeFireteams.length === 0 && <NoFireteamsFound small />}
      <div>
        {activeFireteams.map((ft) => (
          <FireteamListingCard
            key={ft.lobbyId}
            className={styles.listing}
            fireteam={ft}
            linkToDetails={true}
            showHover={true}
            lobbyStateOverride={DestinyFireteamFinderLobbyState.Inactive}
          />
        ))}
      </div>
      <span className={styles.sectionHeader}>
        {Localizer.Fireteams.ScheduledFireteams}
      </span>
      {scheduledFireteams.length === 0 && <NoFireteamsFound small />}
      <div>
        {scheduledFireteams.map((ft) => (
          <FireteamListingCard
            key={ft.lobbyId}
            className={styles.listing}
            fireteam={ft}
            linkToDetails={true}
            showHover={true}
          />
        ))}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(CustomLobbyStateCard, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
