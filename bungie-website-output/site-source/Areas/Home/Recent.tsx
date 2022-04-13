// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import { Responsive } from "../../Global/Boot/Responsive";
import styles from "./Recent.module.scss";
import React, { useEffect, useState } from "react";
import { Logger } from "../../Global/Logger";
import { RendererLogLevel } from "../../Platform/BnetPlatform.TSEnum";
import { TwitterFeed, TwitterScript } from "../../UI/Content/TwitterFeed";
import { Grid, GridCol, IGridColProps } from "../../UI/UIKit/Layout/Grid/Grid";

import { BasicNewsQuery } from "../../Utilities/ContentUtils";
import { NewsPreview } from "../News/NewsPreview";

interface RecentProps {}

export const Recent: React.FC<RecentProps> = (props) => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [articles, setArticles] = useState(null);
  const { medium } = useDataStore(Responsive);
  const recentArticleLimit = 7;

  const testMultipleArticles = new Array(8).fill(articles?.[0]);

  useEffect(() => {
    BasicNewsQuery(locale, recentArticleLimit)
      .find()
      .then((response) => {
        const [entries, count] = response || [];
        setArticles(entries);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      });
  }, [locale]);

  return (
    <div className={styles.container}>
      <TwitterScript />
      <Grid>
        <ArticleSection
          articleList={testMultipleArticles.slice(0, 4)}
          cols={9}
          medium={12}
        />
        {!medium && (
          <GridCol cols={3} className={styles.right}>
            <TwitterFeed />
          </GridCol>
        )}
        <ArticleSection
          articleList={testMultipleArticles.slice(4, 6)}
          cols={6}
          mobile={12}
        />
        <ArticleSection
          articleList={testMultipleArticles.slice(6, 8)}
          className={styles.right}
          cols={6}
          mobile={12}
        />
      </Grid>
    </div>
  );
};

interface IArticleSectionProps extends IGridColProps {
  /** Articles array slice for this section */
  articleList: any[];
}

const ArticleSection = (props: IArticleSectionProps) => {
  // We aren't using ref for anything but since GridColProps has type LegacyRef, we can't use it outside of a class component
  const { ref, articleList, ...rest } = props;

  return (
    <GridCol {...rest}>
      {articleList.map((article, i) => {
        if (article) {
          return <NewsPreview key={i} articleData={article} />;
        }
      })}
    </GridCol>
  );
};
