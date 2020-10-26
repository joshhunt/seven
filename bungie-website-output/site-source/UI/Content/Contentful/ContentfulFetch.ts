import { ValidContentfulTypes } from "@Contentful/ContentfulTypeMap";
import { IEventPageFields } from "@Contentful/Contracts/EventPageContracts";
import { DetailedError } from "@CustomErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { ContentfulClientApi, createClient } from "contentful";

class _ContentfulFetch {
  public static Instance = new _ContentfulFetch();

  private client: ContentfulClientApi;

  public initialize() {
    const apiKey = ConfigUtils.GetParameter(
      "Contentful",
      "ContentfulApiKey",
      ""
    );

    if (!apiKey) {
      throw new DetailedError(
        "Initialization",
        "Contentful was initialized before CoreSettings were available"
      );
    }

    const isPreview =
      ConfigUtils.Environment !== "beta" && ConfigUtils.Environment !== "live";

    this.client = createClient({
      accessToken: apiKey,
      space: "w57yqg9suly1",
      host: isPreview ? "preview.contentful.com" : undefined,
    });
  }

  /**
   * Fetches a contentful entry of the given type that contains a `slug` field
   * @param contentType The content type in question
   * @param slug The provided slug - should usually come from URL params from react-router
   */
  public fetchBySlug(contentType: ValidContentfulTypes, slug: string) {
    return new Promise((resolve, reject) => {
      this.client
        .getEntries<IEventPageFields>({
          "fields.slug[in]": slug,
          content_type: contentType,
          include: 5,
        })
        .then(resolve)
        .catch(reject);
    });
  }
}

export const ContentfulFetch = _ContentfulFetch.Instance;
