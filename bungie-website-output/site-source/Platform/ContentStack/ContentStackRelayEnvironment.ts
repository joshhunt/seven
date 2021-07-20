import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Environment, Network, Store, RecordSource } from "relay-runtime";
import { RequestParameters } from "relay-runtime/lib/util/RelayConcreteNode";
import { Variables } from "relay-runtime/lib/util/RelayRuntimeTypes";

type GraphQlEnvironment = "live" | "development" | "preview";

const contentStackGraphQlFetcher = async (query: string, variables: any) => {
  const apiKey = ConfigUtils.GetParameter(
    SystemNames.ContentStack,
    "ApiKey",
    ""
  );
  // This value should follow the format: {environment}{deliveryToken}
  const envPlusDeliveryToken = ConfigUtils.GetParameter(
    SystemNames.ContentStack,
    "EnvPlusDeliveryToken",
    ""
  );
  // Parse out the values inside curly braces
  const envPlusDeliveryTokenRegex = /{(.*)}{(.*)}/gi;
  const envPlusDeliveryIsValid = envPlusDeliveryToken.match(
    envPlusDeliveryTokenRegex
  );

  if (!envPlusDeliveryToken || !envPlusDeliveryIsValid) {
    throw new Error(
      "ContentStack environment and/or delivery token is invalid"
    );
  }

  if (!apiKey) {
    throw new Error("No ContentStack API key present");
  }

  let environment: GraphQlEnvironment, deliveryToken: string;

  try {
    const tuple = envPlusDeliveryTokenRegex.exec(envPlusDeliveryToken);
    environment = tuple[1] as GraphQlEnvironment;
    deliveryToken = tuple[2];
  } catch (e) {
    throw new Error("Unable to parse environment and/or delivery token");
  }

  const proxyEnabled = ConfigUtils.SystemStatus(
    SystemNames.ContentStackFetchReverseProxy
  );

  // Ensure we've done the steps to actually set up the CloudFlare proxy.
  // This is here to prevent us from simply enabling the proxy system without knowing that it's actually set up and working.
  const cloudflareConfigured = ConfigUtils.GetParameter(
    SystemNames.ContentStackFetchReverseProxy,
    "CloudflareReverseProxyIsConfigured",
    false
  );

  // Enabling switching between a proxy and the normal hostname
  let contentStackGraphqlHostname = "graphql.contentstack.com";
  if (proxyEnabled && cloudflareConfigured) {
    contentStackGraphqlHostname = ConfigUtils.GetParameter(
      SystemNames.ContentStackFetchReverseProxy,
      "ReverseProxyHost",
      contentStackGraphqlHostname
    );
  }

  // Fetch data from GitHub's GraphQL API:
  const response = await fetch(
    `https://${contentStackGraphqlHostname}/stacks/${apiKey}?environment=${environment}`,
    {
      method: "POST",
      headers: {
        access_token: deliveryToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  // Get the response as JSON
  return await response.json();
};

const fetchRelay = (params: RequestParameters, variables: Variables) => {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return contentStackGraphQlFetcher(params.text, variables);
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
