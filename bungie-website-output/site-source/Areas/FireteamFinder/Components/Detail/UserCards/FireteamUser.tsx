// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamUserLoader } from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUserLoader";
import { FireteamFinder } from "@Platform";
import React from "react";

interface FireteamUserProps {
  fireteam: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  member: FireteamFinder.DestinyFireteamFinderPlayerId;
  //the viewer of the page is the host
  isHost: boolean;
  isSelf: boolean;
  invited: boolean;
  isActive: boolean;
  applicationId?: string;
}

export const FireteamUser: React.FC<FireteamUserProps> = (props) => {
  return (
    <FireteamUserLoader
      isHost={props.isHost}
      isSelf={props.isSelf}
      member={props.member}
      fireteam={props.fireteam}
      invited={props.invited}
      applicationId={props.applicationId}
      isActive={props.isActive}
    />
  );
};
