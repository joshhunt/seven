import { Localizer } from "@bungie/localization/Localizer";
import {
  AuthError,
  AuthResponseStateEnum,
  PlatformErrorCode,
} from "../types/authTypes";

const handleAuthError = (error: any): AuthError => {
  if (error.platformError) {
    switch (error.platformError) {
      case PlatformErrorCode.AuthVerificationNotLinkedToAccount:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialFailure,
          message: Localizer.WebAuth.ErrorVerificationNotLinkedToAccount,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthAccountNotFound:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorAccountNotFound,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthAccountAlreadyExists:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialCannotOverwrite,
          message: Localizer.WebAuth.ErrorAuthAccountAlreadyExists,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthAccountCannotBeLinked:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialFailure,
          message: Localizer.WebAuth.ErrorAuthAccountCannotBeLinked,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthAccountAlreadyLinkedToSelf:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialFailure,
          message: Localizer.WebAuth.ErrorAuthAccountAlreadyLinkedToSelf,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthBattleNetAccountRequired:
        return {
          state: AuthResponseStateEnum.ErrorInvalidPlatform,
          message: Localizer.WebAuth.ErrorAuthBattleNetAccountRequired,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthSteamAccountRequired:
        return {
          state: AuthResponseStateEnum.ErrorInvalidPlatform,
          message: Localizer.WebAuth.ErrorAuthSteamAccountRequired,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthTwitchAccountRequired:
        return {
          state: AuthResponseStateEnum.ErrorInvalidPlatform,
          message: Localizer.WebAuth.ErrorTwitchAccountRequired,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthInvalidPartnershipId:
        return {
          state: AuthResponseStateEnum.ErrorInvalidParameters,
          message: Localizer.WebAuth.ErrorAuthInvalidPartnershipId,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthTokenInvalidRequest:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorAuthTokenInvalidRequest,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthTokenExpired:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorAuthTokenExpired,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthUnauthorized:
        return {
          state: AuthResponseStateEnum.WebAuthRequired,
          message: Localizer.WebAuth.ErrorAuthUnauthorized,
          platformError: error.platformError,
        };
      case PlatformErrorCode.AuthAccountUnavailable:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorAuthAccountUnavailable,
          platformError: error.platformError,
        };
      default:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorUnknown,
          platformError: error.platformError,
        };
    }
  }

  if (error.state) {
    switch (error.state) {
      case AuthResponseStateEnum.SystemDisabled:
        return {
          state: AuthResponseStateEnum.SystemDisabled,
          message: Localizer.WebAuth.SystemDisabled,
        };
      case AuthResponseStateEnum.MissingWebAuth:
        return {
          state: AuthResponseStateEnum.MissingWebAuth,
          message: Localizer.WebAuth.MissingWebAuth,
        };
      case AuthResponseStateEnum.WebAuthRequired:
        return {
          state: AuthResponseStateEnum.WebAuthRequired,
          message: Localizer.WebAuth.WebAuthRequired,
        };
      case AuthResponseStateEnum.ErrorNoImplementation:
        return {
          state: AuthResponseStateEnum.ErrorNoImplementation,
          message: Localizer.WebAuth.ErrorNoImplementation,
        };
      case AuthResponseStateEnum.ErrorInvalidPlatform:
        return {
          state: AuthResponseStateEnum.ErrorInvalidPlatform,
          message: Localizer.WebAuth.ErrorInvalidPlatform,
        };
      case AuthResponseStateEnum.ErrorLinkingCredentialFailure:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialFailure,
          message: Localizer.WebAuth.ErrorLinkingCredentialFailure,
        };
      case AuthResponseStateEnum.ErrorLinkingCredentialCannotOverwrite:
        return {
          state: AuthResponseStateEnum.ErrorLinkingCredentialCannotOverwrite,
          message: Localizer.WebAuth.ErrorLinkingCredentialCannotOverwrite,
        };
      case AuthResponseStateEnum.ErrorMissingSessionState:
        return {
          state: AuthResponseStateEnum.ErrorMissingSessionState,
          message: Localizer.WebAuth.ErrorMissingSessionState,
        };
      case AuthResponseStateEnum.ErrorInvalidParameters:
        return {
          state: AuthResponseStateEnum.ErrorInvalidParameters,
          message: Localizer.WebAuth.ErrorInvalidParameters,
        };
      default:
        return {
          state: AuthResponseStateEnum.ErrorUnknown,
          message: Localizer.WebAuth.ErrorUnknown,
        };
    }
  }

  return {
    state: AuthResponseStateEnum.ErrorUnknown,
    message: error.message,
  } as AuthError;
};

export default handleAuthError;
