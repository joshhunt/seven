// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/SearchInput.module.scss";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { GrFormClose } from "@react-icons/all-files/gr/GrFormClose";
import React, { useState } from "react";

interface SearchInputProps {
  placeholder: string;
  updateSearchString: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <form onReset={() => props.updateSearchString("")}>
      <div className={styles.searchInput}>
        <FaSearch />
        <input
          type={"text"}
          placeholder={props.placeholder}
          onChange={(e) => {
            setTimeout(() => props.updateSearchString(e.target.value), 400);
          }}
        />
        <button type={"reset"}>
          <GrFormClose />
        </button>
      </div>
    </form>
  );
};
