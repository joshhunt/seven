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

    if (AclHelper.hasGameCodesAccess(acls)) {
      return ConfigUtils.SystemStatus(SystemNames.PlaytestAccessRefreshed)
        ? "approved"
        : "pending";
    }

    return "surveyIncomplete";
  } catch (e) {
    return "error";
  }
}
