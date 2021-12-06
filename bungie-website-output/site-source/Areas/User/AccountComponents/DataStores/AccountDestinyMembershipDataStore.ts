// Created by jlauer, 2021
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _AccountDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _AccountDestinyMembershipDataStore();
}

export const AccountDestinyMembershipDataStore =
  _AccountDestinyMembershipDataStore.Instance;
