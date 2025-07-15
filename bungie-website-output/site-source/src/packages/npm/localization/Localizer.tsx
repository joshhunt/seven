import React from "react";
import LocalizationState from "./LocalizationState";

interface ValidLocale {
  name: string;
  locKey: string;
  specific: string;
}

type FancyLocalizerDict = {
  validLocales: ValidLocale[];
  CurrentCultureName?: string;
  CurrentCultureSpecific?: string;
  LocInherit?: "True" | "False";
  Format: (val: string, params: { [key: string]: any }) => string;
  FormatReact: (
    val: string,
    params: { [key: string]: React.ReactNode }
  ) => React.ReactNode;
  [key: string]: any;
};

const curly = new RegExp("{([a-z0-9]+)}", "gi");
const dollar = /\$\$([a-z0-9]+)\$\$/gi;

const determineRegexToUse = (localizationString: string) => {
  let regexToUse: RegExp | undefined;

  if (localizationString.match(curly)) {
    regexToUse = curly;
  } else if (localizationString.match(dollar)) {
    regexToUse = dollar;
  }

  return regexToUse;
};

const format = (localizationString: string, replaceWith: any): string => {
  const regexToUse = determineRegexToUse(localizationString);

  let matched,
    formattedString = localizationString;

  if (regexToUse) {
    do {
      matched = regexToUse.exec(localizationString);
      if (matched) {
        const replaceThis = matched[0];
        const replaceKey = matched[1];

        if (replaceWith[replaceKey] !== undefined) {
          formattedString = formattedString.replace(
            replaceThis,
            replaceWith[replaceKey]
          );
        }
      }
    } while (matched);
  }

  return formattedString;
};

const formatReact = (
  localizationString: string,
  replaceWith: any
): React.ReactNode => {
  const regexToUse = determineRegexToUse(localizationString);

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

const caseInsensitiveEqual = (string1: string, string2: string) => {
  return string1.toLowerCase() === string2.toLowerCase();
};

const localizerProxy: FancyLocalizerDict = new Proxy(
  {},
  {
    get(_, propName: string) {
      const fileName = propName.toLowerCase();

      if (
        typeof __localizer !== "undefined" &&
        fileName in __localizer &&
        typeof __localizer[fileName] !== "object"
      ) {
        return __localizer[fileName];
      }

      if (caseInsensitiveEqual(fileName, "CurrentCultureName")) {
        return LocalizationState.currentCultureName;
      }

      if (caseInsensitiveEqual(fileName, "CurrentCultureSpecific")) {
        return __localizer.validLocales.find(
          (a: any) => a.name === LocalizationState.currentCultureName
        ).specific;
      }

      if (caseInsensitiveEqual(fileName, "LocInherit")) {
        return LocalizationState.locInherit;
      }

      if (caseInsensitiveEqual(fileName, "ValidLocales")) {
        return __localizer.validLocales;
      }

      if (
        caseInsensitiveEqual(fileName, "Format") ||
        caseInsensitiveEqual(fileName, "fnStringReplace")
      ) {
        return new Proxy(format, {
          apply(target, thisArg, argumentsList) {
            return target(argumentsList[0], argumentsList[1]);
          },
        });
      }

      if (caseInsensitiveEqual(fileName, "FormatReact")) {
        return new Proxy(formatReact, {
          apply(target, thisArg, argumentsList) {
            return target(argumentsList[0], argumentsList[1]);
          },
        });
      }

      return new Proxy(
        {},
        {
          get(___, stringName: string, ____) {
            let returnable: string | null = null;

            const fileStrings = __localizer[fileName];
            if (stringName === "__all") {
              return fileStrings;
            }

            const fixedStringName = stringName.toLowerCase();

            if (fileStrings && fixedStringName) {
              const innerValue: string = fileStrings[fixedStringName];
              if (innerValue !== undefined) {
                returnable = innerValue;
              }
            }

            if (returnable === undefined || returnable === null) {
              returnable = `##${fileName}.${stringName}##`;
            }

            return returnable;
          },
        }
      );
    },
  }
) as FancyLocalizerDict;

export const Localizer: FancyLocalizerDict = localizerProxy;
