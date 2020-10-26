import { DataStore } from "@Global/DataStore";
import { BungieMembershipType, BungieCredentialType } from "@Enum";
import { Platform } from "@Platform";

export interface ICodesState {
  userPlatforms: BungieMembershipType[];
  selectedPlatform: BungieMembershipType;
}

class CodesDataStoreInternal extends DataStore<ICodesState> {
  public static Instance = new CodesDataStoreInternal({
    userPlatforms: [],
    selectedPlatform: BungieMembershipType.None,
  });

  /**
   * Initializes CodesDataStore
   */
  public async initialize(userIsCrossSaved = true) {
    Platform.UserService.GetMembershipDataForCurrentUser()
      .then((data) => {
        if (data.destinyMemberships.length > 0) {
          const userPlatforms = userIsCrossSaved
            ? data.destinyMemberships[0].applicableMembershipTypes
            : data.destinyMemberships.map((dm) => dm.membershipType);

          this.update({
            userPlatforms,
          });
        }
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  }
}

export const CodesDataStore = CodesDataStoreInternal.Instance;
