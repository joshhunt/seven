// Created by atseng, 2023
// Copyright Bungie, Inc.

import FireteamUserInternal from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUserInternal";
import styles from "@Areas/Fireteams/Fireteam.module.scss";
import { FireteamFinder } from "@Platform";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { useState } from "react";

interface FireteamUserLoaderProps {
  fireteam: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  member: FireteamFinder.DestinyFireteamFinderPlayerId;
  //the viewer of the page is the host
  isHost: boolean;
  isSelf: boolean;
  invited: boolean;
  refreshFireteam?: () => void;
  applicationId?: string;
  hideKick?: boolean;
}

export const FireteamUserLoader: React.FC<FireteamUserLoaderProps> = (
  props
) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SpinnerContainer
      loading={!isLoaded}
      className={!isLoaded && styles.loadingUser}
    >
      <FireteamUserInternal
        isHost={props.isHost}
        isSelf={props.isSelf}
        member={props.member}
        fireteam={props.fireteam}
        invited={props.invited}
        refreshFireteam={() => props.refreshFireteam()}
        loaded={() => setIsLoaded(true)}
        applicationId={props.applicationId}
        hideKick={props.hideKick}
      />
    </SpinnerContainer>
  );
};
