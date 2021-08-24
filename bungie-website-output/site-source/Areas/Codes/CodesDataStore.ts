import { DataStore } from "@bungie/datastore";
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

  public actions = this.createActions({
    /**
     * Re-fetch membership data
     * @param userIsCrossSaved
     */
    refreshUserMemberships: async (userIsCrossSaved = true) => {
      try {
        const membershipData = await Platform.UserService.GetMembershipDataForCurrentUser();

        if (membershipData.destinyMemberships.length > 0) {
          const userMemberships = userIsCrossSaved
            ? membershipData.destinyMemberships[0].applicableMembershipTypes
            : membershipData.destinyMemberships.map((dm) => dm.membershipType);

          return {
            userMemberships,
          };
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
    /**
     * Sets the selected membership type
     * @param selectedMembership
     */
    updateSelectedMembership: (selectedMembership: BungieMembershipType) => ({
      selectedMembership,
    }),
  });

  public async initialize(userIsCrossSaved = true) {
    return this.actions.refreshUserMemberships(userIsCrossSaved);
  }
}

export const CodesDataStore = CodesDataStoreInternal.Instance;
