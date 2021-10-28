// Created by atseng, 2021
// Copyright Bungie, Inc.

import { BungieNetActivity } from "@Areas/User/ProfileComponents/BungieNetActivity";
import { BungieNetGroups } from "@Areas/User/ProfileComponents/BungieNetGroups";
import { ProfileErrorBoundary } from "@Areas/User/ProfileComponents/ProfileErrorBoundary";
import { User } from "@Platform";
import React from "react";
import { Localizer } from "@bungie/localization";

interface BungieViewProps {
  bungieNetUser: User.GeneralUser;
}

export const BungieView: React.FC<BungieViewProps> = (props) => {
  return (
    <>
      <ProfileErrorBoundary
        message={Localizer.Profile.LoadingErrorForumActivity}
      >
        <BungieNetActivity membershipId={props.bungieNetUser.membershipId} />
      </ProfileErrorBoundary>
      <ProfileErrorBoundary message={Localizer.Profile.GroupsLoadingError}>
        <BungieNetGroups membershipId={props.bungieNetUser.membershipId} />
      </ProfileErrorBoundary>
    </>
  );
};
