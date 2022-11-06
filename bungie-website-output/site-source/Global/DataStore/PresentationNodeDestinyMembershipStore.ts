// Created by atseng, 2022
// Copyright Bungie, Inc.

import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _PresentationNodeDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _PresentationNodeDestinyMembershipDataStore();
}

export const PresentationNodeDestinyMembershipDataStore =
  _PresentationNodeDestinyMembershipDataStore.Instance;
