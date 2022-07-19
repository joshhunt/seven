// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import { useCSWebpImages } from "@Utilities/CSUtils";
import classNames from "classnames";
import React, { LegacyRef, useMemo } from "react";
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
    blurb?: string;
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

  const images = useCSWebpImages(
    useMemo(
      () => ({
        desktopBg: bg?.desktop?.url,
        mobileBg: bg?.mobile?.url,
      }),
      [bg?.desktop, bg?.mobile]
    )
  );

  const { mobile } = useDataStore(Responsive);

  return (
    <div className={classNames(styles.freeSection, classes?.section)}>
      <div
        className={classNames(styles.sectionIdAnchor, classes?.idAnchor)}
        ref={inputRef}
        id={sectionId}
      />
      <LazyLoadedBgDiv
        className={classNames(styles.sectionBg, classes?.sectionBg)}
        img={mobile ? images.mobileBg : images.desktopBg}
      />
      <div className={styles.contentWrapper}>
        {smallTitle && (
          <>
            <h3 className={styles.smallTitle}>{smallTitle}</h3>
            <div className={styles.divider} />
          </>
        )}

        {title && <h2 className={styles.title}>{title}</h2>}

        {blurb && (
          <p className={classNames(styles.blurb, classes?.blurb)}>{blurb}</p>
        )}
        {children}
      </div>
    </div>
  );
};
