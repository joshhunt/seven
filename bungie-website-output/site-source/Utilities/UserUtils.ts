import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import Cookies from "js-cookie";
import * as Globals from "@Enum";
import { DetailedError } from "@CustomErrors";
import moment from "moment";
import { AnalyticsUtils } from "./AnalyticsUtils";
import { ConfigUtils } from "./ConfigUtils";
import * as H from "history";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@Global/Localizer";

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

export class UserUtils {
  /** Returns true if the user is authenticated */
  public static isAuthenticated(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser !== undefined;
  }

  /** Returns true if the user is authenticated */
  public static get hasAuthenticationCookie() {
    const membershipId = Cookies.get("bungleme");

    return membershipId !== undefined && membershipId !== "0";
  }

  public static getAuthChangeStatus(currentProps, prevProps) {
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

  /** Returns the logged in user's membership ID */
  public static loggedInUserMembershipId(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser.user.membershipId : null;
  }

  /** Returns the logged in user's membership ID */
  public static get loggedInUserMembershipIdFromCookie() {
    return Cookies.get("bungleme");
  }

  /** Returns the logged in user's display name */
  public static loggedInUserDisplayName(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser.user.displayName : null;
  }

  /** Returns the logged in user's email */
  public static loggedInUserEmail(
    gs: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
  ) {
    return gs.loggedInUser ? gs.loggedInUser.email : null;
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
