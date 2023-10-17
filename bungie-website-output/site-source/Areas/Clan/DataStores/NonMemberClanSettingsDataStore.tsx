// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { DataStore } from "@bungie/datastore";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { GroupsV2, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";

interface NonMemberClanSettingsDataStorePayload {
  clanResponse: GroupsV2.GroupResponse;
}

class _NonMemberClanSettingsDataStore extends DataStore<
  NonMemberClanSettingsDataStorePayload
> {
  public static readonly InitialState: NonMemberClanSettingsDataStorePayload = {
    clanResponse: undefined,
  };

  public static Instance = new _NonMemberClanSettingsDataStore(
    _NonMemberClanSettingsDataStore.InitialState
  );
  public actions = this.createActions({
    reset: () => {
      return _NonMemberClanSettingsDataStore.InitialState;
    },
    getClanResponse: async (
      state: NonMemberClanSettingsDataStorePayload,
      clanId: string,
      globalState: GlobalState<"loggedInUser"> | Partial<GlobalState<any>>
    ) => {
      if (!ConfigUtils.SystemStatus(SystemNames.Clans)) {
        return;
      }

      if (ClanUtils.isBnetAdmin(globalState.loggedInUser)) {
        return;
      }

      try {
        const result = await Platform.GroupV2Service.GetGroup(clanId);

        return {
          clanResponse: result,
        };
      } catch {
        return;
      }
    },
    setClanResponse: (
      state: NonMemberClanSettingsDataStorePayload,
      clanResponse: GroupsV2.GroupResponse
    ) => {
      return {
        clanResponse: clanResponse,
      };
    },
  });
}

export const NonMemberClanSettingsDataStore =
  _NonMemberClanSettingsDataStore.Instance;
