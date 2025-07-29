import { DestinyFireteamFinderLobbyState } from "@Enum";
import { FireteamFilterManager } from "./FireteamFilterManager";
import { Localizer } from "@bungie/localization/Localizer";

// Create a custom enum with literal values
export enum CustomLobbyState {
  Active = 1, // Same as DestinyFireteamFinderLobbyState.Active
  Inactive = 2, // Same as DestinyFireteamFinderLobbyState.Inactive
  Unknown = 0, // Same as DestinyFireteamFinderLobbyState.Unknown
  Clan = 900,
  Mine = 999, // Custom value
}

// Type for allowed lobby states
export type AllowedLobbyState =
  | CustomLobbyState.Active
  | CustomLobbyState.Inactive
  | CustomLobbyState.Unknown
  | CustomLobbyState.Clan
  | CustomLobbyState.Mine;

export class LobbyStateManager {
  /**
   * Maps CustomLobbyState to DestinyFireteamFinderLobbyState for API calls
   */
  private static mapToDestinyLobbyState(
    customState: CustomLobbyState
  ): DestinyFireteamFinderLobbyState | null {
    switch (customState) {
      case CustomLobbyState.Active:
        return DestinyFireteamFinderLobbyState.Active;
      case CustomLobbyState.Inactive:
        return DestinyFireteamFinderLobbyState.Inactive;
      case CustomLobbyState.Unknown:
        return DestinyFireteamFinderLobbyState.Unknown;
      case CustomLobbyState.Mine:
      case CustomLobbyState.Clan:
        return null; // Special handling required
      default:
        return DestinyFireteamFinderLobbyState.Active;
    }
  }

  /**
   * Maps DestinyFireteamFinderLobbyState to CustomLobbyState
   */
  private static mapFromDestinyLobbyState(
    destinyState: DestinyFireteamFinderLobbyState
  ): CustomLobbyState {
    switch (destinyState) {
      case DestinyFireteamFinderLobbyState.Active:
        return CustomLobbyState.Active;
      case DestinyFireteamFinderLobbyState.Inactive:
        return CustomLobbyState.Inactive;
      case DestinyFireteamFinderLobbyState.Unknown:
        return CustomLobbyState.Active;
      default:
        return CustomLobbyState.Active;
    }
  }

  /**
   * Gets initial lobby state from URL params
   */
  static getInitialLobbyState(
    urlParams: Record<string, string>,
    defaultState: CustomLobbyState
  ): CustomLobbyState {
    const lobbyStateParam = FireteamFilterManager.parseIntAndValidate(
      urlParams.lobbyState
    );

    // Check if it's our custom states
    if (lobbyStateParam === CustomLobbyState.Mine) {
      return CustomLobbyState.Mine;
    }

    if (lobbyStateParam === CustomLobbyState.Clan) {
      return CustomLobbyState.Clan;
    }

    // Check other states
    if (lobbyStateParam === CustomLobbyState.Active) {
      return CustomLobbyState.Active;
    }

    if (lobbyStateParam === CustomLobbyState.Inactive) {
      return CustomLobbyState.Inactive;
    }

    if (lobbyStateParam === CustomLobbyState.Unknown) {
      return CustomLobbyState.Unknown;
    }

    return defaultState; // Default
  }

  /**
   * Gets the Destiny API lobby state (null if custom handling needed)
   */
  static getDestinyLobbyState(
    customState: CustomLobbyState
  ): DestinyFireteamFinderLobbyState | null {
    return this.mapToDestinyLobbyState(customState);
  }

  /**
   * Checks if lobby state is active
   */
  static isActive(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Active;
  }

  /**
   * Checks if lobby state is inactive
   */
  static isInactive(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Inactive;
  }

  /**
   * Checks if lobby state is clan
   */
  static isClan(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Clan;
  }

  /**
   * Checks if lobby state is mine
   */
  static isMine(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Mine;
  }

  /**
   * Checks if lobby state is unknown
   */
  static isUnknown(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Unknown;
  }

  /**
   * Gets display label for lobby state
   */
  static getLobbyStateLabel(lobbyState: CustomLobbyState): string {
    const lobbyStateLabelMap: Record<CustomLobbyState, string> = {
      [CustomLobbyState.Active]: Localizer.fireteams.active || "Active",
      [CustomLobbyState.Inactive]: Localizer.fireteams.scheduled || "Scheduled",
      [CustomLobbyState.Unknown]: Localizer.fireteams.Any || "Any",
      [CustomLobbyState.Clan]: Localizer.clans.Clan || "Clan",
      [CustomLobbyState.Mine]: Localizer.fireteams.Mine || "Mine",
    };

    return lobbyStateLabelMap[lobbyState] || "Unknown";
  }

  /**
   * Gets all available lobby states
   */
  static getAllLobbyStates(): CustomLobbyState[] {
    return [
      CustomLobbyState.Active,
      CustomLobbyState.Inactive,
      CustomLobbyState.Mine,
    ];
  }

  /**
   * Checks if lobby state requires special handling (like Mine)
   */
  static requiresSpecialHandling(lobbyState: CustomLobbyState): boolean {
    return lobbyState === CustomLobbyState.Mine;
  }

  /**
   * Converts from Destiny lobby state to custom lobby state
   */
  static fromDestinyLobbyState(
    destinyState: DestinyFireteamFinderLobbyState
  ): CustomLobbyState {
    return this.mapFromDestinyLobbyState(destinyState);
  }
}
