// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { PlatformError } from "@CustomErrors";
import { PlatformFriendType } from "@Enum";
import { Friends } from "@Platform";

export interface PlatformFriendsResponseData {
  platform: PlatformFriendType;
  friendsResponse: Friends.PlatformFriendResponse;
  isLoaded: boolean;
  totalPages: number;
  error?: PlatformError;
}

export interface PlatformFriendsDataStorePayload {
  errorMembershipIds: string[];
  recentlySentMembershipIds: string[];
  recentlyCanceledMembershipIds: string[];
  platformSpecificData: PlatformFriendsResponseData[];
}

class _PlatformFriendsDataStore extends DataStore<
  PlatformFriendsDataStorePayload
> {
  private static readonly initialPlatformData: PlatformFriendsResponseData[] = [
    {
      platform: PlatformFriendType.Xbox,
      friendsResponse: null,
      isLoaded: false,
      totalPages: 10,
    },
    {
      platform: PlatformFriendType.PSN,
      friendsResponse: null,
      isLoaded: false,
      totalPages: 10,
    },
    {
      platform: PlatformFriendType.Steam,
      friendsResponse: null,
      isLoaded: false,
      totalPages: 10,
    },
    {
      platform: PlatformFriendType.Egs,
      friendsResponse: null,
      isLoaded: false,
      totalPages: 10,
    },
  ];

  public static Instance = new _PlatformFriendsDataStore({
    errorMembershipIds: [],
    recentlySentMembershipIds: [],
    recentlyCanceledMembershipIds: [],
    //default is 10 total pages per platform, but we have no idea so total pages will probably change
    platformSpecificData: _PlatformFriendsDataStore.initialPlatformData,
  });

  public actions = this.createActions({
    addToErroringIds: (state, mId: string) => {
      return { errorMembershipIds: [mId, ...this.state.errorMembershipIds] };
    },
    addToRecentlySent: (state, mId: string) => {
      return {
        recentlySentMembershipIds: [
          mId,
          ...this.state.recentlySentMembershipIds,
        ],
      };
    },
    addToRecentlyCanceledMembershipIds: (state, mId: string) => {
      return {
        recentlyCanceledMembershipIds: [
          mId,
          ...this.state.recentlyCanceledMembershipIds,
        ],
      };
    },
    removeFromErroringIds: (state, mId: string) => {
      return {
        errorMembershipIds: [
          ...this.state.errorMembershipIds.filter(
            (memberId) => memberId !== mId
          ),
        ],
      };
    },
    removeFromRecentlySent: (state, mId: string) => {
      return {
        recentlySentMembershipIds: [
          ...this.state.recentlySentMembershipIds.filter(
            (memberId) => memberId !== mId
          ),
        ],
      };
    },
    removeFromRecentlyCanceledMembershipIds: (state, mId: string) => {
      return {
        recentlyCanceledMembershipIds: [
          ...this.state.recentlySentMembershipIds.filter(
            (memberId) => memberId !== mId
          ),
        ],
      };
    },
    resetErroringIds: () => {
      return { errorMembershipIds: [] };
    },
    resetRecentActions: () => {
      return {
        recentlySentMembershipIds: [],
        recentlyCanceledMembershipIds: [],
      };
    },
    updatePlatformFriendResponse: (
      state,
      platform: PlatformFriendType,
      friendResponse: Friends.PlatformFriendResponse
    ) => {
      const deepCopyAllPlatformData = this.getDeepCopyOfPlatformData();
      const nextPlatformData = this.getSpecificPlatform(
        platform,
        deepCopyAllPlatformData
      );
      if (nextPlatformData) {
        nextPlatformData.friendsResponse = friendResponse;
        nextPlatformData.error = null;
      }

      return { platformSpecificData: deepCopyAllPlatformData };
    },
    replacePlatformFriends: (
      state,
      platform: PlatformFriendType,
      friends: Friends.PlatformFriend[]
    ) => {
      const deepCopyAllPlatformData = this.getDeepCopyOfPlatformData();
      const nextPlatformData = this.getSpecificPlatform(
        platform,
        deepCopyAllPlatformData
      );
      if (nextPlatformData) {
        nextPlatformData.friendsResponse.platformFriends = friends;
      }

      return { platformSpecificData: deepCopyAllPlatformData };
    },
    updatePlatformIsLoaded: (
      state,
      platform: PlatformFriendType,
      isLoaded: boolean
    ) => {
      const deepCopyAllPlatformData = this.getDeepCopyOfPlatformData();
      const nextPlatformData = this.getSpecificPlatform(
        platform,
        deepCopyAllPlatformData
      );
      if (nextPlatformData) {
        nextPlatformData.isLoaded = isLoaded;
      }

      return { platformSpecificData: deepCopyAllPlatformData };
    },
    updatePlatformTotalPages: (
      state,
      platform: PlatformFriendType,
      totalPages: number
    ) => {
      const deepCopyAllPlatformData = this.getDeepCopyOfPlatformData();
      const nextPlatformData = this.getSpecificPlatform(
        platform,
        deepCopyAllPlatformData
      );
      if (nextPlatformData) {
        nextPlatformData.totalPages = totalPages;
      }

      return { platformSpecificData: deepCopyAllPlatformData };
    },
    setError: (state, platform: PlatformFriendType, error: PlatformError) => {
      const deepCopyAllPlatformData = this.getDeepCopyOfPlatformData();
      const nextPlatformData = this.getSpecificPlatform(
        platform,
        deepCopyAllPlatformData
      );

      if (nextPlatformData) {
        nextPlatformData.error = error;
      }

      return { platformSpecificData: deepCopyAllPlatformData };
    },
  });

  private readonly getDeepCopyOfPlatformData = (): PlatformFriendsResponseData[] => {
    return JSON.parse(JSON.stringify(this.state.platformSpecificData));
  };

  private readonly getSpecificPlatform = (
    platform: PlatformFriendType,
    platformSpecificData: PlatformFriendsResponseData[]
  ): PlatformFriendsResponseData => {
    return platformSpecificData.find((x) => x.platform === platform);
  };
}

/**
 * DataStore to maintain the changing data around platform friends and importing them
 */
export const PlatformFriendsDataStore = _PlatformFriendsDataStore.Instance;
