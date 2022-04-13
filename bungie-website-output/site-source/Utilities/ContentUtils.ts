import { Content } from "@Platform";
import moment from "moment";
import { IDestinySkuSale } from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
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
