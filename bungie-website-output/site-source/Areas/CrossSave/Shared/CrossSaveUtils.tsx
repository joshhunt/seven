import { EnumUtils } from "@Utilities/EnumUtils";
import { DateTime } from "luxon";
import {
  ICrossSaveFlowState,
  CrossSaveMode,
} from "./CrossSaveFlowStateDataStore";
import {
  ICrossSaveStepDefinition,
  CrossSaveActivateSteps,
  ICrossSaveActivateParams,
} from "../CrossSaveActivate";
import { Localizer } from "@bungie/localization";
import { CrossSave, Responses, GroupsV2, Platforms, Contract } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import { Logger } from "@Global/Logger";
import { BungieMembershipType, BungieCredentialType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { IMultiSiteLink } from "@Routes/RouteHelper";

interface ICrossSaveNextPrev {
  nextStep: ICrossSaveStepDefinition;
  prevStep: ICrossSaveStepDefinition;
  nextPath: IMultiSiteLink;
  prevPath: IMultiSiteLink;
}

export interface IFlowStateForMembership {
  profileResponse: Responses.DestinyProfileResponse;
  platformMembership: Platforms.BungiePlatformMembership;
  userInfo: Responses.DestinyProfileUserInfoCard;
  clan?: GroupsV2.GroupMembership;
}

export interface ICrossSaveAccountState {
  needsAuth: boolean;
  hasErrors: boolean;
  isLinked: boolean;
  goodToGo: boolean;
}

export class CrossSaveUtils {
  /**
   *
   * @param pairingStatus
   * @param crossSaveMode
   */
  public static getPresetPairingDecision(
    pairingStatus: CrossSave.CrossSavePairingStatus,
    crossSaveMode: CrossSaveMode
  ) {
    const profileMembershipTypes = Object.keys(pairingStatus.profiles).map(
      (key) => BungieMembershipType[this.EnumKeyifyMembershipType(key)]
    ) as BungieMembershipType[];

    return profileMembershipTypes;
  }

  private static EnumKeyifyMembershipType(
    input: BungieMembershipType | string
  ) {
    return input as keyof typeof BungieMembershipType;
  }

  /**
   * Gets the relevant steps for the user's flow state
   * @param flowState
   */
  public static getActivateStepDefsFromFlowState(
    flowState: ICrossSaveFlowState
  ): ICrossSaveStepDefinition[] {
    const steps: ICrossSaveStepDefinition[] = [];

    if (!flowState.isActive) {
      steps.push({
        step: "Link",
        label: Localizer.Crosssave.LinkAccountsHeader,
      });

      if (!flowState.pairingStatus) {
        return steps;
      }

      steps.push({
        step: "Characters",
        label: Localizer.Crosssave.CharacterChoiceHeader,
      });
    }

    steps.push({
      step: "Commit",
      label: Localizer.Crosssave.ReviewHeader,
    });

    return steps;
  }

  /**
   * Gets the step following the current step
   * @param flowState
   * @param currentStepName The name of the step currently being viewed
   */
  public static getNextStep(
    flowState: ICrossSaveFlowState,
    currentStepName: CrossSaveActivateSteps
  ): ICrossSaveStepDefinition {
    const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(flowState);
    const currentIndex = stepDefs.findIndex((a) => a.step === currentStepName);
    if (currentIndex === -1) {
      return null;
    }

    const nextIndex = currentIndex + 1;

    return stepDefs.length - 1 >= nextIndex ? stepDefs[nextIndex] : null;
  }

  /**
   * Gets the previous step in the flow
   * @param flowState
   * @param currentStepName
   */
  public static getPrevStep(
    flowState: ICrossSaveFlowState,
    currentStepName: CrossSaveActivateSteps
  ): ICrossSaveStepDefinition {
    const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(flowState);
    const currentIndex = stepDefs.findIndex((a) => a.step === currentStepName);
    if (currentIndex === -1) {
      return null;
    }

    const prevIndex = currentIndex - 1;

    return prevIndex >= 0 ? stepDefs[prevIndex] : null;
  }

  /**
   * Gets the paths of hte next and previous steps
   * @param flowState
   * @param currentStepName
   */
  public static getNextPrevStepPaths(
    flowState: ICrossSaveFlowState,
    currentStepName: CrossSaveActivateSteps
  ): ICrossSaveNextPrev {
    const activateAction = RouteDefs.Areas.CrossSave.getAction("Activate");

    const nextStep = CrossSaveUtils.getNextStep(flowState, currentStepName);
    const prevStep = CrossSaveUtils.getPrevStep(flowState, currentStepName);
    const nextPath = nextStep
      ? activateAction.resolve<ICrossSaveActivateParams>({
          step: nextStep.step,
        })
      : null;

    const prevPath = prevStep
      ? activateAction.resolve<ICrossSaveActivateParams>({
          step: prevStep.step,
        })
      : null;

    if (nextStep || prevStep) {
      return {
        nextStep,
        prevStep,
        nextPath,
        prevPath,
      };
    }

    return null;
  }

  /**
   * Gets all the relevant flow state info for a particular membership type
   * @param flowState
   * @param membershipType
   */
  public static getFlowStateInfoForMembership(
    flowState: ICrossSaveFlowState,
    membershipType: BungieMembershipType
  ): IFlowStateForMembership {
    const membershipTypeString = BungieMembershipType[membershipType];
    const profileResponse =
      flowState.profileResponses[
        this.EnumKeyifyMembershipType(membershipTypeString)
      ];
    const platformMembership =
      flowState.pairingStatus.profiles[
        this.EnumKeyifyMembershipType(membershipTypeString)
      ];
    const clan = flowState.userClans.find(
      (a) => a.member.destinyUserInfo.membershipType === membershipType
    );
    const userInfo = flowState.linkedDestinyProfiles.profiles.find(
      (a) => a.membershipType === membershipType
    );

    return {
      profileResponse,
      userInfo,
      clan,
      platformMembership,
    };
  }

  /**
   * Gets the account linking and verification status for a membership type
   * @param targetMembershipType
   * @param authStatus
   * @param validationErrors
   * @param linkedCredentialTypes
   */
  public static getAccountLinkStatus(
    targetMembershipType: BungieMembershipType,
    authStatus: CrossSave.CrossSaveCredentialAuthenticationStatus,
    validationErrors: CrossSave.CrossSaveValidationError[],
    linkedCredentialTypes: BungieCredentialType[]
  ): ICrossSaveAccountState {
    const now = DateTime.now();
    const credentialType = UserUtils.getCredentialTypeFromMembershipType(
      targetMembershipType
    );

    const isLinked = linkedCredentialTypes.indexOf(credentialType) > -1;
    const needsAuth =
      !authStatus.isAuthenticated ||
      now.plus({ minutes: 5 }) > DateTime.fromISO(authStatus.expirationDate);
    const hasErrors =
      isLinked && validationErrors && validationErrors.length > 0;
    const goodToGo = !needsAuth && !hasErrors;

    return {
      needsAuth,
      hasErrors,
      isLinked,
      goodToGo,
    };
  }

  /**
   * Returns true if the account is verified for this membership type
   * @param mt
   * @param loggedInUser
   * @param flowState
   */
  public static accountAuthVerified(
    mt: BungieMembershipType,
    loggedInUser: Contract.UserDetail,
    flowState: ICrossSaveFlowState
  ) {
    const authStatuses = flowState.validation.authStatuses;

    const mtFixed = this.EnumKeyifyMembershipType(BungieMembershipType[mt]);

    if (!loggedInUser) {
      return CrossSaveUtils.getAccountLinkStatus(
        mt,
        authStatuses[mtFixed],
        flowState.validation.profileSpecificErrors[mtFixed],
        []
      );
    }

    return CrossSaveUtils.getAccountLinkStatus(
      mt,
      authStatuses[mtFixed],
      flowState.validation.profileSpecificErrors[mtFixed],
      loggedInUser.crossSaveCredentialTypes
    );
  }

  /**
   * Returns true if all accounts have been verified
   * @param loggedInUser
   * @param flowState
   */
  public static allAccountsAuthVerified(
    loggedInUser: Contract.UserDetail,
    flowState: ICrossSaveFlowState
  ) {
    if (!flowState || !flowState.validation || !loggedInUser) {
      return false;
    }

    // Note that this is looking at credential types, so Stadia is 16 not 5
    // For auth purposes, Stadia is always considered authorized
    const crossSaveCredentialTypes = loggedInUser.crossSaveCredentialTypes.filter(
      (ct) =>
        !EnumUtils.looseEquals(
          BungieCredentialType[ct],
          BungieCredentialType.StadiaId,
          BungieCredentialType
        )
    );
    const authStatuses = flowState.validation.authStatuses;

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );

    const goodToGoAccounts = pairableMembershipTypes
      .map((mt) => {
        const mtFixed = this.EnumKeyifyMembershipType(BungieMembershipType[mt]);

        const statuss = CrossSaveUtils.getAccountLinkStatus(
          mt,
          authStatuses[mtFixed],
          flowState.validation.profileSpecificErrors[mtFixed],
          loggedInUser.crossSaveCredentialTypes
        );

        console.log(mtFixed, statuss);

        return statuss;
      })
      .filter((status) => status.goodToGo);

    const canProceed =
      goodToGoAccounts.length === crossSaveCredentialTypes.length;

    return canProceed;
  }

  /**
   * Gets all pairable membership types
   * @param flowState
   */
  public static getPairableMembershipTypes(
    flowState: ICrossSaveFlowState
  ): BungieMembershipType[] {
    if (
      !flowState.validation ||
      !flowState.validation.pairableMembershipTypes
    ) {
      return [];
    }

    return Object.keys(flowState.validation.pairableMembershipTypes).map(
      (mtFixed) => BungieMembershipType[this.EnumKeyifyMembershipType(mtFixed)]
    );
  }

  /**
   * Returns true if a membership type can be primary
   * @param membershipType
   * @param flowState
   */
  public static membershipTypeCanBePrimary(
    membershipType: BungieMembershipType,
    flowState: ICrossSaveFlowState
  ) {
    let result = false;

    try {
      const mtFixed = this.EnumKeyifyMembershipType(
        BungieMembershipType[membershipType]
      );
      const pairability: CrossSave.CrossSavePairabilityStatus =
        flowState.validation.pairableMembershipTypes[mtFixed];

      result = pairability.canBePrimary;
    } catch (e) {
      Logger.error("Failed to get pairability status for membershipType");
    }

    return result;
  }

  /**
   * Returns all membershipType that are unlinked
   * @param flowState
   */
  public static getUnLinkedPairableMembershipTypes(
    flowState: ICrossSaveFlowState
  ): BungieMembershipType[] {
    const allMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );

    return allMembershipTypes
      .filter((m) => {
        if (
          !flowState.linkedDestinyProfiles?.profiles?.find(
            (p) => p.membershipType === m
          ) &&
          !flowState.linkedDestinyProfiles?.profilesWithErrors?.find(
            (p) => p.infoCard.membershipType === m
          )
        ) {
          return m;
        }
      })
      ?.map((f) => f);
  }
}
