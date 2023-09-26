// Created by atseng, 2023
// Copyright Bungie, Inc.

import { IApplicationScopeCheckBoxValues } from "@Areas/Application/Shared/ApplicationUtils";
import { ApplicationScopes } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Applications } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";

export class ApplicationScopesHelper {
  private static readonly availableScopes = ConfigUtils.GetParameter(
    SystemNames.Applications,
    SystemNames.AvailableScopes,
    0
  );
  private static readonly disabledScopes = ConfigUtils.GetParameter(
    SystemNames.Applications,
    SystemNames.DisabledScopes,
    0
  );

  private static readonly orderedListScopes = [
    ApplicationScopes.ReadDestinyInventoryAndVault,
    ApplicationScopes.ReadDestinyVendorsAndAdvisors,
    ApplicationScopes.MoveEquipDestinyItems,
    ApplicationScopes.AdminGroups,
    ApplicationScopes.ReadGroups,
    ApplicationScopes.WriteGroups,
    ApplicationScopes.BnetWrite,
    ApplicationScopes.ReadUserData,
    ApplicationScopes.EditUserData,
    ApplicationScopes.ReadAndApplyTokens,
    ApplicationScopes.AdvancedWriteActions,
    ApplicationScopes.PartnerOfferGrant,
    ApplicationScopes.DestinyUnlockValueQuery,
    ApplicationScopes.UserPiiRead,
  ];

  public static applicationScopesStringValues: IApplicationScopeCheckBoxValues[] = ApplicationScopesHelper.orderedListScopes
    .filter((a) => {
      if (
        ApplicationScopesHelper.availableScopes &
          EnumUtils.getNumberValue(a, ApplicationScopes) &&
        !(
          ApplicationScopesHelper.disabledScopes &
          EnumUtils.getNumberValue(a, ApplicationScopes)
        )
      ) {
        return a;
      }
    })
    .map((a) => {
      return {
        name: EnumUtils.getStringValue(a, ApplicationScopes),
        value: false,
      };
    });

  public static getInitialAppScopeValues = (app?: Applications.Application) => {
    return Object.fromEntries(
      ApplicationScopesHelper.applicationScopesStringValues.map((field) => {
        let value = false;

        if (
          app &&
          parseInt(app?.scope, 10) &
            EnumUtils.getNumberValue(field.name, ApplicationScopes)
        ) {
          value = true;
        }

        return [field.name, value];
      })
    );
  };
}

export class ScopeConstants {
  /// <summary>
  /// Maximum scope selectable by external applications.
  /// </summary>
  public static MaximumScope = ApplicationScopes.ReadAndApplyTokens;

  /// <summary>
  /// Default scope everyone gets even if they don't ask for it.
  /// </summary>
  public static DefaultScope = ApplicationScopes.ReadBasicUserProfile;

  /// <summary>
  /// Special scope reserved for privileged applications.
  /// </summary>
  public static PrivilegedScope = -1 as ApplicationScopes;

  /// <summary>
  /// Permissions with this scope can be used by any application.
  /// </summary>
  public static Any = 0;
}
