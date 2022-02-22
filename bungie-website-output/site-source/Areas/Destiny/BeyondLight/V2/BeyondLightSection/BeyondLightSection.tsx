// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import styles from "./BeyondLightSection.module.scss";

interface BeyondLightSectionProps {
  smallTitle: string;
  sectionTitle: string;
  blurb?: string;
  bg: {
    desktop: string;
    mobile: string;
  };
  flexInfoBlocks: Omit<BLFlexInfoImgBlockProps, "direction">[];
  classes?: {
    section?: string;
    bg?: string;
    bgGradient?: string;
  };
  inputRef: LegacyRef<HTMLDivElement>;
  sectionId: string;
}

export const BeyondLightSection: React.FC<BeyondLightSectionProps> = (
  props
) => {
  const {
    smallTitle,
    sectionTitle,
    blurb,
    bg,
    flexInfoBlocks,
    classes,
    sectionId,
  } = props;

  const { mobile } = useDataStore(Responsive);

  const sectionBg =
    bg.desktop ?? bg.mobile
      ? `url(${mobile ? bg.mobile : bg.desktop})`
      : undefined;

  return (
    <div
      className={classNames(styles.blSection, classes?.section)}
      ref={props.inputRef}
      id={sectionId}
    >
      <div
        className={classNames(styles.sectionBg, classes?.bg)}
        style={{ backgroundImage: sectionBg }}
      />
      <div className={classNames(styles.bgGradient, classes?.bgGradient)} />
      <div className={styles.contentWrapper}>
        <p className={styles.smallTitle}>{smallTitle}</p>
        <div className={styles.titleDivider} />
        <h2
          className={styles.sectionTitle}
          dangerouslySetInnerHTML={sanitizeHTML(sectionTitle)}
        />
        {blurb && <p className={styles.blurb}>{blurb}</p>}
        {flexInfoBlocks?.map((block, i) => {
          return (
            <BLFlexInfoImgBlock
              {...block}
              direction={i % 2 === 0 ? "normal" : "reverse"}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

interface BLFlexInfoImgBlockProps extends ClickableMediaThumbnailProps {
  blurb: string;
  blurbHeading: string;
  direction: "normal" | "reverse";
}

export const BLFlexInfoImgBlock: React.FC<BLFlexInfoImgBlockProps> = (
  props
) => {
  const { blurbHeading, blurb, direction, ...rest } = props;

  const wrapperStyles: React.CSSProperties =
    props.direction === "reverse" ? { flexDirection: "row-reverse" } : {};

  return (
    <div className={styles.flexInfoImgBlock} style={wrapperStyles}>
      <div
        className={classNames(styles.blurbWrapper, {
          [styles.reversed]: props.direction === "reverse",
        })}
      >
        <p className={styles.blurbHeading}>{props.blurbHeading}</p>
        <p className={styles.blurb}>{props.blurb}</p>
      </div>
      <div className={styles.thumbnailWrapper}>
        <ClickableMediaThumbnail
          {...rest}
          showBottomShade={true}
          classes={{
            btnWrapper: styles.clickableImg,
            btnBottomShade: styles.btnShade,
            btnBg: styles.btnBg,
          }}
        />
      </div>
    </div>
  );
};
