import { User } from "@Platform";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthStep,
  getNextSteps,
  stateConfig,
} from "@UI/User/scripts/AuthStateMachine";
import { AuthError } from "@UI/User/types/authTypes";

enum FlowMode {
  None = "None",
  CreateUser = "CreateUser",
  SignIn = "SignIn",
  LinkSignIn = "LinkSignIn",
  LinkProfile = "LinkProfile",
  UnlinkProfile = "UnlinkProfile",
  VerifyAuth = "VerifyAuth",
  LinkPreview = "LinkPreview",
}

enum AuthResponseStateEnum {
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

interface AuthenticationState {
  context: {
    membershipId: string | null;
    isAuthenticated: boolean;
    credentialType: string | null;
    linkedAccounts: string[];
    authProvider: string | null;
  };

  authState: {
    flowMode: FlowMode;
    initialCredentialType: string | null;
    secondCredentialType: string | null;
    forceLink: boolean;
    initialDisplayName: string | null;
    user: any | null; // Type as GeneralUser when available
  };

  linkAccounts: {
    currentAccountOwner: User.GeneralUser | null;
    currentUser: User.GeneralUser | null;
    platformDisplayName: string;
    currentAccountOwnerLinks: string[];
    linkAuthProvider: string | null;
    currentAuthProvider: string | null;
  } | null;

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

interface AuthenticationStateWithFlow extends AuthenticationState {
  flow: {
    currentStep: AuthStep;
    stepHistory: AuthStep[];
    nextSteps: AuthStep[];
    mode: FlowMode;
  };
}

const initialState: AuthenticationStateWithFlow = {
  context: {
    membershipId: null,
    isAuthenticated: false,
    credentialType: null,
    linkedAccounts: [],
    authProvider: null,
  },
  authState: {
    flowMode: FlowMode.None,
    initialCredentialType: null,
    secondCredentialType: null,
    forceLink: false,
    initialDisplayName: null,
    user: null,
  },
  linkAccounts: null,
  forms: {
    ageGate: {
      birthDate: "",
      country: "",
      isValid: false,
      childStatus: null,
    },
    platformSelection: {
      selectedPlatform: null,
    },
  },
  ui: {
    loading: false,
    error: null,
    navigation: {
      canGoBack: false,
      backDestination: undefined,
      nextEnabled: false,
    },
  },
  flow: {
    currentStep: AuthStep.INITIAL,
    stepHistory: [],
    nextSteps: getNextSteps(AuthStep.INITIAL, {}),
    mode: FlowMode.None,
  },
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    // Context Updates
    setAuthContext: (
      state,
      action: PayloadAction<Partial<AuthenticationStateWithFlow["context"]>>
    ) => {
      state.context = { ...state.context, ...action.payload };
    },

    // Auth State Updates
    setAuthState: (
      state,
      action: PayloadAction<Partial<AuthenticationStateWithFlow["authState"]>>
    ) => {
      state.authState = { ...state.authState, ...action.payload };
    },

    // Link Accounts Updates
    setLinkAccountsState: (
      state,
      action: PayloadAction<AuthenticationStateWithFlow["linkAccounts"]>
    ) => {
      state.linkAccounts = action.payload;
    },

    // Form Updates
    updateAgeGate: (
      state,
      action: PayloadAction<
        Partial<AuthenticationStateWithFlow["forms"]["ageGate"]>
      >
    ) => {
      state.forms.ageGate = { ...state.forms.ageGate, ...action.payload };
    },
    setPlatformSelection: (state, action: PayloadAction<string | null>) => {
      state.forms.platformSelection.selectedPlatform = action.payload;
    },

    // UI State Management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ui.loading = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<AuthenticationStateWithFlow["ui"]["error"]>
    ) => {
      state.ui.error = action.payload;
      // Handle special cases
      if (state.ui.error?.state === AuthResponseStateEnum.GoogleAuthCancelled) {
        // Signal to close window
        // Implementation specific
      }
      if (
        state.ui.error?.state ===
        AuthResponseStateEnum.WebAuthCompleteRequiresLocalAccount
      ) {
        // Trigger flow change
        state.authState.flowMode = FlowMode.LinkSignIn;
      }
    },
    updateNavigation: (
      state,
      action: PayloadAction<Partial<AuthenticationState["ui"]["navigation"]>>
    ) => {
      state.ui.navigation = { ...state.ui.navigation, ...action.payload };
    },

    // Navigation actions
    goToStep: (state, action: PayloadAction<AuthStep>) => {
      // Save current step to history if it's not the initial step
      if (state.flow.currentStep !== AuthStep.INITIAL) {
        state.flow.stepHistory.push(state.flow.currentStep);
      }

      state.flow.currentStep = action.payload;
      state.flow.nextSteps = getNextSteps(action.payload, state);
      state.flow.mode = stateConfig[action.payload].flowMode;

      // Update navigation state
      state.ui.navigation.canGoBack =
        stateConfig[action.payload].allowBack &&
        state.flow.stepHistory.length > 0;
      state.ui.navigation.nextEnabled = state.flow.nextSteps.length > 0;
    },

    goBack: (state) => {
      const previousStep = state.flow.stepHistory.pop();
      if (previousStep) {
        state.flow.currentStep = previousStep;
        state.flow.nextSteps = getNextSteps(previousStep, state);
        state.flow.mode = stateConfig[previousStep].flowMode;

        // Update navigation state
        state.ui.navigation.canGoBack =
          stateConfig[previousStep].allowBack &&
          state.flow.stepHistory.length > 0;
        state.ui.navigation.nextEnabled = state.flow.nextSteps.length > 0;
      }
    },

    resetFlow: (state) => {
      state.flow = initialState.flow;
    },

    // Reset States
    resetForms: (state) => {
      state.forms = initialState.forms;
    },
    resetAll: () => initialState,
  },
});

export const {
  setAuthContext,
  setAuthState,
  setLinkAccountsState,
  updateAgeGate,
  setPlatformSelection,
  setLoading,
  setError,
  updateNavigation,
  resetForms,
  resetAll,
  goToStep,
  goBack,
  resetFlow,
} = authenticationSlice.actions;

// Selectors
export const selectAuthContext = (state: {
  authentication: AuthenticationState;
}) => state.authentication.context;

export const selectAuthState = (state: {
  authentication: AuthenticationState;
}) => state.authentication.authState;

export const selectLinkAccountsState = (state: {
  authentication: AuthenticationState;
}) => state.authentication.linkAccounts;

export const selectAgeGateData = (state: {
  authentication: AuthenticationState;
}) => state.authentication.forms.ageGate;

export const selectError = (state: { authentication: AuthenticationState }) =>
  state.authentication.ui.error;

export default authenticationSlice.reducer;
