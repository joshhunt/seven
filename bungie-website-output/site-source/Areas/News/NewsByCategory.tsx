import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { Logger } from "@Global/Logger";
import { RendererLogLevel } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import ReactPaginate from "react-paginate";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { NewsCategory } from "./News";
import styles from "./NewsByCategory.module.scss";
import { NewsPreview } from "./NewsPreview";
import { Responsive } from "@Boot/Responsive";

interface NewsByCategoryProps {}

export enum GameTaxonomy {
  destiny_2,
  marathon,
}

const BasicNewsQuery = (
  locale: string,
  articlesPerPage: number,
  currentPage: number,
  game?: string,
  category?: string
) => {
  let query = ContentStackClient()
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
      "taxonomies",
    ])
    .language(locale)
    .descending("date")
    .includeCount()
    .skip((currentPage - 1) * articlesPerPage)
    .limit(articlesPerPage);

  if (game) {
    query = query.where("taxonomies.game", game);
  }

  if (category && !game) {
    query = query.where("category", category);
  }

  return query.toJSON();
};

const NewsByCategory: React.FC<NewsByCategoryProps> = () => {
  const responsive = useDataStore(Responsive);
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const location = useLocation();
  const history = useHistory();
  const qs = new URLSearchParams(location.search);
  const pageCategory = UrlUtils.GetUrlAction(location).toLowerCase();
  const pageQueryToNumber = parseInt(qs.get("page"), 10);
  const [articles, setArticles] = useState<any[]>([]);
  const articlesPerPage = 25;
  const [total, setTotal] = useState(articlesPerPage);
  const totalPages = Math.ceil(total / articlesPerPage);

  const fetchArticles = (selectedCategory: string, currentPage: number) => {
    let game;
    let category;

    const categoryIsInvalid = !EnumUtils.getStringKeys(NewsCategory).includes(
      pageCategory?.toLowerCase()
    );

    if (selectedCategory === "marathon" || selectedCategory === "destiny") {
      game = selectedCategory === "marathon" ? "marathon" : "destiny_2";
      category = undefined;
    } else if (!categoryIsInvalid || selectedCategory) {
      game = undefined;
      category = selectedCategory;
    }

    BasicNewsQuery(locale, articlesPerPage, currentPage, game, category)
      .find()
      .then((response: any) => {
        const [entries, count] = response || [[], 0];
        setArticles(entries);
        setTotal(count);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      });
  };
  const page =
    isNaN(pageQueryToNumber) || pageQueryToNumber < 1 ? 1 : pageQueryToNumber;
  useEffect(() => {
    fetchArticles(pageCategory, page);
  }, [pageCategory, page]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.articleList}>
        {articles.map((article: any, i: number) => (
          <NewsPreview key={i} articleData={article} />
        ))}

        {totalPages > 1 && (
          <ReactPaginate
            forcePage={page - 1}
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
