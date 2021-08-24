// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DataStore } from "@bungie/datastore";

export type SmsVerificationPhases = "PhoneEntry" | "CodeEntry" | "Verified";

interface SmsDataStorePayload {
  verificationPhase: SmsVerificationPhases;
  lastDigits: string;
}

class SmsDataStoreInternal extends DataStore<SmsDataStorePayload> {
  public static Instance = new SmsDataStoreInternal({
    verificationPhase: "PhoneEntry",
    lastDigits: "",
  });

  public actions = this.createActions({
    /**
     * Update the last 4 digits
     * @param lastDigits
     */
    updateLastDigits: (lastDigits: string) => ({ lastDigits }),
    /**
     * Set the current phase of the verification flow
     * @param phase
     */
    updatePhase: (phase: SmsVerificationPhases) => ({
      verificationPhase: phase,
    }),
  });
}

export const SmsDataStore = SmsDataStoreInternal.Instance;

SmsDataStore.actions.updateLastDigits("");
