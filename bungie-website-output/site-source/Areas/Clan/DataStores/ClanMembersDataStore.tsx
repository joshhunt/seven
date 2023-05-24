// Created by atseng, 2023
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";
import { RuntimeGroupMemberType } from "@Enum";
import { Platform, Queries } from "@Platform";
import React from "react";

export interface ClanMemberTypeMembers {
  page: number;
  memberType: RuntimeGroupMemberType;
  searchTerm: string;
  response: Queries.SearchResultGroupMember;
}

export interface ClanMembersDataStorePayload {
  memberTypeResponses: ClanMemberTypeMembers[];
  defaultMemberTypeResponses: ClanMemberTypeMembers[];
  clanId: string;
  loaded: boolean;
}

class _ClanMembersDataStore extends DataStore<ClanMembersDataStorePayload> {
  public static readonly InitialState: ClanMembersDataStorePayload = {
    memberTypeResponses: [],
    defaultMemberTypeResponses: [],
    clanId: "0",
    loaded: false,
  };

  public static Instance = new _ClanMembersDataStore(
    _ClanMembersDataStore.InitialState
  );

  public actions = this.createActions({
    reset: () => {
      return _ClanMembersDataStore.InitialState;
    },
    /**
     * Get clan members of ALL different member types
     * @param clanId groupId
     * @param searchTerm name search string
     * @param page page number 1 based!
     */
    getAllClanMembers: async (
      state: ClanMembersDataStorePayload,
      clanId: string,
      page = 1,
      searchTerm = ""
    ) => {
      try {
        const data = await Promise.all([
          Platform.GroupV2Service.GetMembersOfGroup(
            clanId,
            page,
            RuntimeGroupMemberType.Founder,
            searchTerm
          ),
          Platform.GroupV2Service.GetMembersOfGroup(
            clanId,
            page,
            RuntimeGroupMemberType.ActingFounder,
            searchTerm
          ),
          Platform.GroupV2Service.GetMembersOfGroup(
            clanId,
            page,
            RuntimeGroupMemberType.Admin,
            searchTerm
          ),
          Platform.GroupV2Service.GetMembersOfGroup(
            clanId,
            page,
            RuntimeGroupMemberType.Member,
            searchTerm
          ),
          Platform.GroupV2Service.GetMembersOfGroup(
            clanId,
            page,
            RuntimeGroupMemberType.Beginner,
            searchTerm
          ),
        ]);

        const foundersData = {
          page: page,
          searchTerm: searchTerm,
          memberType: RuntimeGroupMemberType.Founder,
          response: data[0],
        };

        const actingFoundersData = {
          page: page,
          searchTerm: searchTerm,
          memberType: RuntimeGroupMemberType.ActingFounder,
          response: data[1],
        };

        const adminsData = {
          page: page,
          searchTerm: searchTerm,
          memberType: RuntimeGroupMemberType.Admin,
          response: data[2],
        };

        const membersData = {
          page: page,
          searchTerm: searchTerm,
          memberType: RuntimeGroupMemberType.Member,
          response: data[3],
        };

        const beginnersData = {
          page: page,
          searchTerm: searchTerm,
          memberType: RuntimeGroupMemberType.Beginner,
          response: data[4],
        };

        return {
          defaultMemberTypeResponses:
            page === 1 && searchTerm === ""
              ? [
                  foundersData,
                  actingFoundersData,
                  adminsData,
                  membersData,
                  beginnersData,
                ]
              : state.defaultMemberTypeResponses ?? [],
          memberTypeResponses: [
            foundersData,
            actingFoundersData,
            adminsData,
            membersData,
            beginnersData,
          ],
          clanId: clanId,
          loaded: true,
        };
      } catch {
        return;
      }
    },
    /**
     * Get clan members of select different member types
     * @param clanId groupId
     * @param memberTypes list of RuntimeGroupMemberTypes
     * @param searchTerm name search string
     * @param page page number 1 based!
     */
    getMembersOfType: async (
      state: ClanMembersDataStorePayload,
      clanId: string,
      memberTypes: RuntimeGroupMemberType[],
      searchTerm = "",
      page = 1
    ) => {
      try {
        const data = await Promise.all(
          memberTypes.map((mt) =>
            Platform.GroupV2Service.GetMembersOfGroup(
              clanId,
              page,
              mt,
              searchTerm
            )
          )
        );

        const updatedData: ClanMemberTypeMembers[] = data.map((d, i) => {
          return {
            page: page,
            searchTerm: searchTerm,
            memberType: memberTypes[i],
            response: d,
          };
        });

        return {
          memberTypeResponses: [
            ...state.memberTypeResponses.filter(
              (m) => !memberTypes.includes(m.memberType)
            ),
            ...updatedData,
          ],
          clanId: clanId,
          loaded: true,
        };
      } catch {
        return;
      }
    },
  });
}

export const ClanMembersDataStore = _ClanMembersDataStore.Instance;
