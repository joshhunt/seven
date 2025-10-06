// Created by larobinson, 2025
// Copyright Bungie, Inc.

import { AclEnum } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";

export class AclHelper {
  private static GameCodeAccessAcls: AclEnum[] = [
    AclEnum.MarathonAlpha_EarlyAccess,
    AclEnum.MarathonAlpha_BungieInternal,
    AclEnum.MarathonAlpha_DevTeam,
    AclEnum.MarathonAlpha_SonyGeneral,
    AclEnum.MarathonAlpha_DevTeamPartners,
    AclEnum.MarathonAlpha_MarketingPartners,
    AclEnum.MarathonAlpha_CSCreators,
    AclEnum.MarathonAlpha_SonyNetworkTesters,
    AclEnum.MarathonAlpha_FriendsAndFamily,
    AclEnum.MarathonAlpha_PublicFriends,
    AclEnum.MarathonAlpha_General,
    AclEnum.Marathon_TechTest_General,
    AclEnum.Marathon_TechTest_Bungie,
    AclEnum.Marathon_TechTest_Sony,
    AclEnum.Marathon_TechTest_VIP,
    AclEnum.Marathon_TechTest_DiaryStudy,
  ] as const;

  private static TechTestAcls: AclEnum[] = [
    AclEnum.Marathon_TechTest_General,
    AclEnum.Marathon_TechTest_Bungie,
    AclEnum.Marathon_TechTest_Sony,
    AclEnum.Marathon_TechTest_VIP,
    AclEnum.Marathon_TechTest_DiaryStudy,
  ] as const;
  static getAclAsString(acl: AclEnum): string {
    return EnumUtils.getStringValue(acl, AclEnum);
  }

  static hasGameCodesAccess(userAcls: AclEnum[]): boolean {
    if (!userAcls) {
      return false;
    }
    return userAcls.some((role: AclEnum) =>
      AclHelper.GameCodeAccessAcls.includes(role)
    );
  }

  static hasOldAclOnly(userAcls: AclEnum[]): boolean {
    if (!userAcls) {
      return false;
    }

    const hasNewAcl = userAcls.some((role: AclEnum) =>
      AclHelper.TechTestAcls.includes(role)
    );

    return this.hasGameCodesAccess(userAcls) && !hasNewAcl;
  }

  static getMarathonAcl(userAcls: AclEnum[]): AclEnum | null | undefined {
    if (!userAcls) {
      return null;
    }

    return userAcls.find((role) =>
      AclHelper.getAclAsString(role)?.startsWith("Marathon_")
    );
  }

  static getMarathonAclAsCohortMapKey(userAcls: AclEnum[]): string {
    if (!userAcls || userAcls.length === 0) {
      return null;
    }

    const acl = this.getMarathonAcl(userAcls);

    return AclHelper.getAclAsString(acl);
  }
}
