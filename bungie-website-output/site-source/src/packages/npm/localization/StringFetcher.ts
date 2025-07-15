import { DataStore } from "@bungie/datastore";
import { Localizer } from "./Localizer";
import LocalizationState from "./LocalizationState";

export const STRING_FETCHER_CACHE_TIME_MS = 15000;

export interface StringFetcherPayload {
  loaded: boolean;
  started: boolean;
}

class StringFetcherInternal extends DataStore<StringFetcherPayload> {
  public static Instance = new StringFetcherInternal({
    loaded: false,
    started: false,
  });

  public actions = this.createActions({
    /**
     * Set the loaded state
     * @param state
     * @param loaded
     */
    setLoaded: (state, loaded: boolean) => ({ loaded }),
    /**
     * Set the started state
     * @param state
     * @param started
     */
    setStarted: (state, started: boolean) => ({ started }),
  });

  private get cacheString() {
    return Math.floor(Date.now() / STRING_FETCHER_CACHE_TIME_MS).toString();
  }

  private responseToJson(response: Response) {
    if (!response.ok) {
      throw new Error(`Fetch failure: ${response.status}`);
    }

    // No Content
    if (response.status === 204) {
      return Promise.resolve(null);
    }

    const jsonResponse: Promise<any> = response.json();

    return jsonResponse;
  }

  private shouldSkipFetch(force: boolean, existingStrings: any | undefined) {
    if (!force) {
      if (this.state.started) {
        return true;
      }

      if (existingStrings !== undefined) {
        this.actions.setLoaded(true);

        return true;
      }
    }

    return false;
  }

  public async fetch(force = false) {
    if (this.shouldSkipFetch(force, (window as any)["__localizer"])) {
      return;
    }

    this.actions.setLoaded(false);
    this.actions.setStarted(true);

    const loc = Localizer.CurrentCultureName;

    const jsonUrl = `/JsonLocalizer.ashx?lc=${loc}&lcin=${LocalizationState.locInherit}&nc=true&bv=${this.cacheString}`;

    return fetch(jsonUrl)
      .then(this.responseToJson)
      .then((data) => {
        (window as any)["__localizer"] = data;

        this.actions.setLoaded(true);
      })
      .catch(() => {
        throw new Error(
          `Unable to load localization. Attempted to load ${Localizer.CurrentCultureName} strings.`
        );
      });
  }
}

export type StringFetcherClass = StringFetcherInternal;
export const StringFetcher = StringFetcherInternal.Instance;
