// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, GroupPotentialMemberStatus } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import React from "react";

interface InvitationActionButtonProps {
  clanId: string;
  potentialClanMemberMap: {
    [K in EnumStrings<
      typeof BungieMembershipType
    >]?: GroupsV2.GroupPotentialMember;
  };
}

export const InvitationActionButton: React.FC<InvitationActionButtonProps> = (
  props
) => {
  const destinyMembership = useDataStore(ClanDestinyMembershipDataStore);
  const isCrossSaved = destinyMembership?.isCrossSaved;
  const applicationOnMultiplePlatforms =
    !isCrossSaved && Object.values(props.potentialClanMemberMap)?.length > 1;

  const clansLoc = Localizer.Clans;
  const acceptButtonLabel = (pm: GroupsV2.GroupPotentialMember) =>
    applicationOnMultiplePlatforms
      ? Localizer.Format(clansLoc.AcceptInviteOnPlatform, {
          platform:
            Localizer.Platforms[
              EnumUtils.getStringValue(
                pm.destinyUserInfo.membershipType,
                BungieMembershipType
              )
            ],
        })
      : clansLoc.AcceptInvite;

  const declineInvite = (
    membershipType: BungieMembershipType,
    membershipId: string
  ) => {
    Platform.GroupV2Service.IndividualGroupInviteCancel(
      props.clanId,
      membershipType,
      membershipId
    ).then(() => {
      //done - no message here
    });
  };

  const acceptInvite = (membershipType: BungieMembershipType) => {
    const groupApplicationRequest: GroupsV2.GroupApplicationRequest = {
      message: "",
    };

    //accept
    Platform.GroupV2Service.RequestGroupMembership(
      groupApplicationRequest,
      props.clanId,
      membershipType
    ).then(() => {
      //success
    });
  };

  return (
    <>
      {Object.values(props.potentialClanMemberMap)
        .filter((value) => {
          return value.potentialStatus === GroupPotentialMemberStatus.Invitee;
        })
        .map((pm) => {
          return (
            <>
              <Button
                key={pm.destinyUserInfo.membershipId}
                size={BasicSize.Medium}
                buttonType={"clear"}
                onClick={() => acceptInvite(pm.destinyUserInfo.membershipType)}
              >
                {acceptButtonLabel(pm)}
              </Button>
              <Button
                key={pm.destinyUserInfo.membershipId}
                size={BasicSize.Medium}
                buttonType={"clear"}
                onClick={() =>
                  declineInvite(
                    pm.destinyUserInfo.membershipType,
                    pm.destinyUserInfo.membershipId
                  )
                }
              >
                {clansLoc.DeclineInvite}
              </Button>
            </>
          );
        })}
    </>
  );
};
