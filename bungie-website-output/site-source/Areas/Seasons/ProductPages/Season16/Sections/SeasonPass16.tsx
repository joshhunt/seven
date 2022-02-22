// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season16/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import { Info } from "luxon";
import React, { LegacyRef, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./SeasonPass16.module.scss";

interface SeasonPass16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["season_pass_section"];
  headerSeasonText: string;
}

const SeasonPass16: React.FC<SeasonPass16Props> = ({
  data,
  inputRef,
  headerSeasonText,
}) => {
  const { mobile } = useDataStore(Responsive);

  const infoBlockScreenshots = data?.info_blocks.map((b) => b.screenshot?.url);

  const handleImgClick = (imgIndex: number) => {
    ImagePaginationModal.show({
      images: infoBlockScreenshots,
      imgIndex: imgIndex,
    });
  };

  const sectionBg = responsiveBgImageFromStackFile(
    data?.bg.desktop,
    data?.bg.mobile,
    mobile
  );

  return (
    <div className={styles.seasonPassSection}>
      <div className={styles.sectionIdAnchor} id={"pass"} ref={inputRef} />
      <div
        className={styles.sectionBg}
        style={{ backgroundImage: sectionBg }}
      />
      <div className={styles.contentWrapperNormal}>
        <LazyLoadWrapper>
          <SectionHeader
            title={data?.heading}
            seasonText={headerSeasonText}
            sectionName={data?.section_name}
            isBold={true}
          />
          <div className={styles.blurbAndVideo}>
            <div className={styles.seasonBlurb}>
              <p
                className={styles.paragraphLarge}
                dangerouslySetInnerHTML={sanitizeHTML(data?.blurb)}
              />
            </div>
          </div>
        </LazyLoadWrapper>
        <div className={styles.infoBlocksWrapper}>
          {data?.info_blocks.map((b, i) => {
            return (
              <InfoBlock16
                key={i}
                blurb={b.blurb}
                title={b.heading}
                thumbnail={b.thumbnail?.url}
                screenshot={infoBlockScreenshots[i]}
                onClick={() => handleImgClick(i)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface IInfoBlock16 {
  blurb: string;
  title: string;
  thumbnail: string;
  screenshot: string;
  onClick: () => void;
}

const InfoBlock16 = (props: IInfoBlock16) => {
  return (
    <div className={styles.infoBlock}>
      <div
        className={styles.blockImg}
        style={{ backgroundImage: `url(${props.thumbnail})` }}
        onClick={props.onClick}
      />
      <div className={styles.blockText}>
        <h4>{props.title}</h4>
        <p className={styles.paragraph}>{props.blurb}</p>
      </div>
    </div>
  );
};

export default SeasonPass16;
