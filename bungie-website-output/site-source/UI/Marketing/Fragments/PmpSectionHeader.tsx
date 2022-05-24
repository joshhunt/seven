// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackPmpSectionHeader } from "../../../Generated/contentstack-types";
import styles from "./PmpSectionHeader.module.scss";

type PmpSectionHeaderProps = DataReference<
  "pmp_info_thumbnail_group",
  BnetStackPmpSectionHeader
> & {
  classes?: {
    root?: string;
    heading?: string;
    secondaryHeading?: string;
    smallTitle?: string;
    blurb?: string;
    textWrapper?: string;
  };
};

export const PmpSectionHeader: React.FC<PmpSectionHeaderProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const { data, classes } = props;

  if (!data) {
    return null;
  }

  const {
    heading,
    blurb,
    left_small_title,
    right_small_title,
    secondary_heading,
    mobile_bg,
    desktop_bg,
  } = data ?? {};

  const bgImage = responsiveBgImageFromStackFile(desktop_bg, mobile_bg, mobile);

  return (
    <div
      className={classNames(styles.headerWrapper, classes?.root)}
      style={{ backgroundImage: bgImage }}
    >
      <div className={styles.textWrapper}>
        <div className={styles.headingsFlexWrapper}>
          <div className={styles.leftHeadings}>
            <h3
              className={classNames(
                styles.smallHeading,
                classes?.secondaryHeading
              )}
              dangerouslySetInnerHTML={sanitizeHTML(secondary_heading)}
            />
            <h2
              className={classNames(styles.heading, classes?.heading)}
              dangerouslySetInnerHTML={sanitizeHTML(heading)}
            />
          </div>
          {(left_small_title ?? right_small_title) && (
            <div className={styles.smallTitles}>
              <p className={classNames(classes?.smallTitle)}>
                {left_small_title}
              </p>
              <p className={classNames(classes?.smallTitle)}>
                {right_small_title}
              </p>
            </div>
          )}
        </div>
        <p
          className={classNames(styles.blurb, classes?.blurb)}
          dangerouslySetInnerHTML={sanitizeHTML(blurb)}
        />
      </div>
    </div>
  );
};
