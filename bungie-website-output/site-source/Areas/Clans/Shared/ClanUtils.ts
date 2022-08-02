// Created by atseng, 2022
// Copyright Bungie, Inc.

import { GroupsV2 } from "@Platform";

export class ClanUtils {
  public static CovertGroupToGroupCard(
    groupV2: GroupsV2.GroupV2
  ): GroupsV2.GroupV2Card {
    return {
      groupId: groupV2.groupId,
      name: groupV2.name,
      groupType: groupV2.groupType,
      creationDate: groupV2.creationDate,
      about: groupV2.about,
      motto: groupV2.motto,
      memberCount: groupV2.memberCount,
      locale: groupV2.locale,
      membershipOption: groupV2.membershipOption,
      capabilities: groupV2.features.capabilities,
      clanInfo: groupV2.clanInfo,
      avatarPath: groupV2.avatarPath,
      theme: groupV2.theme,
    };
  }
}
