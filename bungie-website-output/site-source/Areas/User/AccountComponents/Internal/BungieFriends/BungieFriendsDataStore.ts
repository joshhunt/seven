// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore/DataStore";
import { Friends, Platform } from "@Platform";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";

export interface BungieFriendsDataStorePayload {
  friends: Friends.BungieFriend[];
  pendingRequests: Friends.BungieFriend[];
  outgoingRequests: Friends.BungieFriend[];
  loading: boolean;
}

class _BungieFriendsDataStore extends DataStore<BungieFriendsDataStorePayload> {
  public static Instance = new _BungieFriendsDataStore({
    friends: [],
    pendingRequests: [],
    outgoingRequests: [],
    loading: false,
  });

  public actions = this.createActions({
    setLoading: (loading: boolean) => ({ loading }),
    fetchAllFriends: async () => {
      this.actions.setLoading(true);

      let requests, friends;

      try {
        requests = await _BungieFriendsDataStore.getFriendsRequests();
        friends = await _BungieFriendsDataStore.getFriends();
      } catch (error) {
        Modal.error(error);
      }

      return {
        friends: friends ?? [],
        pendingRequests: requests.pendingRequests ?? [],
        outgoingRequests: requests.outgoingRequests ?? [],
        loading: false,
      };
    },
  });

  public static getFriendsRequests = async () => {
    try {
      const friendRequests = await Platform.SocialService.GetFriendRequestList();

      return {
        pendingRequests: friendRequests?.incomingRequests ?? [],
        outgoingRequests: friendRequests?.outgoingRequests ?? [],
      };
    } catch (err) {
      return null;
    }
  };

  public static getFriends = async () => {
    try {
      const friendsResponse = await Platform.SocialService.GetFriendList();

      return friendsResponse?.friends ?? [];
    } catch (err) {
      return null;
    }
  };
}

/**
 * Holds data of friends requests and friends for the logged in user.
 */
export const BungieFriendsDataStore = _BungieFriendsDataStore.Instance;
