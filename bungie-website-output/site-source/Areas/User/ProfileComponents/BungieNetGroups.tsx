// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, GroupsForMemberFilter, GroupType } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import { useAsyncError } from "@Utilities/ReactUtils";
import React, { useEffect, useState } from "react";
import styles from "./BungieView.module.scss";

interface BungieNetGroupsProps {
  membershipId: string;
}

export const BungieNetGroups: React.FC<BungieNetGroupsProps> = (props) => {
  const throwError = useAsyncError();
  const [groups, setGroups] = useState<GroupsV2.GetGroupsForMemberResponse>(
    null
  );

  const GetGroups = () => {
    Platform.GroupV2Service.GetGroupsForMember(
      BungieMembershipType.BungieNext,
      props.membershipId,
      GroupsForMemberFilter.All,
      GroupType.General
    )
      .then((response) => {
        setGroups(response);
      })
      .catch(throwError);
  };

  useEffect(() => {
    GetGroups();
  }, [props.membershipId]);

  const groupsTitle = "Groups";

  if (groups === null) {
    return null;
  }

  return (
    <div className={styles.groups}>
      <h3>{groupsTitle}</h3>
      <ul>
        {groups.results.map((group: GroupsV2.GroupMembership) => {
          return (
            <li key={group.group.groupId}>
              <Anchor url={RouteHelper.Group(group.group.groupId)}>
                <OneLineItem
                  icon={<IconCoin iconImageUrl={group.group.avatarPath} />}
                  itemTitle={group.group.name}
                />
              </Anchor>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
