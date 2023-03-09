// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamUserLoader } from "@Areas/Fireteams/Shared/FireteamUserLoader";
import { Fireteam } from "@Platform";
import React from "react";

interface FireteamUserProps {
  fireteam: Fireteam.FireteamSummary;
  member: Fireteam.FireteamMember;
  //the viewer of the page is the host
  isHost: boolean;
  isAdmin: boolean;
  isSelf: boolean;
  invited: boolean;
  refreshFireteam?: () => void;
}

export const FireteamUser: React.FC<FireteamUserProps> = (props) => {
  return (
    <FireteamUserLoader
      isHost={props.isHost}
      isSelf={props.isSelf}
      isAdmin={props.isAdmin}
      member={props.member}
      fireteam={props.fireteam}
      invited={props.invited}
      refreshFireteam={() => props.refreshFireteam()}
    />
  );
};
