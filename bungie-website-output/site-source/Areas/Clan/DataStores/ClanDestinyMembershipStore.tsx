// Created by atseng, 2023
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _ClanDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _ClanDestinyMembershipDataStore();
}

export const ClanDestinyMembershipDataStore =
  _ClanDestinyMembershipDataStore.Instance;
