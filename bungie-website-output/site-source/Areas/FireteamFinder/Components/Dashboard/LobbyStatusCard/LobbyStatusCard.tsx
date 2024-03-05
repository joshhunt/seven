import React from "react";
import { FireteamFinder } from "@Platform";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import FireteamListingCard from "@Areas/FireteamFinder/Components/Shared/FireteamListingCard";
import OnlineStatus from "@Areas/FireteamFinder/Components/Shared/OnlineStatus";
import styles from "./LobbyStatusCard.module.scss";

interface ActiveLobbyProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  activeFireteam: FireteamFinder.DestinyFireteamFinderListing;
  linkToDetails?: boolean;
  activeStatus?: number;
}

/*
 * Displays Fireteam listing when Fireteam data is present and the user is in an active Fireteam
 * Displays placeholder listing card when Fireteam data is NOT present and the user is NOT in an active Fireteam
 * */

const LobbyStatus: React.FC<ActiveLobbyProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;

  return (
    <div className={styles.wrapper}>
      <OnlineStatus
        activeStatus={Boolean(
          props?.activeFireteam?.listingId || props?.activeStatus
        )}
        labels={{
          online: fireteamsLoc.activeFireteam,
          offline: fireteamsLoc.inactiveFireteam,
        }}
      />
      {props?.activeFireteam?.listingId || props?.activeStatus ? (
        <div>
          <FireteamListingCard fireteam={props?.activeFireteam} />
        </div>
      ) : (
        <div className={styles.inactiveLobby}>
          <p>{fireteamsLoc.inactiveLobbyScreentip}</p>
        </div>
      )}
    </div>
  );
};

export default withDestinyDefinitions(LobbyStatus, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
