// Created by atseng, 2021
// Copyright Bungie, Inc.

import { BungieNetActivity } from "@Areas/User/ProfileComponents/BungieNetActivity";
import { BungieNetGroups } from "@Areas/User/ProfileComponents/BungieNetGroups";
import { User } from "@Platform";
import React from "react";

interface BungieViewProps {
  bungieNetUser: User.GeneralUser;
}

export const BungieView: React.FC<BungieViewProps> = (props) => {
  return (
    <>
      <BungieNetActivity membershipId={props.bungieNetUser.membershipId} />
      <BungieNetGroups membershipId={props.bungieNetUser.membershipId} />
    </>
  );
};
