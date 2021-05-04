// Created by a-larobinson, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localization/Localizer";
import { DestinyNewsCallout } from "@Areas/Destiny/Shared/DestinyNewsCallout";
import {
  IDestinyNewsMedia,
  DestinyNewsAndMedia,
  MediaTab,
} from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsAndMediaUpdated } from "@Areas/Destiny/Shared/DestinyNewsAndMediaUpdated";
import { StringUtils } from "@Utilities/StringUtils";
import { RouteHelper } from "@Routes/RouteHelper";

interface IFirehoseNewsAndMediaProps {
  /* Admin tag from Marketing News and Media Content Item in Firehose */
  tag: string;
  useUpdatedComponent?: boolean;
  smallSeasonText?: string;
  selectedTab?: MediaTab;
}

interface IFirehoseNewsAndMediaState {
  contentRenderable: Content.ContentItemPublicContract;
}

/**
 * FirehoseNewsAndMedia - Converts Marketing News and Media firehose item to a renderable component
 *  *
 * @param {IFirehoseNewsAndMediaProps} props
 * @returns
 */
export class FirehoseNewsAndMedia extends React.Component<
  IFirehoseNewsAndMediaProps,
  IFirehoseNewsAndMediaState
> {
  constructor(props: IFirehoseNewsAndMediaProps) {
    super(props);

    this.state = {
      contentRenderable: null,
    };
  }

  public componentDidMount() {
    Platform.ContentService.GetContentByTagAndType(
      this.props.tag,
      "MarketingNewsAndMedia",
      Localizer.CurrentCultureName,
      true
    ).then((response) =>
      this.setState({
        contentRenderable: response,
      })
    );
  }

  private readonly _hasItems = (array: []) => {
    return array !== null && array?.length > 0;
  };

  public render() {
    if (this.state.contentRenderable) {
      const content = this.state.contentRenderable.properties;

      const showNews = this._hasItems(content.News);
      const sectionTitleNews = !StringUtils.isNullOrWhiteSpace(
        content.SectionNewsTitle
      )
        ? content.SectionNewsTitle
        : Localizer.News.News;
      let defaultTab: MediaTab = "screenshots";
      if (this.props.selectedTab) {
        defaultTab = this.props.selectedTab;
      } else if (this._hasItems(content.LoreItems)) {
        defaultTab = "lore";
      } else if (this._hasItems(content.VideoItems)) {
        defaultTab = "videos";
      }

      const news: React.ReactNode = this._hasItems(content.News) ? (
        <div>
          {content.News.map((n: any, i: number) => {
            return (
              <DestinyNewsCallout
                key={i}
                bgPath={n.properties.ImageThumbnail}
                newsCalloutTitle={n.properties.Title}
                newsCalloutLink={n.properties.Hyperlink}
              />
            );
          })}
        </div>
      ) : null;

      const videos: IDestinyNewsMedia[] = this._hasItems(content.VideoItems)
        ? content.VideoItems.map((v: any) => {
            return {
              isVideo: true,
              thumbnail: v.properties.VideoThumbnail,
              detail: v.properties.VideoId,
              title: v.properties.Title,
            };
          })
        : null;

      const lore: IDestinyNewsMedia[] = this._hasItems(content.LoreItems)
        ? []
        : null;
      this._hasItems(content.LoreItems) &&
        content.LoreItems.forEach((li: any) => {
          const lorePath = RouteHelper.NewsArticle(Number(li.contentId));

          lore.push({
            isVideo: false,
            thumbnail: li.properties.ArticleBanner,
            detail: li.properties.FrontPageBanner,
            isLore: true,
            lorePath: lorePath.url,
            title: li.properties.Title,
          });
        });

      const wallpapers: IDestinyNewsMedia[] = this._hasItems(
        content.WallpaperItems
      )
        ? content.WallpaperItems.map((w: any) => {
            return {
              isVideo: false,
              thumbnail: w.properties.ImageThumbnail,
              detail: w.properties.LargeImage,
            };
          })
        : null;

      const screenshots: IDestinyNewsMedia[] = this._hasItems(
        content.ScreenshotItems
      )
        ? content.ScreenshotItems.map((s: any) => {
            return {
              isVideo: false,
              thumbnail: s.properties.ImageThumbnail,
              detail: s.properties.LargeImage,
            };
          })
        : null;

      return (
        <>
          {this.props.useUpdatedComponent ? (
            <DestinyNewsAndMediaUpdated
              defaultTab={defaultTab}
              showNews={showNews}
              news={news}
              lore={lore}
              videos={videos}
              screenshots={screenshots}
              wallpapers={wallpapers}
              sectionTitleNews={sectionTitleNews}
              smallSeasonText={this.props.smallSeasonText}
            />
          ) : (
            <DestinyNewsAndMedia
              defaultTab={defaultTab}
              showNews={showNews}
              news={news}
              lore={lore}
              videos={videos}
              screenshots={screenshots}
              wallpapers={wallpapers}
              sectionTitleNews={sectionTitleNews}
            />
          )}
        </>
      );
    } else {
      return null;
    }
  }
}
