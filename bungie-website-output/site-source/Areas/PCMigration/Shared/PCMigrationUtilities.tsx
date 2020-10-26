import { EmailVerificationState } from "./PCMigrationModalStagePage";
import { Contract, User } from "@Platform";
import { Localizer } from "@Global/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import { BungieCredentialType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { StringUtils } from "@Utilities/StringUtils";

export class PCMigrationUtilities {
  public static GetEmailValidationStatus(
    emailStatus: number
  ): EmailVerificationState {
    if (emailStatus === 9) {
      return EmailVerificationState.Verified;
    } else if (emailStatus === 2) {
      return EmailVerificationState.Verifying;
    } else {
      return EmailVerificationState.NotVerified;
    }
  }

  public static HasCredentialType(
    credentialTypes: Contract.GetCredentialTypesForAccountResponse[],
    checkType: BungieCredentialType
  ): boolean {
    return (
      typeof credentialTypes !== "undefined" &&
      typeof credentialTypes.find((c) => c.credentialType === checkType) !==
        "undefined"
    );
  }

  public static IsLinked(
    credentialTypes: Contract.GetCredentialTypesForAccountResponse[]
  ): boolean {
    return (
      typeof credentialTypes !== "undefined" &&
      typeof credentialTypes.find(
        (c) => c.credentialType === BungieCredentialType.BattleNetId
      ) !== "undefined" &&
      typeof credentialTypes.find(
        (c) => c.credentialType === BungieCredentialType.SteamId
      ) !== "undefined"
    );
  }

  public static MigrationIsComplete(
    response: User.BlizzardToSteamMigrationStatusResponse
  ): boolean {
    let migrationIsComplete = false;

    if (!ConfigUtils.SystemStatus("PCMigrationEntitlements")) {
      if (typeof response !== "undefined") {
        if (
          typeof response.CharacterMigratedDate !== "undefined" &&
          response.CharacterMigratedDate !== "" &&
          typeof response.SilverMigratedDate !== "undefined" &&
          response.SilverMigratedDate !== "" &&
          typeof response.SeasonPassMigratedDate !== "undefined" &&
          response.SeasonPassMigratedDate !== ""
        ) {
          migrationIsComplete = true;
        }
      }
    } else {
      migrationIsComplete =
        response.MigrationComplete &&
        response.CallerIsLinkedToSourceAndDestinationCredential;
    }

    return migrationIsComplete;
  }

  public static GetSteamProfileIdLink(
    displayName: string,
    credentialTypes: Contract.GetCredentialTypesForAccountResponse[]
  ): React.ReactElement {
    const steamCred = credentialTypes.find(
      (c) => c.credentialType === BungieCredentialType.SteamId
    );

    if (
      typeof steamCred !== "undefined" &&
      steamCred.credentialType === BungieCredentialType.SteamId
    ) {
      const credentialAsString = steamCred.credentialAsString;

      if (!StringUtils.isNullOrWhiteSpace(credentialAsString)) {
        const url = `https://steamcommunity.com/profiles/${encodeURIComponent(
          credentialAsString
        )}`;

        const idAsString = Localizer.Format(
          Localizer.Pcmigration.IdCredentialasstring,
          {
            credentialAsString: credentialAsString,
          }
        );

        const anchorText = `${displayName}(${idAsString})`;

        return <Anchor url={url}>{anchorText}</Anchor>;
      }
    }

    return null;
  }
}
