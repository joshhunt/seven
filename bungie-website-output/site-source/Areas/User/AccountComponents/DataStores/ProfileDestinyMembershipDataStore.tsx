import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";

class _ProfileDestinyMembershipDataStore extends DestinyMembershipDataStore {
  public static Instance = new _ProfileDestinyMembershipDataStore();
}

export const ProfileDestinyMembershipDataStore =
  _ProfileDestinyMembershipDataStore.Instance;
