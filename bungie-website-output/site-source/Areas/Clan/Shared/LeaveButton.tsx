// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";
import styles from "@Areas/Clan/ClanProfile.module.scss";

interface LeaveButtonProps {
  clanId: string;
  clanMemberMap: {
    [K in EnumStrings<typeof BungieMembershipType>]?: GroupsV2.GroupMember;
  };
  callback?: () => void;
}

export const LeaveButton: React.FC<LeaveButtonProps> = (props) => {
  const joinedOnMultiplePlatforms =
    Object.values(props.clanMemberMap)?.length > 1;

  const clansLoc = Localizer.Clans;
  const leaveClan = (membershipType: BungieMembershipType) => {
    Platform.GroupV2Service.RescindGroupMembership(props.clanId, membershipType)
      .then(() => {
        props.callback();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  return (
    <>
      {Object.keys(props.clanMemberMap).map((mtype) => {
        return (
          <Button
            key={mtype}
            className={styles.leaveButton}
            size={BasicSize.Medium}
            buttonType={"clear"}
            onClick={() =>
              leaveClan(
                BungieMembershipType[mtype as keyof typeof BungieMembershipType]
              )
            }
          >
            {joinedOnMultiplePlatforms
              ? Localizer.Format(clansLoc.LeaveClanOnPlatform, {
                  platform: Localizer.Platforms[mtype],
                })
              : clansLoc.LeaveClan}
          </Button>
        );
      })}
    </>
  );
};
