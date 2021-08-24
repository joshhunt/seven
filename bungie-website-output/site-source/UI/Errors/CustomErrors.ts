// tslint:disable: max-classes-per-file
// Disabling max-classes because this file is specifically meant to include a lot of them

import { PlatformResponse } from "@ApiIntermediary";
import { PlatformErrorCodes, SpamReductionLevel } from "@Enum";
import { Localizer } from "@bungie/localization";

/**
 * A special error with a title and a message
 * */
export class DetailedError extends Error {
  public logTitle: string;
  public logMessage: string;
  public logDetail: any[];
  public readonly detail: any[];
  public readonly spamReductionLevel: SpamReductionLevel;

  constructor(
    public readonly title: string,
    public readonly message: string,
    spamReductionLevel: SpamReductionLevel = SpamReductionLevel.Default,
    ...detail: any[]
  ) {
    super(message);

    this.logTitle = title;
    this.logMessage = message;
    this.detail = detail;
    this.logDetail = detail;
    this.spamReductionLevel = spamReductionLevel;

    Object.setPrototypeOf(this, DetailedError.prototype);
  }
}

/** A system is disabled */
export class SystemDisabledError extends DetailedError {
  constructor(public readonly systemName: string) {
    super(
      Localizer.Errors.SystemDisabledTitle,
      Localizer.Errors.SystemDisabled,
      SpamReductionLevel.Major,
      systemName
    );

    Object.setPrototypeOf(this, SystemDisabledError.prototype);
  }
}

/** Throw when a page is not found */
export class PageDoesNotExistError extends DetailedError {
  constructor() {
    super(Localizer.Errors.PageNotFoundTitle, Localizer.Errors.PageNotFound);

    Object.setPrototypeOf(this, PageDoesNotExistError.prototype);
  }
}

export class NotFoundError extends DetailedError {
  constructor() {
    super("Content Not Found", "The requested content does not exist");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/** Platform errors */
export class PlatformError extends DetailedError {
  public response: any;
  public errorCode: PlatformErrorCodes;
  public throttleSeconds: number;
  public errorStatus: string;
  public messageData: any;

  constructor(error: PlatformResponse) {
    super(
      Localizer.Messages.PlatformErrorTitle,
      `${error.Message} (${error.ErrorCode})`,
      undefined,
      error
    );

    this.response = error.Response;
    this.errorCode = error.ErrorCode;
    this.throttleSeconds = error.ThrottleSeconds;
    this.errorStatus = error.ErrorStatus;
    this.messageData = error.MessageData;

    Object.setPrototypeOf(this, PlatformError.prototype);
  }
}

/** Props provided are not valid for the component */
export class InvalidPropsError extends DetailedError {
  constructor(message: string, ...detail: any[]) {
    super("Invalid Props", message, undefined, detail);

    Object.setPrototypeOf(this, PlatformError.prototype);
  }
}

export class DefinitionNotFoundError extends DetailedError {
  constructor(hash: string | number, type: string, ...detail: any[]) {
    super(
      Localizer.Errors.DefinitionNotFoundTitle,
      Localizer.Format(Localizer.Errors.DefinitionNotFound, {
        type: type,
        hash: hash,
      }),
      undefined,
      detail
    );

    Object.setPrototypeOf(this, PlatformError.prototype);
  }
}

export class FailedToLoadError extends DetailedError {
  constructor(itemName: string, specificMessage: string) {
    super(
      Localizer.Format(Localizer.Errors.ItemFailedLoad, { item: itemName }),
      specificMessage
    );

    Object.setPrototypeOf(this, PlatformError.prototype);
  }
}

export class SeoDataError extends DetailedError {
  constructor(propertyName: string[]) {
    super(
      "SEO data missing in BungieHelmet",
      `${propertyName.join(", ")} not populated.`,
      SpamReductionLevel.Minor
    );

    Object.setPrototypeOf(this, SeoDataError.prototype);
  }
}
