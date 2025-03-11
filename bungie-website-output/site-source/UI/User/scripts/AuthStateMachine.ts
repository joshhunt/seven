import { FlowMode } from "../types/authTypes";

export enum AuthStep {
  // Initial States
  INITIAL = "INITIAL",
  PLATFORM_SELECT = "PLATFORM_SELECT",

  // Marathon Flow
  MARATHON_FOUND = "MARATHON_FOUND",
  MARATHON_PICK_PROFILE = "MARATHON_PICK_PROFILE",
  MARATHON_LINK_CONFIRM = "MARATHON_LINK_CONFIRM",

  // Sign In Flow
  PARTNER_SIGN_IN = "PARTNER_SIGN_IN",
  FIRST_ACCOUNT_CHECK = "FIRST_ACCOUNT_CHECK",
  PROFILE_SELECTION = "PROFILE_SELECTION",

  // Age Gate
  AGE_GATE_ENTRY = "AGE_GATE_ENTRY",
  AGE_GATE_CONFIRM = "AGE_GATE_CONFIRM",

  // Profile Creation
  ADULT_PROFILE_CREATE = "ADULT_PROFILE_CREATE",
  CHILD_PROFILE_CREATE = "CHILD_PROFILE_CREATE",
  PROFILE_CONFIRM = "PROFILE_CONFIRM",

  //// OAuth
  //OAUTH_DETAILS = 'OAUTH_DETAILS', OAUTH_EXPANDED = 'OAUTH_EXPANDED', STORE_APPROVAL = 'STORE_APPROVAL',

  // Final States
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
}

export interface StateConfig {
  allowBack: boolean;
  nextSteps: AuthStep[];
  component: React.ReactNode; // The component to render
  flowMode: FlowMode;
}

export const stateConfig: Record<AuthStep, StateConfig> = {
  [AuthStep.INITIAL]: {
    allowBack: false,
    nextSteps: [AuthStep.PLATFORM_SELECT, AuthStep.MARATHON_FOUND],
    component: "InitialView",
    flowMode: FlowMode.None,
  },

  [AuthStep.PLATFORM_SELECT]: {
    allowBack: true,
    nextSteps: [AuthStep.PARTNER_SIGN_IN],
    component: "PlatformSelect",
    flowMode: FlowMode.SignIn,
  },

  [AuthStep.MARATHON_FOUND]: {
    allowBack: true,
    nextSteps: [AuthStep.MARATHON_PICK_PROFILE],
    component: "MarathonFound",
    flowMode: FlowMode.LinkProfile,
  },

  [AuthStep.MARATHON_PICK_PROFILE]: {
    allowBack: true,
    nextSteps: [AuthStep.MARATHON_LINK_CONFIRM],
    component: "MarathonPickProfile",
    flowMode: FlowMode.LinkProfile,
  },

  [AuthStep.MARATHON_LINK_CONFIRM]: {
    allowBack: true,
    nextSteps: [AuthStep.COMPLETE],
    component: "MarathonLinkConfirm",
    flowMode: FlowMode.LinkProfile,
  },

  [AuthStep.PARTNER_SIGN_IN]: {
    allowBack: true,
    nextSteps: [AuthStep.FIRST_ACCOUNT_CHECK],
    component: "PartnerSignIn",
    flowMode: FlowMode.SignIn,
  },

  [AuthStep.FIRST_ACCOUNT_CHECK]: {
    allowBack: false,
    nextSteps: [AuthStep.PROFILE_SELECTION, AuthStep.AGE_GATE_ENTRY],
    component: "DuplicateCheck",
    flowMode: FlowMode.LinkSignIn,
  },

  [AuthStep.PROFILE_SELECTION]: {
    allowBack: true,
    nextSteps: [AuthStep.AGE_GATE_ENTRY],
    component: "ProfileSelection",
    flowMode: FlowMode.LinkSignIn,
  },

  [AuthStep.AGE_GATE_ENTRY]: {
    allowBack: true,
    nextSteps: [AuthStep.AGE_GATE_CONFIRM],
    component: "AgeGateEntry",
    flowMode: FlowMode.CreateUser,
  },

  [AuthStep.AGE_GATE_CONFIRM]: {
    allowBack: true,
    nextSteps: [AuthStep.ADULT_PROFILE_CREATE, AuthStep.CHILD_PROFILE_CREATE],
    component: "AgeGateConfirm",
    flowMode: FlowMode.CreateUser,
  },

  [AuthStep.ADULT_PROFILE_CREATE]: {
    allowBack: true,
    nextSteps: [AuthStep.PROFILE_CONFIRM],
    component: "AdultProfileCreate",
    flowMode: FlowMode.CreateUser,
  },

  [AuthStep.CHILD_PROFILE_CREATE]: {
    allowBack: true,
    nextSteps: [AuthStep.PROFILE_CONFIRM],
    component: "ChildProfileCreate",
    flowMode: FlowMode.CreateUser,
  },

  [AuthStep.PROFILE_CONFIRM]: {
    allowBack: true,
    nextSteps: [AuthStep.COMPLETE],
    component: "ProfileConfirm",
    flowMode: FlowMode.SignIn,
  }, //
  //[AuthStep.OAUTH_DETAILS]: {
  //	allowBack: false, nextSteps: [AuthStep.OAUTH_EXPANDED, AuthStep.STORE_APPROVAL], component: 'OAuthDetails', flowMode: FlowMode.VerifyAuth
  //},
  //
  //[AuthStep.OAUTH_EXPANDED]: {
  //	allowBack: true, nextSteps: [AuthStep.STORE_APPROVAL], component: 'OAuthExpanded', flowMode: FlowMode.VerifyAuth
  //},
  //
  //[AuthStep.STORE_APPROVAL]: {
  //	allowBack: true, nextSteps: [AuthStep.COMPLETE], component: 'StoreApproval', flowMode: FlowMode.VerifyAuth
  //},

  [AuthStep.COMPLETE]: {
    allowBack: false,
    nextSteps: [],
    component: "Complete",
    flowMode: FlowMode.None,
  },

  [AuthStep.ERROR]: {
    allowBack: true,
    nextSteps: [AuthStep.INITIAL],
    component: "Error",
    flowMode: FlowMode.None,
  },
};

export const getNextSteps = (currentStep: AuthStep, state: any): AuthStep[] => {
  const config = stateConfig[currentStep];

  // Add conditional logic for determining next steps
  switch (currentStep) {
    case AuthStep.AGE_GATE_CONFIRM:
      return state.forms.ageGate.childStatus
        ? [AuthStep.CHILD_PROFILE_CREATE]
        : [AuthStep.ADULT_PROFILE_CREATE];

    case AuthStep.FIRST_ACCOUNT_CHECK:
      return state.authState.user
        ? [AuthStep.PROFILE_SELECTION]
        : [AuthStep.AGE_GATE_ENTRY];

    default:
      return config.nextSteps;
  }
};
