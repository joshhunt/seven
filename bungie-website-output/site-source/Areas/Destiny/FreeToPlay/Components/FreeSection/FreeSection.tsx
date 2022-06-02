// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import styles from "./FreeSection.module.scss";

interface FreeSectionProps {
  smallTitle?: string;
  title?: string;
  blurb?: string;
  sectionId?: string;
  inputRef?: LegacyRef<HTMLDivElement>;
  bg?: {
    desktop?: BnetStackFile;
    mobile?: BnetStackFile;
  };
  classes?: {
    section?: string;
    sectionBg?: string;
    idAnchor?: string;
  };
  children?: React.ReactNode;
}

export const FreeSection: React.FC<FreeSectionProps> = (props) => {
  const {
    title,
    classes,
    blurb,
    smallTitle,
    children,
    bg,
    inputRef,
    sectionId,
  } = props;

  const { mobile } = useDataStore(Responsive);

  return (
    <div className={classNames(styles.freeSection, classes?.section)}>
      <div
        className={classNames(styles.sectionIdAnchor, classes?.idAnchor)}
        ref={inputRef}
        id={sectionId}
      />
      <div
        className={classNames(styles.sectionBg, classes?.sectionBg)}
        style={{
          backgroundImage: responsiveBgImageFromStackFile(
            bg?.desktop,
            bg?.mobile,
            mobile
          ),
        }}
      />
      <div className={styles.contentWrapper}>
        {smallTitle && (
          <>
            <h3 className={styles.smallTitle}>{smallTitle}</h3>
            <div className={styles.divider} />
          </>
        )}

        {title && <h2 className={styles.title}>{title}</h2>}

        {blurb && <p className={styles.blurb}>{blurb}</p>}
        {children}
      </div>
    </div>
  );
};
