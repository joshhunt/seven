// Created by atseng, 2022
// Copyright Bungie, Inc.

import {
  SearchDataStore,
  SearchTabContentProps,
} from "@Areas/Search/DataStores/SearchDataStore";
import styles from "@Areas/Search/search.module.scss";
import { LoadMoreButton } from "@Areas/Search/Shared/LoadMoreButton";
import { SearchResultItem } from "@Areas/Search/Shared/SearchResultItem";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import React, { useEffect, useState } from "react";

export interface ISearchItemDisplayProperties {
  title: string;
  subtitle?: React.ReactNode;
  flair?: React.ReactNode;
  icon?: React.ReactNode;
  url: string | IMultiSiteLink;
}

export const SearchTabContent: React.FC<SearchTabContentProps> = (props) => {
  const loadNextPage = (page: number) => {
    setIsLoading(true);

    //load next page action
    props.nextPageFunction();
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [props.searchItems]);

  if (props.searchItems?.length) {
    const nextPage = props.page + 1;

    return (
      <div className={styles.tabContent}>
        <ul>
          {props.searchItems.map((item, index) => (
            <SearchResultItem
              key={index}
              url={item.url}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              flair={item.flair}
            />
          ))}
        </ul>
        {props.hasMore && (
          <LoadMoreButton
            loadNextPage={() => loadNextPage(nextPage)}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }

  return null;
};
