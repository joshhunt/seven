export enum LogLevel {
  None = 0,
  Normal = 1,
  Verbose = 2,
}

type LogSignature = (content: any, ...optional: any[]) => number;

export interface ILogger {
  log: LogSignature;
  logVerbose: LogSignature;
  warn: LogSignature;
  warnVerbose: LogSignature;
  error: LogSignature;
  errorVerbose: LogSignature;

  setLogLevel: (level: LogLevel) => void;
}

export class BaseLogger implements ILogger {
  protected readonly logsInFlight: string[] = [];

  protected readonly base_log = Function.prototype.bind.call(
    console.log,
    console
  );
  protected readonly base_logVerbose = Function.prototype.bind.call(
    console.debug,
    console
  );
  protected readonly base_warn = Function.prototype.bind.call(
    console.warn,
    console
  );
  protected readonly base_warnVerbose = Function.prototype.bind.call(
    console.warn,
    console
  );
  protected readonly base_error = Function.prototype.bind.call(
    console.error,
    console
  );
  protected readonly base_errorVerbose = Function.prototype.bind.call(
    console.error,
    console
  );

  public log = (content: any, ...optional: any[]) => 0;
  public logVerbose = (content: any, ...optional: any[]) => 0;
  public warn = (content: any, ...optional: any[]) => 0;
  public warnVerbose = (content: any, ...optional: any[]) => 0;
  public error = (
    error: Error | any,
    sendToServer = true,
    ...optional: any[]
  ) => 0;
  public errorVerbose = (content: any, ...optional: any[]) => 0;

  constructor(protected readonly prefix: string) {
    //I hate just setting this here, but it's the only way to get the default log level to be verbose in local environments, if this is not suppressed, part of the dom tree doesn't render
    //eslint-disable-next-line no-restricted-globals
    const logLevelDefault = location.hostname.endsWith("local")
      ? LogLevel.Verbose
      : LogLevel.None;
    this.setLogLevel(logLevelDefault);
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
