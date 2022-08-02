// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _ClansDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _ClansDestinyMembershipDataStore();
}

export const ClansDestinyMembershipDataStore =
  _ClansDestinyMembershipDataStore.Instance;
