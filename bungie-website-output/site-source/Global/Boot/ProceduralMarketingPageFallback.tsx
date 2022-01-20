import { ProceduralMarketingPageFallbackQuery } from "@Boot/__generated__/ProceduralMarketingPageFallbackQuery.graphql";
import { useFragmentMap } from "@bungie/contentstack";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { Error404 } from "@UI/Errors/Error404";
import { PmpAnchor } from "@UI/Marketing/Fragments/PmpAnchor";
import { PmpCallToAction } from "@UI/Marketing/Fragments/PmpCallToAction";
import { PmpNavigationBar } from "@UI/Marketing/Fragments/PmpNavigationBar";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useParams } from "react-router";

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

  /**
   * Fetch marketing page content by slug. To add new fragments, create a fragment component and reference the
   * fragment's name below.
   */
  const data = useLazyLoadQuery<ProceduralMarketingPageFallbackQuery>(
    graphql`
      query ProceduralMarketingPageFallbackQuery(
        $slug: String!
        $locale: String!
      ) {
        all_procedural_marketing_page(where: { url: $slug, locale: $locale }) {
          items {
            title
            url
            seo_description
            social_media_preview_imageConnection {
              edges {
                node {
                  url
                }
              }
            }
            contentConnection {
              edges {
                node {
                  __typename
                  ...PmpAnchorFragment
                  ...PmpNavigationBarFragment
                  ...PmpCallToActionFragment
                }
              }
            }
          }
        }
      }
    `,
    {
      slug: `/${params.slug}`,
      locale: BungieNetLocaleMap(Localizer.CurrentCultureName),
    }
  );

  const pageDef = data?.all_procedural_marketing_page?.items?.[0];

  if (!pageDef) {
    return props.fallback ?? <Error404 />;
  }

  const {
    title,
    seo_description,
    contentConnection,
    social_media_preview_imageConnection,
  } = pageDef;

  const { url: ogImage } = imageFromConnection(
    social_media_preview_imageConnection
  );

  /**
   * Fragments are added to the object map here. The keys are fragment types and the values are React components.
   */
  const { FragmentMappedList } = useFragmentMap(
    {
      PmpNavigationBar,
      PmpAnchor,
      PmpCallToAction,
    },
    pageDef.contentConnection
  );

  return (
    <>
      <BungieHelmet
        title={title}
        image={ogImage}
        description={seo_description}
      />

      <FragmentMappedList />
    </>
  );
};
