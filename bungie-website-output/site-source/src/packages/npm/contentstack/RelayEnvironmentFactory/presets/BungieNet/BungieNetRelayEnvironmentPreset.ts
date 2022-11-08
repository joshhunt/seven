"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BungieNetRelayEnvironmentPresetAsync = exports.BungieNetRelayEnvironmentPreset = void 0;
const getHostName = (reverseProxy) => {
  let hostName;
  if (reverseProxy) {
    const proxyEnabled = reverseProxy.enabled;
    // Ensure we've done the steps to actually set up the CloudFlare proxy.
    // This is here to prevent us from simply enabling the proxy system without knowing that it's actually set up and working.
    const cloudflareConfigured =
      reverseProxy.parameters.CloudflareReverseProxyIsConfigured === "true";
    const reverseProxyHost = reverseProxy.parameters.ReverseProxyHost;
    // Enabling switching between a proxy and the normal hostname
    if (proxyEnabled && cloudflareConfigured && reverseProxyHost) {
      hostName = reverseProxyHost;
    }
  }
  return hostName;
};
const getConfigurationAsync = async (bnetEnvironmentHostName) => {
  const commonSettings = await fetchCommonSettings(bnetEnvironmentHostName);
  return getConfiguration(bnetEnvironmentHostName, commonSettings);
};
const getConfiguration = (bnetEnvironmentHostName, cachedSettingsObject) => {
  const config = {
    enabled: false,
  };
  const commonSettings = cachedSettingsObject;
  if (!commonSettings.systems) {
    throw new Error("Settings object does not include systems data.");
  }
  const { systems } = commonSettings;
  const contentStackSystem = systems.ContentStack;
  const reverseProxySystem = systems.ContentStackFetchReverseProxy;
  if (reverseProxySystem) {
    config.reverseProxy = reverseProxySystem;
  }
  if (contentStackSystem) {
    const { ApiKey, EnvPlusDeliveryToken } = contentStackSystem.parameters;
    if (!ApiKey) {
      throw new Error("No ContentStack API key present");
    }
    const { deliveryToken, environment } = parseEnvAndDeliveryToken(
      EnvPlusDeliveryToken
    );
    config.apiKey = String(ApiKey);
    config.environment = environment;
    config.deliveryToken = deliveryToken;
    config.enabled = contentStackSystem.enabled;
  } else {
    throw new Error("Could not load ContentStack system from CommonSettings.");
  }
  return config;
};
const fetchCommonSettings = (bnetEnvironmentHostName) => {
  return fetch(`https://${bnetEnvironmentHostName}/Platform/Settings`)
    .then((response) => response.json())
    .then((json) => json.Response);
};
const parseEnvAndDeliveryToken = (envPlusDeliveryToken) => {
  const envPlusDeliveryTokenRegex = /{(.*)}{(.*)}/gi;
  if (!envPlusDeliveryToken) {
    throw new Error(
      "ContentStack environment and delivery token not provided."
    );
  }
  let environment, deliveryToken;
  try {
    /**
     * Why the hell are we doing this? Good question! The environment and delivery token always go together.
     * You can't use a delivery token for another environment, so it's important that the one you're using
     * matches the environment you specify here. But because these are defined in configuration far away
     * from where they are used, I wanted to make it clear to anyone editing the configuration that BOTH
     * values needed to be updated.
     */
    const tuple = envPlusDeliveryTokenRegex.exec(envPlusDeliveryToken);
    if (!tuple) {
      throw new Error(
        "Invalid EnvPlusDeliveryToken. Format must be {environment}{token}."
      );
    }
    environment = tuple[1];
    deliveryToken = tuple[2];
  } catch (e) {
    throw new Error(
      "Unable to parse environment and/or delivery token: " + e.message
    );
  }
  return {
    environment,
    deliveryToken,
  };
};
const presetAsync = async (params) => {
  const { bnetEnvironmentHostName } = params ?? {};
  const hostNameOrDefault = bnetEnvironmentHostName ?? "www.bungie.net";
  const {
    environment,
    deliveryToken,
    apiKey,
    reverseProxy,
  } = await getConfigurationAsync(hostNameOrDefault);
  const hostName = getHostName(reverseProxy);
  return {
    hostName,
    environment,
    apiKey,
    deliveryToken,
  };
};
const preset = (params) => {
  const { bnetEnvironmentHostName, cachedSettingsObject } = params ?? {};
  if (!cachedSettingsObject) {
    throw new Error(
      "BungieNetRelayEnvironmentPreset must included a cachedSettingsObject. Otherwise, BungieNetRelayEnvironmentPresetAsync can be used to fetch settings."
    );
  }
  const hostNameOrDefault = bnetEnvironmentHostName ?? "www.bungie.net";
  const { environment, deliveryToken, apiKey, reverseProxy } = getConfiguration(
    hostNameOrDefault,
    cachedSettingsObject
  );
  const hostName = getHostName(reverseProxy);
  return {
    hostName,
    environment,
    apiKey,
    deliveryToken,
  };
};
exports.BungieNetRelayEnvironmentPreset = preset;
exports.BungieNetRelayEnvironmentPresetAsync = presetAsync;
//# sourceMappingURL=BungieNetRelayEnvironmentPreset.js.map
