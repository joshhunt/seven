import { DataStore } from "@bungie/datastore";
import React from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";
import { Localizer } from "@bungie/localization";

export interface Season11DataStorePayload {
  idToElementsMapping: { [key: string]: HTMLElement };
  heroRef: HTMLElement | null;
  heroTrailerYoutubeId: string | null;
  prophecyTrailerYoutubeId: string | null;
  ranksTrailerYoutubeId: string | null;
  exoticTrailerYoutubeId: string | null;
}

class _Season11DataStore extends DataStore<Season11DataStorePayload> {
  public static Instance = new _Season11DataStore({
    idToElementsMapping: {},
    heroRef: null,
    exoticTrailerYoutubeId: null,
    heroTrailerYoutubeId: null,
    prophecyTrailerYoutubeId: null,
    ranksTrailerYoutubeId: null,
  });

  public initialize() {
    this.actions.setTrailerIds();
  }

  public actions = this.createActions({
    /**
     * Set the reference for the hero element
     * @param heroRef
     */
    setHeroRef: (state, heroRef: HTMLElement) => ({ heroRef }),
    /**
     * Get the parameter values from Webmaster for the trailer IDs
     */
    setTrailerIds: () => {
      return {
        exoticTrailerYoutubeId: _Season11DataStore.trailerJsonParamToLocalizedValue(
          "ExoticTrailer"
        ),
        heroTrailerYoutubeId: _Season11DataStore.trailerJsonParamToLocalizedValue(
          "HeroTrailer"
        ),
        prophecyTrailerYoutubeId: _Season11DataStore.trailerJsonParamToLocalizedValue(
          "ProphecyTrailer"
        ),
        ranksTrailerYoutubeId: _Season11DataStore.trailerJsonParamToLocalizedValue(
          "RanksTrailer"
        ),
      };
    },
    /**
     * Update the mapping of element IDs to element references, for subnav
     * @param element
     * @param id
     */
    mapIdToElement: (state, element: HTMLElement, id: string) => {
      return {
        ...this.state.idToElementsMapping,
        ...{ [id]: element },
      };
    },
  });

  private static trailerJsonParamToLocalizedValue(
    paramName: string
  ): string | null {
    const trailerString = ConfigUtils.GetParameter(
      SystemNames.Season11Page,
      paramName,
      "{}"
    ).replace(/'/g, '"');
    const trailerData = JSON.parse(trailerString);

    return (
      trailerData[Localizer.CurrentCultureName] ?? trailerData["en"] ?? null
    );
  }
}

export const Season11DataStore = _Season11DataStore.Instance;
