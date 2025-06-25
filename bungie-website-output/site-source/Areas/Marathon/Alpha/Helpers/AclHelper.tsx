// Created by larobinson, 2025
// Copyright Bungie, Inc.

import { AclEnum } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";

export class AclHelper {
  static getAclAsString = (acl: AclEnum): string => {
    return EnumUtils.getStringValue(acl, AclEnum);
  };

  static hasGameCodesAccess(userAcls: AclEnum[]): boolean {
    if (!userAcls) {
      return null;
    }

    return userAcls.some((role: AclEnum) =>
      this.getAclAsString(role)?.startsWith("Marathon_")
    );
  }

  static getMarathonAcl(userAcls: AclEnum[]): AclEnum | null | undefined {
    if (!userAcls) {
      return null;
    }

    return userAcls.find((role) =>
      this.getAclAsString(role)?.startsWith("Marathon_")
    );
  }

  static getMarathonAclAsCohortMapKey(userAcls: AclEnum[]): string {
    if (!userAcls || userAcls.length === 0) {
      return null;
    }

    const acl = this.getMarathonAcl(userAcls);

    return this.getAclAsString(acl);
  }
}
