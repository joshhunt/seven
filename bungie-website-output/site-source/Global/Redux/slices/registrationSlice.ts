// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { Contract, GroupsV2 } from "@Platform";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  currentStep: number;
  selectedMembershipType: BungieMembershipType | null;
  validAlphaMembership: GroupsV2.GroupUserInfoCard | null;
  memberships: GroupsV2.GroupUserInfoCard[];
  loginMembershipType: BungieMembershipType | null;
  showConfirmation: boolean;
  emailVerified: boolean;
  surveyCompleted: boolean;
  ndaSigned: boolean;
  eligible: boolean;
}

const initialState: RegistrationState = {
  currentStep: 0,
  selectedMembershipType: null,
  validAlphaMembership: null,
  memberships: [],
  loginMembershipType: null,
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
    setMembershipType: (
      state,
      action: PayloadAction<BungieMembershipType | null>
    ) => {
      state.selectedMembershipType = action.payload;
    },
    setValidMembership: (
      state,
      action: PayloadAction<GroupsV2.GroupUserInfoCard | null>
    ) => {
      state.validAlphaMembership = action.payload;
    },
    setMemberships: (
      state,
      action: PayloadAction<GroupsV2.GroupUserInfoCard[]>
    ) => {
      state.memberships = action.payload;
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
    setLoginMembershipType: (
      state,
      action: PayloadAction<BungieMembershipType | null>
    ) => {
      state.loginMembershipType = action.payload;
    },
    setNdaSigned: (state, action: PayloadAction<boolean>) => {
      state.ndaSigned = action.payload;
    },
  },
});

export const {
  setStep,
  setMembershipType,
  setValidMembership,
  setMemberships,
  setLoginMembershipType,
  setShowConfirmation,
  setSurveyCompleted,
  resetFlow,
  setEligibility,
} = registrationSlice.actions;

export default registrationSlice.reducer;
