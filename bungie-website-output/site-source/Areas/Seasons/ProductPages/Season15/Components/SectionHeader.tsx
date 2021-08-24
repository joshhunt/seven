// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React from "react";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  title: string;
  seasonText: string;
  sectionName: string;
  className?: string;
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
        className={classNames(styles.heading, { [styles.bold]: props.isBold })}
        dangerouslySetInnerHTML={sanitizeHTML(props.title)}
      />
      <div className={styles.smallTitles}>
        <p>{props.seasonText}</p>
        <p>{props.sectionName}</p>
      </div>
    </div>
  );
};
