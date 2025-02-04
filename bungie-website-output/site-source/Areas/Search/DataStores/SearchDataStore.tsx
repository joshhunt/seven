import { ISearchItemDisplayProperties } from "@Areas/Search/Shared/SearchTabContent";
import { SearchUtils } from "@Areas/Search/Shared/SearchUtils";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { DataStore } from "@bungie/datastore";
import { Localizer } from "@bungie/localization";
import {
  BungieMembershipType,
  GroupDateRange,
  GroupSortBy,
  GroupType,
  RendererLogLevel,
} from "@Enum";
import { Logger } from "@Global/Logger";
import { GroupsV2, Platform, User } from "@Platform";
import { BnetStackNewsArticle } from "../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";

export interface SearchPayload {
  searchTerm: string;
  searchTabContentProps: SearchTabContentProps[];
}

export interface SearchTabContentProps {
  searchItems: ISearchItemDisplayProperties[];
  searchType: SearchType;
  nextPageFunction?: () => void;
  page: number;
  hasMore: boolean;
  tabLabel: string;
}

export type SearchType =
  | "clans"
  | "destinyusers"
  | "users"
  | "items"
  | "news"
  | "support"
  | "none";

class _SearchDataStore extends DataStore<SearchPayload> {
  public static readonly InitialState: SearchPayload = {
    searchTerm: "",
    searchTabContentProps: [],
  };

  public static Instance = new _SearchDataStore(_SearchDataStore.InitialState);

  public actions = this.createActions({
    reset: () => {
      return _SearchDataStore.InitialState;
    },

    setSearchTerm: (state: SearchPayload, searchTerm: string) => {
      return {
        searchTerm,
      };
    },

    doPagedClanSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Clans,
        searchType: "clans",
        page: 0,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedClanSearch(searchTerm, page + 1),
        searchItems: [],
      };

      try {
        const groupInput: GroupsV2.GroupQuery = {
          name: searchTerm,
          groupType: GroupType.Clan,
          creationDate: GroupDateRange.All,
          sortBy: GroupSortBy.Id,
          groupMemberCountFilter: null,
          localeFilter: null,
          tagText: null,
          currentPage: page,
          itemsPerPage: 25,
          requestContinuationToken: null,
        };

        const clanSearchResponse = await Platform.GroupV2Service.GroupSearch(
          groupInput
        );

        const currentDisplayPropsList =
          state.searchTabContentProps?.find((t) => t.searchType === "clans")
            ?.searchItems ?? [];
        const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromClanSearch(
          clanSearchResponse?.results
        );
        const combinedList =
          page === 0
            ? fetchedDisplayPropsList
            : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

        tabContent.page = clanSearchResponse.query.currentPage ?? 0;
        tabContent.hasMore = clanSearchResponse.hasMore;
        tabContent.searchItems = combinedList;
      } catch (error) {
        console.error("Clan search failed:", error);
      }

      SearchDataStore.actions.addSearchTab(tabContent, page === 0);

      return {
        searchTerm: searchTerm,
      };
    },

    doPagedItemSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Items,
        searchType: "items",
        page: 0,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedItemSearch(searchTerm, page + 1),
        searchItems: [],
      };

      try {
        const itemsSearchResponse = await Platform.Destiny2Service.SearchDestinyEntities(
          "DestinyInventoryItemDefinition",
          searchTerm,
          page
        );

        const currentDisplayPropsList =
          state.searchTabContentProps?.find((t) => t.searchType === "items")
            ?.searchItems ?? [];
        const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromItemSearch(
          itemsSearchResponse?.results.results
        );
        const combinedList =
          page === 0
            ? fetchedDisplayPropsList
            : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

        tabContent.page = itemsSearchResponse?.results?.query?.currentPage ?? 0;
        tabContent.hasMore = itemsSearchResponse?.results?.hasMore;
        tabContent.searchItems = combinedList;
      } catch (error) {
        console.error("Item search failed:", error);
      }

      SearchDataStore.actions.addSearchTab(tabContent, page === 0);

      return {
        searchTerm: searchTerm,
      };
    },

    doPagedNewsSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 1
    ) => {
      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_News,
        searchType: "news",
        page: 1,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedNewsSearch(searchTerm, page + 1),
        searchItems: [],
      };

      try {
        const articlesPerPage = 50;
        const [entries, count] = await ContentStackClient()
          .ContentType("news_article")
          .Query()
          .only(["subtitle", "date", "title", "url"])
          .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
          .descending("date")
          .includeCount()
          .skip((page - 1) * articlesPerPage)
          .limit(articlesPerPage)
          .toJSON()
          .find();

        const filteredResults = entries.filter(
          (entry: BnetStackNewsArticle) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const currentDisplayPropsList =
          state.searchTabContentProps?.find((t) => t.searchType === "news")
            ?.searchItems ?? [];
        const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromNewsSearch(
          filteredResults
        );
        const combinedList =
          page === 1
            ? fetchedDisplayPropsList
            : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

        tabContent.page = page;
        tabContent.hasMore = count > page * articlesPerPage;
        tabContent.searchItems = combinedList;
      } catch (error) {
        console.error("News search failed:", error);
        Logger.logToServer(error, RendererLogLevel.Error);
      }

      SearchDataStore.actions.addSearchTab(tabContent, page === 1);

      return {
        searchTerm: searchTerm,
      };
    },

    doPagedUserSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Users,
        searchType: "users",
        page: 0,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedUserSearch(searchTerm, page + 1),
        searchItems: [],
      };

      try {
        const userSearchPrefixRequest: User.UserSearchPrefixRequest = {
          displayNamePrefix: searchTerm,
        };

        const userSearchResponse = await Platform.UserService.SearchByGlobalNamePost(
          userSearchPrefixRequest,
          page
        );

        const currentDisplayPropsList =
          state.searchTabContentProps?.find((t) => t.searchType === "users")
            ?.searchItems ?? [];
        const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromUserSearch(
          userSearchResponse?.searchResults
        );
        const combinedList =
          page === 0
            ? fetchedDisplayPropsList
            : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

        tabContent.page = userSearchResponse?.page ?? 0;
        tabContent.hasMore = userSearchResponse?.hasMore;
        tabContent.searchItems = combinedList;
      } catch (error) {
        console.error("User search failed:", error);
      }

      SearchDataStore.actions.addSearchTab(tabContent, page === 0);

      return {
        searchTerm: searchTerm,
      };
    },

    doPagedDestinyUserSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_DestinyPlayers,
        searchType: "destinyusers",
        page: 0,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedDestinyUserSearch(
            searchTerm,
            page + 1
          ),
        searchItems: [],
      };

      try {
        const bungieGlobalName = searchTerm.split("#");
        const destinyUserName: User.ExactSearchRequest = {
          displayName: bungieGlobalName[0],
          displayNameCode: parseInt(bungieGlobalName[1], 10),
        };

        const destinyUserSearchResponse = await Platform.Destiny2Service.SearchDestinyPlayerByBungieName(
          destinyUserName,
          BungieMembershipType.All
        );

        const currentDisplayPropsList =
          state.searchTabContentProps?.find(
            (t) => t.searchType === "destinyusers"
          )?.searchItems ?? [];
        const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromDestinyUserSearch(
          destinyUserSearchResponse
        );
        const combinedList =
          page === 0
            ? fetchedDisplayPropsList
            : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

        tabContent.searchItems = combinedList;
      } catch (error) {
        console.error("Destiny user search failed:", error);
      }

      SearchDataStore.actions.addSearchTab(tabContent, page === 0);

      return {
        searchTerm: searchTerm,
      };
    },

    addSearchTab: (
      state: SearchPayload,
      tabContent: SearchTabContentProps,
      isFirstPage: boolean
    ) => {
      const otherTabs = state.searchTabContentProps.filter(
        (t) => t.searchType !== tabContent.searchType
      );
      const allTabs = [tabContent, ...otherTabs];

      return {
        searchTabContentProps: allTabs,
      };
    },
  });
}

export const SearchDataStore = _SearchDataStore.Instance;
