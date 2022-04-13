// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Button } from "@UIKit/Controls/Button/Button";
import React from "react";
import styles from "@Areas/Search/search.module.scss";

interface LoadMoreButtonProps {
  loadNextPage: () => void;
  isLoading: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = (props) => {
  const usertoolsLoc = Localizer.Usertools;

  return (
    <div className={styles.buttonContainer}>
      <Button
        onClick={() => props.loadNextPage()}
        buttonType={"gold"}
        loading={props.isLoading}
      >
        {usertoolsLoc.ViewMoreResults}
      </Button>
    </div>
  );
};
