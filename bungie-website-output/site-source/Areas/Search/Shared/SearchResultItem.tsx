// Created by atseng, 2022
// Copyright Bungie, Inc.

import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import React, { ReactNode } from "react";
import styles from "@Areas/Search/search.module.scss";

interface SearchResultItemProps {
  url: string | IMultiSiteLink;
  title: string;
  subtitle: ReactNode;
  icon?: ReactNode;
  flair?: ReactNode;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = (props) => {
  return (
    <li>
      <Anchor url={props.url}>
        <TwoLineItem
          className={styles.searchResultTwoLine}
          itemTitle={props.title}
          itemSubtitle={props.subtitle}
          icon={props.icon ?? null}
          flair={props.flair ?? null}
        />
      </Anchor>
    </li>
  );
};
