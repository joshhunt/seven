import { Localizer } from "@bungie/localization";
import { DetailedError } from "@CustomErrors";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { Content } from "@Platform";

export class LocalizerUtils {
  /**
   * Returns the string name of a membership type
   * @param membershipType
   */
  public static getPlatformNameFromMembershipType(
    membershipType: BungieMembershipType
  ) {
    switch (membershipType) {
      case BungieMembershipType.TigerPsn:
        return Localizer.Registration.networksigninoptionplaystation;
      case BungieMembershipType.TigerXbox:
        return Localizer.Registration.networksigninoptionxbox;
      case BungieMembershipType.TigerBlizzard:
        return Localizer.Registration.networksigninoptionblizzard;
      case BungieMembershipType.TigerSteam:
        return Localizer.Registration.NetworkSignInOptionSteam;
      case BungieMembershipType.TigerStadia:
        return Localizer.Registration.NetworkSignInOptionStadia;
      case BungieMembershipType.BungieNext:
        return "Bungie.net";
      case BungieMembershipType.TigerDemon:
        return "Demonware";
      default:
        throw new DetailedError(
          "Localizer",
          `The membershipType '${BungieMembershipType[membershipType]}' is not a valid Destiny platform.`
        );
    }
  }

  /**
   * Gets the abbreviated name of a platform
   * @param membershipType
   */
  public static getPlatformAbbrForMembershipType(
    membershipType: BungieMembershipType
  ) {
    return Localizer.Registration[
      `MembershipAbbreviation${BungieMembershipType[membershipType]}`
    ];
  }

  /**
   * Returns the string name of a credential type
   * @param credentialType
   */
  public static getPlatformNameFromCredentialType(
    credentialType: BungieCredentialType
  ) {
    switch (credentialType) {
      case BungieCredentialType.Psnid:
        return Localizer.Registration.networksigninoptionplaystation;
      case BungieCredentialType.Xuid:
        return Localizer.Registration.networksigninoptionxbox;
      case BungieCredentialType.BattleNetId:
        return Localizer.Registration.networksigninoptionblizzard;
      case BungieCredentialType.SteamId:
        return Localizer.Registration.NetworkSignInOptionSteam;
      case BungieCredentialType.StadiaId:
        return Localizer.Registration.NetworkSignInOptionStadia;
      case BungieCredentialType.TwitchId:
        return Localizer.Registration.NetworkSignInOptionTwitch;
      default:
        throw new DetailedError(
          "Localizer",
          `The credentialType '${BungieCredentialType[credentialType]}' is not a valid Destiny platform.`
        );
    }
  }

  /**
   * Convert a Firehose StringCollection to a Localizer-esque object
   * @param stringCollection
   */
  public static stringCollectionToObject(
    stringCollection: Content.ContentItemPublicContract
  ): { [key: string]: string } | null {
    if (!stringCollection?.properties?.["Entries"]) {
      return null;
    }

    const data = stringCollection.properties["Entries"] as {
      key: string;
      value: string;
    }[];

    return data.reduce((acc, item) => {
      acc[item.key] = item.value;

      return acc;
    }, {} as { [key: string]: string });
  }
}
