import { DataStore } from "@Global/DataStore";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";

export interface ICodesState {
  userMemberships: BungieMembershipType[];
  selectedMembership: BungieMembershipType;
}

class CodesDataStoreInternal extends DataStore<ICodesState> {
  public static Instance = new CodesDataStoreInternal({
    userMemberships: [],
    selectedMembership: BungieMembershipType.None,
  });

  /**
   * Initializes CodesDataStore
   */
  public async initialize(userIsCrossSaved = true) {
    Platform.UserService.GetMembershipDataForCurrentUser()
      .then((data) => {
        if (data.destinyMemberships.length > 0) {
          const userMemberships = userIsCrossSaved
            ? data.destinyMemberships[0].applicableMembershipTypes
            : data.destinyMemberships.map((dm) => dm.membershipType);

          this.update({
            userMemberships,
          });
        }
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  }

  public updateSelectedMembership(membership: BungieMembershipType) {
    this.update({ selectedMembership: membership });
  }
}

export const CodesDataStore = CodesDataStoreInternal.Instance;
