// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React from "react";
import { Localizer } from "@Global/Localizer";
import { Content, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { DataStore } from "@Global/DataStore";

export interface BeyondLightPhaseThreeDataStorePayload {
  phaseThreeActive: boolean;
  phaseThree: { [key: string]: string };
  loaded: boolean;
}

class _BeyondLightPhaseThreeDataStore extends DataStore<
  BeyondLightPhaseThreeDataStorePayload
> {
  private initialized = false;
  private initialLocale = "";

  public static Instance = new _BeyondLightPhaseThreeDataStore({
    phaseThreeActive: false,
    phaseThree: {},
    loaded: false,
  });

  /**
   * Returns true if the requested phase has strings
   * @param phase
   */
  public phaseActive(phase: keyof BeyondLightPhaseThreeDataStorePayload) {
    return Object.keys(this.state[phase]).length > 0;
  }

  public initialize() {
    if (
      this.initialized &&
      this.initialLocale === Localizer.CurrentCultureName
    ) {
      return;
    }

    this.initialized = true;
    this.initialLocale = Localizer.CurrentCultureName;

    this.update({
      phaseThreeActive: ConfigUtils.SystemStatus("BeyondLightPhase3"),
    });

    this.fetchStrings();
  }

  private fetchStrings() {
    // Load all items, and if they fail, just ignore it.
    const promise: Promise<Content.ContentItemPublicContract> = Platform.ContentService.GetContentByTagAndType(
      "bl-phase-three",
      "StringCollection",
      Localizer.CurrentCultureName,
      false
    ).catch(() => void 0);

    Promise.resolve(promise).then((rawAllPhaseData) => {
      const data = LocalizerUtils.stringCollectionToObject(rawAllPhaseData);

      this.update({
        phaseThree: data,
        loaded: true,
      });
    });
  }
}

export const BeyondLightPhaseThreeDataStore =
  _BeyondLightPhaseThreeDataStore.Instance;
