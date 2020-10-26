import { DetailedError } from "@CustomErrors";
import { DataStore } from "./DataStore";
import React from "react";
import { StringUtils, StringCompareOptions } from "@Utilities/StringUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FetchUtils } from "@Utilities/FetchUtils";
import { BuildVersion } from "@Helpers";
import { UrlUtils } from "@Utilities/UrlUtils";

type FancyLocalizerDict = {
  validLocales?: ValidLocale[];
  CurrentCultureName?: string;
  CurrentCultureSpecific?: string;
  LocInherit?: "True" | "False";
  Format?: (val: string, params: { [key: string]: any }) => string;
  FormatReact?: (
    val: string,
    params: { [key: string]: React.ReactNode }
  ) => React.ReactNode;
  [key: string]: any;
};

const curly = new RegExp("{([a-z0-9]+)}", "gi");
const dollar = /\$\$([a-z0-9]+)\$\$/gi;

const format = (localizationString: string, replaceWith: any): string => {
  let matched,
    regexToUse: RegExp,
    formattedString = localizationString;

  if (formattedString.match(curly)) {
    regexToUse = curly;
  } else if (formattedString.match(dollar)) {
    regexToUse = dollar;
  }

  if (regexToUse) {
    // tslint:disable-next-line: no-conditional-assignment
    while ((matched = regexToUse.exec(localizationString))) {
      const replaceThis = matched[0];
      const replaceKey = matched[1];

      if (replaceWith[replaceKey] !== undefined) {
        formattedString = formattedString.replace(
          replaceThis,
          replaceWith[replaceKey]
        );
      }
    }
  }

  return formattedString;
};

const formatReact = (
  localizationString: string,
  replaceWith: any
): React.ReactNode => {
  let regexToUse: RegExp;

  if (localizationString.match(curly)) {
    regexToUse = curly;
  } else if (localizationString.match(dollar)) {
    regexToUse = dollar;
  }

  let result: React.ReactNode = localizationString;
  if (regexToUse) {
    const parts = localizationString.split(regexToUse);

    const resultParts = parts.map((part, i) => {
      let resultPart = part;
      if (replaceWith && part in replaceWith) {
        resultPart = replaceWith[part];
      }

      return <React.Fragment key={i}>{resultPart}</React.Fragment>;
    });

    result = resultParts;
  }

  return result;
};

const localizerProxy: FancyLocalizerDict = new Proxy(
  {},
  {
    get(_, propName: string, __) {
      const fileName = propName.toLowerCase();

      if (
        typeof __localizer !== "undefined" &&
        fileName in __localizer &&
        typeof __localizer[fileName] !== "object"
      ) {
        return __localizer[fileName];
      }

      if (
        StringUtils.equals(
          fileName,
          "CurrentCultureName",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return LocalizerUtils.currentCultureName;
      }

      if (
        StringUtils.equals(
          fileName,
          "CurrentCultureSpecific",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return LocalizerUtils.currentCultureSpecific;
      }

      if (
        StringUtils.equals(
          fileName,
          "LocInherit",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return LocalizerUtils.locInherit ? "True" : "False";
      }

      if (
        StringUtils.equals(
          fileName,
          "ValidLocales",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return __localizer.validLocales;
      }

      if (
        StringUtils.equals(
          fileName,
          "Format",
          StringCompareOptions.IgnoreCase
        ) ||
        StringUtils.equals(
          fileName,
          "fnStringReplace",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return new Proxy(format, {
          apply(target, thisArg, argumentsList) {
            return target(argumentsList[0], argumentsList[1]);
          },
        });
      }

      if (
        StringUtils.equals(
          fileName,
          "FormatReact",
          StringCompareOptions.IgnoreCase
        )
      ) {
        return new Proxy(formatReact, {
          apply(target, thisArg, argumentsList) {
            return target(argumentsList[0], argumentsList[1]);
          },
        });
      }

      const fileProxy = new Proxy(
        {},
        {
          get(___, stringName: string, ____) {
            let returnable = null;
            const fileStrings = __localizer[fileName];
            if (stringName === "__all") {
              return fileStrings;
            }

            const fixedStringName = stringName.toLowerCase();
            if (fileStrings) {
              const innerValue: string = fileStrings[fixedStringName];
              if (innerValue !== undefined) {
                returnable = innerValue;
              }
            }

            const debuggerOn = ConfigUtils.SystemStatus("LocalizerDebug");

            if (
              returnable === undefined ||
              (debuggerOn && UrlUtils.QueryToObject()._locDebug)
            ) {
              returnable = `##${fileName}.${stringName}##`;
            }

            return returnable;
          },
        }
      );

      return fileProxy;
    },
  }
);

export const Localizer: FancyLocalizerDict = localizerProxy;

class StringFetcherInternal extends DataStore<{
  loaded: boolean;
  started: boolean;
}> {
  public static Instance = new StringFetcherInternal({
    loaded: false,
    started: false,
  });

  public fetch(force = false) {
    if (!force && this.state.started) {
      return Promise.resolve();
    }

    if (window["__localizer"] !== undefined && !force) {
      this.update({ loaded: true });

      return Promise.resolve();
    }

    this.update({ loaded: false, started: true });

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
        this.update({ loaded: true });
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
