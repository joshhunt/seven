// Created by atseng, 2023
// Copyright Bungie, Inc.

import FireteamUserInternal from "@Areas/Fireteams/Shared/FireteamUserInternal";
import { Fireteam } from "@Platform";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React, { useState } from "react";
import styles from "@Areas/Fireteams/Fireteam.module.scss";

interface FireteamUserLoaderProps {
  fireteam: Fireteam.FireteamSummary;
  member: Fireteam.FireteamMember;
  //the viewer of the page is the host
  isHost: boolean;
  isAdmin: boolean;
  isSelf: boolean;
  invited: boolean;
  refreshFireteam?: () => void;
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
        isAdmin={props.isAdmin}
        member={props.member}
        fireteam={props.fireteam}
        invited={props.invited}
        refreshFireteam={() => props.refreshFireteam()}
        loaded={() => setIsLoaded(true)}
      />
    </SpinnerContainer>
  );
};
