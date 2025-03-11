// Flow Control
export enum FlowMode {
  None = "None",
  SignIn = "SignIn",
  LinkSignIn = "LinkSignIn",
  LinkProfile = "LinkProfile",
  VerifyAuth = "VerifyAuth",
}

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

// We should also track the user's choice in the state:

export interface FlowState {
  mode: FlowMode;

  currentStep: AuthStep;

  firstTimeChoice?: "link" | "create" | null; // Track their choice from firstAccountCheck

  redirectAfterFlow?: string;
}

// Error States
export enum AuthResponseStateEnum {
  Success = "Success",
  None = "None",
  SystemDisabled = "SystemDisabled",
  MissingWebAuth = "MissingWebAuth",
  WebAuthRequired = "WebAuthRequired",
  ErrorUnknown = "ErrorUnknown",
  ErrorNoImplementation = "ErrorNoImplementation",
  ErrorInvalidPlatform = "ErrorInvalidPlatform",
  ErrorLinkingCredentialFailure = "ErrorLinkingCredentialFailure",
  ErrorLinkingCredentialCannotOverwrite = "ErrorLinkingCredentialCannotOverwrite",
  WebAuthCompleteRequiresLocalAccount = "WebAuthCompleteRequiresLocalAccount",
  GoogleAuthCancelled = "GoogleAuthCancelled",
  ErrorMissingSessionState = "ErrorMissingSessionState",
  ErrorInvalidParameters = "ErrorInvalidParameters",
}

// Platform Error Codes
export enum PlatformErrorCode {
  AuthVerificationNotLinkedToAccount = "AuthVerificationNotLinkedToAccount",
  AuthAccountNotFound = "AuthAccountNotFound",
  AuthAccountAlreadyExists = "AuthAccountAlreadyExists",
  AuthAccountCannotBeLinked = "AuthAccountCannotBeLinked",
  AuthAccountAlreadyLinkedToSelf = "AuthAccountAlreadyLinkedToSelf",
  AuthBattleNetAccountRequired = "AuthBattleNetAccountRequired",
  AuthSteamAccountRequired = "AuthSteamAccountRequired",
  AuthTwitchAccountRequired = "AuthTwitchAccountRequired",
  AuthInvalidPartnershipId = "AuthInvalidPartnershipId",
  AuthTokenInvalidRequest = "AuthTokenInvalidRequest",
  AuthTokenExpired = "AuthTokenExpired",
  AuthUnauthorized = "AuthUnauthorized",
  AuthAccountUnavailable = "AuthAccountUnavailable",
}

// General User Type
export interface GeneralUser {
  membershipId: string;
  displayName: string;
  // Add other user properties as needed
}

// Profile Types
export interface AuthenticatedProfile {
  authStatus: string;
  membership: {
    id: string;
    type: string;
  };
  linkedMemberships: string[];
  isPartOfCrossSave: boolean;
  hasMarathonSave: boolean;
  isLoggedInProfile: boolean;
  accountType: "social" | "game";
  profileLogo: string;
}

export interface MarathonSave {
  size: number;
  accountName: string;
  accountType: string;
}

// API Response Types
export interface AuthContextResponse {
  membershipId: string;
  isAuthenticated: boolean;
  credentialType: string;
  linkedAccounts: string[];
  authProvider: string;
}

export interface MembershipResponse {
  destinyMemberships: any[]; // Type properly when destiny types are available
  bungieNetUser: GeneralUser;
  primaryMembershipId?: string;
}

// State Types
export interface AuthState {
  flowMode: FlowMode;
  initialCredentialType: string | null;
  secondCredentialType: string | null;
  forceLink: boolean;
  initialDisplayName: string | null;
  user: GeneralUser | null;
}

export interface LinkAccountsState {
  currentUser: GeneralUser;
  platformDisplayName: string;
  currentAccountOwnerLinks: string[];
  linkAuthProvider: string | null;
  currentAuthProvider: string | null;
}

// Error Types
export interface AuthError {
  state: AuthResponseStateEnum;
  platformError?: PlatformErrorCode;
  message?: string;
}

// Form Types
export interface AgeGateData {
  birthDate: string;
  country: string;
}

export interface AgeGateValidation {
  requirements: {
    validDateRange: {
      min: Date;
      max: Date;
    };
    validCountries: string[];
  };
  knownData: {
    birthDate: Date | null;
    country: string | null;
    isValid: boolean;
  };
  childStatus: boolean | null;
}

// Authentication State Interface
export interface AuthenticationState {
  // Auth Context
  context: AuthContextResponse;

  // Auth State
  authState: AuthState;

  // Link Accounts State
  linkAccounts: LinkAccountsState | null;

  // Forms State
  forms: {
    ageGate: {
      birthDate: string;
      country: string;
      isValid: boolean;
      childStatus: boolean | null;
    };
    platformSelection: {
      selectedPlatform: string | null;
    };
  };

  // UI State
  ui: {
    loading: boolean;
    error: AuthError | null;
    navigation: {
      canGoBack: boolean;
      backDestination?: string;
      nextEnabled: boolean;
    };
  };
}
