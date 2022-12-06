// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { useCSWebpImages } from "@Utilities/CSUtils";
import React, { useMemo } from "react";
import styles from "./Featured.module.scss";

interface FeaturedProps {
  featured: any[];
}

export const Featured: React.FC<FeaturedProps> = (props) => {
  return (
    <Grid>
      <GridCol cols={12} className={styles.featuredItemsContainer}>
        <div className={styles.header}>
          <span>{Localizer.Explore.FeaturedItemsHeader}</span>
        </div>
        <div className={styles.featuredItems}>
          {props.featured?.map((item, num) => {
            return <FeaturedBlock item={item} key={num} />;
          })}
        </div>
      </GridCol>
    </Grid>
  );
};

interface FeaturedBlockProps {
  item: any;
}

export const FeaturedBlock: React.FC<FeaturedBlockProps> = (props) => {
  const featuredItem = props.item;
  const useNewsArticle = featuredItem?.news_article;

  const images = useCSWebpImages(
    useMemo(
      () => ({
        featuredImg: useNewsArticle
          ? featuredItem?.news_article?.reference?.[0]?.image?.url
          : featuredItem?.link?.image?.url,
      }),
      [featuredItem?.news_article?.reference, featuredItem?.link]
    )
  );

  const url = useNewsArticle
    ? `/7/${Localizer.CurrentCultureName}/news/article${featuredItem?.news_article?.reference?.[0]?.url?.hosted_url}` ??
      ""
    : featuredItem?.link?.link?.href ?? "";
  const css = {
    backgroundImage: `url(${images?.featuredImg})`,
  };
  const title = useNewsArticle
    ? featuredItem?.news_article?.reference?.[0]?.title
    : featuredItem?.link?.title;
  const subtitle = useNewsArticle
    ? featuredItem?.news_article?.reference?.[0]?.subtitle
    : featuredItem?.link?.subtitle;

  return (
    <Anchor className={styles.pinnedItem} url={url}>
      <div className={styles.background} style={css} />
      <div className={styles.featuredTextContent}>
        <div className={styles.featuredSubtitle}>{subtitle}</div>
        <div className={styles.featuredTitle}>{title}</div>
      </div>
    </Anchor>
  );
};
