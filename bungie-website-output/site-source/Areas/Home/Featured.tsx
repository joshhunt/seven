// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React from "react";
import {
  BnetStackHomePageCallout,
  BnetStackHomePageFeatured,
  BnetStackNewsArticle,
} from "../../Generated/contentstack-types";
import styles from "./Featured.module.scss";

interface FeaturedProps {
  featured: BnetStackHomePageFeatured[];
}

interface FeaturedBlockProps {
  featuredItem: BnetStackHomePageFeatured;
}

export const Featured: React.FC<FeaturedProps> = (props) => {
  return (
    <Grid>
      <GridCol cols={12} className={styles.featuredItemsContainer}>
        <div className={styles.header}>
          <span>{Localizer.Explore.FeaturedItemsHeader}</span>
        </div>
        <div className={styles.featuredItems}>
          {props.featured.map((item, num) => {
            return <FeaturedBlock featuredItem={item} key={num} />;
          })}
        </div>
      </GridCol>
    </Grid>
  );
};

export const FeaturedBlock: React.FC<FeaturedBlockProps> = (props) => {
  //news article is the default, if there happens to be a news article and a callout
  const useNewsArticle =
    props.featuredItem?.news_article &&
    props.featuredItem?.news_article?.length;

  const callout = props.featuredItem?.callout[0];
  const newsArticle = props.featuredItem?.news_article[0];

  if (!callout && !newsArticle) {
    return null;
  }

  const url = useNewsArticle ? newsArticle?.url : callout?.link?.href;
  const css = {
    backgroundImage: `url(${
      useNewsArticle
        ? props.featuredItem.news_article[0]?.image?.url
        : props.featuredItem.callout[0]?.background_image?.url
    })`,
  };
  const title = useNewsArticle ? newsArticle?.title : callout?.title;
  const subtitle = useNewsArticle ? newsArticle?.subtitle : callout?.subtitle;

  return (
    <Anchor className={styles.pinnedItem} url={url}>
      <div className={styles.background} style={css} />
      <div className={styles.featuredTextContent}>
        <div className={styles.featuredTitle}>{title}</div>
        <div className={styles.featuredSubtitle}>{subtitle}</div>
      </div>
    </Anchor>
  );
};
