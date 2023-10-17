// Created by atseng, 2023
// Copyright Bungie, Inc.

import { AclEnum, BungieMembershipType, RuntimeGroupMemberType } from "@Enum";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, GroupsV2 } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";

export class ClanUtils {
  public static PROGRESSION_HASH_CLAN_LEVEL = "584850370";
  public static PROGRESSION_HASH_CLAN_FITNESS_RAID = "3381682691";
  public static PROGRESSION_HASH_CLAN_FITNESS_TRIALS = "3759191272";
  public static PROGRESSION_HASH_CLAN_FITNESS_NIGHTFALL = "1273404180";

  public static orderByLastSeen = (
    applicableMembershipTypes: BungieMembershipType[],
    lastSeenDisplayNameType: BungieMembershipType
  ) => {
    return applicableMembershipTypes?.sort((a, b) => {
      if (b === lastSeenDisplayNameType) {
        return 1;
      } else if (a === lastSeenDisplayNameType) {
        return -1;
      }

      return 0;
    });
  };

  public static isBnetAdmin = (userDetail: Contract.UserDetail) => {
    return userDetail?.userAcls?.includes(AclEnum.BNextFounderInAllGroups);
  };

  public static canViewAdmin = (
    clan: GroupsV2.GroupMembership,
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) => {
    return (
      UserUtils.isAuthenticated(globalState) &&
      (ClanUtils.isBnetAdmin(globalState.loggedInUser) ||
        clan?.member?.memberType > RuntimeGroupMemberType.Member)
    );
  };

  public static canMakeFounderEdits = (
    clan: GroupsV2.GroupMembership,
    globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) => {
    return (
      UserUtils.isAuthenticated(globalState) &&
      clan?.member?.memberType > RuntimeGroupMemberType.Admin
    );
  };

  public static canEditClanCulture = (
    clan: GroupsV2.GroupMembership,
    userDetail: Contract.UserDetail
  ) => {
    const adminsCanEdit =
      clan?.group?.features?.updateCulturePermissionOverride;

    return (
      ClanUtils.isBnetAdmin(userDetail) ||
      clan?.member?.memberType > RuntimeGroupMemberType.Admin ||
      (clan?.member?.memberType > RuntimeGroupMemberType.Member &&
        adminsCanEdit)
    );
  };

  public static canEditClanBanner = (
    clan: GroupsV2.GroupMembership,
    userDetail: Contract.UserDetail
  ) => {
    const adminsCanEdit = clan?.group?.features?.updateBannerPermissionOverride;

    return (
      clan?.member?.memberType > RuntimeGroupMemberType.Admin ||
      (clan?.member?.memberType > RuntimeGroupMemberType.Member &&
        adminsCanEdit)
    );
  };

  public static canInvite = (
    clan: GroupsV2.GroupMembership,
    userDetail: Contract.UserDetail
  ) => {
    const adminsCanInvite = clan?.group?.features?.invitePermissionOverride;

    return (
      clan?.member?.memberType > RuntimeGroupMemberType.Admin ||
      (clan?.member?.memberType > RuntimeGroupMemberType.Member &&
        adminsCanInvite)
    );
  };
}
