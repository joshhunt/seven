// Created by atseng, 2022
// Copyright Bungie, Inc.
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _RewardsDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _RewardsDestinyMembershipDataStore();
}

export const RewardsDestinyMembershipDataStore =
  _RewardsDestinyMembershipDataStore.Instance;
