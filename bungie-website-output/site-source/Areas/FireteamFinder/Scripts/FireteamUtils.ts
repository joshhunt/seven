// Created by atseng, 2022
// Copyright Bungie, Inc.

import { IRadioOption } from "@Areas/FireteamFinder/Components/Shared/RadioButtons";
import { BnetFireteamDefinition } from "@Areas/FireteamFinder/Constants/BnetFireteamDefinition";
import { FireteamFinderColors } from "@Areas/FireteamFinder/Constants/FireteamFinderColors";
import {
  FireteamOptions,
  IOptionCategory,
} from "@Areas/FireteamFinder/Constants/FireteamOptions";
import {
  FireteamFinderValueTypes,
  FireteamFinderValueTypesKeys,
} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { Localizer } from "@bungie/localization";
import { DetailedError } from "@CustomErrors";
import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { BungieMembershipType, FireteamPlatform } from "@Enum";
import { FireteamFinder } from "@Platform";
import { IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { DateTime } from "luxon";

export class FireteamUtils {
  public static getListingValuesFromFireteamOptions(
    title: number[],
    tags: number[],
    language: number,
    minGuardianRank: number,
    microphone: number,
    platform: number,
    applicationRequirement: number,
    joinSetting: number,
    players?: number
  ): FireteamFinder.DestinyFireteamFinderListingValue[] {
    const listingValues: FireteamFinder.DestinyFireteamFinderListingValue[] = [];

    if (title !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.title),
        values: title,
      });
    }

    if (tags?.length > 0) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.tags),
        values: tags,
      });
    }

    if (language !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.locale),
        values: [language],
      });
    }

    if (minGuardianRank !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.minGuardianRank),
        values: [minGuardianRank],
      });
    }

    if (microphone !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.mic),
        values: [microphone],
      });
    }

    if (platform !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.platform),
        values: [platform],
      });
    }

    if (applicationRequirement !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.applicationRequirement),
        values: [applicationRequirement],
      });
    }

    if (players !== null) {
      listingValues.push({
        valueType: parseInt(FireteamFinderValueTypes.players),
        values: [players],
      });
    }

    listingValues.push({
      valueType: parseInt(FireteamFinderValueTypes.joinSetting),
      values: [joinSetting],
    });

    return listingValues;
  }

  public static getValuesByCategoryFromListingValues(
    listingValues: FireteamFinder.DestinyFireteamFinderListingValue[],
    optionCategory: string,
    listingValueDefinitions: DefinitionsFetcherized<
      "DestinyFireteamFinderOptionDefinition"
    >
  ) {
    const fireteamOptionTree = new FireteamOptions(
      listingValueDefinitions
    ).createOptionsTree();

    const categoryHash = fireteamOptionTree[optionCategory].hash;

    return (
      listingValues.find((listingVal) => listingVal.valueType === categoryHash)
        ?.values ?? []
    );
  }

  public static getRootNode = (
    activityGraphDefinition: DestinyDefinitions.DestinyFireteamFinderActivityGraphDefinition,
    definitions: DefinitionsFetcherized<
      "DestinyFireteamFinderActivityGraphDefinition"
    >
  ) => {
    let rootNode = activityGraphDefinition;

    while (rootNode?.parentHash) {
      rootNode = definitions?.get(rootNode?.parentHash);
    }

    return rootNode;
  };

  public static getCurrentOptionFromOptionsTree = (
    currentValue: string,
    optionCategory: FireteamFinderValueTypesKeys,
    tree: Record<number, IOptionCategory>
  ) => {
    const category = tree[FireteamFinderValueTypes[optionCategory]];

    return category?.options.find((opt) => opt.value === currentValue);
  };

  public static getDefaultOptionFromOptionsTree = (
    optionCategory: FireteamFinderValueTypesKeys,
    tree: Record<number, IOptionCategory>
  ) => {
    const category = tree[FireteamFinderValueTypes[optionCategory]];

    return category?.options.find(
      (opt) => opt.value === category?.defaultCreateValue
    );
  };

  public static getCurrentOptionFromListing = (
    listing: FireteamFinder.DestinyFireteamFinderListing,
    optionCategory: FireteamFinderValueTypesKeys,
    listingValueDefinitions: DefinitionsFetcherized<
      "DestinyFireteamFinderOptionDefinition"
    >
  ) => {
    const currentValue = listing?.settings?.listingValues
      ?.find(
        (lVal) =>
          lVal.valueType.toString() === FireteamFinderValueTypes[optionCategory]
      )
      ?.values[0].toString();

    return FireteamUtils.getCurrentOptionFromOptionsTree(
      currentValue,
      optionCategory,
      new FireteamOptions(listingValueDefinitions).createOptionsTree()
    );
  };

  public static getBnetFireteamDefinitionFromListing(
    listing: FireteamFinder.DestinyFireteamFinderListing,
    listingValueDefinitions: DefinitionsFetcherized<
      "DestinyFireteamFinderOptionDefinition"
    >,
    activityGraphDefinitions: DefinitionsFetcherized<
      "DestinyFireteamFinderActivityGraphDefinition"
    >
  ): BnetFireteamDefinition {
    const fireteamOptionTree = new FireteamOptions(
      listingValueDefinitions
    ).createOptionsTree();

    const defaultBnetFireteamDefinition: BnetFireteamDefinition = {
      id: "",
      lobbyId: "",
      lobbyState: 0,
      owner: {
        membershipId: "",
        membershipType: BungieMembershipType.BungieNext,
      },
      titleStringHashes: [],
      tagHashes: [],
      activity: {
        headerColor: "",
        title: "Redacted",
        playerElectedDifficulty: null,
      },
      players: {
        maxPlayerCount: 6,
        availableSlots: 5,
      },
      clanId: "0",
      scheduled: false,
      scheduledDateAndTime: "",
      applicationRequired: this.getDefaultOptionFromOptionsTree(
        "applicationRequirement",
        fireteamOptionTree
      ),
      platform: this.getDefaultOptionFromOptionsTree(
        "platform",
        fireteamOptionTree
      ),
      hasMic: this.getDefaultOptionFromOptionsTree("mic", fireteamOptionTree),
      isPublic: true,
      locale: this.getDefaultOptionFromOptionsTree(
        "locale",
        fireteamOptionTree
      ),
      minGuardianRank: this.getDefaultOptionFromOptionsTree(
        "minGuardianRank",
        fireteamOptionTree
      ),
      joinSetting: 1,
    };

    const fireteam = defaultBnetFireteamDefinition;

    if (
      listing?.listingId === undefined ||
      listing?.ownerId === undefined ||
      listing?.settings === undefined
    ) {
      return fireteam;
    }

    fireteam.id = listing?.listingId;
    fireteam.lobbyId = listing?.lobbyId;
    fireteam.owner = {
      membershipId: listing.ownerId.membershipId,
      membershipType: listing.ownerId.membershipType,
    };

    /* Data from listing.settings */
    let activityGraphDefinition = activityGraphDefinitions?.get(
      listing?.settings?.activityGraphHash
    );
    let playerElectedDifficulty = "";
    const rootNode = this.getRootNode(
      activityGraphDefinition,
      activityGraphDefinitions
    );
    if (activityGraphDefinition?.isPlayerElectedDifficultyNode) {
      playerElectedDifficulty =
        activityGraphDefinition?.displayProperties?.name;
      activityGraphDefinition = activityGraphDefinitions?.get(
        activityGraphDefinition?.parentHash
      );
    }

    fireteam.players.maxPlayerCount = listing?.settings?.maxPlayerCount;
    fireteam.players.availableSlots = listing.availableSlots;
    fireteam.clanId = listing?.settings?.clanId;
    fireteam.scheduled = !(
      DateTime.fromISO(listing?.settings?.scheduledDateTime)?.year <= 1970
    );
    fireteam.scheduledDateAndTime =
      fireteam.scheduled && listing?.settings?.scheduledDateTime;
    fireteam.applicationRequired = this.getCurrentOptionFromListing(
      listing,
      "applicationRequirement",
      listingValueDefinitions
    );
    fireteam.isPublic =
      listing?.settings?.privacyScope === 1 ||
      listing?.settings?.privacyScope === 0;
    fireteam.scheduledDateAndTime = listing?.settings?.scheduledDateTime;

    fireteam.titleStringHashes = this.getValuesByCategoryFromListingValues(
      listing?.settings?.listingValues,
      FireteamFinderValueTypes.title,
      listingValueDefinitions
    ).map((hash) => hash.toString());
    fireteam.tagHashes = this.getValuesByCategoryFromListingValues(
      listing?.settings?.listingValues,
      FireteamFinderValueTypes.tags,
      listingValueDefinitions
    ).map((hash) => hash.toString());
    fireteam.applicationRequired = this.getCurrentOptionFromListing(
      listing,
      "applicationRequirement",
      listingValueDefinitions
    );
    fireteam.hasMic = this.getCurrentOptionFromListing(
      listing,
      "mic",
      listingValueDefinitions
    );
    fireteam.platform = this.getCurrentOptionFromListing(
      listing,
      "platform",
      listingValueDefinitions
    );
    fireteam.minGuardianRank = this.getCurrentOptionFromListing(
      listing,
      "minGuardianRank",
      listingValueDefinitions
    );
    fireteam.activity = {
      headerColor: FireteamFinderColors.hexCode[rootNode?.hash],
      title: activityGraphDefinition?.displayProperties?.name || "Redacted",
      playerElectedDifficulty: playerElectedDifficulty,
    };
    fireteam.lobbyState = listing?.lobbyState;
    fireteam.joinSetting = this.getValuesByCategoryFromListingValues(
      listing?.settings?.listingValues,
      FireteamFinderValueTypes.joinSetting,
      listingValueDefinitions
    )?.[0];
    const localeValue = this.getValuesByCategoryFromListingValues(
      listing?.settings?.listingValues,
      FireteamFinderValueTypes.locale,
      listingValueDefinitions
    )?.[0]?.toString();
    fireteam.locale = this.getCurrentOptionFromOptionsTree(
      localeValue,
      "locale",
      fireteamOptionTree
    );

    return fireteam;
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
}
