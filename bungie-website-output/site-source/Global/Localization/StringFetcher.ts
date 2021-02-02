import { DetailedError } from "@CustomErrors";
import { DataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { BuildVersion } from "@Helpers";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FetchUtils } from "@Utilities/FetchUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";

class StringFetcherInternal extends DataStore<{
  loaded: boolean;
  started: boolean;
}> {
  public static Instance = new StringFetcherInternal({
    loaded: false,
    started: false,
  });

  public actions = this.createActions({
    /**
     * Set the loaded state
     * @param loaded
     */
    setLoaded: (loaded: boolean) => ({ loaded }),
    /**
     * Set the started state
     * @param started
     */
    setStarted: (started: boolean) => ({ started }),
  });

  public async fetch(force = false) {
    if (!force && this.state.started) {
      return;
    }

    if (window["__localizer"] !== undefined && !force) {
      this.actions.setLoaded(true);

      return;
    }

    this.actions.setLoaded(false);
    this.actions.setStarted(true);

    const loc = Localizer.CurrentCultureName;
    const lcin = LocalizerUtils.locInherit ? "True" : "False";

    // Locally, we don't want to have to wait for the string cache to update
    const cacheString = ConfigUtils.EnvironmentIsLocal
      ? Date.now()
      : BuildVersion;

    const jsonUrl = `/JsonLocalizer.ashx?lc=${loc}&lcin=${lcin}&nc=true&bv=${cacheString}`;

    return FetchUtils.FetchJson(new Request(jsonUrl))
      .then((data) => {
        window["__localizer"] = data;

        this.actions.setLoaded(true);
      })
      .catch(() => {
        throw new DetailedError(
          "Unable to load localization.",
          `Attempted to load ${Localizer.CurrentCultureName} strings.`
        );
      });
  }
}

export const StringFetcher = StringFetcherInternal.Instance;
