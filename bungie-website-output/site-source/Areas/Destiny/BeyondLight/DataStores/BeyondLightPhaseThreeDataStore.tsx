// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React from "react";
import { Localizer } from "@Global/Localization/Localizer";
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

  public async initialize() {
    if (
      this.initialized &&
      this.initialLocale === Localizer.CurrentCultureName
    ) {
      return;
    }

    this.initialized = true;
    this.initialLocale = Localizer.CurrentCultureName;

    this.actions.updateActive(ConfigUtils.SystemStatus("BeyondLightPhase3"));
    await this.actions.getStrings();
  }

  public actions = this.createActions({
    /**
     * Sets the phase active state
     * @param active
     */
    updateActive: (active: boolean) => ({ phaseThreeActive: active }),
    /**
     * Download strings
     */
    getStrings: async () => {
      return Platform.ContentService.GetContentByTagAndType(
        "bl-phase-three",
        "StringCollection",
        Localizer.CurrentCultureName,
        false
      )
        .then((rawAllPhaseData) => {
          return {
            phaseThree: LocalizerUtils.stringCollectionToObject(
              rawAllPhaseData
            ),
            loaded: true,
          };
        })
        .catch(() => void 0);
    },
  });
}

export const BeyondLightPhaseThreeDataStore =
  _BeyondLightPhaseThreeDataStore.Instance;
