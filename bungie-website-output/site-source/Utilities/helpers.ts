import { SystemNames } from "@Global/SystemNames";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UrlUtils } from ".//UrlUtils";

declare var __BUILDHASH__: string;

export const BuildVersion = __BUILDHASH__;
export type Environment =
  | "local"
  | "internal"
  | "near"
  | "dev"
  | "next"
  | "bvt"
  | "alpha"
  | "beta"
  | "six"
  | "seven"
  | "live";

export const EnumKey = <TEnum>(enumVal: any, enumObj: TEnum) => {
  return ((enumObj as any)[enumVal] as unknown) as keyof typeof enumObj;
};

/**
 * Normalizes an image path
 * @param path The path to the image (not including the /7/ca part)
 */
export const Img = (path: string) => {
  return `${UrlUtils.AppBaseUrl}/ca/${path}`;
};

export const HelpArticle = (articleId: string) => {
  const articleTemplateUrl: string | null = ConfigUtils.GetParameter(
    SystemNames.ZendeskHelpArticleUrl,
    "TemplateUrl",
    ""
  );

  if (!articleTemplateUrl) {
    return null;
  }

  const currentLoc = LocalizerUtils.currentCultureName;
  // if zendesk locale is different from bnet locale, get it from webmaster, else current locale is same as zendesk's
  const zendeskLoc = ConfigUtils.GetParameter(
    SystemNames.ZendeskArticleLocales,
    currentLoc,
    currentLoc
  );

  // return article url with replaced locale and article id
  return articleTemplateUrl
    .replace("{locale}", zendeskLoc)
    .replace("{articleId}", articleId);
};
