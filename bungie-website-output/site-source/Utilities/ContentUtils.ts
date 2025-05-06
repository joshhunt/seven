import { Content } from "@Platform";
import { ContentStackClient } from "../Platform/ContentStack/ContentStackClient";

export interface IMarketingMediaAsset {
  contentItemTitle: string;
  videoId: string;
  loopingVideoThumbnail: string;
  videoThumbnail: string;
  videoMp4: string;
  videoTitle: string;
  imageThumbnail: string;
  largeImage: string;
  title: string;
  subtitle: string;
  hyperlink: string;
  fontColor: "white" | "black";
  textBlock: string;
  buttonLink: string;
  buttonSku: string;
  buttonLabel: string;
}

export class ContentUtils {
  public static marketingMediaAssetFromContent(
    contentItem: Content.ContentItemPublicContract
  ): IMarketingMediaAsset {
    return {
      contentItemTitle: contentItem.properties["ContentItemTitle"],
      videoId: contentItem.properties["VideoId"],
      loopingVideoThumbnail: contentItem.properties["LoopingVideoThumbnail"],
      videoThumbnail: contentItem.properties["VideoThumbnail"],
      videoMp4: contentItem.properties["VideoMp4"],
      videoTitle: contentItem.properties["VideoTitle"],
      imageThumbnail: contentItem.properties["ImageThumbnail"],
      largeImage: contentItem.properties["LargeImage"],
      title: contentItem.properties["Title"],
      subtitle: contentItem.properties["Subtitle"],
      hyperlink: contentItem.properties["Hyperlink"],
      fontColor: contentItem.properties["FontColor"],
      textBlock: contentItem.properties["TextBlock"],
      buttonLink: contentItem.properties["ButtonLink"],
      buttonSku: contentItem.properties["ButtonSku"],
      buttonLabel: contentItem.properties["ButtonLabel"],
    };
  }
}

/**
 * The first, reusable, part of requesting news articles from contentstack, can be used on its own or with additional parameters and filters
 * @param locale
 * @param articleLimit: how many articles to fetch at a time
 * @param currentPage: optional, used for pagination, serves to tell the query how far down the list of articles it should start its fetch
 */

export const BasicNewsQuery = (
  locale: string,
  articleLimit: number,
  currentPage = 1
) => {
  return ContentStackClient()
    .ContentType("news_article")
    .Query()
    .language(locale)
    .descending("date")
    .includeCount()
    .skip((currentPage - 1) * articleLimit)
    .limit(articleLimit)
    .toJSON();
};

/*
 * This function allows you to filter a news query by specific items using regex
 * Example: If you are attempting to filter by a single word:
 * .regex("category", "community")
 *
 * Example: If you are attempting to filter by many words:
 * .regex("category", "community|destiny|updates")
 * .regex("title", "demo|destiny")
 *
 *  */
export const SpecifiedNewsQuery = (
  locale: string,
  articleLimit: number,
  key: string,
  regexFilter: string,
  currentPage = 1,
  omitArticles?: {
    key: string;
    value: string;
  }
) => {
  let query = ContentStackClient().ContentType("news_article").Query();

  /* notEqualTo: This method retrieves entries where a specific field value is not equal to a specified value.
   * https://www.contentstack.com/docs/developers/web-framework/querying#notequalto-key-value-optional
   * */
  if (omitArticles?.key && omitArticles?.value) {
    query = query.notEqualTo(omitArticles.key, omitArticles.value);
  }

  query = query
    .regex(key, regexFilter)
    .language(locale)
    .descending("date")
    .includeCount()
    .skip((currentPage - 1) * articleLimit)
    .limit(articleLimit);

  return query.toJSON();
};
