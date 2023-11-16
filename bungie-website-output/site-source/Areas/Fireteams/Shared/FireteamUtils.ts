// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { DetailedError } from "@CustomErrors";
import { BungieMembershipType, FireteamPlatform } from "@Enum";
import { Models } from "@Platform";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";

export class FireteamUtils {
  public static IsValidFireteamPlatform(platform: FireteamPlatform) {
    return (
      platform !== FireteamPlatform.Blizzard &&
      platform !== FireteamPlatform.Stadia
    );
  }

  public static platformOptions() {
    return EnumUtils.getStringKeys(FireteamPlatform)
      .filter((fp) =>
        FireteamUtils.IsValidFireteamPlatform(
          FireteamPlatform[fp as keyof typeof FireteamPlatform]
        )
      )
      .map((fireteamPlatformString) => {
        const dropdownOption: IDropdownOption = {
          value: EnumUtils.getNumberValue(
            FireteamPlatform[
              fireteamPlatformString as keyof typeof FireteamPlatform
            ],
            FireteamPlatform
          ).toString(),

          //The platform dropdown, which will soon be replaced in the new fireteam finder service, is currently using out of date console names,
          // the least invasive mitigation is to just change the label here to use membership types instead of the console names
          label: this.FireteamPlatformToDropdownLabel(
            FireteamPlatform[
              fireteamPlatformString as keyof typeof FireteamPlatform
            ]
          ),
        };

        return dropdownOption;
      });
  }

  public static langOptions() {
    const validLocales = Localizer.validLocales.map((lo) => {
      const dropdownOption: IDropdownOption = {
        value: lo.name,
        label: Localizer.Languages[lo.locKey],
      };

      return dropdownOption;
    });

    validLocales.unshift({
      label: Localizer.Fireteams.AllLanguages,
      value: "",
    });

    return validLocales;
  }

  public static activityOptions(
    coreSettings: Models.CoreSettingsConfiguration,
    forCreating: boolean
  ) {
    const activityOptions = coreSettings.fireteamActivities.map((fa) => {
      const dropdownOption: IDropdownOption = {
        value: fa.identifier,
        label: fa.displayName,
        iconPath: fa.imagePath,
      };

      return dropdownOption;
    });

    if (!forCreating) {
      //All is not in the coresettings fireteamActivities
      activityOptions.unshift({
        value: "0",
        label: Localizer.Fireteams.AllActivities,
      });
    }

    return activityOptions;
  }

  public static BnetMembershipTypeToFireteamPlatform(
    mtype: BungieMembershipType
  ): FireteamPlatform {
    switch (mtype) {
      case BungieMembershipType.TigerXbox:
        return FireteamPlatform.XboxOne;
      case BungieMembershipType.TigerPsn:
        return FireteamPlatform.Playstation4;
      case BungieMembershipType.TigerSteam:
        return FireteamPlatform.Steam;
      case BungieMembershipType.TigerEgs:
        return FireteamPlatform.Egs;
      case BungieMembershipType.TigerStadia:
        return FireteamPlatform.Stadia;
      default:
        throw new DetailedError(
          "Invalid membership type",
          "Only Destiny membership types are allowed in this component"
        );
    }
  }

  public static FireteamPlatformToBnetMembershipType(
    platform: FireteamPlatform
  ): BungieMembershipType {
    switch (platform) {
      case FireteamPlatform.XboxOne:
        return BungieMembershipType.TigerXbox;
      case FireteamPlatform.Playstation4:
        return BungieMembershipType.TigerPsn;
      case FireteamPlatform.Steam:
        return BungieMembershipType.TigerSteam;
      case FireteamPlatform.Egs:
        return BungieMembershipType.TigerEgs;
      default:
        throw new DetailedError(
          "Invalid membership type",
          "Only Destiny membership types are allowed in this component"
        );
    }
  }

  public static FireteamPlatformToDropdownLabel(
    platform: FireteamPlatform
  ): string {
    switch (platform) {
      case FireteamPlatform.Any:
        return Localizer.platforms.Any;
      case FireteamPlatform.XboxOne:
        return Localizer.crosssave.Xbox;
      case FireteamPlatform.Playstation4:
        return Localizer.crosssave.PlaystationHeader;
      case FireteamPlatform.Steam:
        return Localizer.platforms.TigerSteam;
      case FireteamPlatform.Egs:
        return Localizer.platforms.TigerEgs;
      default:
        throw new DetailedError(
          "Invalid membership type",
          "Only Destiny membership types are allowed in this component"
        );
    }
  }
}
