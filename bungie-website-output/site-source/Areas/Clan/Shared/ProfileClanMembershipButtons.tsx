// Created by atseng, 2023
// Copyright Bungie, Inc.

import { InvitationActionButton } from "@Areas/Clan/Shared/InvitationActionButton";
import { JoinButton } from "@Areas/Clan/Shared/JoinButton";
import { LeaveButton } from "@Areas/Clan/Shared/LeaveButton";
import { RescindButton } from "@Areas/Clan/Shared/RescindButton";
import { BungieMembershipType, MembershipOption } from "@Enum";
import { GroupsV2 } from "@Platform";
import React from "react";

interface ProfileClanMembershipButtonsProps {
  clanId: string;
  membershipMap: {
    [K in EnumStrings<typeof BungieMembershipType>]?: GroupsV2.GroupMember;
  };
  potentialMembershipMap: {
    [K in EnumStrings<
      typeof BungieMembershipType
    >]?: GroupsV2.GroupPotentialMember;
  };
  membershipOption: MembershipOption;
  membershipUpdated: () => void;
}

export const ProfileClanMembershipButtons: React.FC<ProfileClanMembershipButtonsProps> = (
  props
) => {
  return (
    <>
      {/*leave*/}
      <LeaveButton
        clanId={props.clanId}
        clanMemberMap={props.membershipMap}
        callback={() => props.membershipUpdated()}
      />
      {/*rescind*/}
      <RescindButton
        clanId={props.clanId}
        potentialClanMemberMap={props.potentialMembershipMap}
        callback={() => props.membershipUpdated()}
      />
      {/*join*/}
      <JoinButton
        clanId={props.clanId}
        potentialMemberMap={props.potentialMembershipMap}
        membershipMap={props.membershipMap}
        membershipOption={props.membershipOption}
        callback={() => props.membershipUpdated()}
      />
      {/*invitations*/}
      <InvitationActionButton
        clanId={props.clanId}
        potentialClanMemberMap={props.potentialMembershipMap}
        callback={() => props.membershipUpdated()}
      />
    </>
  );
};
