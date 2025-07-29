import React from "react";
import { Localizer } from "@bungie/localization/Localizer";
import classNames from "classnames";
import styles from "./TabAndListings.module.scss";
import {
  CustomLobbyState,
  LobbyStateManager,
} from "../../../Helpers/LobbyStateManager";

interface TabAndListingsProps {
  setShowingLobbyState: (lobbyState: CustomLobbyState) => void;
  handleUrlUpdate: (key: string, value: string) => void;
  activeLobbyState: CustomLobbyState;
  matchingLobbyState: CustomLobbyState;
}

const TabAndListings: React.FC<TabAndListingsProps> = ({
  setShowingLobbyState,
  activeLobbyState,
  handleUrlUpdate,
  matchingLobbyState,
}) => {
  return (
    <a
      className={classNames(styles.tabHeaderItemText, {
        [styles.selected]: activeLobbyState === matchingLobbyState,
      })}
      onClick={() => {
        setShowingLobbyState(matchingLobbyState);
        handleUrlUpdate("lobbyState", matchingLobbyState.toString());
      }}
    >
      {LobbyStateManager.getLobbyStateLabel(matchingLobbyState)}
    </a>
  );
};

export default TabAndListings;
