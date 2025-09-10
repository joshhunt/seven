import { Localizer } from "@bungie/localization";
import { DetailedError } from "@CustomErrors";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { Content } from "@Platform";
import { French } from "flatpickr/dist/l10n/fr.js";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { German } from "flatpickr/dist/l10n/de.js";
import { Italian } from "flatpickr/dist/l10n/it.js";
import { Japanese } from "flatpickr/dist/l10n/ja.js";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { Polish } from "flatpickr/dist/l10n/pl.js";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";

export class LocalizerUtils {
  /**
   * Returns the string name of a membership type
   * @param membershipType
   */
  public static getPlatformNameFromMembershipType(
    membershipType: BungieMembershipType
  ): string {
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
      case BungieMembershipType.TigerEgs:
        return Localizer.Registration.NetworkSignInOptionEgs;
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
   * Returns the string name of a membership type -- does it look similar to the one above it? YES, it's a duplicate but I'm done fighting with perforce on this one.
   * @param membershipType
   */
  public static getPlatformNameFromDestinyMembershipType(
    membershipType: BungieMembershipType
  ): string {
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
      case BungieMembershipType.TigerEgs:
        return Localizer.Registration.NetworkSignInOptionEgs;
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
  ): string {
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

  /**
   * Convert a Chinese localizer culture name to alternate
   * @param cultureName
   */
  public static useAltChineseCultureString(cultureName: string): string {
    if (cultureName.indexOf("zh") > -1) {
      if (cultureName.indexOf("chs") > -1) {
        return "zh-cn";
      }

      if (cultureName.indexOf("cht") > -1) {
        return "zh-tw";
      }

      return cultureName;
    } else {
      return cultureName;
    }
  }

  /**
   * Add locale appropriate thousands separator to long numbers
   */

  public static useThousandsSeparatorByLocale(
    num: number | string,
    locale: string,
    globalState: any
  ): string {
    const serverLanguage = globalState.coreSettings.userContentLocales[locale];

    return num?.toLocaleString(serverLanguage);
  }

  /**
   * converts bnet locales to Flatpickr locales
   */

  public static convertLocaleToFlatpickrLocale = (loc: string) => {
    if (Localizer.validLocales.some((l) => l.name === loc) && loc !== "en") {
      switch (loc) {
        case "fr":
          return French;
        case "es":
          return Spanish;
        case "de":
          return German;
        case "it":
          return Italian;
        case "ja":
          return Japanese;
        case "pt-br":
          return Portuguese;
        case "ru":
          return Russian;
        case "pl":
          return Polish;
        case "ko":
          return Korean;
        case "zh-cht":
        case "zh-chs":
          return Mandarin;
      }
    }

    return null;
  };
}
