// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React from "react";
import { Localizer } from "@bungie/localization";
import { Content, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { DataStore } from "@bungie/datastore";

export interface BeyondLightPhaseTwoDataStorePayload {
  phaseTwoActive: boolean;
  phaseTwo: { [key: string]: string };
  loaded: boolean;
}

class _BeyondLightPhaseTwoDataStore extends DataStore<
  BeyondLightPhaseTwoDataStorePayload
> {
  private initialized = false;
  private initialLocale = "";

  public static Instance = new _BeyondLightPhaseTwoDataStore({
    phaseTwoActive: false,
    phaseTwo: {},
    loaded: false,
  });

  /**
   * Returns true if the requested phase has strings
   * @param phase
   */
  public phaseActive(phase: keyof BeyondLightPhaseTwoDataStorePayload) {
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

    this.actions.updateActive(ConfigUtils.SystemStatus("BeyondLightPhase2"));
    await this.actions.getStrings();
  }

  public actions = this.createActions({
    /**
     * Sets the phase active state
     * @param active
     */
    updateActive: (active: boolean) => ({ phaseTwoActive: active }),
    /**
     * Download strings
     */
    getStrings: async () => {
      return Platform.ContentService.GetContentByTagAndType(
        "bl-phase-two",
        "StringCollection",
        Localizer.CurrentCultureName,
        false
      )
        .then((rawAllPhaseData) => {
          return {
            phaseTwo: LocalizerUtils.stringCollectionToObject(rawAllPhaseData),
            loaded: true,
          };
        })
        .catch(() => void 0);
    },
  });
}

export const BeyondLightPhaseTwoDataStore =
  _BeyondLightPhaseTwoDataStore.Instance;
