import React, { useMemo } from "react";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { IoPersonSharp } from "@react-icons/all-files/io5/IoPersonSharp";
import classNames from "classnames";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import styles from "./PlayerCount.module.scss";

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

const PlayerCount: React.FC<FireteamListingCardProps> = (props) => {
  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const { players } = fireteamDefinition ?? {};

  return (
    <div className={classNames(styles.section, styles.players)}>
      <IoPersonSharp />
      <div>{players.maxPlayerCount - players.availableSlots}</div>
      <span>{"/"}</span>
      <div>{players.maxPlayerCount}</div>
    </div>
  );
};

export default withDestinyDefinitions(PlayerCount, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
