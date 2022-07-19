// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React from "react";
import {
  BnetStackHomePage,
  BnetStackNewsArticle,
} from "../../Generated/contentstack-types";
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
  const url = useNewsArticle
    ? featuredItem?.news_article?.reference?.[0]?.url || ""
    : featuredItem?.link?.link?.href || "";
  const css = {
    backgroundImage: `url(${
      useNewsArticle
        ? featuredItem?.news_article?.reference?.[0]?.image?.url || ""
        : featuredItem?.link?.image?.url || ""
    })`,
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
        <div className={styles.featuredTitle}>{title}</div>
        <div className={styles.featuredSubtitle}>{subtitle}</div>
      </div>
    </Anchor>
  );
};
