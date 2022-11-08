// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { NewsPreview } from "@Areas/News/NewsPreview";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicNewsQuery } from "@Utilities/ContentUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router";
import { Logger } from "@Global/Logger";
import { RendererLogLevel } from "@Enum";
import styles from "./ArticleList.module.scss";
import pagerStyles from "../User/Account.module.scss";

interface ArticleListProps {}

const ArticleList: React.FC<ArticleListProps> = () => {
  const responsive = useDataStore(Responsive);
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const [articles, setArticles] = useState(null);
  const articlesPerPage = 25;
  const [total, setTotal] = useState(articlesPerPage);
  const totalPages = total / articlesPerPage;
  const pageQueryToNumber = Number(params.get("page"));

  useEffect(() => {
    BasicNewsQuery(locale, articlesPerPage, pageQueryToNumber ?? 1)
      .tags(["news-tech"])
      .find()
      .then((response) => {
        const [entries, count] = response || [];
        setArticles(entries);
        setTotal(count);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      });
  }, [pageQueryToNumber, locale]);

  return (
    <>
      <BungieHelmet
        title={Localizer.News.BungieTechBlog}
        image={Img("/bungie/bgs/bungie_tech/tech_blog_banner.jpg")}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.pageContainer}>
        <img
          className={styles.heroBg}
          src={
            responsive.mobile
              ? Img("/bungie/bgs/bungie_tech/tech_blog_banner.jpg")
              : Img("/bungie/bgs/bungie_tech/tech_blog_banner.jpg")
          }
        />
        <Grid className={styles.articleListAndPager}>
          <GridCol cols={12}>
            {/* Article List */}
            {articles?.map((article: any, i: number) => (
              <NewsPreview key={i} articleData={article} />
            ))}

            {/* Pager */}
            {totalPages > 1 && (
              <ReactPaginate
                forcePage={pageQueryToNumber - 1 ?? 1}
                onPageChange={(selectedItem) =>
                  history.push({ search: `?page=${selectedItem.selected + 1}` })
                }
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                pageLinkClassName={styles.pagerButton}
                previousLabel={Localizer.usertools.previousPage}
                nextLabel={Localizer.usertools.nextPage}
                containerClassName={styles.container}
                breakClassName={styles.ellipsis}
                activeClassName={styles.current}
                previousClassName={classNames(
                  styles.pagerButton,
                  styles.prevNext
                )}
                nextClassName={classNames(styles.pagerButton, styles.prevNext)}
                disabledClassName={styles.disabled}
              />
            )}
          </GridCol>
        </Grid>
      </div>
    </>
  );
};

export default ArticleList;
