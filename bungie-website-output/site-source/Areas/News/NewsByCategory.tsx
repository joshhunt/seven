// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Logger } from "../../Global/Logger";
import { RendererLogLevel } from "../../Platform/BnetPlatform.TSEnum";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { TwitterFeed } from "../../UI/Content/TwitterFeed";
import { EnumUtils } from "../../Utilities/EnumUtils";
import { UrlUtils } from "../../Utilities/UrlUtils";
import { NewsCategory } from "./News";
import styles from "./NewsByCategory.module.scss";
import { NewsPreview } from "./NewsPreview";

interface NewsByCategoryProps {}

const NewsByCategory: React.FC<NewsByCategoryProps> = () => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const [articles, setArticles] = useState(null);
  const articlesPerPage = 25;
  const [total, setTotal] = useState(articlesPerPage);
  const category = UrlUtils.GetUrlAction(location);
  const categoryIsInvalid = !EnumUtils.getStringKeys(NewsCategory).includes(
    UrlUtils.GetUrlAction(location)
  );
  const pageQueryToNumber = Number(params.get("page"));
  const [page, setPage] = useState(pageQueryToNumber || 1);
  const hasPrevious = page > 1;
  const hasNext = page < Math.ceil(total / articlesPerPage);

  const BasicNewsQuery = (currentPage: number) => {
    return ContentStackClient()
      .ContentType("news_article")
      .Query()
      .only(["image", "subtitle", "date", "title", "url"])
      .language(locale)
      .descending("date")
      .includeCount()
      .skip((currentPage - 1) * articlesPerPage)
      .limit(articlesPerPage)
      .toJSON();
  };

  useEffect(() => {
    if (
      pageQueryToNumber < 1 &&
      pageQueryToNumber > Math.ceil(total / articlesPerPage)
    ) {
      setPage(1);
    }
  }, []);

  useEffect(() => {
    if (!category || categoryIsInvalid) {
      BasicNewsQuery(page)
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
      BasicNewsQuery(page)
        .where("category", category)
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
  }, [category, page]);

  const changePage = (nextPage: number) => {
    history.push({ search: `?page=${nextPage}` });
    setPage(nextPage);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.articleListAndPager}>
        {/* Article List */}
        {articles?.map((article: any, i: number) => (
          <NewsPreview key={i} articleData={article} />
        ))}

        {/* Pager */}
        {total > articlesPerPage && (
          <div className={styles.container}>
            <div
              className={classNames(
                styles.pagerButton,
                { [styles.disabled]: !hasPrevious },
                styles.prevNext
              )}
              onClick={() => {
                if (hasPrevious) {
                  changePage(page - 1);
                }
              }}
            >
              {Localizer.usertools.previouspage}
            </div>
            {Array.apply(null, Array(Math.ceil(total / articlesPerPage))).map(
              (item: null, i: number) => {
                return (
                  <div
                    key={i + 1}
                    className={classNames(styles.pagerButton, {
                      [styles.current]: i + 1 === (pageQueryToNumber || 1),
                    })}
                    onClick={() => changePage(i + 1)}
                  >
                    {(i + 1).toString()}
                  </div>
                );
              }
            )}
            <div
              className={classNames(
                styles.pagerButton,
                { [styles.disabled]: !hasNext },
                styles.prevNext
              )}
              onClick={() => {
                if (hasNext) {
                  changePage(page + 1);
                }
              }}
            >
              {Localizer.usertools.nextpage}
            </div>
          </div>
        )}
        <TwitterFeed />
      </div>
    </div>
  );
};

export default NewsByCategory;
