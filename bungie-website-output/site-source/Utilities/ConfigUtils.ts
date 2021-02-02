import { DetailedError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Logger } from "@Global/Logger";
import { ValidSystemNames } from "@Global/SystemNames";
import { Environment } from "@Helpers";

export class ConfigUtils {
  /** Gets the current site environment */
  public static get Environment(): Environment {
    return this._environment;
  }

  /** If true, we are in production */
  public static get EnvironmentIsProduction() {
    return this._environment === "live" || this._environment === "beta";
  }

  /** If true, we are in production */
  public static get EnvironmentIsLocal() {
    return this._environment === "local";
  }

  private static get coreSettings() {
    const coreSettings =
      GlobalStateDataStore.state && GlobalStateDataStore.state.coreSettings;
    if (!coreSettings) {
      throw new DetailedError(
        "Settings Unavailable",
        "Attempted to access CoreSettings, but it does not exist"
      );
    }

    return coreSettings;
  }

  private static _environment: Environment = null;
  /**
   * Returns true if the system with the given name is enabled
   * @param coreSettings
   * @param systemName
   */
  public static SystemStatus(systemName: ValidSystemNames) {
    const coreSettings = ConfigUtils.coreSettings;

    const system = coreSettings.systems[systemName];

    return system ? system.enabled : false;
  }

  /**
   * Get a parameter out of config
   * @param coreSettings Core Settings
   * @param systemName The name of the system
   * @param parameterName The name of the parameter in that system
   * @param defaultValue If no value is found, use this one instead
   */
  public static GetParameter<T>(
    systemName: ValidSystemNames,
    parameterName: string,
    defaultValue: T
  ): T {
    const coreSettings = ConfigUtils.coreSettings;

    const system = coreSettings.systems[systemName];
    let parameter;
    if (system) {
      if (system.parameters) {
        parameter = system.parameters[parameterName];
        if (parameter === undefined) {
          Logger.error(
            new DetailedError(
              "Parameter not found",
              `${parameterName} does not exist in system ${systemName}. Is it set to be external?`
            )
          );
        }
      }
    } else {
      Logger.error(
        new DetailedError(
          "System not found",
          `${systemName} does not exist in configuration. Is it set to be external?`
        )
      );
    }

    return parameter !== undefined
      ? this.convertType(parameter, defaultValue)
      : defaultValue;
  }

  private static convertType<T>(input: string, defaultVal: T) {
    let output = null;
    switch (typeof defaultVal) {
      case "boolean":
        output = input === "true";
        break;
      case "number":
        output = Number(input);
        break;
      case "string":
        output = String(input);
        break;
      default:
        throw new TypeError(
          `Cannot convert value ${input} to type ${typeof defaultVal}`
        );
    }

    return output as T;
  }

  /**
   * Sets the current environment
   * @param environment
   */
  public static setEnvironment(environment: Environment) {
    this._environment = environment;
  }

  /**
   * Updates settings
   */
  public static updateSettings() {
    return GlobalStateDataStore.actions.refreshSettings();
  }
}
