import React from "react";
import { FireteamFinder } from "@Platform";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import FireteamListingCard from "@Areas/FireteamFinder/Components/Shared/FireteamListingCard";
import styles from "./LobbyStatusCard.module.scss";
import { Icon } from "@UIKit/Controls/Icon";
import { DestinyFireteamFinderLobbyState } from "@Enum";

interface ActiveLobbyProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  activeFireteam: FireteamFinder.DestinyFireteamFinderListing;
  linkToDetails?: boolean;
}

/*
 * Displays Fireteam listing when Fireteam data is present and the user is in an active Fireteam
 * Displays placeholder listing card when Fireteam data is NOT present and the user is NOT in an active Fireteam
 * */

const LobbyStatus: React.FC<ActiveLobbyProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const lobbyState = props?.activeFireteam?.lobbyState;
  const isActive = lobbyState === DestinyFireteamFinderLobbyState?.Active;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.iconMsg}>
        <Icon iconType={"bungle"} iconName={"logodestiny"} />
        {fireteamsLoc.MyIngameFireteam}
      </h3>
      {isActive ? (
        <div>
          <FireteamListingCard
            fireteam={props?.activeFireteam}
            showHover={true}
          />
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
