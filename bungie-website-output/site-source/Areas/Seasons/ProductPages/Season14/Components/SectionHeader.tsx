// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import classNames from "classnames";
import React from "react";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  title: string;
  seasonText: string;
  sectionName: string;
  className?: string;
  hideSmallTitlesAtMobile?: boolean;
  centerHeadingAtMobile?: boolean;
  isBold?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  return (
    <div
      className={classNames(styles.sectionHeader, {
        [props.className]: props.className,
      })}
    >
      <h2
        className={classNames(
          styles.heading,
          { [styles.mobileCenterText]: props.centerHeadingAtMobile },
          { [styles.bold]: props.isBold }
        )}
        dangerouslySetInnerHTML={{ __html: props.title }}
      />
      <div
        className={classNames(styles.smallTitles, {
          [styles.hideAtMobile]: props.hideSmallTitlesAtMobile,
        })}
      >
        <p>{props.seasonText}</p>
        <p>{props.sectionName}</p>
      </div>
    </div>
  );
};
