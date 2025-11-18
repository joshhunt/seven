import { BungieCredentialType } from "@Enum";
import { Platform } from "@Platform";
import { Contract, User } from "@Platform";
import { AclHelper } from "@Areas/Marathon/Helpers/AclHelper";

/**
 * PlaytestsHelper provides utility functions for detecting and managing
 * user authentication credential types in the context of Marathon playtests.
 */
export class PlaytestsHelper {
  /**
   * Gets the current user's authentication context, including which credential type
   * they are currently authenticated with for this session.
   *
   * @returns Promise<User.UserAuthContextResponse> The authentication context
   */
  public static async getCurrentAuthenticationContext(): Promise<
    User.UserAuthContextResponse
  > {
    try {
      const authContext = await Platform.UserService.GetCurrentUserAuthContextState();
      return authContext;
    } catch (error) {
      console.error("Failed to get current authentication context:", error);
      throw error;
    }
  }

  /**
   * Gets all credential types associated with the current user's account.
   * This shows all platforms they have linked, not just the current session.
   *
   * @returns Promise<Contract.GetCredentialTypesForAccountResponse[]>
   */
  public static async getAvailableCredentialTypes(): Promise<
    Contract.GetCredentialTypesForAccountResponse[]
  > {
    try {
      const credentials = await Platform.UserService.GetCredentialTypesForAccount();
      return credentials;
    } catch (error) {
      console.error("Failed to get available credential types:", error);
      throw error;
    }
  }

  /**
   * Determines if the current session is authenticated via a specific credential type.
   *
   * @param targetCredentialType The credential type to check for
   * @returns Promise<boolean> True if the current session uses this credential type
   */
  public static async isAuthenticatedVia(
    targetCredentialType: BungieCredentialType
  ): Promise<boolean> {
    try {
      const authContext = await this.getCurrentAuthenticationContext();
      return authContext.AuthProvider === targetCredentialType;
    } catch (error) {
      console.error("Failed to check authentication credential type:", error);
      return false;
    }
  }

  /**
   * Checks if the user has a specific credential type linked to their account.
   * This is different from isAuthenticatedVia - this checks if they HAVE the credential,
   * not if they're currently authenticated with it.
   *
   * @param targetCredentialType The credential type to check for
   * @returns Promise<boolean> True if the user has this credential type linked
   */
  public static async hasCredentialTypeLinked(
    targetCredentialType: BungieCredentialType
  ): Promise<boolean> {
    try {
      const credentials = await this.getAvailableCredentialTypes();
      return credentials.some(
        (cred) => cred.credentialType === targetCredentialType
      );
    } catch (error) {
      console.error("Failed to check linked credential types:", error);
      return false;
    }
  }
}

export type PlaytestStatus =
  | "approved"
  | "pending"
  | "notEligible"
  | "surveyIncomplete";

// Client no longer calls Qualtrics directly; use server API with localStorage fallback

/**
 * Checks if a user has already responded to a specific Qualtrics survey.
 * @param {string} uniqueIdentifier - The unique ID of the user to check for.
 * @returns {Promise<boolean>} - True if a response exists, false otherwise.
 */
export async function getSurveyCompletedForUser(uniqueIdentifier: string) {
  // For the playtest, rely only on localStorage so there are no external calls
  try {
    const local = localStorage.getItem("marathon-playtests-survey-completed");
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === "object") {
        const flag = parsed[String(uniqueIdentifier)];
        if (typeof flag === "boolean") {
          return flag;
        }
      }
    }
  } catch {}

  return false;
}

export function is18OrOlder(dateString: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthDate = new Date(dateString);

  const eighteenthBirthday = new Date(
    birthDate.getFullYear() + 18,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  return today >= eighteenthBirthday;
}

export async function resolvePlaytestStatus(
  loggedInUser: any
): Promise<PlaytestStatus> {
  if (!loggedInUser?.membershipId) {
    return "notEligible";
  }
  const [surveyDone, hasAcl] = await Promise.all([
    getSurveyCompletedForUser(loggedInUser?.user?.membershipId),
    AclHelper.hasGameCodesAccess(loggedInUser?.AclEnums),
  ]);
  if (hasAcl) return "approved";
  if (!surveyDone) return "surveyIncomplete";
  return "pending";
}
