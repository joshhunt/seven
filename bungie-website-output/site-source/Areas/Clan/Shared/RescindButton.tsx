// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, GroupPotentialMemberStatus } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import React from "react";

interface RescindButtonProps {
  clanId: string;
  potentialClanMemberMap: {
    [K in EnumStrings<
      typeof BungieMembershipType
    >]?: GroupsV2.GroupPotentialMember;
  };
  callback: () => void;
}

export const RescindButton: React.FC<RescindButtonProps> = (props) => {
  const applicationOnMultiplePlatforms =
    Object.values(props.potentialClanMemberMap)?.length > 1;

  const clansLoc = Localizer.Clans;
  const leaveClan = (membershipType: BungieMembershipType) => {
    Platform.GroupV2Service.RescindGroupMembership(
      props.clanId,
      membershipType
    ).then(() => {
      //done - no message here
      props.callback && props.callback();
    });
  };

  const buttonLabel = (potentialMember: GroupsV2.GroupPotentialMember) => {
    return applicationOnMultiplePlatforms
      ? Localizer.Format(clansLoc.RescindApplicationOnPlatform, {
          platform:
            Localizer.Platforms[
              EnumUtils.getStringValue(
                potentialMember.destinyUserInfo.membershipType,
                BungieMembershipType
              )
            ],
        })
      : clansLoc.RescindApplication;
  };

  return (
    <>
      {Object.values(props.potentialClanMemberMap)
        .filter((value) => {
          return value.potentialStatus === GroupPotentialMemberStatus.Applicant;
        })
        .map((pm) => {
          return (
            <Button
              key={pm.destinyUserInfo.membershipId}
              size={BasicSize.Medium}
              buttonType={"clear"}
              onClick={() => leaveClan(pm.destinyUserInfo.membershipType)}
            >
              {buttonLabel(pm)}
            </Button>
          );
        })}
    </>
  );
};
