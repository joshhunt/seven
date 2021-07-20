// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _GameHistoryDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _GameHistoryDestinyMembershipDataStore();
}

export const GameHistoryDestinyMembershipDataStore =
  _GameHistoryDestinyMembershipDataStore.Instance;
