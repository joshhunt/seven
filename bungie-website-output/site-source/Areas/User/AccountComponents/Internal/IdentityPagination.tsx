// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import React from "react";
import ReactPaginate from "react-paginate";
import styles from "../../Account.module.scss";

interface IdentityPaginationProps {
  onPageChange: (selectedItem: { selected: number }) => void;
  pageCount: number;
  forcePage?: number;
}

export const IdentityPagination: React.FC<IdentityPaginationProps> = (
  props
) => {
  const { onPageChange, pageCount, forcePage } = props;

  return (
    <ReactPaginate
      forcePage={forcePage ?? 0}
      onPageChange={onPageChange}
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      previousLabel={Localizer.usertools.previousPage}
      nextLabel={Localizer.usertools.nextPage}
      containerClassName={styles.paginateInterface}
      activeClassName={styles.active}
      previousClassName={styles.prev}
      nextClassName={styles.next}
      disabledClassName={styles.disabled}
    />
  );
};
