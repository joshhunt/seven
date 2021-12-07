// tslint:disable: max-file-line-count

import { Localizer } from "@bungie/localization/Localizer";
import { DetailedError } from "@CustomErrors";
import * as Globals from "@Enum";
import {
  GlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Fireteam, Friends, GroupsV2, Ignores, User } from "@Platform";
import * as H from "history";
import Cookies from "js-cookie";
import moment from "moment";
import { AnalyticsUtils } from "./AnalyticsUtils";
import { ConfigUtils } from "./ConfigUtils";

export interface IBungieName {
  /** This will fallback to the name to use if we do not have a bungie Global Name for them */
  bungieGlobalName: string;
  bungieGlobalCode: string;
  bungieGlobalCodeWithHashtag: string;
}

export enum AuthChangeStatus {
  None,
  UserLoggedIn,
  UserLoggedOut,
}

export enum CookieConsentValidity {
  Invalid,
  Expired,
  Current,
}

export enum EmailValidationState {
  None,
  NotVerified,
  Verified,
  Verifying,
}

export class UserUtils {
  public static readonly emptyBungieNameObject = {
    bungieGlobalName: null,
    bungieGlobalCode: null,
    bungieGlobalCodeWithHashtag: null,
  } as IBungieName;

  /** Returns true if the user is authenticated */
  public static get hasAuthenticationCookie() {
    const membershipId = Cookies.get("bungleme");

    return membershipId !== undefined && membershipId !== "0";
  }

  /** Returns the logged in user's membership ID */
  public static get loggedInUserMembershipIdFromCookie() {
    return Cookies.get("bungleme");
  }

  /** Returns true if the user is authenticated */
  public static isAuthenticated(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser !== undefined;
  }

  public static getAuthChangeStatus(
    currentProps: GlobalStateComponentProps,
    prevProps: GlobalStateComponentProps
  ) {
    const wasAuthed = UserUtils.isAuthenticated(prevProps.globalState);
    const isNowAuthed = UserUtils.isAuthenticated(currentProps.globalState);

    let status: AuthChangeStatus = UserUtils.isAuthenticated(
      currentProps.globalState
    )
      ? AuthChangeStatus.UserLoggedIn
      : AuthChangeStatus.UserLoggedOut;

    //user logs in
    if (!wasAuthed && isNowAuthed) {
      status = AuthChangeStatus.UserLoggedIn;
    }

    //user logs out
    if (wasAuthed && !isNowAuthed) {
      status = AuthChangeStatus.UserLoggedOut;
    }

    return status;
  }

  /** Returns the logged in user's email validation status */
  public static getEmailValidationState(
    emailStatus: number
  ): EmailValidationState {
    if (emailStatus === 9) {
      return EmailValidationState.Verified;
    } else if (emailStatus === 2) {
      return EmailValidationState.Verifying;
    } else {
      return EmailValidationState.NotVerified;
    }
  }

  /** Returns the logged in user's membership ID */
  public static loggedInUserMembershipId(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser?.user?.membershipId : null;
  }

  /** Returns the logged in user's display name */
  public static loggedInUserDisplayName(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser?.user?.displayName : null;
  }

  public static formatBungieGlobalCode = (code: number) => {
    const bungieGlobalCode =
      code && code !== 0 ? UserUtils.standardizeBungieGlobalCode(code) : null;
    const bungieGlobalCodeWithHashtag = bungieGlobalCode
      ? `#${bungieGlobalCode}`
      : null;

    return {
      bungieGlobalCode: bungieGlobalCode,
      bungieGlobalCodeWithHashtag: bungieGlobalCodeWithHashtag,
    };
  };

  public static getBungieNameFromBnetGeneralUser(
    user: User.GeneralUser
  ): IBungieName {
    if (user) {
      // The general user object is the only place where one of the values for GlobalDisplayName or GlobalDisplayNameCode can potentially be null or empty but not the other
      const invalidCombination =
        user?.cachedBungieGlobalDisplayNameCode === 0 ||
        !user?.cachedBungieGlobalDisplayName;
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(
        user?.cachedBungieGlobalDisplayNameCode
      );
      const validBungieNameFlow =
        user?.cachedBungieGlobalDisplayName &&
        user?.cachedBungieGlobalDisplayName.length !== 0
          ? user?.cachedBungieGlobalDisplayName
          : user?.displayName;
      const invalidBungieNameBackup = user?.displayName;

      return {
        bungieGlobalName: invalidCombination
          ? invalidBungieNameBackup
          : validBungieNameFlow,
        bungieGlobalCode: invalidCombination ? "" : bungieGlobalCode,
        bungieGlobalCodeWithHashtag: invalidCombination
          ? ""
          : bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  }
  public static getBungieNameFromGroupUserInfoCard = (
    user: GroupsV2.GroupUserInfoCard
  ): IBungieName => {
    if (user) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(user?.bungieGlobalDisplayNameCode);

      return {
        bungieGlobalName:
          user?.bungieGlobalDisplayName ||
          user?.displayName ||
          user?.supplementalDisplayName,
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };
  public static getBungieNameFromUserInfoCard = (
    user: User.UserInfoCard
  ): IBungieName => {
    if (user) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(user?.bungieGlobalDisplayNameCode);

      return {
        bungieGlobalName:
          user?.bungieGlobalDisplayName ||
          user?.displayName ||
          user?.supplementalDisplayName,
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };
  public static getBungieNameFromUserSearchResponseDetail = (
    user: User.UserSearchResponseDetail
  ): IBungieName => {
    if (user) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(user?.bungieGlobalDisplayNameCode);

      return {
        bungieGlobalName: user?.bungieGlobalDisplayName,
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };
  public static getBungieNameFromBnetBungieFriend = (
    friend: Friends.BungieFriend
  ): IBungieName => {
    if (friend) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(friend?.bungieGlobalDisplayNameCode);
      const supplementalMembership = friend?.bungieNetUser;
      const supplementalData = UserUtils.formatBungieGlobalCode(
        supplementalMembership?.cachedBungieGlobalDisplayNameCode
      );

      return {
        bungieGlobalName:
          friend?.bungieGlobalDisplayName ||
          supplementalMembership?.cachedBungieGlobalDisplayName ||
          supplementalMembership?.displayName,
        bungieGlobalCode:
          bungieGlobalCode || supplementalData?.bungieGlobalCode,
        bungieGlobalCodeWithHashtag:
          bungieGlobalCodeWithHashtag ??
          supplementalData?.bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };
  public static getBungieNameFromBnetIgnoredPlayer = (
    player: Ignores.IgnoredPlayer
  ): IBungieName => {
    if (player) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(player?.bungieNameCode);

      return {
        bungieGlobalName: player?.bungieName,
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };
  public static getBungieNameFromBnetFireteamMember = (
    member: Fireteam.FireteamMember
  ): IBungieName => {
    if (member) {
      const {
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } = UserUtils.formatBungieGlobalCode(
        member?.destinyUserInfo?.bungieGlobalDisplayNameCode
      );

      return {
        bungieGlobalName:
          member?.destinyUserInfo?.bungieGlobalDisplayName ||
          member?.destinyUserInfo?.FireteamDisplayName ||
          member?.destinyUserInfo?.displayName,
        bungieGlobalCode,
        bungieGlobalCodeWithHashtag,
      } as IBungieName;
    } else {
      return UserUtils.emptyBungieNameObject;
    }
  };

  public static standardizeBungieGlobalCode = (
    bungieGlobalCode: number
  ): string => {
    const splitString = [...bungieGlobalCode.toString()];
    const numberNeeded = 4 - splitString.length;

    return Array(numberNeeded).fill("0").concat(splitString).join("");
  };

  /** Returns the logged in user's email */
  public static loggedInUserEmail(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser.email : null;
  }

  /** Returns the profile picture path or defaults to tricorn for a bungieFriend */
  public static bungieFriendProfilePicturePath(
    user: Friends.BungieFriend
  ): string | null {
    return (
      user?.bungieNetUser?.profilePicturePath ??
      "/7/ca/destiny/logos/tricorn.png"
    );
  }

  /**
   * Converts BungieMembershipType to BungieCredentialType
   * @param membershipType
   */
  public static getCredentialTypeFromMembershipType(
    membershipType: Globals.BungieMembershipType
  ) {
    switch (membershipType) {
      case Globals.BungieMembershipType.TigerDemon:
        return Globals.BungieCredentialType.DemonId;
      case Globals.BungieMembershipType.TigerPsn:
        return Globals.BungieCredentialType.Psnid;
      case Globals.BungieMembershipType.TigerBlizzard:
        return Globals.BungieCredentialType.BattleNetId;
      case Globals.BungieMembershipType.TigerXbox:
        return Globals.BungieCredentialType.Xuid;
      case Globals.BungieMembershipType.TigerSteam:
        return Globals.BungieCredentialType.SteamId;
      case Globals.BungieMembershipType.TigerStadia:
        return Globals.BungieCredentialType.StadiaId;
      default:
        throw new DetailedError(
          "Invalid membership type",
          "Only Destiny membership types are allowed in this component"
        );
    }
  }

  /**
   * Converts BungieCredentialType to BungieMembershipType
   * @param credType
   */
  public static getMembershipTypeFromCredentialType(
    credType: Globals.BungieCredentialType
  ) {
    switch (credType) {
      case Globals.BungieCredentialType.DemonId:
        return Globals.BungieMembershipType.TigerDemon;
      case Globals.BungieCredentialType.Psnid:
        return Globals.BungieMembershipType.TigerPsn;
      case Globals.BungieCredentialType.BattleNetId:
        return Globals.BungieMembershipType.TigerBlizzard;
      case Globals.BungieCredentialType.Xuid:
        return Globals.BungieMembershipType.TigerXbox;
      case Globals.BungieCredentialType.SteamId:
        return Globals.BungieMembershipType.TigerSteam;
      case Globals.BungieCredentialType.StadiaId:
        return Globals.BungieMembershipType.TigerStadia;
      default:
        throw new DetailedError(
          "Invalid credential type",
          "Only Destiny credential types are allowed in this component"
        );
    }
  }

  /**
   * converts platform string in to
   * @param platform
   */
  public static getCredentialTypeFromPlatformString(platform: string) {
    switch (platform) {
      case "xbox":
      case "msstore":
        return Globals.BungieCredentialType.Xuid;
      case "psn":
      case "playstation":
        return Globals.BungieCredentialType.Psnid;
      case "steam":
        return Globals.BungieCredentialType.SteamId;
      case "stadia":
        return Globals.BungieCredentialType.StadiaId;
      case "twitch":
        return Globals.BungieCredentialType.TwitchId;
    }

    return null;
  }

  /**
   * Converts BungieCredentialType to PlatformFriendType
   * @param credType
   */
  public static getPlatformTypeFromTypeFromCredentialType(
    credType: Globals.BungieCredentialType
  ) {
    switch (credType) {
      case Globals.BungieCredentialType.SteamId:
        return Globals.PlatformFriendType.Steam;
      case Globals.BungieCredentialType.Psnid:
        return Globals.PlatformFriendType.PSN;
      case Globals.BungieCredentialType.Xuid:
        return Globals.PlatformFriendType.Xbox;
      default:
        throw new DetailedError(
          "Invalid credential type",
          "The supplied credential type does not have a corresponding PlatformFriendType"
        );
    }
  }

  /**
   * Converts PlatformFriendType to BungieMembershipType
   * @param platformFriendType
   */
  public static getBungieMembershipTypeFromPlatformFriendType(
    platformFriendType: Globals.PlatformFriendType
  ) {
    switch (platformFriendType) {
      case Globals.PlatformFriendType.Steam:
        return Globals.BungieMembershipType.TigerSteam;
      case Globals.PlatformFriendType.PSN:
        return Globals.BungieMembershipType.TigerPsn;
      case Globals.PlatformFriendType.Xbox:
        return Globals.BungieMembershipType.TigerXbox;
      default:
        throw new DetailedError(
          "Invalid platformFriend type",
          "The supplied platform friend type does not have a corresponding BungieMembershipType"
        );
    }
  }

  /**
   * Converts PlatformFriendType to BungieCredentialType
   * @param platformFriendType
   */
  public static getCredentialTypeFromPlatformFriendType(
    platformFriendType: Globals.PlatformFriendType
  ) {
    switch (platformFriendType) {
      case Globals.PlatformFriendType.Steam:
        return Globals.BungieCredentialType.SteamId;
      case Globals.PlatformFriendType.PSN:
        return Globals.BungieCredentialType.Psnid;
      case Globals.PlatformFriendType.Xbox:
        return Globals.BungieCredentialType.Xuid;
      default:
        return Globals.BungieCredentialType.None;
    }
  }

  /**
   * Checks if authentication is enabled for BungieMembershipTypes
   * @param membershipType
   */

  public static isAuthEnabledForMembershipType(
    membershipType: Globals.BungieMembershipType
  ) {
    switch (membershipType) {
      case Globals.BungieMembershipType.TigerPsn:
        return ConfigUtils.SystemStatus("PSNAuth");
      case Globals.BungieMembershipType.TigerBlizzard:
        return ConfigUtils.SystemStatus("Blizzard");
      case Globals.BungieMembershipType.TigerXbox:
        return ConfigUtils.SystemStatus("XuidAuth");
      case Globals.BungieMembershipType.TigerSteam:
        return ConfigUtils.SystemStatus("SteamIdAuth");
      case Globals.BungieMembershipType.TigerStadia:
        return ConfigUtils.SystemStatus("StadiaIdAuth");
      default:
        throw new DetailedError(
          "Invalid membership type",
          "Only Destiny membership types are allowed in this component"
        );
    }
  }

  /** Sets the consent cookie */
  public static SetConsentCookie() {
    const enabled = ConfigUtils.SystemStatus("CookieConsent");
    if (enabled) {
      const cookieName = ConfigUtils.GetParameter(
        "CookieConsent",
        "CookieName",
        "bunglecst"
      );
      const currentVersion = ConfigUtils.GetParameter(
        "PrivacyAuthCheck",
        "CurrentPrivacyVersion",
        "0"
      );

      const opts: Cookies.CookieAttributes = {
        expires: moment().add(7, "years").toDate(),
      };

      if (ConfigUtils.EnvironmentIsProduction) {
        opts.domain = "bungie.net";
      }

      Cookies.set(cookieName, currentVersion, opts);

      // Track page at this point because it wasn't tracked when the user first hit the page
      AnalyticsUtils.trackPage();
    }
  }

  /** If true, cookie consent system is enabled */
  public static CookieConsentIsEnabled() {
    return ConfigUtils.SystemStatus("CookieConsent");
  }

  /** If true, user has given consent */
  public static CookieConsentValidity(): CookieConsentValidity {
    const currentVersion = ConfigUtils.GetParameter(
      "PrivacyAuthCheck",
      "CurrentPrivacyVersion",
      "0"
    );
    const cookieName = ConfigUtils.GetParameter(
      "CookieConsent",
      "CookieName",
      "bunglecst"
    );
    const cookieVersion = Cookies.get(cookieName);

    let validity = CookieConsentValidity.Invalid;
    if (cookieVersion) {
      validity =
        cookieVersion === currentVersion
          ? CookieConsentValidity.Current
          : CookieConsentValidity.Expired;
    }

    return validity;
  }

  public static CookieConsentIsCurrent() {
    return this.CookieConsentValidity() === CookieConsentValidity.Current;
  }

  public static SignIn(
    history: H.History,
    prevPath?: string,
    registrationLocKey?: string
  ) {
    const encodedPrevPath = encodeURIComponent(prevPath);
    const previousPath =
      prevPath?.length > 0 && registrationLocKey?.length > 0
        ? `&bru=${encodedPrevPath}`
        : `?bru=${encodedPrevPath}`;

    history.push(
      `/${Localizer.CurrentCultureName}/User/SignIn${
        registrationLocKey?.length > 0 ? `?title=${registrationLocKey}` : ""
      }${previousPath}`
    );
  }
}
