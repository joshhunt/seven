// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory, useLocation } from "react-router";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { NewsCategory } from "./News";
import styles from "./NewsByCategory.module.scss";
import { NewsPreview } from "./NewsPreview";

interface NewsByCategoryProps {}

const BasicNewsQuery = (
  locale: string,
  articlesPerPage: number,
  currentPage: number,
  category?: string
) => {
  return ContentStackClient()
    .ContentType("news_article")
    .Query()
    .only([
      "image",
      "mobile_image",
      "banner_image",
      "subtitle",
      "date",
      "title",
      "url",
    ])
    .language(locale)
    .descending("date")
    .includeCount()
    .skip((currentPage - 1) * articlesPerPage)
    .limit(articlesPerPage)
    .toJSON();
};

const NewsByCategory: React.FC<NewsByCategoryProps> = () => {
  const responsive = useDataStore(Responsive);
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const location = useLocation();
  const history = useHistory();
  const qs = new URLSearchParams(location.search);
  const pageCategory = UrlUtils.GetUrlAction(location);
  const categoryIsInvalid = !EnumUtils.getStringKeys(NewsCategory).includes(
    UrlUtils.GetUrlAction(location)
  );
  const pageQueryToNumber = parseInt(qs.get("page"));
  const [page, setPage] = useState(pageQueryToNumber || 1);
  const [articles, setArticles] = useState(null);
  const articlesPerPage = 25;
  const [total, setTotal] = useState(articlesPerPage);
  const totalPages = total / articlesPerPage;

  useEffect(() => {
    if (
      pageQueryToNumber < 1 &&
      pageQueryToNumber > Math.ceil(total / articlesPerPage)
    ) {
      setPage(1);
    }
  }, []);

  useEffect(() => {
    if (!pageCategory || categoryIsInvalid) {
      BasicNewsQuery(locale, articlesPerPage, page)
        .find()
        .then((response) => {
          const [entries, count] = response || [];
          setArticles(entries);
          setTotal(count);
        })
        .catch((error: Error) => {
          Logger.logToServer(error, RendererLogLevel.Error);
        });
    } else {
      BasicNewsQuery(locale, articlesPerPage, page)
        .where("category", pageCategory)
        .find()
        .then((response) => {
          const [entries, count] = response || [];
          setArticles(entries);
          setTotal(count);
        })
        .catch((error: Error) => {
          Logger.logToServer(error, RendererLogLevel.Error);
        });
    }
  }, [pageCategory, page]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.articleList}>
        {/* Article List */}
        {articles?.map((article: any, i: number) => (
          <NewsPreview key={i} articleData={article} />
        ))}

        {/* Pager */}
        {totalPages > 1 && (
          <ReactPaginate
            forcePage={page - 1 ?? 1}
            onPageChange={(selectedItem) =>
              history.push({
                search: `?page=${selectedItem.selected + 1}`,
              })
            }
            pageCount={totalPages}
            pageRangeDisplayed={responsive.mobile ? 1 : 5}
            marginPagesDisplayed={1}
            pageLinkClassName={styles.pagerButton}
            previousLabel={Localizer.usertools.previousPage}
            nextLabel={Localizer.usertools.nextPage}
            containerClassName={styles.container}
            breakClassName={styles.ellipsis}
            activeClassName={styles.current}
            previousClassName={classNames(styles.pagerButton, styles.prevNext)}
            nextClassName={classNames(styles.pagerButton, styles.prevNext)}
            disabledClassName={styles.disabled}
          />
        )}
      </div>
    </div>
  );
};

export default NewsByCategory;
