import {
  ICrossSaveFlowState,
  CrossSaveMode,
} from "./CrossSaveFlowStateDataStore";
import {
  ICrossSaveStepDefinition,
  CrossSaveActivateSteps,
  ICrossSaveActivateParams,
} from "../CrossSaveActivate";
import { Localizer } from "@Global/Localizer";
import { CrossSave, Responses, GroupsV2, Platforms, Contract } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import moment from "moment/moment";
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
      (key) => BungieMembershipType[key]
    ) as BungieMembershipType[];

    return profileMembershipTypes;
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
    const profileResponse = flowState.profileResponses[membershipTypeString];
    const platformMembership =
      flowState.pairingStatus.profiles[membershipTypeString];
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
    const now = moment();
    const credentialType = UserUtils.getCredentialTypeFromMembershipType(
      targetMembershipType
    );

    const isLinked = linkedCredentialTypes.indexOf(credentialType) > -1;
    const needsAuth =
      !authStatus.isAuthenticated ||
      now.add(5, "minutes").isAfter(moment(authStatus.expirationDate));
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

    if (!loggedInUser) {
      return CrossSaveUtils.getAccountLinkStatus(
        mt,
        authStatuses[BungieMembershipType[mt]],
        flowState.validation.profileSpecificErrors[BungieMembershipType[mt]],
        []
      );
    }

    return CrossSaveUtils.getAccountLinkStatus(
      mt,
      authStatuses[BungieMembershipType[mt]],
      flowState.validation.profileSpecificErrors[BungieMembershipType[mt]],
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

    const crossSaveCredentialTypes = loggedInUser.crossSaveCredentialTypes;
    const authStatuses = flowState.validation.authStatuses;

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );

    const goodToGoAccounts = pairableMembershipTypes
      .map((mt) => {
        return CrossSaveUtils.getAccountLinkStatus(
          mt,
          authStatuses[BungieMembershipType[mt]],
          flowState.validation.profileSpecificErrors[BungieMembershipType[mt]],
          loggedInUser.crossSaveCredentialTypes
        );
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
      (mtString) => BungieMembershipType[mtString]
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
      const pairability: CrossSave.CrossSavePairabilityStatus =
        flowState.validation.pairableMembershipTypes[
          BungieMembershipType[membershipType]
        ];

      result = pairability.canBePrimary;
    } catch (e) {
      Logger.error("Failed to get pairability status for membershipType");
    }

    return result;
  }
}
