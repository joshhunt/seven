// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DataStore } from "@Global/DataStore";

export type verificationPhases = "PhoneEntry" | "CodeEntry" | "Verified";

interface SmsDataStorePayload {
  verificationPhase: verificationPhases;
  lastDigits: string;
}

class SmsDataStoreInternal extends DataStore<SmsDataStorePayload> {
  public static Instance = new SmsDataStoreInternal({
    verificationPhase: "PhoneEntry",
    lastDigits: "",
  });

  public updatePhase(phase: verificationPhases) {
    this.update({ verificationPhase: phase });
  }

  public updateLastDigits(digits: string) {
    this.update({ lastDigits: digits });
  }
}

export const SmsDataStore = SmsDataStoreInternal.Instance;
