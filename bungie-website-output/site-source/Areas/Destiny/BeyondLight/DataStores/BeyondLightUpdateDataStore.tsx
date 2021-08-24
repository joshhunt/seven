// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Content, Platform } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import * as React from "react";
import { DataStore } from "@bungie/datastore";

export interface BeyondLightUpdateDataStorePayload {
  phaseOneActive: boolean;
  phaseOne: { [key: string]: string };
  phaseOneA: { [key: string]: string };
  phaseOneB: { [key: string]: string };
  phaseOneC: { [key: string]: string };
  homepage: { [key: string]: string };
  loaded: boolean;
}

class _BeyondLightUpdateDataStore extends DataStore<
  BeyondLightUpdateDataStorePayload
> {
  private initialized = false;
  private initialLocale = "";

  public static Instance = new _BeyondLightUpdateDataStore({
    phaseOneActive: true,
    phaseOne: {},
    phaseOneA: {},
    phaseOneB: {},
    phaseOneC: {},
    homepage: {},
    loaded: false,
  });

  /**
   * Returns true if the requested phase has strings
   * @param phase
   */
  public phaseActive(phase: keyof BeyondLightUpdateDataStorePayload) {
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

    this.actions.updateActive(ConfigUtils.SystemStatus("BeyondLightPhase1"));
    await this.actions.getStrings();
  }

  public actions = this.createActions({
    /**
     * Sets the phase active state
     * @param active
     */
    updateActive: (active: boolean) => ({ phaseOneActive: active }),
    /**
     * Download strings
     */
    getStrings: () => {
      const firehosePhaseTags = [
        "phaseone",
        "bl-phase-one-a",
        "bl-phase-one-b",
        "bl-phase-one-c",
        "bl-update",
      ];

      // Load all items, and if they fail, just ignore it.
      const promises: Promise<
        Content.ContentItemPublicContract
      >[] = firehosePhaseTags.map((phaseTag) =>
        Platform.ContentService.GetContentByTagAndType(
          phaseTag,
          "StringCollection",
          Localizer.CurrentCultureName,
          false
        ).catch(() => void 0)
      );

      return Promise.all(promises).then((rawAllPhaseData) => {
        const transformed = rawAllPhaseData.map((rawPhase) =>
          LocalizerUtils.stringCollectionToObject(rawPhase)
        );

        return {
          phaseOne: transformed[0] ?? {},
          phaseOneA: transformed[1] ?? {},
          phaseOneB: transformed[2] ?? {},
          phaseOneC: transformed[3] ?? {},
          homepage: transformed[4] ?? {},
          loaded: true,
        };
      });
    },
  });
}

export const BeyondLightUpdateDataStore = _BeyondLightUpdateDataStore.Instance;
