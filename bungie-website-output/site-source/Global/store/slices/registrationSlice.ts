// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { BungieCredentialType } from "@Enum";
import { Contract } from "@Platform";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  currentStep: number;
  selectedCredentialType: BungieCredentialType | null;
  validAlphaCredential: Contract.GetCredentialTypesForAccountResponse | null;
  credentials: Contract.GetCredentialTypesForAccountResponse[];
  loginCredentialType: BungieCredentialType | null;
  showConfirmation: boolean;
  emailVerified: boolean;
  surveyCompleted: boolean;
  ndaSigned: boolean;
  eligible: boolean;
}

const initialState: RegistrationState = {
  currentStep: 0,
  selectedCredentialType: null,
  validAlphaCredential: null,
  credentials: [],
  loginCredentialType: null,
  showConfirmation: false,
  emailVerified: false,
  surveyCompleted: false,
  ndaSigned: false,
  eligible: true,
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCredentialType: (
      state,
      action: PayloadAction<BungieCredentialType | null>
    ) => {
      state.selectedCredentialType = action.payload;
    },
    setValidCredential: (
      state,
      action: PayloadAction<Contract.GetCredentialTypesForAccountResponse | null>
    ) => {
      state.validAlphaCredential = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<Contract.GetCredentialTypesForAccountResponse[]>
    ) => {
      state.credentials = action.payload;
    },
    setShowConfirmation: (state, action: PayloadAction<boolean>) => {
      state.showConfirmation = action.payload;
    },
    setSurveyCompleted: (state, action: PayloadAction<boolean>) => {
      state.surveyCompleted = action.payload;
    },
    resetFlow: (state) => {
      return initialState;
    },
    setEligibility: (state, action: PayloadAction<boolean>) => {
      state.eligible = action.payload;
    },
    setLoginCredentialType: (
      state,
      action: PayloadAction<BungieCredentialType | null>
    ) => {
      state.loginCredentialType = action.payload;
    },
    setNdaSigned: (state, action: PayloadAction<boolean>) => {
      state.ndaSigned = action.payload;
    },
  },
});

export const {
  setStep,
  setCredentialType,
  setValidCredential,
  setCredentials,
  setLoginCredentialType,
  setShowConfirmation,
  setSurveyCompleted,
  resetFlow,
  setEligibility,
} = registrationSlice.actions;

export default registrationSlice.reducer;
