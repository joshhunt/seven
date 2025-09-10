// Created by larobinson, 2025
// Copyright Bungie, Inc.

import {
  AclEnum,
  BungieCredentialType,
  ClientDeviceType,
  ApplicationScopes,
} from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import { Platform } from "@Platform";
import { Contract, User } from "@Platform";

/**
 * PlaytestsHelper provides utility functions for detecting and managing
 * user authentication credential types in the context of Marathon playtests.
 */
export class PlaytestsHelper {
  static getAclAsString = (acl: AclEnum): string => {
    return EnumUtils.getStringValue(acl, AclEnum);
  };

  /**
   * Check if user has access to Marathon Playtests based on their ACLs
   * Uses the same pattern as Alpha flow for consistency
   * @param userAcls Array of user ACLs
   * @returns boolean indicating if user has playtests access
   */
  static hasPlaytestsAccess(userAcls: AclEnum[]): boolean {
    if (!userAcls || !Array.isArray(userAcls)) {
      return false;
    }

    // Check for specific Marathon Playtests ACLs
    return userAcls.some((role: AclEnum) => {
      const aclString = this.getAclAsString(role);
      // More specific check for playtests access
      return (
        aclString?.includes("Marathon_Playtests") ||
        aclString?.includes("MarathonPlaytests") ||
        aclString === "Marathon_Alpha" || // Alpha users get playtests access
        aclString?.startsWith("Marathon_Internal")
      );
    });
  }

  /**
   * Get the specific Marathon Playtests ACL for the user
   * @param userAcls Array of user ACLs
   * @returns The Marathon Playtests ACL or null if none found
   */
  static getMarathonPlaytestsAcl(userAcls: AclEnum[]): AclEnum | null {
    if (!userAcls || !Array.isArray(userAcls)) {
      return null;
    }

    return (
      userAcls.find((role) => {
        const aclString = this.getAclAsString(role);
        return (
          aclString?.includes("Marathon_Playtests") ||
          aclString?.includes("MarathonPlaytests") ||
          aclString === "Marathon_Alpha" ||
          aclString?.startsWith("Marathon_Internal")
        );
      }) || null
    );
  }

  /**
   * Get Marathon ACL as string for logging/debugging purposes
   * @param userAcls Array of user ACLs
   * @returns String representation of Marathon ACL or null
   */
  static getMarathonAclString(userAcls: AclEnum[]): string | null {
    const marathonAcl = this.getMarathonPlaytestsAcl(userAcls);
    return marathonAcl ? this.getAclAsString(marathonAcl) : null;
  }

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
   * Gets the current user's detailed information including credential settings.
   *
   * @returns Promise<Contract.UserDetail>
   */
  public static async getCurrentUserDetail(): Promise<Contract.UserDetail> {
    try {
      const userDetail = await Platform.UserService.GetCurrentUser();
      return userDetail;
    } catch (error) {
      console.error("Failed to get current user detail:", error);
      throw error;
    }
  }

  /**
   * Converts a BungieCredentialType enum value to a human-readable string.
   *
   * @param credentialType The credential type enum value
   * @returns string The display name for the credential type
   */
  public static getCredentialTypeDisplayName(
    credentialType: BungieCredentialType
  ): string {
    switch (credentialType) {
      case BungieCredentialType.Xuid:
        return "Xbox Live";
      case BungieCredentialType.Psnid:
        return "PlayStation Network";
      case BungieCredentialType.SteamId:
        return "Steam";
      case BungieCredentialType.StadiaId:
        return "Stadia";
      case BungieCredentialType.TwitchId:
        return "Twitch";
      case BungieCredentialType.EgsId:
        return "Epic Games Store";
      default:
        return "Unknown Platform";
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

  /**
   * Gets a summary of the user's authentication state for display purposes.
   *
   * @returns Promise<AuthenticationSummary>
   */
  public static async getAuthenticationSummary(): Promise<
    AuthenticationSummary
  > {
    try {
      const [
        authContext,
        userDetail,
        availableCredentials,
      ] = await Promise.all([
        this.getCurrentAuthenticationContext(),
        this.getCurrentUserDetail(),
        this.getAvailableCredentialTypes(),
      ]);

      return {
        currentCredentialType: authContext.AuthProvider,
        currentCredentialDisplayName: this.getCredentialTypeDisplayName(
          authContext.AuthProvider
        ),
        membershipId: authContext.MembershipId,
        deviceType: authContext.DeviceType,
        isOAuthSession: authContext.IsOAuth,
        scope: authContext.Scope,
        linkedCredentials: availableCredentials,
        publicCredentialTypes: userDetail.publicCredentialTypes,
        crossSaveCredentialTypes: userDetail.crossSaveCredentialTypes,
      };
    } catch (error) {
      console.error("Failed to get authentication summary:", error);
      throw error;
    }
  }
}

/**
 * Interface representing a summary of the user's authentication state
 */
export interface AuthenticationSummary {
  currentCredentialType: BungieCredentialType;
  currentCredentialDisplayName: string;
  membershipId: string;
  deviceType: ClientDeviceType;
  isOAuthSession: boolean;
  scope: ApplicationScopes;
  linkedCredentials: Contract.GetCredentialTypesForAccountResponse[];
  publicCredentialTypes: BungieCredentialType[];
  crossSaveCredentialTypes: BungieCredentialType[];
}

/**
 * Example usage patterns for credential type detection
 */
export class AuthenticationExamples {
  /**
   * Example: Check if user is currently authenticated via Steam
   */
  public static async checkIfSteamUser(): Promise<boolean> {
    return await PlaytestsHelper.isAuthenticatedVia(
      BungieCredentialType.SteamId
    );
  }

  /**
   * Example: Get the current session's credential type name
   */
  public static async getCurrentPlatformName(): Promise<string> {
    const authContext = await PlaytestsHelper.getCurrentAuthenticationContext();
    return PlaytestsHelper.getCredentialTypeDisplayName(
      authContext.AuthProvider
    );
  }

  /**
   * Example: Check if user has PlayStation Network linked (regardless of current session)
   */
  public static async hasPSNLinked(): Promise<boolean> {
    return await PlaytestsHelper.hasCredentialTypeLinked(
      BungieCredentialType.Psnid
    );
  }

  /**
   * Example: Get all platform names the user has linked
   */
  public static async getAllLinkedPlatforms(): Promise<string[]> {
    const credentials = await PlaytestsHelper.getAvailableCredentialTypes();
    return credentials.map((cred) =>
      PlaytestsHelper.getCredentialTypeDisplayName(cred.credentialType)
    );
  }
}

export type PlaytestStatus =
  | "approved"
  | "pending"
  | "notEligible"
  | "surveyIncomplete";

// TODO: Wire to real Qualtrics API
export async function getSurveyCompletedForUser(
  userMembershipId: string
): Promise<boolean> {
  // Placeholder: return false until integrated
  try {
    // await fetch('/api/qualtrics/...');
    return false;
  } catch {
    return false;
  }
}

// TODO: Wire to real ACL check
export async function getHasPlaytestAcl(
  userMembershipId: string
): Promise<boolean> {
  try {
    // Example: await Platform.Whatever.CheckAcl({ userMembershipId })
    return false;
  } catch {
    return false;
  }
}

export async function resolvePlaytestStatus(
  userMembershipId?: string
): Promise<PlaytestStatus> {
  if (!userMembershipId) {
    return "notEligible";
  }
  const [surveyDone, hasAcl] = await Promise.all([
    getSurveyCompletedForUser(userMembershipId),
    getHasPlaytestAcl(userMembershipId),
  ]);
  if (hasAcl) return "approved";
  if (!surveyDone) return "surveyIncomplete";
  return "pending";
}
