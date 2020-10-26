import { DataStore } from "@Global/DataStore";
import React from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";
import { Localizer } from "@Global/Localizer";

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
    const exoticTrailerYoutubeId = this.trailerJsonParamToLocalizedValue(
      "ExoticTrailer"
    );
    const heroTrailerYoutubeId = this.trailerJsonParamToLocalizedValue(
      "HeroTrailer"
    );
    const prophecyTrailerYoutubeId = this.trailerJsonParamToLocalizedValue(
      "ProphecyTrailer"
    );
    const ranksTrailerYoutubeId = this.trailerJsonParamToLocalizedValue(
      "RanksTrailer"
    );

    this.update({
      exoticTrailerYoutubeId,
      heroTrailerYoutubeId,
      prophecyTrailerYoutubeId,
      ranksTrailerYoutubeId,
    });
  }

  public addIdElementMapping = (element: HTMLElement, id: string) => {
    if (!(id in this.state.idToElementsMapping)) {
      this.update({
        idToElementsMapping: {
          ...this.state.idToElementsMapping,
          ...{ [id]: element },
        },
      });
    }
  };

  public setHeroRef(ref: HTMLElement) {
    this.update({
      heroRef: ref,
    });
  }

  private trailerJsonParamToLocalizedValue(paramName: string): string | null {
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
