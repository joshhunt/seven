"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayEnvironmentFactory = void 0;
const relay_runtime_1 = require("relay-runtime");
class RelayEnvironmentFactory {
  /**
   * Create a new RelayEnvironmentFactory
   * @param {RelayEnvironmentFactoryParams} params
   */
  constructor(params) {
    this.params = params;
    this.contentStackGraphQlFetcher = async (query, variables) => {
      const { deliveryToken, environment, apiKey } = this.params;
      const hostName = this.hostName;
      // Get the response as JSON
      return await this.fetchFromContentStack(
        hostName,
        apiKey,
        deliveryToken,
        environment,
        query,
        variables
      );
    };
    this.fetchFromContentStack = async (
      hostname,
      apiKey,
      deliveryToken,
      environment,
      query,
      variables
    ) => {
      const response = await fetch(
        `https://${hostname}/stacks/${apiKey}?environment=${environment}`,
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
    this.fetchRelay = (params, variables) => {
      if (!params.text) {
        throw new Error("Query not provided to ContentStackRelayEnvironment.");
      }
      return this.contentStackGraphQlFetcher(params.text, variables);
    };
  }
  get hostName() {
    return this.params.hostName ?? "graphql.contentstack.com";
  }
  /**
   * Create the environment for use with `RelayEnvironmentProvider`
   * @returns {Environment}
   */
  create() {
    return new relay_runtime_1.Environment({
      network: relay_runtime_1.Network.create(this.fetchRelay),
      store: new relay_runtime_1.Store(new relay_runtime_1.RecordSource()),
    });
  }
}
exports.RelayEnvironmentFactory = RelayEnvironmentFactory;
//# sourceMappingURL=RelayEnvironmentFactory.js.map
