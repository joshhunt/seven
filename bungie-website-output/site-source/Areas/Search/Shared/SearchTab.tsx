// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Search/search.module.scss";
import classNames from "classnames";
import React from "react";

interface SearchTabProps {
  label: string;
  resultNumber: number;
  hasMore: boolean;
  isActive: boolean;
  setActive: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = (props) => {
  const hasMoreLabel = props.hasMore ? "+" : "";

  return (
    <div
      className={classNames(styles.tab, { [styles.active]: props.isActive })}
      onClick={() => props.setActive()}
    >
      <span className={styles.tabLabel}>
        {`${props.label} (${props.resultNumber}${hasMoreLabel})`}
      </span>
    </div>
  );
};
