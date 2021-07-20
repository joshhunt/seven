// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _SeasonsDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _SeasonsDestinyMembershipDataStore();
}

export const SeasonsDestinyMembershipDataStore =
  _SeasonsDestinyMembershipDataStore.Instance;
