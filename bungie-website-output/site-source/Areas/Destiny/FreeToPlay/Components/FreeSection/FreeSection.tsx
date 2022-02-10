// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayResponsiveBg } from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BasicImageConnection } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import styles from "./FreeSection.module.scss";

interface FreeSectionProps {
  smallTitle?: string;
  title?: string;
  blurb?: string;
  sectionId?: string;
  inputRef?: LegacyRef<HTMLDivElement>;
  readonly bg?: {
    readonly desktopConnection: BasicImageConnection;
    readonly mobileConnection: BasicImageConnection;
  };
  classes?: {
    section?: string;
    sectionBg?: string;
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
    <div
      className={classNames(styles.freeSection, classes?.section)}
      ref={inputRef}
      id={sectionId}
    >
      <div
        className={classNames(styles.sectionBg, classes?.sectionBg)}
        style={{
          backgroundImage: FreeToPlayResponsiveBg(
            bg?.desktopConnection,
            bg?.mobileConnection,
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
