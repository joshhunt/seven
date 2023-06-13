// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { FC, useMemo, memo } from "react";
import classNames from "classnames";

import styles from "./BorderedTitle.module.scss";

interface Props {
  sectionTitle?: string;
  classes?: {
    wrapper?: string;
    title?: string;
  };
}

const BorderedTitle: FC<Props> = ({ sectionTitle, classes }) => {
  const wrapperClass = useMemo(
    () =>
      classNames(styles.borderTop, { [classes?.wrapper]: classes?.wrapper }),
    [classes?.wrapper]
  );
  const titleClass = useMemo(
    () => classNames(styles.sectionTitle, { [classes?.title]: classes?.title }),
    [classes?.title]
  );

  return sectionTitle ? (
    <div className={wrapperClass}>
      <div className={titleClass}>{sectionTitle}</div>
    </div>
  ) : null;
};

export default memo(BorderedTitle);
