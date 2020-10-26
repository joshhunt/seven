import { Content } from "@Platform";
import moment from "moment";
import { IDestinySkuSale } from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";

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

  public static saleFromContent(
    contentItem: Content.ContentItemPublicContract
  ): IDestinySkuSale {
    return {
      productSkuTag: contentItem.properties["ProductSkuTag"],
      store: contentItem.properties["Store"],
      startDate: contentItem.properties["StartDate"].dateValue,
      endDate: contentItem.properties["EndDate"].dateValue,
      discountString: contentItem.properties["DiscountString"],
    };
  }
}
