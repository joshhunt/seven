// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore/DataStore";
import { Friends, Platform } from "@Platform";

export interface FriendsListDataStorePayload {
  friends: Friends.BungieFriend[];
  pendingRequests: Friends.BungieFriend[];
  outgoingRequests: Friends.BungieFriend[];
}

class _FriendsListDataStore extends DataStore<FriendsListDataStorePayload> {
  public static Instance = new _FriendsListDataStore({
    friends: [],
    pendingRequests: [],
    outgoingRequests: [],
  });

  public actions = this.createActions({
    fetchAllFriends: async () => {
      const {
        pendingRequests,
        outgoingRequests,
      } = await _FriendsListDataStore.getFriendsRequests();
      const friends = await _FriendsListDataStore.getFriends();

      return {
        friends,
        pendingRequests,
        outgoingRequests,
      } as FriendsListDataStorePayload;
    },
  });

  public static getFriendsRequests = async () => {
    try {
      const friendRequests = await Platform.SocialService.GetFriendRequestList();

      return {
        pendingRequests: friendRequests.incomingRequests,
        outgoingRequests: friendRequests.outgoingRequests,
      };
    } catch (err) {
      return null;
    }
  };

  public static getFriends = async () => {
    try {
      const friendsResponse = await Platform.SocialService.GetFriendList();

      return friendsResponse.friends;
    } catch (err) {
      return null;
    }
  };
}

/**
 * Holds data of friends requests and friends for the logged in user.
 */
export const FriendsListDataStore = _FriendsListDataStore.Instance;
