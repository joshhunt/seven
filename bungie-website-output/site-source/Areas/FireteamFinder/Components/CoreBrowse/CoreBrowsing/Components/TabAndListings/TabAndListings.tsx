import React from "react";
import classNames from "classnames";
import styles from "./TabAndListings.module.scss";
import {
  CustomLobbyState,
  LobbyStateManager,
} from "../../../Helpers/LobbyStateManager";

interface TabAndListingsProps {
  setShowingLobbyState: (lobbyState: CustomLobbyState) => void;
  handleLobbyStateUpdate: (lobbyState: CustomLobbyState) => void;
  activeLobbyState: CustomLobbyState;
  matchingLobbyState: CustomLobbyState;
}

const TabAndListings: React.FC<TabAndListingsProps> = ({
  setShowingLobbyState,
  activeLobbyState,
  handleLobbyStateUpdate: handleUrlUpdate,
  matchingLobbyState,
}) => {
  return (
    <a
      className={classNames(styles.tabHeaderItemText, {
        [styles.selected]: activeLobbyState === matchingLobbyState,
      })}
      onClick={() => {
        setShowingLobbyState(matchingLobbyState);
        handleUrlUpdate(matchingLobbyState);
      }}
    >
      {LobbyStateManager.getLobbyStateLabel(matchingLobbyState)}
    </a>
  );
};

export default TabAndListings;
