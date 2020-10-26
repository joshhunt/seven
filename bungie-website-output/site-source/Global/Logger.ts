// tslint:disable: variable-name
import { Renderer } from "@Platform";
import { mapStackTrace } from "@bungie/sourcemapped-stacktrace";
import { DetailedError } from "@CustomErrors";
import { RendererLogLevel, SpamReductionLevel } from "@Enum";
import { StringUtils, StringCompareOptions } from "@Utilities/StringUtils";
import { FetchUtils } from "@Utilities/FetchUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";

enum LogType {
  Message,
  Warning,
  Error,
}

export enum LogLevel {
  None = 0,
  Normal = 1,
  Verbose = 2,
}

type LogSignature = (content: any, ...optional: any[]) => null;

export interface ILogger {
  log: LogSignature;
  logVerbose: LogSignature;
  warn: LogSignature;
  warnVerbose: LogSignature;
  error: LogSignature;
  errorVerbose: LogSignature;

  logToServer(logThis: Error | string, logLevel: RendererLogLevel);

  setLogLevel(level: LogLevel);
}

class LoggerInternal implements ILogger {
  public static Instance = new LoggerInternal("Blam");

  private readonly logsInFlight: string[] = [];

  private readonly base_log = Function.prototype.bind.call(
    console.log,
    console
  );
  private readonly base_logVerbose = Function.prototype.bind.call(
    console.debug,
    console
  );
  private readonly base_warn = Function.prototype.bind.call(
    console.warn,
    console
  );
  private readonly base_warnVerbose = Function.prototype.bind.call(
    console.warn,
    console
  );
  private readonly base_error = Function.prototype.bind.call(
    console.error,
    console
  );
  private readonly base_errorVerbose = Function.prototype.bind.call(
    console.error,
    console
  );

  public log = (content: any, ...optional: any[]) => null;
  public logVerbose = (content: any, ...optional: any[]) => null;
  public warn = (content: any, ...optional: any[]) => null;
  public warnVerbose = (content: any, ...optional: any[]) => null;
  public error = (
    error: Error | any,
    sendToServer = true,
    ...optional: any[]
  ) => null;
  public errorVerbose = (content: any, ...optional: any[]) => null;

  private constructor(private readonly prefix: string) {
    const logLevelDefault = location.hostname.endsWith("local")
      ? LogLevel.Verbose
      : LogLevel.None;
    this.setLogLevel(logLevelDefault);
  }

  public create(prefix: string): ILogger {
    return new LoggerInternal(prefix);
  }

  public async logToServer(
    logThis: Error | ErrorEvent | string,
    logLevel: RendererLogLevel = RendererLogLevel.Error
  ) {
    let message = logThis as string,
      stack = null;

    let spamReduction = SpamReductionLevel.Default;

    if (logThis instanceof DetailedError) {
      spamReduction = logThis.spamReductionLevel;
    }

    if (logThis instanceof Error) {
      message = logThis.message;
      stack = logThis.stack;
    }

    if (logThis instanceof ErrorEvent) {
      message = logThis.message;
      stack = `at ${logThis.filename}:${logThis.lineno}:${logThis.colno}`;
    }

    if (this.logsInFlight.indexOf(message) > -1) {
      // Already logged this error and it hasn't finished sending yet
      return;
    }

    this.logsInFlight.push(message);

    // This is our test to see if the error was in our code.
    const matchesSourcePath =
      stack &&
      StringUtils.contains(stack, "7/", StringCompareOptions.IgnoreCase);
    if (!matchesSourcePath) {
      return;
    }

    const mappedStack = await LoggerInternal.getStack(stack);

    const input: Renderer.ServerLogRequest = {
      Url: location.href,
      LogLevel: logLevel,
      Message: message,
      Stack: mappedStack,
      SpamReductionLevel: spamReduction,
    };

    FetchUtils.ServerLog(input).then(() => {
      // Remove this message from the list
      this.logsInFlight.splice(this.logsInFlight.indexOf(message), 1);
    });
  }

  private static getStack(ogStack: string) {
    return new Promise<string>((resolve) => {
      if (!ogStack) {
        Promise.resolve(null);

        return;
      }

      const sourceMapUrlTransform = ConfigUtils.EnvironmentIsLocal
        ? undefined
        : (url: string) => {
            return url.replace("static/js/", "static/js/maps/");
          };

      mapStackTrace(
        ogStack,
        (remapped: string[]) => {
          const mappedStack = remapped.join("\r\n");

          resolve(mappedStack);
        },
        {
          sourceMapUrlTransform,
        }
      );
    });
  }

  public setLogLevel(level: LogLevel) {
    this.log = Function.prototype.bind.call(
      this.base_log,
      console,
      `${this.prefix}:`
    );
    this.logVerbose = Function.prototype.bind.call(
      this.base_logVerbose,
      console,
      `${this.prefix}:`
    );
    this.warn = Function.prototype.bind.call(
      this.base_warn,
      console,
      `${this.prefix}:`
    );
    this.warnVerbose = Function.prototype.bind.call(
      this.base_warnVerbose,
      console,
      `${this.prefix}:`
    );
    this.error = Function.prototype.bind.call(
      this.base_error,
      console,
      `${this.prefix}:`
    );
    this.errorVerbose = Function.prototype.bind.call(
      this.base_errorVerbose,
      console,
      `${this.prefix}:`
    );

    if (level < LogLevel.Verbose) {
      this.logVerbose = (...args: any[]) => null;
      this.warnVerbose = (...args: any[]) => null;
      this.errorVerbose = (...args: any[]) => null;
    }

    if (level < LogLevel.Normal) {
      this.log = (...args: any[]) => null;
      this.warn = (...args: any[]) => null;
      this.error = (...args: any[]) => null;
    }
  }
}

export const Logger = LoggerInternal.Instance;

window.onerror = (
  event: string,
  source: string,
  fileno: number,
  column,
  error: Error
) => {
  if (!(error instanceof Request)) {
    Logger.logToServer(error);
  }
};

window["enableLogging"] = () => {
  Logger.setLogLevel(LogLevel.Verbose);
};
