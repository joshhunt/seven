import { BungieNetRelayEnvironmentPreset } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetRelayEnvironmentPreset";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Entry, Stack } from "contentstack";

let client: Stack | undefined = undefined;

class _ClientWrapper {
  public static client(): Stack {
    if (!client) {
      throw new Error(
        "ContentStack client has not been initialized. Run InitializeContentStackClient() with the appropriate parameters."
      );
    }

    return client;
  }
}

export const InitializeContentStackClient = () => {
  const {
    deliveryToken,
    environment,
    apiKey,
  } = BungieNetRelayEnvironmentPreset({
    cachedSettingsObject: GlobalStateDataStore.state.coreSettings,
  });

  client = Stack(apiKey, deliveryToken, environment);
};

export const useLazyLoadEntry = (entry: Entry) => {
  return entry.fetch();
};

export const ContentStackClient = _ClientWrapper.client;
