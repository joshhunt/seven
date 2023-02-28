// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _FireteamsDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _FireteamsDestinyMembershipDataStore();
}

export const FireteamsDestinyMembershipDataStore =
  _FireteamsDestinyMembershipDataStore.Instance;
