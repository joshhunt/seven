// tslint:disable: variable-name
// @ts-ignore
import { mapStackTrace } from "@bungie/sourcemapped-stacktrace";
import { DetailedError } from "@CustomErrors";
import { RendererLogLevel, SpamReductionLevel } from "@Enum";
import { BaseLogger, ILogger } from "@Global/BaseLogger";
import { Renderer } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FetchUtils } from "@Utilities/FetchUtils";
import { StringCompareOptions, StringUtils } from "@Utilities/StringUtils";

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

type LogSignature = (content: any, ...optional: any[]) => number;

export interface IServerLogger extends ILogger {
  logToServer: (logThis: Error | string, logLevel: RendererLogLevel) => void;
}

class LoggerInternal extends BaseLogger implements IServerLogger {
  public static Instance = new LoggerInternal("[BLAM]");

  constructor(prefix: string) {
    super(prefix);
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
