import { AclEnum } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";

export class AclHelper {
  private static GameCodeAccessAcls: AclEnum[] = [
    AclEnum.Marathon_Playtest_Bungie,
    AclEnum.Marathon_Playtest_1,
    AclEnum.Marathon_Playtest_2,
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
