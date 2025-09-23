// Created by larobinson, 2025
// Copyright Bungie, Inc.

import { AclEnum } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";

export class AclHelper {
  static getAclAsString(acl: AclEnum): string {
    return EnumUtils.getStringValue(acl, AclEnum);
  }

  static hasGameCodesAccess(userAcls: AclEnum[]): boolean {
    if (!userAcls) {
      return false;
    }
    return userAcls.some(
      (role: AclEnum) =>
        AclHelper.getAclAsString(role)?.toLowerCase().startsWith("marathon") ||
        AclHelper.getAclAsString(role)?.toLowerCase().includes("marathon")
    );
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
