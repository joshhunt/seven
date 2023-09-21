// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, GroupPotentialMemberStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
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
  callback?: () => void;
}

export const InvitationActionButton: React.FC<InvitationActionButtonProps> = (
  props
) => {
  const destinyMembership = useDataStore(ClanDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUserClans"]);
  const isCrossSaved = destinyMembership?.isCrossSaved;
  const applicationOnMultiplePlatforms =
    !isCrossSaved && Object.values(props.potentialClanMemberMap)?.length > 1;

  const currentClanPlatformAccountIsBoundTo = (
    membershipType: BungieMembershipType
  ) => {
    return globalState?.loggedInUserClans?.results?.find(
      (c) => c.member?.destinyUserInfo?.membershipType === membershipType
    );
  };

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
    Platform.GroupV2Service.RescindGroupMembership(
      props.clanId,
      membershipType
    ).then(() => {
      Modal.open(clansLoc.SuccessfullyDeclined);

      //done - no message here
      props.callback();
    });
  };

  const acceptInvite = (membershipType: BungieMembershipType) => {
    const alreadyInClan = currentClanPlatformAccountIsBoundTo(membershipType);

    if (alreadyInClan) {
      Modal.open(
        Localizer.Format(clansLoc.YouCanOnlyJoinOneClanMulti, {
          clan: alreadyInClan.group.name,
        })
      );

      return;
    }

    const groupApplicationRequest: GroupsV2.GroupApplicationRequest = {
      message: "",
    };

    //accept
    Platform.GroupV2Service.RequestGroupMembership(
      groupApplicationRequest,
      props.clanId,
      membershipType
    )
      .then(() => {
        Modal.open(clansLoc.SuccessfullyJoined);

        //success
        props.callback();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
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
