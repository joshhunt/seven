// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React from "react";
import { Localizer } from "@bungie/localization";
import { Content, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { DataStore } from "@bungie/datastore";

export interface BeyondLightPhaseFourDataStorePayload {
  phaseFourActive: boolean;
  phaseFour: { [key: string]: string };
  loaded: boolean;
}

class _BeyondLightPhaseFourDataStore extends DataStore<
  BeyondLightPhaseFourDataStorePayload
> {
  private initialized = false;
  private initialLocale = "";

  public static Instance = new _BeyondLightPhaseFourDataStore({
    phaseFourActive: false,
    phaseFour: {},
    loaded: false,
  });

  /**
   * Returns true if the requested phase has strings
   * @param phase
   */
  public phaseActive(phase: keyof BeyondLightPhaseFourDataStorePayload) {
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

    this.actions.updateActive(ConfigUtils.SystemStatus("BeyondLightPhase4"));

    this.actions.getStrings();
  }

  public actions = this.createActions({
    /**
     * Set this phase active
     * @param active
     */
    updateActive: (active: boolean) => ({
      phaseFourActive: active,
    }),
    /**
     * Download strings
     */
    getStrings: async () => {
      const rawAllPhaseData = await Platform.ContentService.GetContentByTagAndType(
        "bl-phase-four",
        "StringCollection",
        Localizer.CurrentCultureName,
        false
      );

      const data = LocalizerUtils.stringCollectionToObject(rawAllPhaseData);

      return {
        phaseFour: data ?? {},
        loaded: true,
      };
    },
  });
}

export const BeyondLightPhaseFourDataStore =
  _BeyondLightPhaseFourDataStore.Instance;
