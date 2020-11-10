import { DetailedError } from "@CustomErrors";
import { ConfigUtils } from ".//ConfigUtils";

/**
 * For development only - if you want to temporarily put a non-localized string into a page, this will let you. Must be replaced with a real string non-locally.
 * @param badLocString This is the string that will render. We'll replace this with a Localizer reference later.
 */
export const __ = (badLocString: string) => {
  if (!ConfigUtils.EnvironmentIsLocal) {
    throw new DetailedError(
      "Localization Error",
      "String is not localized",
      undefined,
      badLocString
    );
  }

  return badLocString;
};
