// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Responsive } from "@Boot/Responsive";
import { BnetStackNewsArticle } from "../../Generated/contentstack-types";
import styles from "./Recent.module.scss";
import React, { useEffect, useState } from "react";
import { Logger } from "@Global/Logger";
import { RendererLogLevel } from "@Enum";
import { Grid, GridCol, IGridColProps } from "@UIKit/Layout/Grid/Grid";
import { SpecifiedNewsQuery } from "@Utilities/ContentUtils";
import { NewsPreview } from "../News/NewsPreview";

export const Recent = () => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [articles, setArticles] = useState(null);
  const { medium } = useDataStore(Responsive);
  const recentArticleLimit = 4;

  useEffect(() => {
    SpecifiedNewsQuery(
      locale,
      recentArticleLimit,
      "category",
      "community|destiny|updates",
      1,
      { key: "taxonomies.game", value: "marathon" }
    )
      .toJSON()
      .find()
      .then((response) => {
        const entries: BnetStackNewsArticle[] = response[0];
        setArticles(entries);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      });
  }, [locale]);

  return (
    <div className={styles.container}>
      <Grid>
        <GridCol cols={12}>
          <div className={styles.header}>
            <span>{Localizer.Explore.LatestNewsHeader}</span>
          </div>
        </GridCol>
        <ArticleSection articleList={articles} cols={8} medium={12} />
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
      {articleList?.map((article, i) => {
        if (!article) {
          return null;
        }

        return <NewsPreview key={i} articleData={article} />;
      })}
    </GridCol>
  );
};
