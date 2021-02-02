import {
  GlobalStateDataStore,
  GlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import {
  Platform,
  User,
  Tokens,
  Characters,
  Components,
  Renderer,
  Items,
  Contract,
} from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { PlatformError } from "@CustomErrors";
import { DataStore } from "@Global/DataStore";
import * as Globals from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";

export type PCPlatform = "TigerBlizzard" | "TigerSteam";

export interface IPCMigrationCharacterDisplay {
  characterId: string;
  platform: Globals.BungieMembershipType;
  title: string;
  iconPath: string;
  level: number;
}

export interface IPCMigrationUserData {
  dust: number;
  silverBalanceBlizzard: number;
  silverBalanceSteam: number;
  characterDisplays: IPCMigrationCharacterDisplay[];
  versionsOwnedBlizzard: Globals.DestinyGameVersions;
  versionsOwnedSteam: Globals.DestinyGameVersions;
  hasBlizzard: boolean;
  hasSteam: boolean;
  hasDestinyBlizzard: boolean;
  hasDestinySteam: boolean;
  credentials: Contract.GetCredentialTypesForAccountResponse[];
  forceHidden: boolean;
}

class PCMigrationUserDataStoreInternal extends DataStore<IPCMigrationUserData> {
  public static Instance = new PCMigrationUserDataStoreInternal({
    dust: 0,
    silverBalanceBlizzard: 0,
    silverBalanceSteam: 0,
    characterDisplays: [],
    versionsOwnedBlizzard: 0,
    versionsOwnedSteam: 0,
    hasBlizzard: false,
    hasSteam: false,
    hasDestinyBlizzard: false,
    hasDestinySteam: false,
    forceHidden: false,
    credentials: [],
  });

  /**
   * This one is a dumb shim because we'll be getting rid of this code soon.
   * Normally, we'd refactor this one, but it's updating in a lot of places, and those
   * places are called through a chain of functions, so the refactor would be
   * likely to cause problems.
   */
  public actions = this.createActions({
    temporaryCrappyUpdate: (data: Partial<IPCMigrationUserData>) => data,
  });

  public getDestinyAccount(globalState: GlobalState<"loggedInUser">) {
    if (UserUtils.isAuthenticated(globalState)) {
      this.updateLinkState();

      Platform.UserService.GetMembershipDataForCurrentUser()
        .then((user: User.UserMembershipData) => {
          this.getUserDestinyAccountInfo(user);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });

      Platform.RendererService.PCMigrationUserData(
        globalState.loggedInUser.user.membershipId
      )
        .then((user: Renderer.PCMigrationUserDataDefined) =>
          this.getUserDestinyCharacterInfo(user)
        )
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
  }

  public updateLinkState() {
    Platform.UserService.GetCredentialTypesForAccount().then(
      (credentials: Contract.GetCredentialTypesForAccountResponse[]) => {
        this.actions.temporaryCrappyUpdate({
          credentials: credentials,
        });

        this.actions.temporaryCrappyUpdate({
          hasBlizzard:
            typeof credentials.find(
              (c) =>
                c.credentialType === Globals.BungieCredentialType.BattleNetId
            ) !== "undefined",
          hasSteam:
            typeof credentials.find(
              (c) => c.credentialType === Globals.BungieCredentialType.SteamId
            ) !== "undefined",
        });
      }
    );
  }

  private getUserDestinyAccountInfo(user: User.UserMembershipData) {
    const blizzardUser = user.destinyMemberships.find(
      (value) =>
        value.membershipType === Globals.BungieMembershipType.TigerBlizzard
    );
    // add steam
    const steamUser = user.destinyMemberships.find(
      (value) =>
        value.membershipType === Globals.BungieMembershipType.TigerSteam
    );

    if (typeof blizzardUser !== "undefined") {
      this.actions.temporaryCrappyUpdate({
        hasDestinyBlizzard: true,
      });

      this.getSilverFromUser(blizzardUser);
    }

    if (typeof steamUser !== "undefined") {
      this.actions.temporaryCrappyUpdate({
        hasDestinySteam: true,
      });

      this.getSilverFromUser(steamUser);
    }
  }

  private getUserDestinyCharacterInfo(
    user: Renderer.PCMigrationUserDataDefined
  ) {
    const userData = user.data;
    const userDefinitions = user.definitions;

    if (userData && userData.profileResponses) {
      this.getUserDestinyCharacterInfoPlatform(
        userData,
        "TigerBlizzard",
        userDefinitions
      );

      this.getUserDestinyCharacterInfoPlatform(
        userData,
        "TigerSteam",
        userDefinitions
      );
    }
  }

  private getUserDestinyCharacterInfoPlatform(
    userData: Renderer.PCMigrationUserData,
    membershipType: PCPlatform,
    userDefinitions: Renderer.DefinitionSetPCMigrationUserData
  ) {
    if (userData.profileResponses[membershipType]) {
      if (userData.profileResponses[membershipType].characters) {
        let characters: [string, Characters.DestinyCharacterComponent][] = [];
        if (userData.profileResponses[membershipType].characters.data) {
          characters = Object.entries(
            userData.profileResponses[membershipType].characters.data
          );
        }

        this.getCharacterDisplays(characters, userDefinitions);
      }

      if (userData.profileResponses[membershipType].profileCurrencies) {
        if (
          userData.profileResponses[membershipType].profileCurrencies.data.items
        ) {
          this.getDust(
            userData.profileResponses[membershipType].profileCurrencies.data
              .items
          );
        }
      }

      if (userData.profileResponses[membershipType].profile) {
        this.getEntitlements(
          userData.profileResponses[membershipType].profile,
          membershipType
        );
      }
    }
  }

  private getDust(currencyComponents: Items.DestinyItemComponent[]) {
    const dustCurrency = currencyComponents.find((item) => {
      return item.itemHash === 2817410917;
    });

    if (typeof dustCurrency !== "undefined") {
      this.actions.temporaryCrappyUpdate({
        dust: dustCurrency.quantity,
      });
    }
  }

  private getSilverFromUser(user: User.UserInfoCard) {
    if (typeof user !== "undefined") {
      Platform.TokensService.EververseSilverBalance(
        user.membershipId,
        user.membershipType
      ).then((response: Tokens.EververseSilverBalanceResponse) =>
        this.setSilverAmount(response, user.membershipType)
      );
    }
  }

  private setSilverAmount(
    silverResult: Tokens.EververseSilverBalanceResponse,
    membershipType: Globals.BungieMembershipType
  ) {
    if (typeof silverResult !== "undefined") {
      if (membershipType === Globals.BungieMembershipType.TigerBlizzard) {
        this.actions.temporaryCrappyUpdate({
          silverBalanceBlizzard: silverResult.SilverBalance,
        });
      }

      if (membershipType === Globals.BungieMembershipType.TigerSteam) {
        this.actions.temporaryCrappyUpdate({
          silverBalanceSteam: silverResult.SilverBalance,
        });
      }
    }
  }

  private getEntitlements(
    profile: Components.SingleComponentResponseDestinyProfileComponent,
    pcPlatform: PCPlatform
  ) {
    if (pcPlatform === "TigerBlizzard") {
      this.actions.temporaryCrappyUpdate({
        versionsOwnedBlizzard: profile.data.versionsOwned,
      });
    }

    if (pcPlatform === "TigerSteam") {
      this.actions.temporaryCrappyUpdate({
        versionsOwnedSteam: profile.data.versionsOwned,
      });
    }
  }

  private getCharacterDisplays(
    characters: [string, Characters.DestinyCharacterComponent][],
    definitions: Renderer.DefinitionSetPCMigrationUserData
  ) {
    const displays = [];

    characters.forEach((character) => {
      const title = `${
        definitions.classes[character[1].classHash].displayProperties.name
      } ${definitions.races[character[1].raceHash].displayProperties.name} ${
        definitions.genders[character[1].genderHash].displayProperties.name
      }`;

      const display: IPCMigrationCharacterDisplay = {
        characterId: character[1].characterId,
        title: title,
        iconPath: character[1].emblemPath,
        level: character[1].light,
        platform: character[1].membershipType,
      };

      if (
        this.state.characterDisplays.findIndex(
          (d) => d.characterId === character[1].characterId
        ) === -1
      ) {
        this.state.characterDisplays.push(display);
      }
    });

    this.actions.temporaryCrappyUpdate({
      characterDisplays: this.state.characterDisplays,
    });
  }

  /**
   * If true, forceHidden is turned on. If false, forceHidden is not turned on (i.e. normal behavior will resume)
   * @param isForced
   */
  public setForceHiddenState(isForced: boolean) {
    this.actions.temporaryCrappyUpdate({
      forceHidden: isForced,
    });
  }
}

export const PCMigrationUserDataStore =
  PCMigrationUserDataStoreInternal.Instance;
