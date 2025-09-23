import { ResolveInput, PlaytestState } from "./types";
import { AclEnum } from "@Enum";

export async function resolvePlaytestState(
  input: ResolveInput,
  deps: {
    fetchSurveyCompleted: (membershipId: string) => Promise<boolean>;
    hasCodesAccess: (acls?: AclEnum[]) => boolean;
    is18OrOlder: (birthDate?: string) => boolean;
  }
): Promise<PlaytestState> {
  try {
    const { membershipId, acls, birthDate } = input;

    if (!membershipId) return "notLoggedIn";
    if (!deps.is18OrOlder(birthDate)) return "underage";

    const [surveyDone, approved] = await Promise.all([
      deps.fetchSurveyCompleted(membershipId),
      Promise.resolve(deps.hasCodesAccess(acls)),
    ]);

    if (approved) return "approved";
    if (!surveyDone) return "surveyIncomplete";
    return "pending";
  } catch (e) {
    return "error";
  }
}
