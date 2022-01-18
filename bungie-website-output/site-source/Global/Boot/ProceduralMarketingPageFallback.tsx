import { useReferenceMap } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { Error404 } from "@UI/Errors/Error404";
import { PmpAnchor } from "@UI/Marketing/Fragments/PmpAnchor";
import { PmpCallToAction } from "@UI/Marketing/Fragments/PmpCallToAction";
import { PmpMediaCarousel } from "@UI/Marketing/Fragments/PmpMediaCarousel";
import { PmpNavigationBar } from "@UI/Marketing/Fragments/PmpNavigationBar";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { useAsyncError } from "@Utilities/ReactUtils";
import { BnetStackProceduralMarketingPage } from "Generated/contentstack-types";
import { ContentStackClient } from "Platform/ContentStack/ContentStackClient";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

// Due to lack of _content_type_uid field in generated typings, we have to manually add it :(
type HasContentTypeUid = { _content_type_uid: string };
type WithContentTypeUids<T extends any[]> = T[number] extends HasContentTypeUid
  ? T
  : (T[number] & HasContentTypeUid)[];

interface Props {
  /**
   * A component to render if no marketing page content is found at the provided slug. Useful
   * if we have multiple kinds of components that can use root-level slugs and want to prioritize
   * them.
   */
  fallback?: React.ReactElement;
}

/**
 * This component will attempt to fetch and render marketing pages whose slug matches the current URL. This will only
 * happen if the URL was not already rendered by a path earlier. If the slug is not found in ContentStack, we will
 * render the provided fallback node, or a 404 if none is provided,
 * @constructor
 */
export const ProceduralMarketingPageFallback: React.FC<Props> = (props) => {
  const params = useParams<{ slug: string }>();

  const [data, setData] = useState<[BnetStackProceduralMarketingPage[]]>();

  const throwError = useAsyncError();

  useEffect(() => {
    ContentStackClient()
      .ContentType("procedural_marketing_page")
      .Query()
      .where("url", "/" + params.slug)
      .where("locale", BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference("content")
      .toJSON()
      .find()
      .then(setData)
      .catch((error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
        throwError(error);
      });
  }, [params.slug]);

  const entries = data?.[0] ?? ([] as BnetStackProceduralMarketingPage[]);
  const pageDef = entries?.[0];

  const { title, seo_description, content, social_media_preview_image } =
    pageDef ?? {};

  /**
   * Fragments are added to the object map here. The keys are fragment types and the values are React components.
   */
  const { ReferenceMappedList } = useReferenceMap(
    {
      pmp_navigation_bar: PmpNavigationBar,
      pmp_anchor: PmpAnchor,
      pmp_call_to_action: PmpCallToAction,
      pmp_media_carousel: PmpMediaCarousel,
    },
    (content as WithContentTypeUids<typeof pageDef.content>) ?? []
  );

  if (!data) {
    return null;
  }

  if (!pageDef) {
    return props.fallback ?? <Error404 />;
  }

  return (
    <>
      <BungieHelmet
        title={title}
        image={social_media_preview_image?.url}
        description={seo_description}
      />

      <ReferenceMappedList />
    </>
  );
};
