// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ISearchItemDisplayProperties } from "@Areas/Search/Shared/SearchTabContent";
import { SearchUtils } from "@Areas/Search/Shared/SearchUtils";
import { DataStore } from "@bungie/datastore";
import { Localizer } from "@bungie/localization";
import {
  BungieMembershipType,
  GroupDateRange,
  GroupSortBy,
  GroupType,
} from "@Enum";
import { GroupsV2, Platform, User } from "@Platform";
import React from "react";

export interface SearchPayload {
  searchTerm: string;
  searchTabContentProps: SearchTabContentProps[];
  visibleTabs: Set<SearchType>;
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
  | "activities"
  | "items"
  | "news"
  | "support"
  | "none";

class _SearchDataStore extends DataStore<SearchPayload> {
  public static readonly InitialState: SearchPayload = {
    searchTerm: "",
    searchTabContentProps: [],
    visibleTabs: new Set(),
  };

  public static Instance = new _SearchDataStore(_SearchDataStore.InitialState);

  public actions = this.createActions({
    reset: () => {
      return _SearchDataStore.InitialState;
    },
    doPagedClanSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
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

      let clanSearchResponse;

      try {
        clanSearchResponse = await Platform.GroupV2Service.GroupSearch(
          groupInput
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "clans"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromClanSearch(
        clanSearchResponse?.results
      );
      const combinedList =
        page === 0
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Clans,
        searchType: "clans",
        page: clanSearchResponse.query.currentPage ?? 0,
        hasMore: clanSearchResponse.hasMore,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedClanSearch(searchTerm, page + 1),
        searchItems: combinedList,
      };

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
      let itemsSearchResponse;

      try {
        itemsSearchResponse = await Platform.Destiny2Service.SearchDestinyEntities(
          "DestinyInventoryItemDefinition",
          searchTerm,
          page
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "items"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromItemSearch(
        itemsSearchResponse?.results.results
      );
      const combinedList =
        page === 0
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Items,
        searchType: "items",
        page: itemsSearchResponse?.results?.query?.currentPage ?? 0,
        hasMore: itemsSearchResponse?.results?.hasMore,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedItemSearch(searchTerm, page + 1),
        searchItems: combinedList,
      };

      SearchDataStore.actions.addSearchTab(tabContent, page === 0);

      return {
        searchTerm: searchTerm,
      };
    },
    doPagedActivitiesSearch: async (
      state: SearchPayload,
      searchTerm: string,
      page = 0
    ) => {
      let activitiesSearchResponse;

      try {
        activitiesSearchResponse = await Platform.Destiny2Service.SearchDestinyEntities(
          "DestinyActivityDefinition",
          searchTerm,
          page
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "activities"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromItemSearch(
        activitiesSearchResponse?.results.results
      );
      const combinedList =
        page === 0
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Activites,
        searchType: "activities",
        page: activitiesSearchResponse?.results?.query?.currentPage ?? 0,
        hasMore: activitiesSearchResponse?.results?.hasMore,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedActivitiesSearch(searchTerm, page + 1),
        searchItems: combinedList,
      };

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
      let newsSearchResponse = null;

      try {
        newsSearchResponse = await Platform.ContentService.SearchContentWithText(
          Localizer.CurrentCultureName,
          false,
          "News",
          null,
          page,
          searchTerm,
          "WebGlobal"
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "news"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromNewsSearch(
        newsSearchResponse?.results
      );
      const combinedList =
        page === 1
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_News,
        searchType: "news",
        page: newsSearchResponse?.query.currentPage ?? 1,
        hasMore: newsSearchResponse?.hasMore,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedNewsSearch(searchTerm, page + 1),
        searchItems: combinedList,
      };

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
      let userSearchResponse = null;

      try {
        const userSearchPrefixRequest: User.UserSearchPrefixRequest = {
          displayNamePrefix: searchTerm,
        };

        userSearchResponse = await Platform.UserService.SearchByGlobalNamePost(
          userSearchPrefixRequest,
          page
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "users"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromUserSearch(
        userSearchResponse?.searchResults
      );
      const combinedList =
        page === 0
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_Users,
        searchType: "users",
        page: userSearchResponse?.page ?? 0,
        hasMore: userSearchResponse?.hasMore,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedUserSearch(searchTerm, page + 1),
        searchItems: combinedList,
      };

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
      let destinyUserSearchResponse = null;

      try {
        const bungieGlobalName = searchTerm.split("#");

        const destinyUserName: User.ExactSearchRequest = {
          displayName: bungieGlobalName[0],
          displayNameCode: parseInt(bungieGlobalName[1], 10),
        };

        destinyUserSearchResponse = await Platform.Destiny2Service.SearchDestinyPlayerByBungieName(
          destinyUserName,
          BungieMembershipType.All
        );
      } catch {
        return {
          searchTerm: searchTerm,
        };
      }

      const currentDisplayPropsList = state.searchTabContentProps?.find(
        (t) => t.searchType === "destinyusers"
      )?.searchItems;
      const fetchedDisplayPropsList = SearchUtils.GetDisplayPropertiesFromDestinyUserSearch(
        destinyUserSearchResponse
      );
      const combinedList =
        page === 0
          ? fetchedDisplayPropsList
          : [...currentDisplayPropsList, ...fetchedDisplayPropsList];

      const tabContent: SearchTabContentProps = {
        tabLabel: Localizer.Usertools.Tab_DestinyPlayers,
        searchType: "destinyusers",
        page: 0,
        hasMore: false,
        nextPageFunction: () =>
          SearchDataStore.actions.doPagedItemSearch(searchTerm, 0),
        searchItems: combinedList,
      };

      SearchDataStore.actions.addSearchTab(tabContent, true);

      return {
        searchTerm: searchTerm,
      };
    },
    addSearchTab: (
      state: SearchPayload,
      tabContent: SearchTabContentProps,
      isFirstPage: boolean
    ) => {
      return {
        searchTabContentProps: [
          ...state.searchTabContentProps.filter(
            (t) => t.searchType !== tabContent.searchType
          ),
          tabContent,
        ],
        visibleTabs:
          isFirstPage && tabContent?.searchItems?.length
            ? new Set([...state.visibleTabs, tabContent.searchType])
            : state.visibleTabs,
      };
    },
  });
}

export const SearchDataStore = _SearchDataStore.Instance;
