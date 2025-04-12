// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { BungieCredentialType } from "@Enum";
import { Contract } from "@Platform";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  currentStep: number;
  pendingRegistrationFlow: boolean;
  selectedCredentialType: BungieCredentialType | null;
  validAlphaCredential: Contract.GetCredentialTypesForAccountResponse | null;
  loginCredentialType: BungieCredentialType | null;
  showConfirmation: boolean;
  surveyCompleted: boolean;
  ndaSigned: boolean;
  eligible: boolean;
  isFriendLinkFlow: boolean;
  surveyType: "Slim" | "FriendSurvey" | "Standard" | "General";
  cohortId: string;
  // Friend invitation related fields
  inviterId: string;
  inviterCohort: string;
  friendIndex: number;
  inviterName: string;
}

const initialState: RegistrationState = {
  currentStep: 0,
  pendingRegistrationFlow: false,
  selectedCredentialType: null,
  validAlphaCredential: null,
  loginCredentialType: null,
  showConfirmation: false,
  surveyCompleted: false,
  ndaSigned: false,
  eligible: true,
  isFriendLinkFlow: false,
  surveyType: "General",
  cohortId: "",
  // Initialize friend invitation fields
  inviterId: "",
  inviterCohort: "",
  friendIndex: 0,
  inviterName: "",
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setStep: (state: { currentStep: any }, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setPendingRegistrationFlow: (
      state: { pendingRegistrationFlow: any },
      action: PayloadAction<boolean>
    ) => {
      state.pendingRegistrationFlow = action.payload;
    },
    setSelectedCredentialType: (
      state: { selectedCredentialType: any },
      action: PayloadAction<BungieCredentialType | null>
    ) => {
      state.selectedCredentialType = action.payload;
    },
    setValidCredential: (
      state: { validAlphaCredential: any },
      action: PayloadAction<Contract.GetCredentialTypesForAccountResponse | null>
    ) => {
      state.validAlphaCredential = action.payload;
    },
    setShowConfirmation: (
      state: { showConfirmation: any },
      action: PayloadAction<boolean>
    ) => {
      state.showConfirmation = action.payload;
    },
    setSurveyCompleted: (
      state: { surveyCompleted: any },
      action: PayloadAction<boolean>
    ) => {
      state.surveyCompleted = action.payload;
    },
    resetFlow: (state: any) => {
      return {
        ...initialState,
        isFriendLinkFlow: state.isFriendLinkFlow,
        cohortId: state.cohortId,
        inviterId: state.inviterId,
        inviterCohort: state.inviterCohort,
        friendIndex: state.friendIndex,
      };
    },
    setEligibility: (
      state: { eligible: any },
      action: PayloadAction<boolean>
    ) => {
      state.eligible = action.payload;
    },
    setLoginCredentialType: (
      state: { loginCredentialType: any },
      action: PayloadAction<BungieCredentialType | null>
    ) => {
      state.loginCredentialType = action.payload;
    },
    setNdaSigned: (
      state: { ndaSigned: any },
      action: PayloadAction<boolean>
    ) => {
      state.ndaSigned = action.payload;
    },
    setIsFriendLinkFlow: (state, action: PayloadAction<boolean>) => {
      state.isFriendLinkFlow = action.payload;
    },
    setCohortId: (state, action: PayloadAction<string>) => {
      state.cohortId = action.payload;
    },
    setInviterId: (state, action: PayloadAction<string>) => {
      state.inviterId = action.payload;
    },
    setInviterCohort: (state, action: PayloadAction<string>) => {
      state.inviterCohort = action.payload;
    },
    setFriendIndex: (state, action: PayloadAction<number>) => {
      state.friendIndex = action.payload;
    },
    setInviterName: (state, action: PayloadAction<string>) => {
      state.inviterName = action.payload;
    },
    setSurveyType: (
      state,
      action: PayloadAction<"Slim" | "FriendSurvey" | "Standard" | "General">
    ) => {
      state.surveyType = action.payload;
    },
  },
});

export const {
  setIsFriendLinkFlow,
  setCohortId,
  setStep,
  setSelectedCredentialType,
  setValidCredential,
  setShowConfirmation,
  setSurveyCompleted,
  resetFlow,
  setEligibility,
  setInviterId,
  setInviterCohort,
  setFriendIndex,
  setInviterName,
  setSurveyType,
} = registrationSlice.actions;

export default registrationSlice.reducer;
