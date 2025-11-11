import { FireteamFinder, Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import {
  DestinyFireteamFinderLobbyState,
  DestinyFireteamFinderListingFilterMatchType,
  DestinyFireteamFinderListingFilterRangeType,
} from "@Enum";
import { FireteamFilterManager } from "./FireteamFilterManager";
import { FireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { CustomLobbyState, LobbyStateManager } from "./LobbyStateManager";

export interface SearchFiltersInput {
  tags: string[];
  graphId: string;
  lobbyState: DestinyFireteamFinderLobbyState;
  filterData: Record<string, any>;
  browseFilterDefinitionTree: Record<string, any>;
}

export interface MembershipInfo {
  membershipId: string;
  membershipType: number;
  characterId?: string;
}

export interface UserFireteamsResponse {
  userActiveFireteam?: FireteamFinder.DestinyFireteamFinderListing;
  userScheduledFireteams: FireteamFinder.DestinyFireteamFinderListing[];
  currentLobby?: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  activeLobbies: FireteamFinder.DestinyFireteamFinderLobbyResponse[];
}

export class FireteamApiService {
  /**
   * Builds listing values from filter data
   */
  private static buildListingValues(
    filterData: Record<string, any>,
    browseFilterDefinitionTree: Record<string, any>
  ): { values: number[]; valueType: number }[] {
    const listingValues: { values: number[]; valueType: number }[] = [];

    Object.keys(filterData)?.forEach((key: string) => {
      if (
        filterData[key] !== "-1" &&
        filterData[key]?.length !== 0 &&
        key !== "lobbyState"
      ) {
        const optionCategory = browseFilterDefinitionTree[key];

        if (
          key !== FireteamFinderValueTypes.title &&
          key !== FireteamFinderValueTypes.tags &&
          key !== FireteamFinderValueTypes.activity
        ) {
          // Parse the value and only add if it's valid
          const parsedValue = FireteamFilterManager.parseIntAndValidate(
            filterData[key]
          );

          // Skip if parsed value is null
          if (parsedValue !== null && optionCategory?.hash) {
            listingValues.push({
              values: [parsedValue],
              valueType: optionCategory.hash,
            });
          }
        }
      }
    });

    return listingValues;
  }

  /**
   * Builds request filters from listing values, tags, and activity
   */
  private static buildRequestFilters(
    listingValues: { values: number[]; valueType: number }[],
    tags: string[],
    graphId: string
  ): FireteamFinder.DestinyFireteamFinderListingFilter[] {
    const requestFilters = listingValues.map((listingValue) => ({
      listingValue,
      matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
      rangeType: DestinyFireteamFinderListingFilterRangeType.InRangeInclusive,
    })) as FireteamFinder.DestinyFireteamFinderListingFilter[];

    if (tags?.length > 0) {
      const tagsValueType = FireteamFilterManager.parseIntAndValidate(
        FireteamFinderValueTypes.tags
      );

      if (tagsValueType !== null) {
        const tagsRequestFilter = {
          listingValue: {
            values: tags
              .map((tag) => parseInt(tag))
              .filter((tag) => !isNaN(tag)), // Filter out NaN values
            valueType: tagsValueType,
          },
          matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
          rangeType: DestinyFireteamFinderListingFilterRangeType.All,
        };

        if (tagsRequestFilter.listingValue.values.length > 0) {
          requestFilters.push(tagsRequestFilter);
        }
      }
    }

    const activityValueType = FireteamFilterManager.parseIntAndValidate(
      FireteamFinderValueTypes.activity
    );
    const activityId = parseInt(graphId);

    if (activityValueType !== null && !isNaN(activityId)) {
      const activityRequestFilter = {
        listingValue: {
          values: [activityId],
          valueType: activityValueType,
        },
        matchType: DestinyFireteamFinderListingFilterMatchType.Filter,
        rangeType: DestinyFireteamFinderListingFilterRangeType.All,
      };
      requestFilters.push(activityRequestFilter);
    }

    return requestFilters;
  }

  /**
   * Searches for fireteam listings by filters
   */
  static async searchListingsByFilters(
    searchInput: SearchFiltersInput,
    membership: MembershipInfo
  ): Promise<FireteamFinder.DestinyFireteamFinderListing[]> {
    const listingValues = this.buildListingValues(
      searchInput.filterData,
      searchInput.browseFilterDefinitionTree
    );

    const requestFilters = this.buildRequestFilters(
      listingValues,
      searchInput.tags,
      searchInput.graphId
    );

    const input = {
      filters: requestFilters,
      pageSize: 50,
      pageToken: "",
      lobbyState: searchInput.lobbyState,
    };

    try {
      const response = await Platform.FireteamfinderService.SearchListingsByFilters(
        input,
        membership.membershipType,
        membership.membershipId,
        membership.characterId,
        false
      );

      return response.listings;
    } catch (error) {
      const platformError = await ConvertToPlatformError(error);
      Modal.error(platformError);
    }
  }

  /**
   * Gets player lobbies (active and current)
   */
  static async getPlayerLobbies(
    membership: MembershipInfo,
    pageSize: number = 100,
    pageToken: string = ""
  ): Promise<{
    activeLobbies: FireteamFinder.DestinyFireteamFinderLobbyResponse[];
    currentLobby?: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  }> {
    try {
      const response = await Platform.FireteamfinderService.GetPlayerLobbies(
        membership.membershipType,
        membership.membershipId,
        membership.characterId,
        pageSize,
        pageToken
      );

      // Filter active lobbies (state === 1 and listingId !== "0")
      const activeLobbies =
        response?.lobbies?.filter(
          (lobby: FireteamFinder.DestinyFireteamFinderLobbyResponse) =>
            lobby?.state === 1 && lobby?.listingId !== "0"
        ) || [];

      // Find current lobby (state === 2)
      const currentLobby = response?.lobbies?.find(
        (lobby: FireteamFinder.DestinyFireteamFinderLobbyResponse) =>
          lobby?.state === 2
      );

      return {
        activeLobbies,
        currentLobby,
      };
    } catch (error) {
      const platformError = await ConvertToPlatformError(error);
      Modal.error(platformError);
    }
  }

  /**
   * Gets a specific fireteam listing by ID
   */
  static async getListing(
    listingId: string
  ): Promise<FireteamFinder.DestinyFireteamFinderListing> {
    try {
      const response = await Platform.FireteamfinderService.GetListing(
        listingId
      );
      return response;
    } catch (error) {
      const platformError = await ConvertToPlatformError(error);
      Modal.error(platformError);
    }
  }

  /**
   * Gets user's active fireteam and scheduled fireteams
   */
  static async getUserFireteams(
    membership: MembershipInfo
  ): Promise<UserFireteamsResponse> {
    try {
      const playerLobbies = await this.getPlayerLobbies(membership);

      let userActiveFireteam:
        | FireteamFinder.DestinyFireteamFinderListing
        | undefined;
      const userScheduledFireteams: FireteamFinder.DestinyFireteamFinderListing[] = [];

      // Get active fireteam from current lobby (state === 2)
      if (
        playerLobbies.currentLobby?.listingId &&
        playerLobbies.currentLobby.listingId !== "0"
      ) {
        try {
          userActiveFireteam = await this.getListing(
            playerLobbies.currentLobby.listingId
          );
        } catch (error) {
          console.warn(
            `Failed to get active fireteam listing ${playerLobbies.currentLobby.listingId}:`,
            error
          );
        }
      }

      for (const lobby of playerLobbies.activeLobbies) {
        if (lobby.listingId && lobby.listingId !== "0") {
          try {
            const listing = await this.getListing(lobby.listingId);
            userScheduledFireteams.push(listing);
          } catch (error) {
            console.warn(
              `Failed to get scheduled fireteam listing ${lobby.listingId}:`,
              error
            );
          }
        }
      }

      return {
        userActiveFireteam,
        userScheduledFireteams,
        currentLobby: playerLobbies.currentLobby,
        activeLobbies: playerLobbies.activeLobbies,
      };
    } catch (error) {
      console.error("Failed to get user fireteams:", error);
      return {
        userScheduledFireteams: [],
        activeLobbies: [],
      };
    }
  }

  /**
   * Handles different lobby states including "Mine"
   */
  static async getFireteamsByLobbyState(
    lobbyState: CustomLobbyState,
    searchInput: SearchFiltersInput,
    membership: MembershipInfo
  ): Promise<FireteamFinder.DestinyFireteamFinderListing[]> {
    if (LobbyStateManager.isMine(lobbyState)) {
      const userFireteams = await this.getUserFireteams(membership);
      const allUserFireteams: FireteamFinder.DestinyFireteamFinderListing[] = [];

      if (userFireteams.userActiveFireteam) {
        allUserFireteams.push(userFireteams.userActiveFireteam);
      }

      allUserFireteams.push(...userFireteams.userScheduledFireteams);

      return allUserFireteams;
    }

    if (LobbyStateManager.isClan(lobbyState)) {
      const [scheduled, active] = await Promise.all([
        Platform.FireteamfinderService.SearchListingsByClan(
          {
            lobbyState: DestinyFireteamFinderLobbyState.Active,
            pageSize: 100,
            pageToken: "",
          },
          membership.membershipType,
          membership.membershipId,
          membership.characterId
        ),
        Platform.FireteamfinderService.SearchListingsByClan(
          {
            lobbyState: DestinyFireteamFinderLobbyState.Inactive,
            pageSize: 100,
            pageToken: "",
          },
          membership.membershipType,
          membership.membershipId,
          membership.characterId
        ),
      ]);
      return scheduled.listings.concat(active.listings);
    }

    const destinyLobbyState = LobbyStateManager.getDestinyLobbyState(
      lobbyState
    );
    if (destinyLobbyState === null) {
      throw new Error(`Invalid lobby state: ${lobbyState}`);
    }

    const updatedSearchInput = {
      ...searchInput,
      lobbyState: destinyLobbyState,
    };

    return this.searchListingsByFilters(updatedSearchInput, membership);
  }

  /**
   * Gets player lobbies and current active listing in one call
   * @deprecated Use getUserFireteams instead for better naming
   */
  static async getPlayerLobbiesWithActiveListing(
    membership: MembershipInfo,
    pageSize: number = 100,
    pageToken: string = ""
  ): Promise<{
    activeLobbies: FireteamFinder.DestinyFireteamFinderLobbyResponse[];
    currentLobby?: FireteamFinder.DestinyFireteamFinderLobbyResponse;
    activeListing?: FireteamFinder.DestinyFireteamFinderListing;
  }> {
    const playerLobbiesResponse = await this.getPlayerLobbies(
      membership,
      pageSize,
      pageToken
    );

    let activeListing: FireteamFinder.DestinyFireteamFinderListing | undefined;

    if (playerLobbiesResponse.currentLobby?.listingId) {
      try {
        activeListing = await this.getListing(
          playerLobbiesResponse.currentLobby.listingId
        );
      } catch (error) {
        console.warn("Failed to get active listing:", error);
      }
    }

    return {
      ...playerLobbiesResponse,
      activeListing,
    };
  }
}
