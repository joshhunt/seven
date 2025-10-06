import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { AclHelper } from "../Helpers/AclHelper";
import { is18OrOlder } from "../Helpers/PlaytestsHelper";
import { ResolveInput, PlaytestState } from "./types";

export function resolvePlaytestState(input: ResolveInput): PlaytestState {
  try {
    const { membershipId, acls, birthDate } = input;

    if (!membershipId) return "notLoggedIn";
    if (!is18OrOlder(birthDate)) return "underage";

    if (AclHelper.hasOldAclOnly(acls)) {
      // Alpha users will see the pending page until we are ready to 'flip the switch' and show them game codes.
      return ConfigUtils.SystemStatus(SystemNames.PlaytestAccessRefreshed)
        ? "approved"
        : "pending";
    }
    if (AclHelper.hasGameCodesAccess(acls)) {
      return "approved";
    }

    return "surveyIncomplete";
  } catch (e) {
    return "error";
  }
}
