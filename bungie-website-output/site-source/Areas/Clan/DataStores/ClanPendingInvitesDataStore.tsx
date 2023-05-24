// Created by atseng, 2023
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { RuntimeGroupMemberType } from "@Enum";
import { Friends, Platform, Queries } from "@Platform";
import React from "react";

interface ClanPendingInvitesDataStorePayload {
  invitationsResponse: Queries.SearchResultGroupMemberApplication;
  friendsListResponse: Friends.BungieFriendListResponse;
  clanId: string;
  page: number;
}

class _ClanPendingInvitesDataStore extends DataStore<
  ClanPendingInvitesDataStorePayload
> {
  public static readonly InitialState: ClanPendingInvitesDataStorePayload = {
    invitationsResponse: undefined,
    friendsListResponse: undefined,
    clanId: "0",
    page: 1,
  };

  public static Instance = new _ClanPendingInvitesDataStore(
    _ClanPendingInvitesDataStore.InitialState
  );

  public actions = this.createActions({
    reset: () => {
      return _ClanPendingInvitesDataStore.InitialState;
    },
    getInvitationsAndFriends: async (
      state: ClanPendingInvitesDataStorePayload,
      clanId: string,
      page = 1
    ) => {
      try {
        const data = await Promise.allSettled([
          Platform.GroupV2Service.GetInvitedIndividuals(clanId, page),
          Platform.SocialService.GetFriendList(),
        ]);

        const invitationsData =
          data[0].status === "fulfilled" && data[0].value
            ? data[0].value
            : undefined;
        const friendsData =
          data[1].status === "fulfilled" && data[1].value
            ? data[1].value
            : undefined;

        return {
          friendsListResponse: friendsData,
          invitationsResponse: invitationsData,
          clanId: clanId,
          page: page,
        };
      } catch {
        return;
      }
    },
    getPendingInvitations: async (
      state: ClanPendingInvitesDataStorePayload,
      clanId: string,
      page = 1
    ) => {
      try {
        const result = await Platform.GroupV2Service.GetInvitedIndividuals(
          clanId,
          page
        );

        return {
          friendsListResponse: state.friendsListResponse,
          invitationsResponse: result,
          clanId: clanId,
          page: page,
        };
      } catch {
        return;
      }
    },
    getFriends: async (state: ClanPendingInvitesDataStorePayload) => {
      try {
        const result = await Platform.SocialService.GetFriendList();

        return {
          friendsListResponse: result,
          invitationsResponse: state.invitationsResponse,
          clanId: state.clanId,
          page: state.page,
        };
      } catch {
        return;
      }
    },
  });
}

export const ClanPendingInvitesDataStore =
  _ClanPendingInvitesDataStore.Instance;
