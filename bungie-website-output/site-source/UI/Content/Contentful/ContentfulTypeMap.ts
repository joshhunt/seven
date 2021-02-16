import { DetailedError } from "@CustomErrors";
import { PromiseUtils } from "@Utilities/PromiseUtils";
import { Entry } from "contentful";
import * as React from "react";

type ComponentWithDefaultExport = Promise<{
  default: React.ComponentType<any>;
}>;

// Repeat import until success (or multi-failure)
const ensure = (importer: () => ComponentWithDefaultExport) =>
  React.lazy(() => PromiseUtils.retryImport(importer));

/**
 * This is a map of content type IDs to the associated components, to be used in ContentfulEntry
 */
const TypeMap = {
  // Event pages
  eventPage: ensure(() => import("./EntryComponents/EventPage/EventPage")),
  eventPageBanner: ensure(
    () => import("./EntryComponents/EventPage/EventPageBanner")
  ),
  eventPageCallToAction: ensure(
    () => import("./EntryComponents/EventPage/EventPageCTA")
  ),
  eventPageHero: ensure(
    () => import("./EntryComponents/EventPage/EventPageHero")
  ),
  eventPageSectionLinks: ensure(
    () => import("./EntryComponents/EventPage/EventPageLinks")
  ),
  eventPageSectionMedia: ensure(
    () => import("./EntryComponents/EventPage/EventPageMedia")
  ),
  eventPageContentBlock: ensure(
    () => import("./EntryComponents/EventPage/EventPageContentBlock")
  ),

  //News
  newsArticle: ensure(() => import("./EntryComponents/News/NewsArticle")),

  // Other
  button: ensure(() => import("./EntryComponents/ButtonEntry")),
  embeddableYouTubeVideo: ensure(
    () => import("./EntryComponents/EmbeddableYouTubeVideo")
  ),
  mobileDesktopBackground: ensure(
    () => import("./EntryComponents/MobileDesktopBackgroundEntry")
  ),
} as const;

export type ValidContentfulTypes = keyof typeof TypeMap;

/**
 * This is an object with the keys being content type names, and the value being the same.
 */
export const ContentfulTypes = Object.keys(TypeMap).reduce(
  (acc, typeName: ValidContentfulTypes) => {
    acc[typeName] = typeName;

    return acc;
  },
  {} as { [key in ValidContentfulTypes]: string }
);

/**
 * Returns the correct component for the entry provided, based on the entry's content type
 * @param entry The entry in question
 * @constructor
 */
export const GetContentfulComponentForEntry = (entry: Entry<any>) => {
  const entryType = entry.sys.contentType?.sys?.id;
  if (!entryType) {
    return null;
  }

  return GetContentfulComponentForType(entryType as ValidContentfulTypes);
};

/**
 * Returns the correct component for the content type provided
 * @param entryType
 * @constructor
 */
export const GetContentfulComponentForType = (
  entryType: ValidContentfulTypes
) => {
  if (entryType in TypeMap) {
    return TypeMap[entryType];
  }

  throw new DetailedError(
    "Component not found",
    `Component type ${entryType} does not exist in TypeMap`
  );
};
